import React, { useState } from 'react';
import { Award, Check, Pencil, Star, Trophy } from 'lucide-react';
import { LEVELS } from '../data/levels';
import {
  ProgressMap,
  getGlobalLeaderboard,
  getGlobalStats,
} from '../utils/storage';

interface LeaderboardViewProps {
  playerName: string;
  progress: ProgressMap;
  onUpdatePlayerName: (name: string) => void;
  onResetProgress: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  playerName,
  progress,
  onUpdatePlayerName,
  onResetProgress,
}) => {
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(playerName);
  const [confirmReset, setConfirmReset] = useState(false);

  const stats = getGlobalStats(progress);
  const entries = getGlobalLeaderboard(playerName, progress);
  const maxStars = LEVELS.length * 3;

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePlayerName(draftName.trim() || 'Piloto Jr.');
    setEditing(false);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight">
            Ranking Global
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Some pontos em todas as fases usando menos movimentos e sem dicas para subir no pódio.
          </p>
        </div>

        {/* Editable player name */}
        {editing ? (
          <form onSubmit={handleSaveName} className="flex items-center gap-2">
            <input
              type="text"
              value={draftName}
              maxLength={22}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="Seu nome"
              className="px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              autoFocus
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl whitespace-nowrap"
            >
              <Check className="w-4 h-4" />
              <span>Salvar</span>
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => {
              setDraftName(playerName);
              setEditing(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            <Pencil className="w-3.5 h-3.5 text-slate-500" />
            <span>Piloto: {playerName}</span>
          </button>
        )}
      </div>

      {/* Player Global Summary Strip */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="text-xs font-medium text-slate-500 mb-1">Sua Pontuação Global</div>
          <div className="font-mono-tabular text-2xl sm:text-3xl font-bold text-slate-900">
            {stats.totalScore.toLocaleString('pt-BR')}
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="text-xs font-medium text-slate-500 mb-1">Fases Concluídas</div>
          <div className="font-mono-tabular text-2xl sm:text-3xl font-bold text-emerald-600">
            {stats.levelsCleared} / {LEVELS.length}
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="text-xs font-medium text-slate-500 mb-1">Estrelas Coletadas</div>
          <div className="font-mono-tabular text-2xl sm:text-3xl font-bold text-amber-500">
            {stats.totalStars} / {maxStars}
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500">
                <th className="py-3.5 px-4 sm:px-6 w-16">Pos.</th>
                <th className="py-3.5 px-4">Jogador</th>
                <th className="py-3.5 px-4 text-right">Fases</th>
                <th className="py-3.5 px-4 text-right">Estrelas</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Pontuação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {entries.map((entry, idx) => {
                const rank = idx + 1;
                return (
                  <tr
                    key={entry.id}
                    className={
                      entry.isCurrentUser
                        ? 'bg-sky-50/70 font-semibold'
                        : 'hover:bg-slate-50/60'
                    }
                  >
                    <td className="py-3.5 px-4 sm:px-6 font-mono-tabular font-bold text-slate-700">
                      {rank === 1 ? (
                        <span className="inline-flex items-center gap-1 text-amber-500">
                          <Trophy className="w-4 h-4" /> 1º
                        </span>
                      ) : rank === 2 ? (
                        <span className="inline-flex items-center gap-1 text-slate-500">
                          <Award className="w-4 h-4" /> 2º
                        </span>
                      ) : rank === 3 ? (
                        <span className="inline-flex items-center gap-1 text-orange-500">
                          <Award className="w-4 h-4" /> 3º
                        </span>
                      ) : (
                        `${rank}º`
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-900">
                      <div>{entry.playerName}</div>
                      <div className="text-xs font-normal text-slate-500">
                        {entry.updatedAt}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono-tabular text-slate-700">
                      {entry.levelsCleared}/{LEVELS.length}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono-tabular text-amber-600">
                      <span className="inline-flex items-center gap-1 justify-end">
                        {entry.totalStars}
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right font-mono-tabular font-bold text-slate-900">
                      {entry.totalScore.toLocaleString('pt-BR')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reset Local Progress */}
      <div className="flex items-center justify-end">
        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="text-xs font-medium text-slate-500 hover:text-red-600 transition-colors"
          >
            Zerar progresso salvo neste navegador
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-600">Tem certeza?</span>
            <button
              type="button"
              onClick={() => {
                onResetProgress();
                setConfirmReset(false);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg"
            >
              Confirmar
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
