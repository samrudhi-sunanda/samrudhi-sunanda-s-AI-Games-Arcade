import React from 'react';
import { X, BookOpen, Clock, HardDrive, CheckCircle2, Lightbulb, Sparkles } from 'lucide-react';
import { AIConceptInfo } from '../utils/gamesData.ts';
import { soundManager } from '../utils/audio.ts';

interface AlgorithmModalProps {
  concept: AIConceptInfo;
  isOpen: boolean;
  onClose: () => void;
}

export const AlgorithmModal: React.FC<AlgorithmModalProps> = ({ concept, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    soundManager.playClick();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-indigo-500/30 shadow-2xl text-slate-800 dark:text-slate-100 p-6 sm:p-8 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 dark:bg-indigo-900/50 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                Concept #{concept.number} · {concept.subtitle}
              </span>
              <h2 id="modal-title" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {concept.title}
              </h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close explanation modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-6 space-y-6 text-sm text-slate-600 dark:text-slate-300">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Core Concept Overview</span>
            </h3>
            <p className="leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-200">
              {concept.description}
            </p>
          </div>

          {/* Mathematical Formulation if available */}
          {concept.formula && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Mathematical Model / Objective Function
              </h3>
              <div className="p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-200 font-mono text-xs text-indigo-900 dark:bg-indigo-950/40 dark:border-indigo-800/40 dark:text-indigo-300 overflow-x-auto">
                {concept.formula}
              </div>
            </div>
          )}

          {/* How It Works */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
              Algorithm Execution Steps in This Game
            </h3>
            <ul className="space-y-2.5">
              {concept.howItWorks.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-900/60 dark:text-purple-300 dark:border-purple-500/40 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">
                    {idx + 1}
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Complexity Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Time Complexity</p>
                <p className="font-mono text-xs text-slate-800 dark:text-slate-200">{concept.complexity.time}</p>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Space Complexity</p>
                <p className="font-mono text-xs text-slate-800 dark:text-slate-200">{concept.complexity.space}</p>
              </div>
            </div>
          </div>

          {/* Real World Applications */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>Real-World Engineering Applications</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {concept.realWorldApplications.map((app, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                >
                  {app}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            College AI Mini-Project · Computer Engineering
          </span>
          <button
            onClick={handleClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};
