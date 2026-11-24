import React from 'react';
import { ArrowRight, Layers, Star, Trophy } from 'lucide-react';
import { LEVELS } from '../data/levels';
import { VehicleSprite } from './VehicleSprite';

interface TitleViewProps {
  globalScore: number;
  levelsCleared: number;
  totalStars: number;
  onPlay: () => void;
  onOpenLevels: () => void;
}

export const TitleView: React.FC<TitleViewProps> = ({
  globalScore,
  levelsCleared,
  totalStars,
  onPlay,
  onOpenLevels,
}) => {
  const previewVehicles = LEVELS[0].vehicles;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Copy & CTA */}
        <div className="lg:col-span-6 space-y-6">
          <div className="text-xs font-semibold text-slate-500">
            12 Fases Progressivas · Pontuação Global · Lógica e Algoritmos
          </div>

          <h1
            className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
            style={{ textWrap: 'balance' }}
          >
            Deslize os carros coloridos e libere a saída do{' '}
            <span className="text-red-500">Carro Vermelho</span>
          </h1>

          <p className="text-base text-slate-600 leading-relaxed max-w-xl">
            Um quebra-cabeça dinâmico de trânsito para treinar o raciocínio lógico. Antecipe movimentos em cadeia, resolva cada cruzamento com o menor número de passos e suba no Ranking Global.
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onPlay}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm sm:text-base font-bold text-white bg-red-500 hover:bg-red-600 rounded-2xl transition-colors shadow-sm whitespace-nowrap"
            >
              <span>{levelsCleared > 0 ? 'Continuar Jogando' : 'Começar a Jogar'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenLevels}
              className="inline-flex items-center gap-2 px-5 py-3.5 text-sm sm:text-base font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors whitespace-nowrap"
            >
              <Layers className="w-4 h-4 text-slate-600" />
              <span>Escolher Fase</span>
            </button>
          </div>

          {/* Player Progress Snapshot */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
            <div>
              <div className="text-xs text-slate-500 mb-1">Pontuação Global</div>
              <div className="font-mono-tabular text-xl font-bold text-slate-900 inline-flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                {globalScore.toLocaleString('pt-BR')}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Fases Vencidas</div>
              <div className="font-mono-tabular text-xl font-bold text-emerald-600">
                {levelsCleared} / {LEVELS.length}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Estrelas</div>
              <div className="font-mono-tabular text-xl font-bold text-amber-500 inline-flex items-center gap-1">
                {totalStars}
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Showcase: Colorful Toy Board Preview */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-full max-w-[420px] bg-slate-100 border-2 border-slate-200 rounded-3xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-semibold text-slate-500">
                Prévia do Tabuleiro 6×6 · Fase 1
              </span>
              <span className="text-xs font-bold text-emerald-600">
                Saída Livre →
              </span>
            </div>

            <div className="relative aspect-square w-full bg-slate-200/70 rounded-2xl p-1">
              <div className="grid grid-cols-6 grid-rows-6 w-full h-full gap-1.5">
                {Array.from({ length: 36 }).map((_, i) => {
                  const r = Math.floor(i / 6);
                  return (
                    <div
                      key={i}
                      className={`rounded-xl border ${
                        r === 2
                          ? 'bg-red-50/70 border-red-200/70'
                          : 'bg-white border-slate-200/80'
                      }`}
                    />
                  );
                })}
              </div>

              <div className="absolute inset-1 pointer-events-none">
                {previewVehicles.map((v) => (
                  <div
                    key={v.id}
                    className="absolute p-1"
                    style={{
                      left: `${(v.col / 6) * 100}%`,
                      top: `${(v.row / 6) * 100}%`,
                      width: `${((v.orientation === 'H' ? v.length : 1) / 6) * 100}%`,
                      height: `${((v.orientation === 'V' ? v.length : 1) / 6) * 100}%`,
                    }}
                  >
                    <VehicleSprite
                      vehicle={v}
                      isSelected={Boolean(v.isHero)}
                      isHinted={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
