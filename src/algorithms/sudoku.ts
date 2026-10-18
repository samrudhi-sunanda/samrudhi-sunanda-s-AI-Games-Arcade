export type SudokuGrid = number[][];

export function cloneSudokuGrid(grid: SudokuGrid): SudokuGrid {
  return grid.map((row) => [...row]);
}

/**
 * Checks if placing `num` at `grid[row][col]` satisfies Sudoku constraints:
 * 1. Unique in row
 * 2. Unique in column
 * 3. Unique in 3x3 box
 */
export function isValidSudokuMove(grid: SudokuGrid, row: number, col: number, num: number): boolean {
  for (let c = 0; c < 9; c++) {
    if (c !== col && grid[row][c] === num) return false;
  }

  for (let r = 0; r < 9; r++) {
    if (r !== row && grid[r][col] === num) return false;
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const curR = startRow + r;
      const curC = startCol + c;
      if ((curR !== row || curC !== col) && grid[curR][curC] === num) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Finds the next empty cell, optionally using Minimum Remaining Values (MRV) heuristic.
 */
export function findEmptyCellMRV(grid: SudokuGrid): { row: number; col: number; count: number } | null {
  let minCount = 10;
  let bestCell: { row: number; col: number; count: number } | null = null;

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === 0) {
        let validChoices = 0;
        for (let num = 1; num <= 9; num++) {
          if (isValidSudokuMove(grid, r, c, num)) {
            validChoices++;
          }
        }
        if (validChoices < minCount) {
          minCount = validChoices;
          bestCell = { row: r, col: c, count: validChoices };
          if (minCount === 0) return bestCell; // immediate dead end (prune quickly)
        }
      }
    }
  }

  return bestCell;
}

/**
 * Solves Sudoku using Backtracking with MRV heuristic.
 * Returns { solved: boolean, grid: SudokuGrid, steps: number }
 */
export function solveSudoku(grid: SudokuGrid): { solved: boolean; solution: SudokuGrid; steps: number } {
  const workingGrid = cloneSudokuGrid(grid);
  let stepCount = 0;

  function backtrack(): boolean {
    stepCount++;
    if (stepCount > 200000) return false; // Safety cutoff

    const nextCell = findEmptyCellMRV(workingGrid);
    if (!nextCell) {
      return true; // All cells filled
    }

    const { row, col } = nextCell;
    for (let num = 1; num <= 9; num++) {
      if (isValidSudokuMove(workingGrid, row, col, num)) {
        workingGrid[row][col] = num;
        if (backtrack()) {
          return true;
        }
        workingGrid[row][col] = 0; // Backtrack
      }
    }

    return false;
  }

  const solved = backtrack();
  return { solved, solution: workingGrid, steps: stepCount };
}

/**
 * Checks if the user's filled board is completely correct and valid.
 */
export function isSudokuComplete(grid: SudokuGrid): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = grid[r][c];
      if (val < 1 || val > 9) return false;
      if (!isValidSudokuMove(grid, r, c, val)) return false;
    }
  }
  return true;
}

// Preset verified puzzles with known valid solutions
export interface SudokuPreset {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  puzzle: SudokuGrid;
}

export const PRESET_PUZZLES: SudokuPreset[] = [
  {
    id: 'p1',
    name: 'Beginner Logic',
    difficulty: 'Easy',
    puzzle: [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ],
  },
  {
    id: 'p2',
    name: 'Constraint Master',
    difficulty: 'Medium',
    puzzle: [
      [0, 2, 0, 6, 0, 8, 0, 0, 0],
      [5, 8, 0, 0, 0, 9, 7, 0, 0],
      [0, 0, 0, 0, 4, 0, 0, 0, 0],
      [3, 7, 0, 0, 0, 0, 5, 0, 0],
      [6, 0, 0, 0, 0, 0, 0, 0, 4],
      [0, 0, 8, 0, 0, 0, 0, 1, 3],
      [0, 0, 0, 0, 2, 0, 0, 0, 0],
      [0, 0, 9, 8, 0, 0, 0, 3, 6],
      [0, 0, 0, 3, 0, 6, 0, 9, 0],
    ],
  },
  {
    id: 'p3',
    name: 'Deep Backtrack',
    difficulty: 'Hard',
    puzzle: [
      [0, 0, 0, 6, 0, 0, 4, 0, 0],
      [7, 0, 0, 0, 0, 3, 6, 0, 0],
      [0, 0, 0, 0, 9, 1, 0, 8, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 5, 0, 1, 8, 0, 0, 0, 3],
      [0, 0, 0, 3, 0, 6, 0, 4, 5],
      [0, 4, 0, 2, 0, 0, 0, 6, 0],
      [9, 0, 3, 0, 0, 0, 0, 0, 0],
      [0, 2, 0, 0, 0, 0, 1, 0, 0],
    ],
  },
  {
    id: 'p4',
    name: 'Pattern Symmetry',
    difficulty: 'Easy',
    puzzle: [
      [0, 0, 0, 2, 6, 0, 7, 0, 1],
      [6, 8, 0, 0, 7, 0, 0, 9, 0],
      [1, 9, 0, 0, 0, 4, 5, 0, 0],
      [8, 2, 0, 1, 0, 0, 0, 4, 0],
      [0, 0, 4, 6, 0, 2, 9, 0, 0],
      [0, 5, 0, 0, 0, 3, 0, 2, 8],
      [0, 0, 9, 3, 0, 0, 0, 7, 4],
      [0, 4, 0, 0, 5, 0, 0, 3, 6],
      [7, 0, 3, 0, 1, 8, 0, 0, 0],
    ]
  }
];
