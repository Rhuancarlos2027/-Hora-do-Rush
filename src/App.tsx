import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  RotateCcw,
  Star,
  Trophy,
  Undo2,
} from 'lucide-react';
import { GameBoard } from './components/GameBoard';
import { HowToPlayView } from './components/HowToPlayView';
import { LeaderboardView } from './components/LeaderboardView';
import { LevelSelectView } from './components/LevelSelectView';
import { PaintDripBackground } from './components/PaintDripBackground';
import { TitleView } from './components/TitleView';
import { TopBar } from './components/TopBar';
import { VictoryModal } from './components/VictoryModal';
import { LEVELS } from './data/levels';
import {
  AppView,
  HintSuggestion,
  MoveRecord,
  Vehicle,
} from './types/game';
import {
  getNextOptimalHint,
  getValidSlideBounds,
  isHeroAtExit,
} from './utils/solver';
import { soundFX } from './utils/sound';
import {
  ProgressMap,
  calculateLevelScore,
  getGlobalStats,
  loadPlayerName,
  loadProgress,
  savePlayerName,
  saveProgress,
} from './utils/storage';

interface VictorySummary {
  moves: number;
  stars: 1 | 2 | 3;
  earnedScore: number;
}

export default function App() {
  const [view, setView] = useState<AppView>('TITLE');
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress());
  const [playerName, setPlayerName] = useState<string>(() => loadPlayerName());
  const [isMuted, setIsMuted] = useState<boolean>(() => soundFX.isMuted());

  // Determine initial level (first uncompleted or level 1)
  const [currentLevelId, setCurrentLevelId] = useState<number>(() => {
    const saved = loadProgress();
    const firstOpen = LEVELS.find((l) => !saved[l.id]?.completed);
    return firstOpen ? firstOpen.id : 1;
  });

  const currentLevel = useMemo(
    () => LEVELS.find((l) => l.id === currentLevelId) ?? LEVELS[0],
    [currentLevelId]
  );

  const [vehicles, setVehicles] = useState<Vehicle[]>(() =>
    currentLevel.vehicles.map((v) => ({ ...v }))
  );
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>('red');
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [activeHint, setActiveHint] = useState<HintSuggestion | null>(null);
  const [isExitingWin, setIsExitingWin] = useState<boolean>(false);
  const [victorySummary, setVictorySummary] = useState<VictorySummary | null>(null);

  const globalStats = useMemo(() => getGlobalStats(progress), [progress]);

  const startLevel = useCallback((levelId: number) => {
    const lvl = LEVELS.find((l) => l.id === levelId) ?? LEVELS[0];
    setCurrentLevelId(lvl.id);
    setVehicles(lvl.vehicles.map((v) => ({ ...v })));
    setMoveHistory([]);
    setSelectedVehicleId('red');
    setHintsUsed(0);
    setActiveHint(null);
    setIsExitingWin(false);
    setVictorySummary(null);
    setView('PLAYING');
  }, []);

  const handleToggleMute = () => {
    const next = soundFX.toggleMute();
    setIsMuted(next);
  };

  const handleUpdatePlayerName = (name: string) => {
    setPlayerName(name);
    savePlayerName(name);
  };

  const handleResetProgress = () => {
    setProgress({});
    saveProgress({});
    startLevel(1);
  };

  const handleMoveVehicle = useCallback(
    (vehicleId: string, newRow: number, newCol: number) => {
      if (isExitingWin || victorySummary) return;

      const target = vehicles.find((v) => v.id === vehicleId);
      if (!target) return;
      if (target.row === newRow && target.col === newCol) return;

      const nextVehicles = vehicles.map((v) =>
        v.id === vehicleId ? { ...v, row: newRow, col: newCol } : v
      );
      const nextHistory = [
        ...moveHistory,
        {
          vehicleId,
          fromRow: target.row,
          fromCol: target.col,
          toRow: newRow,
          toCol: newCol,
        },
      ];

      setVehicles(nextVehicles);
      setMoveHistory(nextHistory);
      setActiveHint(null);
      setSelectedVehicleId(vehicleId);

      if (isHeroAtExit(nextVehicles)) {
        soundFX.playVictory();
        setIsExitingWin(true);

        const movesCount = nextHistory.length;
        const { score, stars } = calculateLevelScore(
          currentLevel.basePoints,
          currentLevel.optimalMoves,
          movesCount,
          hintsUsed
        );

        setProgress((prev) => {
          const existing = prev[currentLevel.id];
          const updated: ProgressMap = {
            ...prev,
            [currentLevel.id]: {
              completed: true,
              bestMoves:
                existing?.bestMoves != null
                  ? Math.min(existing.bestMoves, movesCount)
                  : movesCount,
              bestScore:
                existing?.bestScore != null
                  ? Math.max(existing.bestScore, score)
                  : score,
              stars:
                existing?.stars != null
                  ? (Math.max(existing.stars, stars) as 0 | 1 | 2 | 3)
                  : stars,
            },
          };
          saveProgress(updated);
          return updated;
        });

        window.setTimeout(() => {
          setVictorySummary({
            moves: movesCount,
            stars,
            earnedScore: score,
          });
        }, 460);
      } else {
        soundFX.playSlide();
      }
    },
    [currentLevel, hintsUsed, isExitingWin, moveHistory, vehicles, victorySummary]
  );

  const handleUndo = useCallback(() => {
    if (moveHistory.length === 0 || isExitingWin || victorySummary) return;
    const last = moveHistory[moveHistory.length - 1];
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === last.vehicleId
          ? { ...v, row: last.fromRow, col: last.fromCol }
          : v
      )
    );
    setMoveHistory((prev) => prev.slice(0, -1));
    setSelectedVehicleId(last.vehicleId);
    setActiveHint(null);
    soundFX.playUndo();
  }, [isExitingWin, moveHistory, victorySummary]);

  const handleRestartLevel = useCallback(() => {
    soundFX.playUndo();
    startLevel(currentLevel.id);
  }, [currentLevel.id, startLevel]);

  const handleHint = useCallback(() => {
    if (isExitingWin || victorySummary) return;
    const suggestion = getNextOptimalHint(vehicles);
    if (suggestion) {
      setActiveHint(suggestion);
      setSelectedVehicleId(suggestion.vehicleId);
      setHintsUsed((h) => h + 1);
      soundFX.playHint();
    }
  }, [isExitingWin, vehicles, victorySummary]);

  const nudgeSelectedVehicle = useCallback(
    (delta: -1 | 1) => {
      if (!selectedVehicleId || isExitingWin || victorySummary) return;
      const target = vehicles.find((v) => v.id === selectedVehicleId);
      if (!target) return;

      const [minPos, maxPos] = getValidSlideBounds(vehicles, target.id);
      if (target.orientation === 'H') {
        const nextCol = Math.max(minPos, Math.min(maxPos, target.col + delta));
        if (nextCol !== target.col) {
          handleMoveVehicle(target.id, target.row, nextCol);
        }
      } else {
        const nextRow = Math.max(minPos, Math.min(maxPos, target.row + delta));
        if (nextRow !== target.row) {
          handleMoveVehicle(target.id, nextRow, target.col);
        }
      }
    },
    [handleMoveVehicle, isExitingWin, selectedVehicleId, vehicles, victorySummary]
  );

  // Keyboard shortcuts during gameplay
  useEffect(() => {
    if (view !== 'PLAYING') return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const selected = vehicles.find((v) => v.id === selectedVehicleId);

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        if (selected?.orientation === 'H') {
          e.preventDefault();
          nudgeSelectedVehicle(-1);
        }
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        if (selected?.orientation === 'H') {
          e.preventDefault();
          nudgeSelectedVehicle(1);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        if (selected?.orientation === 'V') {
          e.preventDefault();
          nudgeSelectedVehicle(-1);
        }
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        if (selected?.orientation === 'V') {
          e.preventDefault();
          nudgeSelectedVehicle(1);
        }
      } else if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        handleUndo();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleRestartLevel();
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        handleHint();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    handleHint,
    handleRestartLevel,
    handleUndo,
    nudgeSelectedVehicle,
    selectedVehicleId,
    vehicles,
    view,
  ]);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) ?? null;
  const selectedBounds = selectedVehicle
    ? getValidSlideBounds(vehicles, selectedVehicle.id)
    : [0, 0];

  const canSlideBackward = selectedVehicle
    ? (selectedVehicle.orientation === 'H'
        ? selectedVehicle.col
        : selectedVehicle.row) > selectedBounds[0]
    : false;
  const canSlideForward = selectedVehicle
    ? (selectedVehicle.orientation === 'H'
        ? selectedVehicle.col
        : selectedVehicle.row) < selectedBounds[1]
    : false;

  const levelSaved = progress[currentLevel.id];

  return (
    <div className="relative min-h-screen bg-white text-slate-900 flex flex-col">
      <PaintDripBackground />

      <TopBar
        currentView={view}
        onNavigate={(nextView) => setView(nextView)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      <main className="relative z-10 flex-1 pt-14 sm:pt-16">
        {view === 'TITLE' && (
          <TitleView
            globalScore={globalStats.totalScore}
            levelsCleared={globalStats.levelsCleared}
            totalStars={globalStats.totalStars}
            onPlay={() => startLevel(currentLevelId)}
            onOpenLevels={() => setView('LEVELS')}
          />
        )}

        {view === 'LEVELS' && (
          <LevelSelectView
            currentLevelId={currentLevelId}
            progress={progress}
            onSelectLevel={(id) => startLevel(id)}
          />
        )}

        {view === 'RANKING' && (
          <LeaderboardView
            playerName={playerName}
            progress={progress}
            onUpdatePlayerName={handleUpdatePlayerName}
            onResetProgress={handleResetProgress}
          />
        )}

        {view === 'HOW_TO_PLAY' && (
          <HowToPlayView onStartPlaying={() => startLevel(currentLevelId)} />
        )}

        {view === 'PLAYING' && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left / Center: Interactive 6x6 Board */}
              <div className="lg:col-span-7 flex flex-col items-center">
                <GameBoard
                  vehicles={vehicles}
                  selectedVehicleId={selectedVehicleId}
                  hint={activeHint}
                  isExitingWin={isExitingWin}
                  onSelectVehicle={(id) => setSelectedVehicleId(id)}
                  onMoveVehicle={handleMoveVehicle}
                />

                <p className="text-xs text-slate-500 mt-4 text-center">
                  Arraste qualquer veículo na sua pista ou clique e use as setas do teclado.
                </p>
              </div>

              {/* Right: Clean Level HUD & Controls */}
              <div className="lg:col-span-5 space-y-5">
                {/* Level Header & Switcher */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-slate-500">
                      Fase {currentLevel.id} de {LEVELS.length} · {currentLevel.difficulty}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={currentLevel.id <= 1}
                        onClick={() => startLevel(currentLevel.id - 1)}
                        aria-label="Fase anterior"
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={currentLevel.id >= LEVELS.length}
                        onClick={() => startLevel(currentLevel.id + 1)}
                        aria-label="Próxima fase"
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h1 className="font-display text-2xl font-extrabold text-slate-900 mb-2">
                    {currentLevel.title}
                  </h1>
                  <p className="text-sm text-slate-600">
                    {currentLevel.tip}
                  </p>
                </div>

                {/* Live Score & Moves Telemetry */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white border border-slate-200 rounded-2xl p-4">
                    <div className="text-xs text-slate-500 mb-1">Movimentos</div>
                    <div className="font-mono-tabular text-2xl font-bold text-slate-900">
                      {moveHistory.length}
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl p-4">
                    <div className="text-xs text-slate-500 mb-1">Ideal</div>
                    <div className="font-mono-tabular text-2xl font-bold text-emerald-600">
                      {currentLevel.optimalMoves}
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl p-4">
                    <div className="text-xs text-slate-500 mb-1">Score Global</div>
                    <div className="font-mono-tabular text-xl font-bold text-sky-600 inline-flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{globalStats.totalScore.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                </div>

                {/* Primary Game Controls */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={moveHistory.length === 0 || isExitingWin}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors whitespace-nowrap"
                  >
                    <Undo2 className="w-4 h-4" />
                    <span>Desfazer</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRestartLevel}
                    disabled={isExitingWin}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-xl transition-colors whitespace-nowrap"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reiniciar</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleHint}
                    disabled={isExitingWin}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 disabled:opacity-40 rounded-xl transition-colors whitespace-nowrap"
                  >
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>Dica</span>
                  </button>
                </div>

                {/* Active Hint Feedback */}
                {activeHint && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-900">
                    <span className="font-semibold">Sugestão do algoritmo:</span> deslize o veículo destacado{' '}
                    <span className="font-bold">{activeHint.steps}</span>{' '}
                    {activeHint.steps === 1 ? 'casa' : 'casas'} para{' '}
                    <span className="font-bold">
                      {activeHint.direction === 'right' && 'a direita'}
                      {activeHint.direction === 'left' && 'a esquerda'}
                      {activeHint.direction === 'up' && 'cima'}
                      {activeHint.direction === 'down' && 'baixo'}
                    </span>
                    .
                  </div>
                )}

                {/* Touch / Tap Directional Nudge Pad */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold text-slate-700">
                      {selectedVehicle
                        ? selectedVehicle.isHero
                          ? 'Carro Vermelho selecionado'
                          : `Veículo ${selectedVehicle.orientation === 'H' ? 'Horizontal' : 'Vertical'} selecionado`
                        : 'Toque em um veículo'}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {levelSaved?.completed ? (
                        <span className="inline-flex items-center gap-1">
                          Melhor marca: {levelSaved.bestMoves} passos · {levelSaved.stars}
                          <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        </span>
                      ) : (
                        'Use os botões ou arraste no tabuleiro'
                      )}
                    </div>
                  </div>

                  {selectedVehicle && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        disabled={!canSlideBackward || isExitingWin}
                        onClick={() => nudgeSelectedVehicle(-1)}
                        aria-label={
                          selectedVehicle.orientation === 'H'
                            ? 'Mover para a esquerda'
                            : 'Mover para cima'
                        }
                        className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center text-slate-800 transition-colors"
                      >
                        {selectedVehicle.orientation === 'H' ? (
                          <ArrowLeft className="w-5 h-5" />
                        ) : (
                          <ArrowUp className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        type="button"
                        disabled={!canSlideForward || isExitingWin}
                        onClick={() => nudgeSelectedVehicle(1)}
                        aria-label={
                          selectedVehicle.orientation === 'H'
                            ? 'Mover para a direita'
                            : 'Mover para baixo'
                        }
                        className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center text-slate-800 transition-colors"
                      >
                        {selectedVehicle.orientation === 'H' ? (
                          <ArrowRight className="w-5 h-5" />
                        ) : (
                          <ArrowDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {victorySummary && (
        <VictoryModal
          level={currentLevel}
          moves={victorySummary.moves}
          stars={victorySummary.stars}
          earnedScore={victorySummary.earnedScore}
          globalScore={globalStats.totalScore}
          hasNextLevel={currentLevel.id < LEVELS.length}
          onReplay={() => startLevel(currentLevel.id)}
          onNextLevel={() => startLevel(currentLevel.id + 1)}
          onViewRanking={() => {
            setVictorySummary(null);
            setView('RANKING');
          }}
        />
      )}
    </div>
  );
}
