import { LeaderboardEntry, LevelProgress } from '../types/game';

const STORAGE_PROGRESS_KEY = 'rushhour_progress_v1';
const STORAGE_PLAYER_NAME_KEY = 'rushhour_player_name_v1';
const STORAGE_LEADERBOARD_KEY = 'rushhour_leaderboard_v1';

export type ProgressMap = Record<number, LevelProgress>;

const DEFAULT_RANKING_SEED: LeaderboardEntry[] = [
  {
    id: 'seed-1',
    playerName: 'Sofia L.',
    totalScore: 4850,
    levelsCleared: 10,
    totalStars: 28,
    updatedAt: 'Turma IIW2026A',
  },
  {
    id: 'seed-2',
    playerName: 'Lucas M.',
    totalScore: 3920,
    levelsCleared: 8,
    totalStars: 22,
    updatedAt: 'Turma IIW2026A',
  },
  {
    id: 'seed-3',
    playerName: 'Helena R.',
    totalScore: 2840,
    levelsCleared: 6,
    totalStars: 17,
    updatedAt: 'Turma IIW2026A',
  },
  {
    id: 'seed-4',
    playerName: 'Pedro H.',
    totalScore: 1750,
    levelsCleared: 4,
    totalStars: 11,
    updatedAt: 'Turma IIW2026A',
  },
  {
    id: 'seed-5',
    playerName: 'Beatriz C.',
    totalScore: 980,
    levelsCleared: 2,
    totalStars: 6,
    updatedAt: 'Turma IIW2026A',
  },
];

export function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_PROGRESS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ProgressMap;
  } catch {
    return {};
  }
}

export function saveProgress(progress: ProgressMap): void {
  try {
    localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Ignore quota errors
  }
}

export function loadPlayerName(): string {
  try {
    return localStorage.getItem(STORAGE_PLAYER_NAME_KEY) || 'Piloto Jr.';
  } catch {
    return 'Piloto Jr.';
  }
}

export function savePlayerName(name: string): void {
  try {
    localStorage.setItem(STORAGE_PLAYER_NAME_KEY, name.trim() || 'Piloto Jr.');
  } catch {
    // Ignore
  }
}

export function calculateLevelScore(
  basePoints: number,
  optimalMoves: number,
  actualMoves: number,
  hintsUsed: number
): { score: number; stars: 1 | 2 | 3 } {
  const ratio = actualMoves <= optimalMoves ? 1 : optimalMoves / actualMoves;
  let stars: 1 | 2 | 3 = 1;

  if (actualMoves <= optimalMoves && hintsUsed === 0) {
    stars = 3;
  } else if (actualMoves <= optimalMoves + 3 && hintsUsed <= 1) {
    stars = 2;
  } else if (ratio >= 0.75 && hintsUsed === 0) {
    stars = 2;
  }

  const efficiencyBonus = Math.round(basePoints * 0.5 * ratio);
  const perfectBonus = actualMoves <= optimalMoves ? 120 : 0;
  const hintPenalty = hintsUsed * 60;
  const score = Math.max(100, basePoints + efficiencyBonus + perfectBonus - hintPenalty);

  return { score, stars };
}

export function getGlobalStats(progress: ProgressMap): {
  totalScore: number;
  levelsCleared: number;
  totalStars: number;
} {
  let totalScore = 0;
  let levelsCleared = 0;
  let totalStars = 0;

  for (const entry of Object.values(progress)) {
    if (entry.completed) {
      levelsCleared += 1;
      totalScore += entry.bestScore;
      totalStars += entry.stars;
    }
  }

  return { totalScore, levelsCleared, totalStars };
}

export function getGlobalLeaderboard(
  playerName: string,
  progress: ProgressMap
): LeaderboardEntry[] {
  let storedOthers: LeaderboardEntry[] = DEFAULT_RANKING_SEED;
  try {
    const raw = localStorage.getItem(STORAGE_LEADERBOARD_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as LeaderboardEntry[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        storedOthers = parsed.filter((e) => !e.isCurrentUser);
      }
    }
  } catch {
    // Use seed
  }

  const stats = getGlobalStats(progress);
  const currentEntry: LeaderboardEntry = {
    id: 'current-player',
    playerName: playerName.trim() || 'Piloto Jr.',
    totalScore: stats.totalScore,
    levelsCleared: stats.levelsCleared,
    totalStars: stats.totalStars,
    isCurrentUser: true,
    updatedAt: 'Você agora',
  };

  const combined = [...storedOthers, currentEntry].sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    if (b.totalStars !== a.totalStars) return b.totalStars - a.totalStars;
    return b.levelsCleared - a.levelsCleared;
  });

  return combined;
}
