export type Board2048 = number[][];
export type Direction2048 = 'up' | 'down' | 'left' | 'right';

export function createEmpty2048Board(): Board2048 {
  return [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
}

export function clone2048Board(board: Board2048): Board2048 {
  return board.map((row) => [...row]);
}

export function getEmptyCells2048(board: Board2048): { r: number; c: number }[] {
  const cells: { r: number; c: number }[] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) {
        cells.push({ r, c });
      }
    }
  }
  return cells;
}

export function addRandomTile2048(board: Board2048): Board2048 {
  const empty = getEmptyCells2048(board);
  if (empty.length === 0) return board;

  const chosen = empty[Math.floor(Math.random() * empty.length)];
  const val = Math.random() < 0.9 ? 2 : 4;
  const newBoard = clone2048Board(board);
  newBoard[chosen.r][chosen.c] = val;
  return newBoard;
}

function slideRow(row: number[]): { newRow: number[]; scoreGained: number } {
  // Filter out zeros
  const nonZero = row.filter((v) => v !== 0);
  const result: number[] = [];
  let scoreGained = 0;

  let i = 0;
  while (i < nonZero.length) {
    if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
      const merged = nonZero[i] * 2;
      result.push(merged);
      scoreGained += merged;
      i += 2;
    } else {
      result.push(nonZero[i]);
      i += 1;
    }
  }

  while (result.length < 4) {
    result.push(0);
  }

  return { newRow: result, scoreGained };
}

export function move2048(
  board: Board2048,
  direction: Direction2048
): { board: Board2048; scoreGained: number; moved: boolean } {
  const newBoard = clone2048Board(board);
  let totalScore = 0;
  let hasMoved = false;

  if (direction === 'left') {
    for (let r = 0; r < 4; r++) {
      const { newRow, scoreGained } = slideRow(newBoard[r]);
      totalScore += scoreGained;
      for (let c = 0; c < 4; c++) {
        if (newBoard[r][c] !== newRow[c]) hasMoved = true;
        newBoard[r][c] = newRow[c];
      }
    }
  } else if (direction === 'right') {
    for (let r = 0; r < 4; r++) {
      const reversed = [...newBoard[r]].reverse();
      const { newRow, scoreGained } = slideRow(reversed);
      newRow.reverse();
      totalScore += scoreGained;
      for (let c = 0; c < 4; c++) {
        if (newBoard[r][c] !== newRow[c]) hasMoved = true;
        newBoard[r][c] = newRow[c];
      }
    }
  } else if (direction === 'up') {
    for (let c = 0; c < 4; c++) {
      const col = [newBoard[0][c], newBoard[1][c], newBoard[2][c], newBoard[3][c]];
      const { newRow, scoreGained } = slideRow(col);
      totalScore += scoreGained;
      for (let r = 0; r < 4; r++) {
        if (newBoard[r][c] !== newRow[r]) hasMoved = true;
        newBoard[r][c] = newRow[r];
      }
    }
  } else if (direction === 'down') {
    for (let c = 0; c < 4; c++) {
      const col = [newBoard[3][c], newBoard[2][c], newBoard[1][c], newBoard[0][c]];
      const { newRow, scoreGained } = slideRow(col);
      newRow.reverse();
      totalScore += scoreGained;
      for (let r = 0; r < 4; r++) {
        if (newBoard[r][c] !== newRow[r]) hasMoved = true;
        newBoard[r][c] = newRow[r];
      }
    }
  }

  return { board: newBoard, scoreGained: totalScore, moved: hasMoved };
}

export function canMove2048(board: Board2048): boolean {
  if (getEmptyCells2048(board).length > 0) return true;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const val = board[r][c];
      if (r + 1 < 4 && board[r + 1][c] === val) return true;
      if (c + 1 < 4 && board[r][c + 1] === val) return true;
    }
  }
  return false;
}

export function getMaxTile2048(board: Board2048): number {
  let max = 0;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] > max) max = board[r][c];
    }
  }
  return max;
}

// Corner gradient weights table (favors top-left corner packing)
const WEIGHT_MATRIX = [
  [2048, 1024, 512, 256],
  [16, 32, 64, 128],
  [8, 4, 2, 1],
  [0.5, 0.25, 0.1, 0],
];

/**
 * Heuristic Evaluation Function for 2048
 * Evaluates:
 * 1. Empty cells count (more free space = safer)
 * 2. Positional weight matrix (monotonic snake ordering toward corner)
 * 3. Smoothness (penalizes neighbor disparity)
 * 4. Max tile at corner bonus
 */
export function evaluateBoard2048(board: Board2048): number {
  let score = 0;
  const emptyCount = getEmptyCells2048(board).length;
  score += emptyCount * 250;

  let maxTile = 0;
  let maxTilePos = { r: 0, c: 0 };

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const val = board[r][c];
      if (val > maxTile) {
        maxTile = val;
        maxTilePos = { r, c };
      }
      if (val > 0) {
        score += Math.log2(val) * WEIGHT_MATRIX[r][c];
      }
    }
  }

  // Bonus for keeping max tile in the corner (0,0)
  if (maxTilePos.r === 0 && maxTilePos.c === 0) {
    score += maxTile * 2;
  }

  // Smoothness penalty
  let smoothness = 0;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const val = board[r][c];
      if (val !== 0) {
        // Right neighbor
        if (c + 1 < 4 && board[r][c + 1] !== 0) {
          smoothness -= Math.abs(Math.log2(val) - Math.log2(board[r][c + 1]));
        }
        // Bottom neighbor
        if (r + 1 < 4 && board[r + 1][c] !== 0) {
          smoothness -= Math.abs(Math.log2(val) - Math.log2(board[r + 1][c]));
        }
      }
    }
  }
  score += smoothness * 30;

  return score;
}

/**
 * Suggests the best direction using 2-step lookahead evaluation
 */
export function getBestMove2048(board: Board2048, searchDepth = 2): Direction2048 | null {
  const directions: Direction2048[] = ['up', 'left', 'down', 'right'];
  let bestScore = -Infinity;
  let bestDir: Direction2048 | null = null;

  for (const dir of directions) {
    const res = move2048(board, dir);
    if (!res.moved) continue;

    let score = evaluateBoard2048(res.board) + res.scoreGained;

    if (searchDepth > 1) {
      // Lookahead: assume random tile spawn on empty cells
      const emptyCells = getEmptyCells2048(res.board);
      const sampleLimit = Math.min(emptyCells.length, 3);
      let avgFutureScore = 0;

      for (let s = 0; s < sampleLimit; s++) {
        const testBoard = clone2048Board(res.board);
        testBoard[emptyCells[s].r][emptyCells[s].c] = 2;

        let maxNext = -Infinity;
        for (const nextDir of directions) {
          const nextRes = move2048(testBoard, nextDir);
          if (nextRes.moved) {
            const nextScore = evaluateBoard2048(nextRes.board) + nextRes.scoreGained;
            if (nextScore > maxNext) maxNext = nextScore;
          }
        }
        avgFutureScore += maxNext === -Infinity ? 0 : maxNext;
      }

      if (sampleLimit > 0) {
        score += avgFutureScore / sampleLimit;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestDir = dir;
    }
  }

  return bestDir;
}
