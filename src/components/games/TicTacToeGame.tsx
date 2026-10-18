import React, { useState, useEffect, useCallback } from 'react';
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
  HelpCircle 
} from 'lucide-react';
import { ActiveView, Difficulty } from '../../types/index.ts';
import { 
  BoardState, 
  Player, 
  checkTicTacToeWinner, 
  getTicTacToeBestMove 
} from '../../algorithms/tictactoe.ts';
import { storage } from '../../utils/storage.ts';
import { soundManager } from '../../utils/audio.ts';
import { AlgorithmModal } from '../AlgorithmModal.tsx';
import { QuickStartModal } from '../QuickStartModal.tsx';
import { AI_CONCEPTS_LIST } from '../../utils/gamesData.ts';
import { QUICK_START_GUIDES } from '../../utils/quickStartData.ts';

interface TicTacToeProps {
  onBack: () => void;
}

export const TicTacToeGame: React.FC<TicTacToeProps> = ({ onBack }) => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [playerSymbol, setPlayerSymbol] = useState<Player>('X');
  const [aiSymbol, setAiSymbol] = useState<Player>('O');
  const [currentTurn, setCurrentTurn] = useState<Player>('X');
  const [difficulty, setDifficulty] = useState<Difficulty>('hard');
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [showAlgorithmModal, setShowAlgorithmModal] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(() => !storage.hasSeenTutorial('tictactoe'));

  // Local stats from storage
  const [stats, setStats] = useState(() => storage.getStats().tictactoe);

  const resetGame = useCallback((chosenSymbol?: Player) => {
    soundManager.playClick();
    const sym = chosenSymbol || playerSymbol;
    const aiSym: Player = sym === 'X' ? 'O' : 'X';
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinningLine(null);
    setIsAiThinking(false);
    setCurrentTurn('X');

    // If human chose 'O', AI plays first as 'X'
    if (sym === 'O') {
      setIsAiThinking(true);
      setTimeout(() => {
        const initialBoard: BoardState = Array(9).fill(null);
        const bestMove = getTicTacToeBestMove(initialBoard, difficulty, 'X', 'O');
        if (bestMove !== -1) {
          initialBoard[bestMove] = 'X';
          setBoard(initialBoard);
          soundManager.playAiMove();
        }
        setCurrentTurn('O');
        setIsAiThinking(false);
      }, 400);
    }
  }, [playerSymbol, difficulty]);

  const handleCellClick = (index: number) => {
    if (board[index] || winner || isAiThinking || currentTurn !== playerSymbol) {
      return;
    }

    soundManager.playMove();
    const newBoard = [...board];
    newBoard[index] = playerSymbol;
    setBoard(newBoard);

    // Check winner after human move
    const result = checkTicTacToeWinner(newBoard);
    if (result.winner) {
      setWinner(result.winner);
      setWinningLine(result.line);
      handleGameEnd(result.winner);
      return;
    }

    // Switch turn to AI
    setCurrentTurn(aiSymbol);
    setIsAiThinking(true);

    // AI Move
    setTimeout(() => {
      const aiMove = getTicTacToeBestMove(newBoard, difficulty, aiSymbol, playerSymbol);
      if (aiMove !== -1) {
        newBoard[aiMove] = aiSymbol;
        setBoard(newBoard);
        soundManager.playAiMove();

        const aiResult = checkTicTacToeWinner(newBoard);
        if (aiResult.winner) {
          setWinner(aiResult.winner);
          setWinningLine(aiResult.line);
          handleGameEnd(aiResult.winner);
        } else {
          setCurrentTurn(playerSymbol);
        }
      }
      setIsAiThinking(false);
    }, 450);
  };

  const handleGameEnd = (gameWinner: Player | 'draw') => {
    let outcome: 'win' | 'loss' | 'draw';
    if (gameWinner === 'draw') {
      outcome = 'draw';
      soundManager.playStep();
    } else if (gameWinner === playerSymbol) {
      outcome = 'win';
      soundManager.playWin();
    } else {
      outcome = 'loss';
      soundManager.playLose();
    }
    const updated = storage.recordTicTacToe(outcome);
    setStats(updated.tictactoe);
  };

  const handleSymbolChange = (symbol: Player) => {
    soundManager.playClick();
    setPlayerSymbol(symbol);
    setAiSymbol(symbol === 'X' ? 'O' : 'X');
    resetGame(symbol);
  };

  const handleDifficultyChange = (newDiff: Difficulty) => {
    soundManager.playClick();
    setDifficulty(newDiff);
    resetGame();
  };

  const minimaxConcept = AI_CONCEPTS_LIST.find((c) => c.id === 'minimax')!;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Header & Breadcrumb */}
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-950/70 hover:bg-purple-900/80 text-purple-200 border border-purple-500/40 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-purple-300" />
            <span>Quick Start</span>
          </button>

          <button
            onClick={() => setShowAlgorithmModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-700/40 transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>AI Algorithm (Minimax)</span>
          </button>

          <button
            onClick={() => resetGame()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-purple-900/60 hover:bg-purple-800/70 text-purple-200 border border-purple-500/40 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Title Lockup */}
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-900/40 text-blue-300 border border-blue-600/30 mb-2">
          Game 1 · Adversarial Search
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Tic-Tac-Toe Minimax
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-lg mx-auto">
          Play against a game-tree search agent. In Hard mode, the AI explores all 255,168 possible leaf states using Minimax to make zero mistakes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Game Settings & Controls Panel */}
        <div className="space-y-5 rounded-2xl bg-[#0f172a]/90 border border-slate-800 p-5 shadow-xl">
          {/* Symbol Selector */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
              Choose Your Side
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSymbolChange('X')}
                className={`py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  playerSymbol === 'X'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 border border-blue-400/40'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/50'
                }`}
              >
                <span className="text-lg">X</span>
                <span className="text-xs font-normal opacity-80">(Plays 1st)</span>
              </button>
              <button
                onClick={() => handleSymbolChange('O')}
                className={`py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  playerSymbol === 'O'
                    ? 'bg-pink-600 text-white shadow-md shadow-pink-500/20 border border-pink-400/40'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/50'
                }`}
              >
                <span className="text-lg">O</span>
                <span className="text-xs font-normal opacity-80">(Plays 2nd)</span>
              </button>
            </div>
          </div>

          {/* Difficulty Selector */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
              AI Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
                <button
                  key={level}
                  onClick={() => handleDifficultyChange(level)}
                  className={`py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all capitalize cursor-pointer ${
                    difficulty === level
                      ? level === 'hard'
                        ? 'bg-red-600/90 text-white shadow'
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
              {difficulty === 'hard' && '🔥 Hard: Full Minimax. Completely mathematically unbeatable.'}
              {difficulty === 'medium' && '⚡ Medium: Strategic wins/blocks with 45% random slips.'}
              {difficulty === 'easy' && '🌱 Easy: Plays legal moves uniformly at random.'}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="pt-4 border-t border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Session Scoreboard</span>
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <p className="text-xs text-emerald-400 font-semibold">Wins</p>
                <p className="text-lg font-bold text-white font-mono">{stats.wins}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <p className="text-xs text-red-400 font-semibold">Losses</p>
                <p className="text-lg font-bold text-white font-mono">{stats.losses}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <p className="text-xs text-slate-400 font-semibold">Draws</p>
                <p className="text-lg font-bold text-white font-mono">{stats.draws}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Central Game Board */}
        <div className="lg:col-span-2 flex flex-col items-center">
          {/* Turn / Status Badge */}
          <div className="mb-6 w-full max-w-sm">
            <div className={`py-2.5 px-4 rounded-xl border flex items-center justify-between transition-all ${
              winner 
                ? winner === 'draw'
                  ? 'bg-slate-800/80 border-slate-600 text-slate-200'
                  : winner === playerSymbol
                  ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-950/50 border-rose-500/50 text-rose-300'
                : isAiThinking
                ? 'bg-indigo-950/50 border-indigo-500/40 text-indigo-300'
                : currentTurn === playerSymbol
                ? 'bg-blue-950/50 border-blue-500/40 text-blue-300'
                : 'bg-purple-950/50 border-purple-500/40 text-purple-300'
            }`}>
              <div className="flex items-center gap-2">
                {winner ? (
                  winner === 'draw' ? (
                    <MinusCircle className="w-5 h-5 text-slate-400" />
                  ) : winner === playerSymbol ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  )
                ) : isAiThinking ? (
                  <Bot className="w-5 h-5 text-indigo-400 animate-pulse" />
                ) : (
                  <User className="w-5 h-5 text-blue-400" />
                )}
                <span className="text-sm font-bold">
                  {winner
                    ? winner === 'draw'
                      ? 'Game Draw! Optimal stalemate.'
                      : winner === playerSymbol
                      ? 'Congratulations! You Won!'
                      : 'AI Wins! (Minimax optimal)'
                    : isAiThinking
                    ? `AI is computing Minimax tree...`
                    : `Your Turn (${playerSymbol})`}
                </span>
              </div>
              <span className="text-xs uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-black/40">
                Turn {board.filter((c) => c !== null).length + 1}
              </span>
            </div>
          </div>

          {/* 3x3 Grid */}
          <div className="relative p-3 rounded-3xl bg-slate-900/90 border-2 border-indigo-500/20 shadow-2xl shadow-indigo-950/50 backdrop-blur-md">
            <div className="grid grid-cols-3 gap-3 w-72 h-72 sm:w-84 sm:h-84">
              {board.map((cell, index) => {
                const isWinningCell = winningLine?.includes(index);
                return (
                  <button
                    key={index}
                    onClick={() => handleCellClick(index)}
                    disabled={Boolean(cell || winner || isAiThinking || currentTurn !== playerSymbol)}
                    aria-label={`Cell ${index + 1}: ${cell || 'Empty'}`}
                    className={`relative rounded-2xl flex items-center justify-center text-4xl sm:text-5xl font-extrabold transition-all duration-150 select-none cursor-pointer ${
                      cell === null
                        ? 'bg-slate-800/80 hover:bg-slate-700/80 active:scale-95 border border-slate-700/50 hover:border-indigo-500/50'
                        : isWinningCell
                        ? 'bg-gradient-to-tr from-amber-500/30 to-yellow-400/30 border-2 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/20'
                        : 'bg-slate-800/90 border border-slate-700'
                    }`}
                  >
                    {cell === 'X' && (
                      <span className="text-blue-400 animate-in zoom-in-50 duration-150 drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]">
                        X
                      </span>
                    )}
                    {cell === 'O' && (
                      <span className="text-pink-400 animate-in zoom-in-50 duration-150 drop-shadow-[0_0_12px_rgba(236,72,153,0.6)]">
                        O
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Outcome Action Banner */}
          {winner && (
            <div className="mt-6 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
              <button
                onClick={() => resetGame()}
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                Play Another Round
              </button>
              <button
                onClick={onBack}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
              >
                Back to Arcade
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Algorithm Modal */}
      <AlgorithmModal
        concept={minimaxConcept}
        isOpen={showAlgorithmModal}
        onClose={() => setShowAlgorithmModal(false)}
      />

      {/* Quick Start Tutorial Modal */}
      <QuickStartModal
        guide={QUICK_START_GUIDES['tictactoe']}
        isOpen={showQuickStart}
        onClose={() => setShowQuickStart(false)}
      />
    </div>
  );
};
