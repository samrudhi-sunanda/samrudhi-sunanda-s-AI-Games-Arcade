import React, { useState } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  Sparkles, 
  Trophy, 
  User, 
  Bot, 
  Info, 
  CheckCircle, 
  XCircle, 
  MinusCircle,
  Columns3,
  HelpCircle
} from 'lucide-react';
import { Difficulty } from '../../types/index.ts';
import { 
  CONNECT4_ROWS, 
  CONNECT4_COLS, 
  Connect4Board, 
  Connect4Piece, 
  createEmptyConnect4Board, 
  getValidConnect4Columns, 
  getLowestEmptyRow, 
  checkConnect4Winner, 
  getConnect4AIMove 
} from '../../algorithms/connect4.ts';
import { storage } from '../../utils/storage.ts';
import { soundManager } from '../../utils/audio.ts';
import { AlgorithmModal } from '../AlgorithmModal.tsx';
import { QuickStartModal } from '../QuickStartModal.tsx';
import { AI_CONCEPTS_LIST } from '../../utils/gamesData.ts';
import { QUICK_START_GUIDES } from '../../utils/quickStartData.ts';

interface ConnectFourGameProps {
  onBack: () => void;
}

export const ConnectFourGame: React.FC<ConnectFourGameProps> = ({ onBack }) => {
  const [board, setBoard] = useState<Connect4Board>(createEmptyConnect4Board);
  const [playerColor, setPlayerColor] = useState<'red' | 'yellow'>('red');
  const [currentTurn, setCurrentTurn] = useState<Connect4Piece>(1); // 1: human, 2: AI
  const [difficulty, setDifficulty] = useState<Difficulty>('hard');
  const [winner, setWinner] = useState<Connect4Piece | 'draw' | null>(null);
  const [winningCells, setWinningCells] = useState<[number, number][] | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [stats, setStats] = useState(() => storage.getStats().connect4);
  const [showAlgorithmModal, setShowAlgorithmModal] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(() => !storage.hasSeenTutorial('connect4'));

  const resetGame = () => {
    soundManager.playClick();
    setBoard(createEmptyConnect4Board());
    setWinner(null);
    setWinningCells(null);
    setCurrentTurn(1);
    setIsAiThinking(false);
  };

  const handleColumnDrop = (col: number) => {
    if (winner || isAiThinking || currentTurn !== 1) return;

    const row = getLowestEmptyRow(board, col);
    if (row === -1) return; // Column is full

    soundManager.playMove();
    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = 1;
    setBoard(newBoard);

    // Check winner after human move
    const result = checkConnect4Winner(newBoard);
    if (result.winner) {
      setWinner(result.winner);
      setWinningCells(result.winningCells);
      handleGameEnd(result.winner);
      return;
    }

    // Hand over to AI
    setCurrentTurn(2);
    setIsAiThinking(true);

    setTimeout(() => {
      const aiCol = getConnect4AIMove(newBoard, difficulty, 2, 1);
      if (aiCol !== -1) {
        const aiRow = getLowestEmptyRow(newBoard, aiCol);
        if (aiRow !== -1) {
          newBoard[aiRow][aiCol] = 2;
          setBoard(newBoard);
          soundManager.playAiMove();

          const aiResult = checkConnect4Winner(newBoard);
          if (aiResult.winner) {
            setWinner(aiResult.winner);
            setWinningCells(aiResult.winningCells);
            handleGameEnd(aiResult.winner);
          } else {
            setCurrentTurn(1);
          }
        }
      }
      setIsAiThinking(false);
    }, 450);
  };

  const handleGameEnd = (gameWinner: Connect4Piece | 'draw') => {
    let outcome: 'win' | 'loss' | 'draw';
    if (gameWinner === 'draw') {
      outcome = 'draw';
      soundManager.playStep();
    } else if (gameWinner === 1) {
      outcome = 'win';
      soundManager.playWin();
    } else {
      outcome = 'loss';
      soundManager.playLose();
    }
    const updated = storage.recordConnect4(outcome);
    setStats(updated.connect4);
  };

  const alphabetaConcept = AI_CONCEPTS_LIST.find((c) => c.id === 'alphabeta')!;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Arcade</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playClick();
              setShowQuickStart(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-950/70 hover:bg-amber-900/80 text-amber-200 border border-amber-500/40 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>Quick Start</span>
          </button>

          <button
            onClick={() => setShowAlgorithmModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 border border-amber-700/40 transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>AI Algorithm (Alpha-Beta Pruning)</span>
          </button>

          <button
            onClick={resetGame}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-900/40 text-amber-300 border border-amber-600/30 mb-2">
          Game 5 · Adversarial Alpha-Beta Search
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Connect Four AI
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-lg mx-auto">
          Connect four consecutive discs in a row, column, or diagonal. The AI uses Minimax with Alpha-Beta branch pruning to search millions of game states in milliseconds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Settings Panel */}
        <div className="space-y-5 rounded-2xl bg-[#0f172a]/90 border border-slate-800 p-5 shadow-xl">
          {/* Color Chooser */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
              Player Disc Color
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setPlayerColor('red');
                  resetGame();
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  playerColor === 'red'
                    ? 'bg-rose-950/70 border-rose-500 text-rose-300 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-sm" />
                <span>Red (Player)</span>
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setPlayerColor('yellow');
                  resetGame();
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  playerColor === 'yellow'
                    ? 'bg-amber-950/70 border-amber-500 text-amber-300 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-sm" />
                <span>Yellow (Player)</span>
              </button>
            </div>
          </div>

          {/* Difficulty Selector */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
              Search Depth (Difficulty)
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    soundManager.playClick();
                    setDifficulty(level);
                    resetGame();
                  }}
                  className={`py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all capitalize cursor-pointer ${
                    difficulty === level
                      ? level === 'hard'
                        ? 'bg-rose-600/90 text-white shadow'
                        : level === 'medium'
                        ? 'bg-amber-600/90 text-white shadow'
                        : 'bg-emerald-600/90 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {difficulty === 'hard' && '🔥 Hard: 5-ply lookahead with Alpha-Beta pruning & center heuristic.'}
              {difficulty === 'medium' && '⚡ Medium: 3-ply lookahead with tactical win/loss block.'}
              {difficulty === 'easy' && '🌱 Easy: Random moves with basic win checks.'}
            </p>
          </div>

          {/* Scoreboard */}
          <div className="pt-2 border-t border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Connect 4 Record</span>
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-emerald-400 font-semibold">Wins</span>
                <p className="text-base font-bold text-white font-mono">{stats.wins}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-rose-400 font-semibold">Losses</span>
                <p className="text-base font-bold text-white font-mono">{stats.losses}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 font-semibold">Draws</span>
                <p className="text-base font-bold text-white font-mono">{stats.draws}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Board Arena */}
        <div className="lg:col-span-2 flex flex-col items-center">
          {/* Turn / Status Badge */}
          <div className="mb-4 w-full max-w-md">
            <div className={`py-2.5 px-4 rounded-xl border flex items-center justify-between transition-all ${
              winner 
                ? winner === 'draw'
                  ? 'bg-slate-800/80 border-slate-600 text-slate-200'
                  : winner === 1
                  ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-950/50 border-rose-500/50 text-rose-300'
                : isAiThinking
                ? 'bg-amber-950/50 border-amber-500/40 text-amber-300'
                : 'bg-blue-950/50 border-blue-500/40 text-blue-300'
            }`}>
              <div className="flex items-center gap-2">
                {winner ? (
                  winner === 'draw' ? <MinusCircle className="w-5 h-5" /> :
                  winner === 1 ? <CheckCircle className="w-5 h-5 text-emerald-400" /> :
                  <XCircle className="w-5 h-5 text-rose-400" />
                ) : isAiThinking ? (
                  <Bot className="w-5 h-5 text-amber-400 animate-pulse" />
                ) : (
                  <User className="w-5 h-5 text-blue-400" />
                )}
                <span className="text-sm font-bold">
                  {winner
                    ? winner === 'draw'
                      ? 'Stalemate! Board completely filled.'
                      : winner === 1
                      ? 'Victory! Four in a row!'
                      : 'AI Wins with Alpha-Beta search!'
                    : isAiThinking
                    ? `AI Pruning Search Branches...`
                    : `Your Turn (Click a Column)`}
                </span>
              </div>
            </div>
          </div>

          {/* 7-Col Drop Buttons */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3 w-full max-w-md px-4 mb-2">
            {Array.from({ length: CONNECT4_COLS }).map((_, c) => {
              const isColFull = board[0][c] !== 0;
              return (
                <button
                  key={c}
                  onClick={() => handleColumnDrop(c)}
                  disabled={isColFull || Boolean(winner) || isAiThinking || currentTurn !== 1}
                  className="py-1 rounded-lg bg-indigo-900/40 hover:bg-indigo-600/70 border border-indigo-700/40 text-indigo-200 text-xs font-bold transition-all disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                  aria-label={`Drop piece in column ${c + 1}`}
                >
                  ↓
                </button>
              );
            })}
          </div>

          {/* The Connect Four Blue Stand Board */}
          <div className="p-3 sm:p-4 rounded-3xl bg-blue-700 border-4 border-blue-900 shadow-2xl shadow-blue-950/80 max-w-md w-full">
            <div className="grid grid-cols-7 gap-2 sm:gap-3">
              {board.map((row, r) =>
                row.map((cell, c) => {
                  const isWinningCell = winningCells?.some(([wr, wc]) => wr === r && wc === c);
                  const isHuman = cell === 1;
                  const isAi = cell === 2;

                  const humanColorClass = playerColor === 'red' ? 'bg-rose-500 shadow-rose-900/60' : 'bg-amber-400 shadow-amber-900/60';
                  const aiColorClass = playerColor === 'red' ? 'bg-amber-400 shadow-amber-900/60' : 'bg-rose-500 shadow-rose-900/60';

                  return (
                    <button
                      key={`${r}-${c}`}
                      onClick={() => handleColumnDrop(c)}
                      disabled={Boolean(winner) || isAiThinking || currentTurn !== 1}
                      className="aspect-square rounded-full bg-slate-950/90 shadow-inner p-1 flex items-center justify-center cursor-pointer border border-blue-900/50"
                      aria-label={`Row ${r + 1}, Col ${c + 1}: ${cell === 1 ? 'Player' : cell === 2 ? 'AI' : 'Empty'}`}
                    >
                      {cell !== 0 && (
                        <div
                          className={`w-full h-full rounded-full transition-transform duration-200 animate-in zoom-in-50 shadow-md ${
                            isHuman ? humanColorClass : aiColorClass
                          } ${isWinningCell ? 'ring-4 ring-white animate-pulse' : ''}`}
                        />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Algorithm Modal */}
      <AlgorithmModal
        concept={alphabetaConcept}
        isOpen={showAlgorithmModal}
        onClose={() => setShowAlgorithmModal(false)}
      />

      {/* Quick Start Tutorial Modal */}
      <QuickStartModal
        guide={QUICK_START_GUIDES['connect4']}
        isOpen={showQuickStart}
        onClose={() => setShowQuickStart(false)}
      />
    </div>
  );
};
