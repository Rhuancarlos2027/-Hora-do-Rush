import React, { useState } from 'react';
import { CheckCircle2, Play, Star } from 'lucide-react';
import { LEVELS } from '../data/levels';
import { DifficultyTier } from '../types/game';
import { ProgressMap } from '../utils/storage';

interface LevelSelectViewProps {
  currentLevelId: number;
  progress: ProgressMap;
  onSelectLevel: (levelId: number) => void;
}

const DIFFICULTY_FILTERS: ('Todas' | DifficultyTier)[] = [
  'Todas',
  'Iniciante',
  'Fácil',
  'Médio',
  'Desafiador',
  'Difícil',
  'Mestre',
];

export const LevelSelectView: React.FC<LevelSelectViewProps> = ({
  currentLevelId,
  progress,
  onSelectLevel,
}) => {
  const [filter, setFilter] = useState<'Todas' | DifficultyTier>('Todas');

  const filteredLevels =
    filter === 'Todas'
      ? LEVELS
      : LEVELS.filter((lvl) => lvl.difficulty === filter);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight">
            Escolha a Fase
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            12 desafios progressivos de lógica e antecipação de movimentos em cadeia.
          </p>
        </div>

        {/* Interactive filter bar */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl">
          {DIFFICULTY_FILTERS.map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setFilter(tier)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                filter === tier
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLevels.map((lvl) => {
          const p = progress[lvl.id];
          const isCurrent = lvl.id === currentLevelId;
          const completed = Boolean(p?.completed);
          const stars = p?.stars ?? 0;

          return (
            <button
              key={lvl.id}
              type="button"
              onClick={() => onSelectLevel(lvl.id)}
              className={`group text-left bg-white border rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
                isCurrent
                  ? 'border-red-400 ring-2 ring-red-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-medium text-slate-500">
                  Fase {lvl.id} · {lvl.difficulty} · Ideal {lvl.optimalMoves} passos
                </span>
                {completed && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                )}
              </div>

              <h2 className="font-display text-lg font-bold text-slate-900 group-hover:text-red-600 transition-colors mb-3">
                {lvl.title}
              </h2>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1" aria-label={`${stars} de 3 estrelas`}>
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= stars
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-slate-200 fill-slate-100'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  {p?.bestMoves ? (
                    <span className="font-mono-tabular text-slate-500">
                      Recorde: {p.bestMoves}
                    </span>
                  ) : (
                    <span className="text-sky-600 inline-flex items-center gap-1">
                      <Play className="w-3.5 h-3.5 fill-sky-600" />
                      Jogar
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
