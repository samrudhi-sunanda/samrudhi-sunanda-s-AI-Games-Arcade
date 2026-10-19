import React, { useEffect, useState } from 'react';
import { 
  X, 
  Keyboard, 
  Gamepad2, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Home, 
  Layers, 
  Trophy, 
  Info, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { ActiveView } from '../types/index.ts';
import { SHORTCUT_DEFINITIONS, GAME_KEY_MAP, GAME_NAME_MAP } from '../utils/keyboardShortcuts.ts';
import { soundManager } from '../utils/audio.ts';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectView: (view: ActiveView) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  onSelectView,
  isDark,
  onToggleTheme,
  isMuted,
  onToggleMute,
}) => {
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      setLastKeyPressed(e.key.toUpperCase());
      const timer = setTimeout(() => setLastKeyPressed(null), 1200);
      return () => clearTimeout(timer);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const gamesShortcuts = [
    { key: '1', name: 'Tic-Tac-Toe', algorithm: 'Minimax Game Tree', view: 'tictactoe' as ActiveView },
    { key: '2', name: 'Sudoku Solver', algorithm: 'CSP & Depth-First Backtracking', view: 'sudoku' as ActiveView },
    { key: '3', name: 'Rock-Paper-Scissors', algorithm: 'Markov Transition Analysis', view: 'rps' as ActiveView },
    { key: '4', name: 'Maze Solver', algorithm: 'A* Heuristic Pathfinding', view: 'maze' as ActiveView },
    { key: '5', name: 'Connect Four', algorithm: 'Alpha-Beta Adversarial Pruning', view: 'connect4' as ActiveView },
    { key: '6', name: '2048 Puzzle', algorithm: 'Lookahead & Heuristic Evaluation', view: '2048' as ActiveView },
    { key: '7', name: 'Hangman', algorithm: 'Corpus Frequency & Information Gain', view: 'hangman' as ActiveView },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#0c1229] border border-slate-200 dark:border-indigo-500/30 p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-slate-100 transition-colors"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-indigo-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-50 dark:bg-[#0d132b] rounded-[10px] flex items-center justify-center">
                <Keyboard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="shortcuts-modal-title" className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Global Keyboard Shortcuts
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-700/50">
                  Quick Navigation
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Press any designated key anywhere in the arcade to navigate instantly.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            aria-label="Close shortcuts dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Keypress Detector Indicator */}
        {lastKeyPressed && (
          <div className="mt-4 p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/40 flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-1">
            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500 dark:text-purple-400" />
              Key Detected:
            </span>
            <span className="px-2 py-0.5 font-mono font-bold rounded bg-indigo-600 text-white shadow-xs">
              {lastKeyPressed}
            </span>
          </div>
        )}

        {/* Shortcuts Content */}
        <div className="mt-6 space-y-6">
          {/* Section 1: 7 Playable Games */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-3">
              <Gamepad2 className="w-4 h-4" />
              <span>Launch Games (Keys 1 – 7)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {gamesShortcuts.map((g) => {
                const isHighlight = lastKeyPressed === g.key;
                return (
                  <button
                    key={g.key}
                    onClick={() => {
                      soundManager.playClick();
                      onSelectView(g.view);
                      onClose();
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isHighlight
                        ? 'bg-indigo-50 dark:bg-indigo-600/30 border-indigo-400 text-indigo-900 dark:text-white ring-2 ring-indigo-400 shadow-md'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800 dark:bg-slate-900/70 dark:hover:bg-slate-800/80 dark:border-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <kbd className="w-7 h-7 rounded-lg bg-indigo-100 border border-indigo-300 text-indigo-700 dark:bg-indigo-950/80 dark:border-indigo-500/50 dark:text-indigo-300 flex items-center justify-center font-mono font-bold text-sm shadow-xs shrink-0">
                        {g.key}
                      </kbd>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{g.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{g.algorithm}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider ml-2 shrink-0">
                      Launch →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Audio & Appearance Controls */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Controls & Audio</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  onToggleMute();
                }}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  lastKeyPressed === 'M'
                    ? 'bg-indigo-50 dark:bg-indigo-600/30 border-indigo-400 text-indigo-900 dark:text-white ring-2 ring-indigo-400'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800 dark:bg-slate-900/70 dark:hover:bg-slate-800/80 dark:border-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <kbd className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 flex items-center justify-center font-mono font-bold text-sm shadow-xs">
                    M
                  </kbd>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Toggle Sound Mute</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Current: {isMuted ? 'Muted (Silent)' : 'Unmuted (Audio On)'}
                    </p>
                  </div>
                </div>
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                )}
              </button>

              <button
                onClick={() => {
                  onToggleTheme();
                }}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  lastKeyPressed === 'D'
                    ? 'bg-indigo-50 dark:bg-indigo-600/30 border-indigo-400 text-indigo-900 dark:text-white ring-2 ring-indigo-400'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800 dark:bg-slate-900/70 dark:hover:bg-slate-800/80 dark:border-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <kbd className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 flex items-center justify-center font-mono font-bold text-sm shadow-xs">
                    D
                  </kbd>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Toggle Dark / Light Mode</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Current: {isDark ? 'Dark Theme' : 'Light Theme'}
                    </p>
                  </div>
                </div>
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600" />
                )}
              </button>
            </div>
          </div>

          {/* Section 3: Navigation Keys */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3">
              <Home className="w-4 h-4" />
              <span>Navigation & Dialogs</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <button
                onClick={() => {
                  soundManager.playClick();
                  onSelectView('home');
                  onClose();
                }}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 dark:bg-slate-900/70 dark:hover:bg-slate-800 dark:border-slate-800 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <kbd className="w-6 h-6 rounded bg-white border border-slate-300 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                  H
                </kbd>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Home Dashboard</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onSelectView('games');
                  onClose();
                }}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 dark:bg-slate-900/70 dark:hover:bg-slate-800 dark:border-slate-800 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <kbd className="w-6 h-6 rounded bg-white border border-slate-300 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                  G
                </kbd>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Games Catalog</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onSelectView('leaderboard');
                  onClose();
                }}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 dark:bg-slate-900/70 dark:hover:bg-slate-800 dark:border-slate-800 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <kbd className="w-6 h-6 rounded bg-white border border-slate-300 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                  L
                </kbd>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Leaderboard</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onSelectView('about');
                  onClose();
                }}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 dark:bg-slate-900/70 dark:hover:bg-slate-800 dark:border-slate-800 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <kbd className="w-6 h-6 rounded bg-white border border-slate-300 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                  A
                </kbd>
                <span className="text-slate-700 dark:text-slate-300 font-medium">About & Team</span>
              </button>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/70 dark:border-slate-800 flex items-center gap-2">
                <kbd className="w-6 h-6 rounded bg-white border border-slate-300 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                  ?
                </kbd>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Open Shortcuts</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/70 dark:border-slate-800 flex items-center gap-2">
                <kbd className="px-1.5 h-6 rounded bg-white border border-slate-300 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 flex items-center justify-center font-mono font-bold text-[10px] shadow-xs">
                  Esc
                </kbd>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Close / Home</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer tip */}
        <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <p className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span>Shortcuts are active across all pages & games.</span>
          </p>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
          >
            Got it, Let's Play
          </button>
        </div>
      </div>
    </div>
  );
};
