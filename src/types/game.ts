export type Orientation = 'H' | 'V';

export type VehicleColorKey =
  | 'red'
  | 'sun'
  | 'sky'
  | 'mint'
  | 'orange'
  | 'grape'
  | 'pink'
  | 'teal'
  | 'lime'
  | 'cobalt'
  | 'coral'
  | 'indigo';

export type VehicleKind = 'hero' | 'car' | 'van' | 'bus' | 'truck';

export interface Vehicle {
  id: string;
  row: number; // 0..5
  col: number; // 0..5
  length: 2 | 3;
  orientation: Orientation;
  color: VehicleColorKey;
  kind: VehicleKind;
  isHero?: boolean;
}

export type DifficultyTier = 'Iniciante' | 'Fácil' | 'Médio' | 'Desafiador' | 'Difícil' | 'Mestre';

export interface LevelConfig {
  id: number;
  title: string;
  difficulty: DifficultyTier;
  optimalMoves: number;
  basePoints: number;
  tip: string;
  vehicles: Vehicle[];
}

export interface MoveRecord {
  vehicleId: string;
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
}

export interface LevelProgress {
  completed: boolean;
  bestMoves: number | null;
  bestScore: number;
  stars: 0 | 1 | 2 | 3;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  totalScore: number;
  levelsCleared: number;
  totalStars: number;
  isCurrentUser?: boolean;
  updatedAt: string;
}

export type AppView = 'TITLE' | 'PLAYING' | 'LEVELS' | 'RANKING' | 'HOW_TO_PLAY';

export interface HintSuggestion {
  vehicleId: string;
  targetRow: number;
  targetCol: number;
  direction: 'left' | 'right' | 'up' | 'down';
  steps: number;
}
