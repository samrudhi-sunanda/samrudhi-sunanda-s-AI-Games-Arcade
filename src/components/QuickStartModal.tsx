import React, { useState, useEffect } from 'react';
import { 
  X, 
  HelpCircle, 
  Sparkles, 
  BrainCircuit, 
  Keyboard, 
  Lightbulb, 
  Play, 
  Target,
  CheckCircle2
} from 'lucide-react';
import { GameQuickStart } from '../utils/quickStartData.ts';
import { storage } from '../utils/storage.ts';
import { soundManager } from '../utils/audio.ts';

interface QuickStartModalProps {
  guide: GameQuickStart;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickStartModal: React.FC<QuickStartModalProps> = ({ guide, isOpen, onClose }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDismiss = () => {
    soundManager.playClick();
    if (dontShowAgain) {
      storage.setTutorialSeen(guide.gameId, true);
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickstart-title"
    >
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0e162e] border-2 border-indigo-500/40 shadow-2xl text-slate-100 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-600/30 shrink-0">
              <div className="w-full h-full bg-[#0d142d] rounded-[14px] flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-900/60 text-purple-300 border border-purple-500/30">
                  Quick Start Guide
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                  {guide.aiAlgorithmTag}
                </span>
              </div>
              <h2 id="quickstart-title" className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                {guide.gameTitle}
              </h2>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close tutorial modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-6 space-y-6 text-xs sm:text-sm text-slate-300">
          {/* Game Objective Card */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-950 text-indigo-400 shrink-0 mt-0.5">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Game Objective
              </span>
              <p className="text-slate-200 leading-relaxed font-medium">
                {guide.objective}
              </p>
            </div>
          </div>

          {/* AI Concept Demonstrated */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-purple-950/40 border border-indigo-700/40 space-y-1.5">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
              <BrainCircuit className="w-4 h-4 text-purple-400" />
              <span>{guide.aiConceptTitle}</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
              {guide.aiConceptSummary}
            </p>
          </div>

          {/* Basic Controls & Interactions */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-indigo-400" />
              <span>Controls & Interactions</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {guide.controls.map((ctrl, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5"
                >
                  <span className="px-2 py-1 rounded-md text-[11px] font-mono font-bold bg-slate-800 text-indigo-300 border border-slate-700/70 shrink-0">
                    {ctrl.keyOrAction}
                  </span>
                  <div>
                    <strong className="text-white block text-xs">{ctrl.label}</strong>
                    <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">
                      {ctrl.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Pro Tip */}
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-600/30 flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-amber-950 text-amber-400 shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
                AI Pro Tip for Evaluators & Players
              </span>
              <p className="text-amber-200/90 text-xs leading-relaxed">
                {guide.proTip}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <label className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <span>Don't show automatically next time</span>
          </label>

          <button
            onClick={handleDismiss}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Got It! Start Playing</span>
          </button>
        </div>
      </div>
    </div>
  );
};
