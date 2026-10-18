import React, { useState } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  Sparkles, 
  Trophy, 
  Info, 
  Swords, 
  ShieldAlert, 
  BrainCircuit, 
  CheckCircle2, 
  HelpCircle 
} from 'lucide-react';
import { 
  RPSChoice, 
  RPSResult, 
  determineRPSWinner, 
  getRPSComputerMove, 
  RPSPrediction,
  CHOICES
} from '../../algorithms/rps.ts';
import { storage } from '../../utils/storage.ts';
import { soundManager } from '../../utils/audio.ts';
import { AlgorithmModal } from '../AlgorithmModal.tsx';
import { QuickStartModal } from '../QuickStartModal.tsx';
import { AI_CONCEPTS_LIST } from '../../utils/gamesData.ts';
import { QUICK_START_GUIDES } from '../../utils/quickStartData.ts';

interface RPSGameProps {
  onBack: () => void;
}

const CHOICE_EMOJIS: Record<RPSChoice, string> = {
  rock: '🪨',
  paper: '📄',
  scissors: '✂️',
};

export const RPSGame: React.FC<RPSGameProps> = ({ onBack }) => {
  const [strategy, setStrategy] = useState<'random' | 'adaptive'>('adaptive');
  const [playerHistory, setPlayerHistory] = useState<RPSChoice[]>([]);
  const [playerChoice, setPlayerChoice] = useState<RPSChoice | null>(null);
  const [aiChoice, setAiChoice] = useState<RPSChoice | null>(null);
  const [roundResult, setRoundResult] = useState<RPSResult | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [lastPrediction, setLastPrediction] = useState<RPSPrediction | null>(null);
  const [stats, setStats] = useState(() => storage.getStats().rps);
  const [showAlgorithmModal, setShowAlgorithmModal] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(() => !storage.hasSeenTutorial('rps'));

  const handlePlayChoice = (choice: RPSChoice) => {
    if (isRevealing) return;

    soundManager.playClick();
    setIsRevealing(true);
    setPlayerChoice(choice);
    setRoundResult(null);

    // AI computes prediction before reveal
    const prediction = getRPSComputerMove(playerHistory, strategy);
    setLastPrediction(prediction);

    // Animate reveal countdown
    setTimeout(() => {
      setAiChoice(prediction.choice);
      const result = determineRPSWinner(choice, prediction.choice);
      setRoundResult(result);

      if (result === 'win') {
        soundManager.playWin();
      } else if (result === 'loss') {
        soundManager.playLose();
      } else {
        soundManager.playStep();
      }

      // Record to history & storage
      const newHistory = [...playerHistory, choice];
      setPlayerHistory(newHistory);
      const updated = storage.recordRPS(result);
      setStats(updated.rps);
      setIsRevealing(false);
    }, 600);
  };

  const handleResetScores = () => {
    soundManager.playClick();
    setPlayerHistory([]);
    setPlayerChoice(null);
    setAiChoice(null);
    setRoundResult(null);
    setLastPrediction(null);
  };

  const agentConcept = AI_CONCEPTS_LIST.find((c) => c.id === 'intelligent-agents')!;

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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-pink-950/70 hover:bg-pink-900/80 text-pink-200 border border-pink-500/40 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-pink-300" />
            <span>Quick Start</span>
          </button>

          <button
            onClick={() => setShowAlgorithmModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-700/40 transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>AI Decision Logic</span>
          </button>

          <button
            onClick={handleResetScores}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset History</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-pink-900/40 text-pink-300 border border-pink-600/30 mb-2">
          Game 3 · Decision-Making & Frequency Models
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Rock Paper Scissors AI
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-lg mx-auto">
          Humans are notoriously bad at generating true random choices. The Adaptive AI tracks your patterns and uses 1st-order Markov state transitions to predict your next throw.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Strategy & History Panel */}
        <div className="space-y-5 rounded-2xl bg-[#0f172a]/90 border border-slate-800 p-5 shadow-xl">
          {/* Strategy Mode Toggle */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
              AI Decision Strategy
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setStrategy('adaptive');
                }}
                className={`p-3 rounded-xl text-xs font-bold border transition-all text-left cursor-pointer ${
                  strategy === 'adaptive'
                    ? 'bg-pink-950/60 border-pink-500/60 text-pink-200 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <BrainCircuit className="w-4 h-4 text-pink-400" />
                  <span>Adaptive AI</span>
                </div>
                <p className="text-[11px] font-normal text-slate-400">
                  Markov + Frequency predictor
                </p>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setStrategy('random');
                }}
                className={`p-3 rounded-xl text-xs font-bold border transition-all text-left cursor-pointer ${
                  strategy === 'random'
                    ? 'bg-blue-950/60 border-blue-500/60 text-blue-200 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <HelpCircle className="w-4 h-4 text-blue-400" />
                  <span>Pure Random</span>
                </div>
                <p className="text-[11px] font-normal text-slate-400">
                  Standard 1/3 uniform Nash choice
                </p>
              </button>
            </div>
          </div>

          {/* AI Thought / Prediction Log */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>AI Decision Log</span>
            </label>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed min-h-[90px] flex items-center">
              {lastPrediction ? (
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-pink-900/40 text-pink-300 border border-pink-500/30">
                      Strategy: {lastPrediction.strategyUsed}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Guessed: {CHOICE_EMOJIS[lastPrediction.predictedPlayerMove]} {lastPrediction.predictedPlayerMove}
                    </span>
                  </div>
                  <p className="text-slate-200">{lastPrediction.explanation}</p>
                </div>
              ) : (
                <p className="text-slate-500 italic">
                  Make your first throw to initialize the AI decision model.
                </p>
              )}
            </div>
          </div>

          {/* Player Tendency Breakdown */}
          {playerHistory.length > 0 && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
                Observed Player Frequencies ({playerHistory.length} moves)
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                {CHOICES.map((c) => {
                  const count = playerHistory.filter((m) => m === c).length;
                  const pct = Math.round((count / playerHistory.length) * 100);
                  return (
                    <div key={c} className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-base">{CHOICE_EMOJIS[c]}</span>
                      <p className="font-bold text-white mt-0.5">{pct}%</p>
                      <span className="text-[10px] text-slate-400 font-mono">({count})</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stats Scoreboard */}
          <div className="pt-2 border-t border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Career Records</span>
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-emerald-400 font-semibold">Wins</span>
                <p className="text-base font-bold text-white font-mono">{stats.playerWins}</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-rose-400 font-semibold">AI Wins</span>
                <p className="text-base font-bold text-white font-mono">{stats.aiWins}</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 font-semibold">Draws</span>
                <p className="text-base font-bold text-white font-mono">{stats.draws}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Central Arena */}
        <div className="lg:col-span-2 flex flex-col items-center">
          {/* Duel Display Arena */}
          <div className="w-full p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-pink-500/20 shadow-2xl shadow-pink-950/40 backdrop-blur-md mb-8">
            <div className="grid grid-cols-2 gap-4 items-center text-center">
              {/* Player Side */}
              <div className="flex flex-col items-center space-y-3 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                  You (Player)
                </span>
                <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center text-5xl sm:text-6xl border-2 transition-transform ${
                  playerChoice 
                    ? 'bg-blue-950/40 border-blue-500/60 scale-105' 
                    : 'bg-slate-800/80 border-slate-700'
                }`}>
                  {playerChoice ? CHOICE_EMOJIS[playerChoice] : '❓'}
                </div>
                <span className="font-bold text-white capitalize text-sm">
                  {playerChoice || 'Choose Below'}
                </span>
              </div>

              {/* AI Side */}
              <div className="flex flex-col items-center space-y-3 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
                <span className="text-xs font-semibold uppercase tracking-wider text-pink-400">
                  AI Opponent
                </span>
                <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center text-5xl sm:text-6xl border-2 transition-transform ${
                  isRevealing
                    ? 'bg-pink-950/50 border-pink-500 animate-spin text-3xl'
                    : aiChoice
                    ? 'bg-pink-950/40 border-pink-500/60 scale-105'
                    : 'bg-slate-800/80 border-slate-700'
                }`}>
                  {isRevealing ? '🌀' : aiChoice ? CHOICE_EMOJIS[aiChoice] : '🤖'}
                </div>
                <span className="font-bold text-white capitalize text-sm">
                  {isRevealing ? 'Predicting...' : aiChoice || 'Waiting'}
                </span>
              </div>
            </div>

            {/* Duel Result Banner */}
            {roundResult && !isRevealing && (
              <div className={`mt-6 p-3.5 rounded-xl border text-center font-bold text-base sm:text-lg animate-in zoom-in-95 duration-150 ${
                roundResult === 'win'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                  : roundResult === 'loss'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-slate-800 border-slate-600 text-slate-300'
              }`}>
                {roundResult === 'win' && '🎉 Victory! Your choice conquered the AI.'}
                {roundResult === 'loss' && '💀 AI Countered You! The prediction model succeeded.'}
                {roundResult === 'draw' && '⚖️ Stalemate! Both chose the exact same weapon.'}
              </div>
            )}
          </div>

          {/* Action Choice Buttons */}
          <div className="w-full max-w-md">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 text-center mb-3">
              Make Your Move
            </p>
            <div className="grid grid-cols-3 gap-3">
              {CHOICES.map((choice) => (
                <button
                  key={choice}
                  onClick={() => handlePlayChoice(choice)}
                  disabled={isRevealing}
                  className="py-4 px-2 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white border border-slate-700/80 hover:border-pink-500/60 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex flex-col items-center gap-2 group disabled:opacity-50"
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform">
                    {CHOICE_EMOJIS[choice]}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider capitalize">
                    {choice}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Algorithm Modal */}
      <AlgorithmModal
        concept={agentConcept}
        isOpen={showAlgorithmModal}
        onClose={() => setShowAlgorithmModal(false)}
      />

      {/* Quick Start Tutorial Modal */}
      <QuickStartModal
        guide={QUICK_START_GUIDES['rps']}
        isOpen={showQuickStart}
        onClose={() => setShowQuickStart(false)}
      />
    </div>
  );
};
