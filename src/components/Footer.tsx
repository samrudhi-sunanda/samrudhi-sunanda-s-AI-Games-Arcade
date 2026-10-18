import React from 'react';
import { Gamepad2, GraduationCap, Code2, Heart, ExternalLink, Keyboard } from 'lucide-react';
import { ActiveView } from '../types/index.ts';
import { soundManager } from '../utils/audio.ts';

interface FooterProps {
  setActiveView: (view: ActiveView) => void;
  onOpenShortcuts?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveView, onOpenShortcuts }) => {
  return (
    <footer className="border-t border-indigo-950/60 bg-[#080c1b] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Project Info */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">AI Games Arcade</span>
          </div>
          <p className="text-sm text-slate-400 max-w-md leading-relaxed">
            An interactive educational gaming suite demonstrating core Artificial Intelligence,
            adversarial game tree search, constraint satisfaction, informed heuristics, and statistical decision-making.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-950/50 border border-indigo-800/40 text-xs text-indigo-300">
            <GraduationCap className="w-4 h-4 text-purple-400" />
            <span>Third-Year Computer Engineering AI Mini-Project</span>
          </div>
        </div>

        {/* Quick Game Links */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Games & Algorithms</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <button onClick={() => setActiveView('tictactoe')} className="hover:text-indigo-400 transition-colors">
                Tic-Tac-Toe (Minimax)
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('sudoku')} className="hover:text-indigo-400 transition-colors">
                Sudoku Solver (CSP & Backtrack)
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('rps')} className="hover:text-indigo-400 transition-colors">
                Rock-Paper-Scissors (Markov)
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('maze')} className="hover:text-indigo-400 transition-colors">
                Maze Solver (A* Search)
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('connect4')} className="hover:text-indigo-400 transition-colors">
                Connect Four (Alpha-Beta)
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('2048')} className="hover:text-indigo-400 transition-colors">
                2048 (Heuristic Evaluation)
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('hangman')} className="hover:text-indigo-400 transition-colors">
                Hangman (Letter Frequency)
              </button>
            </li>
          </ul>
        </div>

        {/* Author / Engineering Credits */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Student Project</h4>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <Code2 className="w-4 h-4 text-purple-400" />
              <span>Samruddhi S</span>
              <span className="text-[10px] text-purple-300 font-normal px-1.5 py-0.2 rounded bg-purple-950 border border-purple-800/40">Developer</span>
            </div>
            <p className="text-[11px] text-slate-400">Co-Dev: Jay K, Pratiksha K, Akanksha G</p>
            <p className="text-slate-400">Department: Computer Engineering</p>
            <p className="text-[11px] text-slate-500">Course: Artificial Intelligence Mini-Project</p>
          </div>
          <button
            onClick={() => setActiveView('about')}
            className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            <span>Explore AI Learning Center</span>
            <ExternalLink className="w-3 h-3" />
          </button>

          {onOpenShortcuts && (
            <div>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenShortcuts();
                }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <Keyboard className="w-3.5 h-3.5 text-indigo-400" />
                <span>Keyboard Shortcuts</span>
                <kbd className="px-1 py-0.2 rounded bg-slate-800 text-[10px] font-mono text-indigo-300 font-bold border border-slate-700">?</kbd>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-800/80 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© {new Date().getFullYear()} AI Games Arcade · Designed for Educational Demonstration</p>
        <p className="flex items-center gap-1.5">
          <span>Engineered with React, TypeScript & Client-Side AI</span>
          <Heart className="w-3 h-3 text-pink-500 fill-pink-500 inline" />
        </p>
      </div>
    </footer>
  );
};
