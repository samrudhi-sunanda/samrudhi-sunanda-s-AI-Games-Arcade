import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  Undo2, 
  Sparkles, 
  Trophy, 
  Info, 
  Play, 
  Pause, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft as LeftIcon, 
  ArrowRight as RightIcon,
  Bot,
  HelpCircle
} from 'lucide-react';
import { 
  Board2048, 
  Direction2048, 
  createEmpty2048Board, 
  clone2048Board, 
  addRandomTile2048, 
  move2048, 
  canMove2048, 
  getMaxTile2048, 
  getBestMove2048,
  evaluateBoard2048 
} from '../../algorithms/game2048.ts';
import { storage } from '../../utils/storage.ts';
import { soundManager } from '../../utils/audio.ts';
import { AlgorithmModal } from '../AlgorithmModal.tsx';
import { QuickStartModal } from '../QuickStartModal.tsx';
import { AI_CONCEPTS_LIST } from '../../utils/gamesData.ts';
import { QUICK_START_GUIDES } from '../../utils/quickStartData.ts';

interface Game2048Props {
  onBack: () => void;
}

const TILE_COLORS: Record<number, string> = {
  2: 'bg-slate-800 text-slate-100 border border-slate-700',
  4: 'bg-slate-700 text-slate-100 border border-slate-600',
  8: 'bg-orange-600 text-white font-bold shadow-sm shadow-orange-500/30',
  16: 'bg-orange-700 text-white font-bold shadow-md shadow-orange-600/40',
  32: 'bg-rose-600 text-white font-bold shadow-md shadow-rose-500/40',
  64: 'bg-red-600 text-white font-extrabold shadow-lg shadow-red-500/50',
  128: 'bg-amber-500 text-slate-900 font-extrabold shadow-lg shadow-amber-400/50',
  256: 'bg-yellow-400 text-slate-900 font-extrabold shadow-xl shadow-yellow-300/60 ring-2 ring-yellow-200',
  512: 'bg-emerald-500 text-white font-extrabold shadow-xl shadow-emerald-400/60 ring-2 ring-emerald-300',
  1024: 'bg-cyan-500 text-white font-extrabold shadow-2xl shadow-cyan-400/70 ring-2 ring-cyan-200',
  2048: 'bg-gradient-to-r from-purple-600 to-pink-500 text-white font-extrabold shadow-2xl shadow-purple-500/80 ring-4 ring-pink-300',
};

