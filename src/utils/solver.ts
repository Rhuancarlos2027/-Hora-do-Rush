import { HintSuggestion, Vehicle } from '../types/game';

export const GRID_SIZE = 6;
export const EXIT_ROW = 2;

export function buildOccupancyGrid(
  vehicles: Vehicle[],
  excludeVehicleId?: string
): (string | null)[][] {
  const grid: (string | null)[][] = Array.from({ length: GRID_SIZE }, () =>
    Array<string | null>(GRID_SIZE).fill(null)
  );

  for (const v of vehicles) {
    if (v.id === excludeVehicleId) continue;
    for (let i = 0; i < v.length; i++) {
      const r = v.orientation === 'H' ? v.row : v.row + i;
      const c = v.orientation === 'H' ? v.col + i : v.col;
      if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
        grid[r][c] = v.id;
      }
    }
  }

  return grid;
}

export function validateBoard(vehicles: Vehicle[]): { valid: boolean; reason?: string } {
  const grid: (string | null)[][] = Array.from({ length: GRID_SIZE }, () =>
    Array<string | null>(GRID_SIZE).fill(null)
  );
  let heroFound = false;

  for (const v of vehicles) {
    if (v.isHero) {
      heroFound = true;
      if (v.orientation !== 'H' || v.row !== EXIT_ROW || v.length !== 2) {
        return { valid: false, reason: 'Hero car must be H, length 2, row 2' };
      }
    }
    for (let i = 0; i < v.length; i++) {
      const r = v.orientation === 'H' ? v.row : v.row + i;
      const c = v.orientation === 'H' ? v.col + i : v.col;
      if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) {
        return { valid: false, reason: `Vehicle ${v.id} out of bounds at (${r}, ${c})` };
      }
      if (grid[r][c] !== null) {
        return { valid: false, reason: `Overlap at (${r}, ${c}) between ${grid[r][c]} and ${v.id}` };
      }
      grid[r][c] = v.id;
    }
  }

  if (!heroFound) {
    return { valid: false, reason: 'Missing hero car' };
  }

  return { valid: true };
}

/**
 * Returns [minPos, maxPos] along the vehicle's active axis (col for 'H', row for 'V').
 */
export function getValidSlideBounds(vehicles: Vehicle[], vehicleId: string): [number, number] {
  const target = vehicles.find((v) => v.id === vehicleId);
  if (!target) return [0, 0];

  const grid = buildOccupancyGrid(vehicles, vehicleId);

  if (target.orientation === 'H') {
    let minCol = target.col;
    while (minCol > 0 && grid[target.row][minCol - 1] === null) {
      minCol--;
    }
    let maxCol = target.col;
    while (
      maxCol + target.length < GRID_SIZE &&
      grid[target.row][maxCol + target.length] === null
    ) {
      maxCol++;
    }
    return [minCol, maxCol];
  } else {
    let minRow = target.row;
    while (minRow > 0 && grid[minRow - 1][target.col] === null) {
      minRow--;
    }
    let maxRow = target.row;
    while (
      maxRow + target.length < GRID_SIZE &&
      grid[maxRow + target.length][target.col] === null
    ) {
      maxRow++;
    }
    return [minRow, maxRow];
  }
}

export function isHeroAtExit(vehicles: Vehicle[]): boolean {
  const hero = vehicles.find((v) => v.isHero);
  if (!hero) return false;
  // Hero reaches exit when it sits at col === 4 on row 2 (touching right border)
  return hero.row === EXIT_ROW && hero.col === GRID_SIZE - hero.length;
}

export function canHeroExitDirectly(vehicles: Vehicle[]): boolean {
  const hero = vehicles.find((v) => v.isHero);
  if (!hero) return false;
  const [, maxCol] = getValidSlideBounds(vehicles, hero.id);
  return maxCol === GRID_SIZE - hero.length;
}

interface SolverStep {
  vehicleIndex: number;
  newPos: number;
}

/**
 * Exact BFS solver treating any single-vehicle slide of 1..k squares as 1 move.
 * Returns the sequence of optimal moves to reach hero col === 4, or null if unsolvable.
 */
