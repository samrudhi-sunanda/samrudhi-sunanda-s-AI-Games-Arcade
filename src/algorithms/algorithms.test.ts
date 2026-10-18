import test from 'node:test';
import assert from 'node:assert/strict';

import { checkTicTacToeWinner, getTicTacToeBestMove } from './tictactoe.ts';
import type { BoardState } from './tictactoe.ts';
import { solveSudoku, isValidSudokuMove, PRESET_PUZZLES } from './sudoku.ts';
import { determineRPSWinner, getRPSComputerMove } from './rps.ts';
import type { RPSChoice } from './rps.ts';
import { runAStarSearch, manhattanDistance } from './astar.ts';
import { checkConnect4Winner, createEmptyConnect4Board, getConnect4AIMove } from './connect4.ts';
import { move2048, canMove2048 } from './game2048.ts';
import { getLetterFrequencyHint } from './hangman.ts';

test('TicTacToe: detects horizontal win', () => {
  const board: BoardState = ['X', 'X', 'X', 'O', 'O', null, null, null, null];
  const { winner, line } = checkTicTacToeWinner(board);
  assert.equal(winner, 'X');
  assert.deepEqual(line, [0, 1, 2]);
});

test('TicTacToe: detects draw', () => {
  const board: BoardState = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
  const { winner } = checkTicTacToeWinner(board);
  assert.equal(winner, 'draw');
});

test('TicTacToe: Minimax blocks opponent win', () => {
  // Opponent 'X' is about to win at index 2
  const board: BoardState = ['X', 'X', null, 'O', null, null, null, null, null];
  const move = getTicTacToeBestMove(board, 'hard', 'O', 'X');
  assert.equal(move, 2);
});

test('Sudoku: validates moves and solves puzzle correctly', () => {
  const p = PRESET_PUZZLES[0].puzzle;
  assert.equal(isValidSudokuMove(p, 0, 2, 1), true); // 1 is valid in (0,2)
  assert.equal(isValidSudokuMove(p, 0, 2, 5), false); // 5 already in row

  const { solved, solution, steps } = solveSudoku(p);
  assert.equal(solved, true);
  assert.ok(steps > 0);
  assert.equal(solution[0][0], 5);
  assert.ok(solution[0][2] >= 1 && solution[0][2] <= 9);
});

test('Rock-Paper-Scissors: verifies rules and adaptive prediction', () => {
  assert.equal(determineRPSWinner('rock', 'scissors'), 'win');
  assert.equal(determineRPSWinner('rock', 'paper'), 'loss');
  assert.equal(determineRPSWinner('scissors', 'scissors'), 'draw');

  // If player repeatedly chooses 'rock', adaptive AI should predict rock and play paper
  const history: RPSChoice[] = ['rock', 'rock', 'rock', 'rock', 'rock'];
  const prediction = getRPSComputerMove(history, 'adaptive');
  assert.equal(prediction.choice, 'paper');
});

test('A* Search: finds shortest Manhattan path in unweighted grid', () => {
  const walls = new Set<string>(['1,1', '2,1', '3,1']);
  const start = { r: 0, c: 0 };
  const goal = { r: 4, c: 4 };

  const result = runAStarSearch(5, 5, start, goal, walls);
  assert.equal(result.found, true);
  assert.ok(result.path.length >= manhattanDistance(start, goal) + 1);
  assert.deepEqual(result.path[0], start);
  assert.deepEqual(result.path[result.path.length - 1], goal);
});

test('Connect Four: detects vertical win and legal moves', () => {
  const board = createEmptyConnect4Board();
  board[5][0] = 1;
  board[4][0] = 1;
  board[3][0] = 1;
  board[2][0] = 1; // 4 in column 0
  const { winner } = checkConnect4Winner(board);
  assert.equal(winner, 1);

  // Test AI blocks opponent's 3-in-a-row vertical
  const board2 = createEmptyConnect4Board();
  board2[5][3] = 1;
  board2[4][3] = 1;
  board2[3][3] = 1; // Threat in col 3!
  const bestCol = getConnect4AIMove(board2, 'hard', 2, 1);
  assert.equal(bestCol, 3);
});

test('2048: handles slides, merges, and game over detection', () => {
  const board = [
    [2, 2, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  const { board: nextBoard, scoreGained, moved } = move2048(board, 'left');
  assert.equal(moved, true);
  assert.equal(nextBoard[0][0], 4);
  assert.equal(nextBoard[0][1], 0);
  assert.equal(scoreGained, 4);

  const fullDeadlock = [
    [2, 4, 2, 4],
    [4, 2, 4, 2],
    [2, 4, 2, 4],
    [4, 2, 4, 2],
  ];
  assert.equal(canMove2048(fullDeadlock), false);
});

test('Hangman: provides accurate letter frequency hint', () => {
  const targetWord = 'ALGORITHM';
  const guessed = new Set<string>(['A', 'L']);
  const hint = getLetterFrequencyHint(targetWord, guessed, 'Technology');
  assert.ok(hint.recommendedLetter.length === 1);
  assert.ok(hint.matchingWordsCount > 0);
});
