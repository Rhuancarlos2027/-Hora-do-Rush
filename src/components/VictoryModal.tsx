import React from 'react';
import { ArrowRight, RotateCcw, Star, Trophy } from 'lucide-react';
import { LevelConfig } from '../types/game';

interface VictoryModalProps {
  level: LevelConfig;
  moves: number;
  stars: 1 | 2 | 3;
  earnedScore: number;
  globalScore: number;
  hasNextLevel: boolean;
  onReplay: () => void;
  onNextLevel: () => void;
  onViewRanking: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  level,
  moves,
  stars,
  earnedScore,
  globalScore,
  hasNextLevel,
  onReplay,
  onNextLevel,
  onViewRanking,
}) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="victory-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-xs p-4"
    >
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl text-center">
        {/* Stars */}
        <div className="flex items-center justify-center gap-3 mb-4">
          {[1, 2, 3].map((s) => {
            const filled = s <= stars;
            return (
              <div
                key={s}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform ${
                  filled
                    ? 'bg-amber-100 text-amber-500 scale-105'
                    : 'bg-slate-100 text-slate-300'
                }`}
              >
                <Star
                  className={`w-7 h-7 ${filled ? 'fill-amber-400 text-amber-500' : ''}`}
                />
              </div>
            );
          })}
        </div>

        <p className="text-xs font-semibold text-emerald-600 mb-1">
          Fase {level.id} Concluída · {level.difficulty}
        </p>
        <h2
          id="victory-title"
          className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2"
        >
          {stars === 3 ? 'Perfeito! Caminho Livre!' : 'Muito Bem! Você Saiu!'}
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          O carro vermelho escapou de <span className="font-semibold text-slate-800">{level.title}</span>.
        </p>

        {/* Metrics Summary */}
        <div className="grid grid-cols-3 gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
          <div>
            <div className="text-xs text-slate-500 mb-1">Seus Passos</div>
            <div className="font-mono-tabular text-xl font-bold text-slate-900">
              {moves}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Ideal</div>
            <div className="font-mono-tabular text-xl font-bold text-emerald-600">
              {level.optimalMoves}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Pontos</div>
            <div className="font-mono-tabular text-xl font-bold text-sky-600">
              +{earnedScore}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-slate-600 mb-6">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Pontuação Global:</span>
          <span className="font-mono-tabular font-bold text-slate-900">
            {globalScore.toLocaleString('pt-BR')} pts
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onReplay}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Jogar de Novo</span>
          </button>

          {hasNextLevel ? (
            <button
              type="button"
              onClick={onNextLevel}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors whitespace-nowrap shadow-sm"
            >
              <span>Próxima Fase</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onViewRanking}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors whitespace-nowrap shadow-sm"
            >
              <span>Ver Ranking</span>
              <Trophy className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
