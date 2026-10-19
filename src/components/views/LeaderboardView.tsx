import React, { useState } from 'react';
import { 
  Trophy, 
  Trash2, 
  RotateCcw, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Flame,
  Grid3X3,
  Columns3,
  TableProperties,
  Compass,
  Swords,
  LayoutGrid,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { GameStats } from '../../types/index.ts';
import { storage } from '../../utils/storage.ts';
import { soundManager } from '../../utils/audio.ts';

interface LeaderboardViewProps {
  stats: GameStats;
  onStatsUpdated: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ stats, onStatsUpdated }) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleConfirmClear = () => {
    soundManager.playLose();
    storage.clearAllStats();
    setShowClearConfirm(false);
    onStatsUpdated();
  };

  const calculateWinRate = (wins: number, total: number) => {
    if (total === 0) return '0%';
    return `${Math.round((wins / total) * 100)}%`;
  };

  return (
    <div className="space-y-8 py-6 sm:py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-600/30 mb-1 transition-colors">
            Browser LocalStorage Telemetry
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3 transition-colors">
            <Trophy className="w-8 h-8 text-amber-500 dark:text-amber-400" />
            <span>Arcade Leaderboard & Stats</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 transition-colors">
            Track your matches, win rates, and highest scores against our client-side AI algorithms.
          </p>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            setShowClearConfirm(true);
          }}
          className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 dark:text-rose-300 dark:border-rose-800/50 transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
        >
          <Trash2 className="w-4 h-4 text-rose-500 dark:text-rose-400" />
          <span>Clear All Statistics</span>
        </button>
      </div>

      {/* Aggregate Overview Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-xs transition-colors">
          <div className="p-3 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">Total Played</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5">{stats.totalGamesPlayed}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-xs transition-colors">
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">Total Victories</span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
              {stats.tictactoe.wins + stats.connect4.wins + stats.rps.playerWins + stats.hangman.wins}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-xs transition-colors">
          <div className="p-3 rounded-xl bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">2048 Best Score</span>
            <p className="text-2xl font-black text-cyan-700 dark:text-cyan-300 font-mono mt-0.5">
              {stats.game2048.bestScore.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-xs transition-colors">
          <div className="p-3 rounded-xl bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">Hangman Streak</span>
            <p className="text-2xl font-black text-pink-700 dark:text-pink-300 font-mono mt-0.5">
              {stats.hangman.bestStreak}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Game Breakdown Table / Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight transition-colors">
          Per-Game Performance Breakdown
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tic-Tac-Toe */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Grid3X3 className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Tic-Tac-Toe (Minimax)</h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800/40">
                Win Rate: {calculateWinRate(stats.tictactoe.wins, stats.tictactoe.gamesPlayed)}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400">Wins</span>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-base">{stats.tictactoe.wins}</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400">Losses</span>
                <p className="font-bold text-rose-600 dark:text-rose-400 font-mono text-base">{stats.tictactoe.losses}</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400">Draws</span>
                <p className="font-bold text-slate-700 dark:text-slate-300 font-mono text-base">{stats.tictactoe.draws}</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400">Total</span>
                <p className="font-bold text-slate-900 dark:text-white font-mono text-base">{stats.tictactoe.gamesPlayed}</p>
              </div>
            </div>
          </div>

          {/* Connect Four */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Columns3 className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Connect Four (Alpha-Beta)</h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800/40">
                Win Rate: {calculateWinRate(stats.connect4.wins, stats.connect4.gamesPlayed)}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400">Wins</span>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-base">{stats.connect4.wins}</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400">Losses</span>
                <p className="font-bold text-rose-600 dark:text-rose-400 font-mono text-base">{stats.connect4.losses}</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400">Draws</span>
                <p className="font-bold text-slate-700 dark:text-slate-300 font-mono text-base">{stats.connect4.draws}</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400">Total</span>
                <p className="font-bold text-slate-900 dark:text-white font-mono text-base">{stats.connect4.gamesPlayed}</p>
              </div>
            </div>
          </div>

          {/* Sudoku Solver */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <TableProperties className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Sudoku Solver (CSP)</h3>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400">Puzzles Solved</span>
                <p className="font-bold text-purple-600 dark:text-purple-300 font-mono text-base">{stats.sudoku.solved}</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400">AI Solves Used</span>
                <p className="font-bold text-cyan-600 dark:text-cyan-300 font-mono text-base">{stats.sudoku.hintsUsed}</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400">Total Played</span>
                <p className="font-bold text-slate-900 dark:text-white font-mono text-base">{stats.sudoku.gamesPlayed}</p>
              </div>
            </div>
          </div>

          {/* Maze Solver */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Compass className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Maze Solver (A* Search)</h3>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400">Mazes Solved</span>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-base">{stats.maze.mazesSolved}</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400">Shortest Path</span>
                <p className="font-bold text-amber-600 dark:text-amber-300 font-mono text-base">
                  {stats.maze.shortestPathLength ? `${stats.maze.shortestPathLength} steps` : '—'}
                </p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400">Runs Count</span>
                <p className="font-bold text-slate-900 dark:text-white font-mono text-base">{stats.maze.gamesPlayed}</p>
              </div>
            </div>
          </div>

          {/* Rock-Paper-Scissors */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Swords className="w-5 h-5 text-pink-500 dark:text-pink-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Rock-Paper-Scissors (Markov)</h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-pink-50 text-pink-700 border border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800/40">
                Player Win Rate: {calculateWinRate(stats.rps.playerWins, stats.rps.gamesPlayed)}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400">Wins</span>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-base">{stats.rps.playerWins}</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400">AI Wins</span>
                <p className="font-bold text-rose-600 dark:text-rose-400 font-mono text-base">{stats.rps.aiWins}</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400">Draws</span>
                <p className="font-bold text-slate-700 dark:text-slate-300 font-mono text-base">{stats.rps.draws}</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400">Total</span>
                <p className="font-bold text-slate-900 dark:text-white font-mono text-base">{stats.rps.gamesPlayed}</p>
              </div>
            </div>
          </div>

          {/* Hangman */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Hangman (Frequency AI)</h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800/40">
                Win Rate: {calculateWinRate(stats.hangman.wins, stats.hangman.gamesPlayed)}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400">Wins</span>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-base">{stats.hangman.wins}</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400">Losses</span>
                <p className="font-bold text-rose-600 dark:text-rose-400 font-mono text-base">{stats.hangman.losses}</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400">Cur. Streak</span>
                <p className="font-bold text-amber-600 dark:text-amber-300 font-mono text-base">{stats.hangman.winStreak}</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400">Best Streak</span>
                <p className="font-bold text-pink-600 dark:text-pink-300 font-mono text-base">{stats.hangman.bestStreak}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Clearing Stats */}
      {showClearConfirm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-[#0f172a] border border-rose-200 dark:border-rose-500/40 text-slate-800 dark:text-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reset All Statistics?</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This action will permanently erase all games played, high scores, and win-loss records stored in your browser's LocalStorage. This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClear}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 transition-all cursor-pointer"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
