export const CONNECT4_ROWS = 6;
export const CONNECT4_COLS = 7;

export type Connect4Piece = 0 | 1 | 2; // 0: empty, 1: human, 2: AI
export type Connect4Board = Connect4Piece[][]; // rows x cols

export function createEmptyConnect4Board(): Connect4Board {
  return Array.from({ length: CONNECT4_ROWS }, () => Array(CONNECT4_COLS).fill(0));
}

export function cloneConnect4Board(board: Connect4Board): Connect4Board {
  return board.map((row) => [...row]);
}

export function getValidConnect4Columns(board: Connect4Board): number[] {
  const validCols: number[] = [];
  for (let c = 0; c < CONNECT4_COLS; c++) {
    // If top cell is empty, col is valid
    if (board[0][c] === 0) {
      validCols.push(c);
    }
  }
  return validCols;
}

export function getLowestEmptyRow(board: Connect4Board, col: number): number {
  for (let r = CONNECT4_ROWS - 1; r >= 0; r--) {
    if (board[r][col] === 0) {
      return r;
    }
  }
  return -1;
}

export function checkConnect4Winner(
  board: Connect4Board
): { winner: Connect4Piece | 'draw' | null; winningCells: [number, number][] | null } {
  // Check Horizontal
  for (let r = 0; r < CONNECT4_ROWS; r++) {
    for (let c = 0; c <= CONNECT4_COLS - 4; c++) {
      const piece = board[r][c];
      if (
        piece !== 0 &&
        piece === board[r][c + 1] &&
        piece === board[r][c + 2] &&
        piece === board[r][c + 3]
      ) {
        return {
          winner: piece,
          winningCells: [
            [r, c],
            [r, c + 1],
            [r, c + 2],
            [r, c + 3],
          ],
        };
      }
    }
  }

  // Check Vertical
  for (let c = 0; c < CONNECT4_COLS; c++) {
    for (let r = 0; r <= CONNECT4_ROWS - 4; r++) {
      const piece = board[r][c];
      if (
        piece !== 0 &&
        piece === board[r + 1][c] &&
        piece === board[r + 2][c] &&
        piece === board[r + 3][c]
      ) {
        return {
          winner: piece,
          winningCells: [
            [r, c],
            [r + 1, c],
            [r + 2, c],
            [r + 3, c],
          ],
        };
      }
    }
  }

  // Check Diagonal Positive (down-right)
  for (let r = 0; r <= CONNECT4_ROWS - 4; r++) {
    for (let c = 0; c <= CONNECT4_COLS - 4; c++) {
      const piece = board[r][c];
      if (
        piece !== 0 &&
        piece === board[r + 1][c + 1] &&
        piece === board[r + 2][c + 2] &&
        piece === board[r + 3][c + 3]
      ) {
        return {
          winner: piece,
          winningCells: [
            [r, c],
            [r + 1, c + 1],
            [r + 2, c + 2],
            [r + 3, c + 3],
          ],
        };
      }
    }
  }

  // Check Diagonal Negative (up-right)
  for (let r = 3; r < CONNECT4_ROWS; r++) {
    for (let c = 0; c <= CONNECT4_COLS - 4; c++) {
      const piece = board[r][c];
      if (
        piece !== 0 &&
        piece === board[r - 1][c + 1] &&
        piece === board[r - 2][c + 2] &&
        piece === board[r - 3][c + 3]
      ) {
        return {
          winner: piece,
          winningCells: [
            [r, c],
            [r - 1, c + 1],
            [r - 2, c + 2],
            [r - 3, c + 3],
          ],
        };
      }
    }
  }

  // Check Draw
  const isFull = board[0].every((cell) => cell !== 0);
  if (isFull) {
    return { winner: 'draw', winningCells: null };
  }

  return { winner: null, winningCells: null };
}

function evaluateWindow(window: Connect4Piece[], piece: Connect4Piece): number {
  let score = 0;
  const oppPiece: Connect4Piece = piece === 1 ? 2 : 1;

  let pieceCount = 0;
  let emptyCount = 0;
  let oppCount = 0;

  for (let i = 0; i < 4; i++) {
    if (window[i] === piece) pieceCount++;
    else if (window[i] === 0) emptyCount++;
    else if (window[i] === oppPiece) oppCount++;
  }

  if (pieceCount === 4) score += 100000;
  else if (pieceCount === 3 && emptyCount === 1) score += 50;
  else if (pieceCount === 2 && emptyCount === 2) score += 10;

  if (oppCount === 3 && emptyCount === 1) score -= 80; // Block opponent win!

  return score;
}