export const Game2048: React.FC<Game2048Props> = ({ onBack }) => {
  const [board, setBoard] = useState<Board2048>(() => {
    let b = createEmpty2048Board();
    b = addRandomTile2048(b);
    b = addRandomTile2048(b);
    return b;
  });
  const [history, setHistory] = useState<{ board: Board2048; score: number }[]>([]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{ dir: Direction2048 | null; score: number } | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const [stats, setStats] = useState(() => storage.getStats().game2048);
  const [showAlgorithmModal, setShowAlgorithmModal] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(() => !storage.hasSeenTutorial('2048'));

  const autoPlayRef = useRef<number | null>(null);

  const restartGame = useCallback(() => {
    soundManager.playClick();
    if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    setAutoPlay(false);
    let b = createEmpty2048Board();
    b = addRandomTile2048(b);
    b = addRandomTile2048(b);
    setBoard(b);
    setScore(0);
    setHistory([]);
    setIsGameOver(false);
    setHasWon(false);
    setAiSuggestion(null);
  }, []);

  const makeMove = useCallback((direction: Direction2048) => {
    if (isGameOver) return;

    const { board: nextBoard, scoreGained, moved } = move2048(board, direction);
    if (!moved) return;

    soundManager.playMove();
    if (scoreGained > 0) {
      soundManager.playMerge();
    }

    // Save for undo
    setHistory((prev) => [...prev.slice(-10), { board, score }]);

    const withNewTile = addRandomTile2048(nextBoard);
    const newScore = score + scoreGained;
    setBoard(withNewTile);
    setScore(newScore);

    // Check Win (2048)
    const maxVal = getMaxTile2048(withNewTile);
    if (maxVal >= 2048 && !hasWon) {
      setHasWon(true);
      soundManager.playWin();
      const updated = storage.record2048(newScore, true);
      setStats(updated.game2048);
    } else {
      const updated = storage.record2048(newScore, false);
      setStats(updated.game2048);
    }

    // Check Game Over
    if (!canMove2048(withNewTile)) {
      setIsGameOver(true);
      setAutoPlay(false);
      soundManager.playLose();
    }
  }, [board, score, isGameOver, hasWon]);

  // Handle Keyboard Arrow inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowUp') makeMove('up');
        else if (e.key === 'ArrowDown') makeMove('down');
        else if (e.key === 'ArrowLeft') makeMove('left');
        else if (e.key === 'ArrowRight') makeMove('right');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [makeMove]);

  // Auto-play effect loop
  useEffect(() => {
    if (!autoPlay || isGameOver) return;

    const runStep = () => {
      const bestDir = getBestMove2048(board, 2);
      if (bestDir) {
        makeMove(bestDir);
        autoPlayRef.current = window.setTimeout(runStep, 150);
      } else {
        setAutoPlay(false);
      }
    };

    autoPlayRef.current = window.setTimeout(runStep, 150);
    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    };
  }, [autoPlay, board, isGameOver, makeMove]);

  const handleUndo = () => {
    if (history.length === 0 || isGameOver) return;
    soundManager.playClick();
    const last = history[history.length - 1];
    setBoard(last.board);
    setScore(last.score);
    setHistory((prev) => prev.slice(0, -1));
  };

  const handleSuggestMove = () => {
    soundManager.playClick();
    const bestDir = getBestMove2048(board, 2);
    const scoreVal = evaluateBoard2048(board);
    setAiSuggestion({ dir: bestDir, score: scoreVal });
  };

  const heuristicConcept = AI_CONCEPTS_LIST.find((c) => c.id === 'heuristics')!;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Bar */}
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-200 border border-cyan-500/40 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-300" />
            <span>Quick Start</span>
          </button>

          <button
            onClick={() => setShowAlgorithmModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-700/40 transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>AI Heuristic Model</span>
          </button>

          <button
            onClick={restartGame}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-cyan-900/40 text-cyan-300 border border-cyan-600/30 mb-2">
          Game 6 · Heuristic Evaluation & Lookahead
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          2048 Puzzle & AI Advisor
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-lg mx-auto">
          Slide and merge numbered tiles. Request AI suggestions or enable Auto-Play to witness the heuristic utility function maximize free space, smoothness, and corner monotonicity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Controls & AI Dashboard */}
        <div className="space-y-5 rounded-2xl bg-[#0f172a]/90 border border-slate-800 p-5 shadow-xl">
          {/* Score Cards */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs uppercase font-semibold text-slate-400">Current Score</span>
              <p className="text-2xl font-black text-white font-mono mt-0.5">{score.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs uppercase font-semibold text-amber-400">Best Score</span>
              <p className="text-2xl font-black text-amber-300 font-mono mt-0.5">
                {stats.bestScore.toLocaleString()}
              </p>
            </div>
          </div>

          {/* AI Features */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <button
              onClick={handleSuggestMove}
              disabled={isGameOver || autoPlay}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Suggest Move</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setAutoPlay(!autoPlay);
              }}
              disabled={isGameOver}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                autoPlay
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30'
              }`}
            >
              {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{autoPlay ? 'Pause Auto-Play' : 'Start AI Auto-Play'}</span>
            </button>

            <button
              onClick={handleUndo}
              disabled={history.length === 0 || isGameOver || autoPlay}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer disabled:opacity-40"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Undo Last Move ({history.length})</span>
            </button>
          </div>

          {/* AI Move Suggestion Result */}
          {aiSuggestion && (
            <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-xs text-slate-300 space-y-1 animate-in fade-in">
              <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
                <Bot className="w-4 h-4" />
                <span>AI Recommendation:</span>
              </span>
              <p className="font-bold text-white text-sm uppercase">
                Move {aiSuggestion.dir}
              </p>
              <p className="text-[11px] text-slate-400">
                Evaluation heuristic fitness: {Math.round(aiSuggestion.score)} pts.
              </p>
            </div>
          )}

          {/* Controls hint */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
            <p className="font-semibold text-slate-300 mb-1">🎮 Keyboard Controls:</p>
            <p>Use Arrow Keys (↑, ↓, ←, →) or on-screen directional buttons to slide tiles.</p>
          </div>
        </div>

        {/* Central 4x4 Grid Board */}
        <div className="lg:col-span-2 flex flex-col items-center">
          {/* Game Over / Win Banner */}
          {isGameOver && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500 text-center text-rose-200 font-bold text-sm w-full max-w-sm animate-in zoom-in-95">
              Game Over! No legal moves remain.
              <button
                onClick={restartGame}
                className="block mx-auto mt-2 px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Try Again
              </button>
            </div>
          )}

          {hasWon && (
            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-center text-emerald-200 font-bold text-sm w-full max-w-sm animate-in zoom-in-95">
              🎉 2048 Tile Achieved! You can continue playing for higher scores.
            </div>
          )}

          {/* 4x4 Board Container */}
          <div className="p-3 sm:p-4 rounded-3xl bg-slate-900/90 border-2 border-cyan-500/20 shadow-2xl shadow-cyan-950/40 backdrop-blur-md">
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5 w-72 h-72 sm:w-96 sm:h-96">
              {board.map((row, r) =>
                row.map((val, c) => {
                  const colorClass = val > 0 ? (TILE_COLORS[val] || 'bg-purple-900 text-white font-extrabold') : 'bg-slate-800/60 border border-slate-800';
                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`rounded-2xl flex items-center justify-center font-bold text-lg sm:text-2xl transition-all duration-100 select-none ${colorClass}`}
                    >
                      {val > 0 ? val : ''}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* On-screen Directional Pad for Mobile / Touch / Mouse */}
          <div className="mt-6 flex flex-col items-center gap-2">
            <button
              onClick={() => makeMove('up')}
              className="p-3 rounded-xl bg-slate-800 hover:bg-cyan-600 text-white border border-slate-700 shadow-md active:scale-95 transition-all cursor-pointer"
              aria-label="Move Up"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => makeMove('left')}
                className="p-3 rounded-xl bg-slate-800 hover:bg-cyan-600 text-white border border-slate-700 shadow-md active:scale-95 transition-all cursor-pointer"
                aria-label="Move Left"
              >
                <LeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => makeMove('down')}
                className="p-3 rounded-xl bg-slate-800 hover:bg-cyan-600 text-white border border-slate-700 shadow-md active:scale-95 transition-all cursor-pointer"
                aria-label="Move Down"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
              <button
                onClick={() => makeMove('right')}
                className="p-3 rounded-xl bg-slate-800 hover:bg-cyan-600 text-white border border-slate-700 shadow-md active:scale-95 transition-all cursor-pointer"
                aria-label="Move Right"
              >
                <RightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Algorithm Modal */}
      <AlgorithmModal
        concept={heuristicConcept}
        isOpen={showAlgorithmModal}
        onClose={() => setShowAlgorithmModal(false)}
      />

      {/* Quick Start Tutorial Modal */}
      <QuickStartModal
        guide={QUICK_START_GUIDES['2048']}
        isOpen={showQuickStart}
        onClose={() => setShowQuickStart(false)}
      />
    </div>
  );
};