export function solveRushHourBFS(
  vehicles: Vehicle[],
  maxStates = 60000
): SolverStep[] | null {
  const n = vehicles.length;
  const heroIndex = vehicles.findIndex((v) => v.isHero);
  if (heroIndex === -1) return null;

  const initialPositions = vehicles.map((v) => (v.orientation === 'H' ? v.col : v.row));
  const orientations = vehicles.map((v) => v.orientation);
  const fixedCoords = vehicles.map((v) => (v.orientation === 'H' ? v.row : v.col));
  const lengths = vehicles.map((v) => v.length);

  const encode = (pos: number[]) => pos.join(',');

  if (initialPositions[heroIndex] === 4) {
    return [];
  }

  const visited = new Set<string>();
  visited.add(encode(initialPositions));

  const parentIndex: number[] = [-1];
  const moveFromParent: (SolverStep | null)[] = [null];
  const queue: number[][] = [initialPositions];
  let head = 0;

  const grid = new Int8Array(36);

  while (head < queue.length && visited.size < maxStates) {
    const curr = queue[head];

    // Fill occupancy grid
    grid.fill(-1);
    for (let i = 0; i < n; i++) {
      const p = curr[i];
      const f = fixedCoords[i];
      const len = lengths[i];
      if (orientations[i] === 'H') {
        const base = f * 6;
        for (let k = 0; k < len; k++) grid[base + p + k] = i;
      } else {
        for (let k = 0; k < len; k++) grid[(p + k) * 6 + f] = i;
      }
    }

    // Generate all valid 1-move slides
    for (let i = 0; i < n; i++) {
      const p = curr[i];
      const f = fixedCoords[i];
      const len = lengths[i];
      const isH = orientations[i] === 'H';

      // Slide backward
      for (let np = p - 1; np >= 0; np--) {
        const cell = isH ? f * 6 + np : np * 6 + f;
        if (grid[cell] !== -1) break;

        const next = curr.slice();
        next[i] = np;
        const key = encode(next);
        if (!visited.has(key)) {
          visited.add(key);
          parentIndex.push(head);
          moveFromParent.push({ vehicleIndex: i, newPos: np });
          queue.push(next);
        }
      }

      // Slide forward
      for (let np = p + 1; np + len <= 6; np++) {
        const checkCoord = np + len - 1;
        const cell = isH ? f * 6 + checkCoord : checkCoord * 6 + f;
        if (grid[cell] !== -1) break;

        const next = curr.slice();
        next[i] = np;
        const key = encode(next);
        if (!visited.has(key)) {
          visited.add(key);
          const newNodeIdx = queue.length;
          parentIndex.push(head);
          moveFromParent.push({ vehicleIndex: i, newPos: np });
          queue.push(next);

          if (i === heroIndex && np === 4) {
            // Reconstruct path
            const path: SolverStep[] = [];
            let trace = newNodeIdx;
            while (trace > 0) {
              const step = moveFromParent[trace];
              if (step) path.push(step);
              trace = parentIndex[trace];
            }
            path.reverse();
            return path;
          }
        }
      }
    }

    head++;
  }

  return null;
}

export function getNextOptimalHint(vehicles: Vehicle[]): HintSuggestion | null {
  const path = solveRushHourBFS(vehicles);
  if (!path || path.length === 0) return null;

  const first = path[0];
  const v = vehicles[first.vehicleIndex];
  if (!v) return null;

  if (v.orientation === 'H') {
    const diff = first.newPos - v.col;
    return {
      vehicleId: v.id,
      targetRow: v.row,
      targetCol: first.newPos,
      direction: diff > 0 ? 'right' : 'left',
      steps: Math.abs(diff),
    };
  } else {
    const diff = first.newPos - v.row;
    return {
      vehicleId: v.id,
      targetRow: first.newPos,
      targetCol: v.col,
      direction: diff > 0 ? 'down' : 'up',
      steps: Math.abs(diff),
    };
  }
}
