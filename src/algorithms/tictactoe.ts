export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type BoardState = CellValue[];

export const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export function checkTicTacToeWinner(board: BoardState): { winner: Player | 'draw' | null; line: number[] | null } {
  for (const combo of WINNING_COMBOS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line: combo };
    }
  }

  const isFull = board.every((cell) => cell !== null);
  if (isFull) {
    return { winner: 'draw', line: null };
  }

  return { winner: null, line: null };
}

export function getAvailableMoves(board: BoardState): number[] {
  const moves: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      moves.push(i);
    }
  }
  return moves;
}

/**
 * Minimax recursive algorithm with depth penalization
 * Returns the heuristic evaluation score for the board
 */
export function minimax(
  board: BoardState,
  depth: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  humanPlayer: Player
): number {
  const { winner } = checkTicTacToeWinner(board);
  if (winner === aiPlayer) return 10 - depth;
  if (winner === humanPlayer) return depth - 10;
  if (winner === 'draw') return 0;

  const availableMoves = getAvailableMoves(board);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of availableMoves) {
      board[move] = aiPlayer;
      const evaluation = minimax(board, depth + 1, false, aiPlayer, humanPlayer);
      board[move] = null;
      maxEval = Math.max(maxEval, evaluation);
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of availableMoves) {
      board[move] = humanPlayer;
      const evaluation = minimax(board, depth + 1, true, aiPlayer, humanPlayer);
      board[move] = null;
      minEval = Math.min(minEval, evaluation);
    }
    return minEval;
  }
}

/**
 * Calculates best move according to chosen difficulty:
 * - Easy: Completely random move
 * - Medium: Blocks immediate wins, seizes immediate wins, otherwise 50% random
 * - Hard: Full Minimax algorithm
 */
export function getTicTacToeBestMove(
  board: BoardState,
  difficulty: 'easy' | 'medium' | 'hard',
  aiPlayer: Player,
  humanPlayer: Player
): number {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return -1;

  if (difficulty === 'easy') {
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  }

  // Seize immediate win
  for (const move of availableMoves) {
    board[move] = aiPlayer;
    if (checkTicTacToeWinner(board).winner === aiPlayer) {
      board[move] = null;
      return move;
    }
    board[move] = null;
  }

  // Block opponent's immediate win
  for (const move of availableMoves) {
    board[move] = humanPlayer;
    if (checkTicTacToeWinner(board).winner === humanPlayer) {
      board[move] = null;
      return move;
    }
    board[move] = null;
  }

  if (difficulty === 'medium') {
    // 50% chance to make random move or play center/corners
    if (Math.random() < 0.45) {
      const randomIndex = Math.floor(Math.random() * availableMoves.length);
      return availableMoves[randomIndex];
    }
  }

  // Optimal Minimax (Hard)
  let bestScore = -Infinity;
  let bestMove = availableMoves[0];

  for (const move of availableMoves) {
    board[move] = aiPlayer;
    const score = minimax(board, 0, false, aiPlayer, humanPlayer);
    board[move] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}
