import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { AppView } from '../types/game';

interface TopBarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentView,
  onNavigate,
  isMuted,
  onToggleMute,
}) => {
  const navItems: { view: AppView; label: string }[] = [
    { view: 'PLAYING', label: 'Jogar' },
    { view: 'LEVELS', label: 'Fases' },
    { view: 'RANKING', label: 'Ranking' },
    { view: 'HOW_TO_PLAY', label: 'Como Jogar' },
  ];

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        <button
          type="button"
          onClick={() => onNavigate('TITLE')}
          className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 hover:text-red-500 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-500 rounded-md"
        >
          Hora do Rush
        </button>

        <nav className="flex items-center gap-4 sm:gap-7 overflow-x-auto">
          {navItems.map((item) => {
            const active = currentView === item.view;
            return (
              <button
                key={item.view}
                type="button"
                onClick={() => onNavigate(item.view)}
                className={`text-sm font-semibold py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-500 ${
                  active
                    ? 'text-red-600 border-red-500'
                    : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="shrink-0">
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? 'Ativar som' : 'Silenciar som'}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-sky-600" />}
            <span className="hidden sm:inline">{isMuted ? 'Sem Som' : 'Som Ativo'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