export function scoreConnect4Board(board: Connect4Board, piece: Connect4Piece): number {
  let score = 0;

  // Center column control is strategically valuable in Connect 4
  const centerCol = Math.floor(CONNECT4_COLS / 2);
  let centerPieces = 0;
  for (let r = 0; r < CONNECT4_ROWS; r++) {
    if (board[r][centerCol] === piece) centerPieces++;
  }
  score += centerPieces * 6;

  // Score Horizontal
  for (let r = 0; r < CONNECT4_ROWS; r++) {
    for (let c = 0; c <= CONNECT4_COLS - 4; c++) {
      const window = [board[r][c], board[r][c + 1], board[r][c + 2], board[r][c + 3]];
      score += evaluateWindow(window, piece);
    }
  }

  // Score Vertical
  for (let c = 0; c < CONNECT4_COLS; c++) {
    for (let r = 0; r <= CONNECT4_ROWS - 4; r++) {
      const window = [board[r][c], board[r + 1][c], board[r + 2][c], board[r + 3][c]];
      score += evaluateWindow(window, piece);
    }
  }

  // Score Diagonal Positive
  for (let r = 0; r <= CONNECT4_ROWS - 4; r++) {
    for (let c = 0; c <= CONNECT4_COLS - 4; c++) {
      const window = [board[r][c], board[r + 1][c + 1], board[r + 2][c + 2], board[r + 3][c + 3]];
      score += evaluateWindow(window, piece);
    }
  }

  // Score Diagonal Negative
  for (let r = 3; r < CONNECT4_ROWS; r++) {
    for (let c = 0; c <= CONNECT4_COLS - 4; c++) {
      const window = [board[r][c], board[r - 1][c + 1], board[r - 2][c + 2], board[r - 3][c + 3]];
      score += evaluateWindow(window, piece);
    }
  }

  return score;
}

/**
 * Minimax with Alpha-Beta Pruning for Connect Four
 */
export function minimaxAlphaBeta(
  board: Connect4Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiPiece: Connect4Piece,
  humanPiece: Connect4Piece
): { column: number; score: number } {
  const validCols = getValidConnect4Columns(board);
  const winCheck = checkConnect4Winner(board);

  if (winCheck.winner === aiPiece) return { column: -1, score: 1000000 + depth };
  if (winCheck.winner === humanPiece) return { column: -1, score: -1000000 - depth };
  if (winCheck.winner === 'draw' || validCols.length === 0) return { column: -1, score: 0 };
  if (depth === 0) return { column: -1, score: scoreConnect4Board(board, aiPiece) };

  // Order moves starting from center outward for best pruning efficiency
  validCols.sort((a, b) => Math.abs(a - 3) - Math.abs(b - 3));

  if (isMaximizing) {
    let maxScore = -Infinity;
    let bestCol = validCols[0];

    for (const col of validCols) {
      const r = getLowestEmptyRow(board, col);
      board[r][col] = aiPiece;
      const { score } = minimaxAlphaBeta(board, depth - 1, alpha, beta, false, aiPiece, humanPiece);
      board[r][col] = 0; // backtrack

      if (score > maxScore) {
        maxScore = score;
        bestCol = col;
      }
      alpha = Math.max(alpha, maxScore);
      if (alpha >= beta) {
        break; // Alpha-Beta cut-off
      }
    }
    return { column: bestCol, score: maxScore };
  } else {
    let minScore = Infinity;
    let bestCol = validCols[0];

    for (const col of validCols) {
      const r = getLowestEmptyRow(board, col);
      board[r][col] = humanPiece;
      const { score } = minimaxAlphaBeta(board, depth - 1, alpha, beta, true, aiPiece, humanPiece);
      board[r][col] = 0; // backtrack

      if (score < minScore) {
        minScore = score;
        bestCol = col;
      }
      beta = Math.min(beta, minScore);
      if (alpha >= beta) {
        break; // Alpha-Beta cut-off
      }
    }
    return { column: bestCol, score: minScore };
  }
}

export function getConnect4AIMove(
  board: Connect4Board,
  difficulty: 'easy' | 'medium' | 'hard',
  aiPiece: Connect4Piece,
  humanPiece: Connect4Piece
): number {
  const validCols = getValidConnect4Columns(board);
  if (validCols.length === 0) return -1;

  if (difficulty === 'easy') {
    return validCols[Math.floor(Math.random() * validCols.length)];
  }

  // Check immediate AI winning move
  for (const col of validCols) {
    const r = getLowestEmptyRow(board, col);
    board[r][col] = aiPiece;
    const isWin = checkConnect4Winner(board).winner === aiPiece;
    board[r][col] = 0;
    if (isWin) return col;
  }

  // Check immediate opponent winning move to block
  for (const col of validCols) {
    const r = getLowestEmptyRow(board, col);
    board[r][col] = humanPiece;
    const isWin = checkConnect4Winner(board).winner === humanPiece;
    board[r][col] = 0;
    if (isWin) return col;
  }

  const depth = difficulty === 'medium' ? 3 : 5;
  const result = minimaxAlphaBeta(board, depth, -Infinity, Infinity, true, aiPiece, humanPiece);
  return result.column !== -1 ? result.column : validCols[0];
}
