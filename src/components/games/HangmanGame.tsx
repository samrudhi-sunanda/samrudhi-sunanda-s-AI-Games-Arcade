import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  Sparkles, 
  Trophy, 
  Info, 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  RefreshCw 
} from 'lucide-react';
import { 
  HangmanCategory, 
  HANGMAN_CATEGORIES, 
  CATEGORY_WORDS, 
  getLetterFrequencyHint, 
  LetterFrequencyHint 
} from '../../algorithms/hangman.ts';
import { storage } from '../../utils/storage.ts';
import { soundManager } from '../../utils/audio.ts';
import { AlgorithmModal } from '../AlgorithmModal.tsx';
import { QuickStartModal } from '../QuickStartModal.tsx';
import { AI_CONCEPTS_LIST } from '../../utils/gamesData.ts';
import { QUICK_START_GUIDES } from '../../utils/quickStartData.ts';

interface HangmanGameProps {
  onBack: () => void;
}

const MAX_INCORRECT_GUESSES = 6;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const HangmanGame: React.FC<HangmanGameProps> = ({ onBack }) => {
  const [category, setCategory] = useState<HangmanCategory>('Technology');
  const [targetWord, setTargetWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [hint, setHint] = useState<LetterFrequencyHint | null>(null);
  const [stats, setStats] = useState(() => storage.getStats().hangman);
  const [showAlgorithmModal, setShowAlgorithmModal] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(() => !storage.hasSeenTutorial('hangman'));

  // Pick new word
  const selectRandomWord = useCallback((cat: HangmanCategory) => {
    const list = CATEGORY_WORDS[cat];
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
  }, []);

  const startNewGame = useCallback((newCat?: HangmanCategory) => {
    soundManager.playClick();
    const activeCat = newCat || category;
    const word = selectRandomWord(activeCat);
    setTargetWord(word);
    setGuessedLetters(new Set());
    setHint(null);
  }, [category, selectRandomWord]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const incorrectGuesses = Array.from(guessedLetters).filter(
    (char) => !targetWord.includes(char)
  );
  const incorrectCount = incorrectGuesses.length;
  const isLost = incorrectCount >= MAX_INCORRECT_GUESSES;
  const isWon = targetWord.length > 0 && targetWord.split('').every((c) => guessedLetters.has(c));
  const isGameOver = isWon || isLost;

  const handleGuessLetter = useCallback((letter: string) => {
    if (isGameOver || guessedLetters.has(letter)) return;

    soundManager.playClick();
    const newGuessed = new Set(guessedLetters);
    newGuessed.add(letter);
    setGuessedLetters(newGuessed);
    setHint(null); // Clear hint on guess

    if (targetWord.includes(letter)) {
      soundManager.playMove();
      // Check win
      const wonNow = targetWord.split('').every((c) => newGuessed.has(c));
      if (wonNow) {
        soundManager.playWin();
        const updated = storage.recordHangman(true);
        setStats(updated.hangman);
      }
    } else {
      soundManager.playStep();
      const newIncorrectCount = Array.from(newGuessed).filter((c) => !targetWord.includes(c)).length;
      if (newIncorrectCount >= MAX_INCORRECT_GUESSES) {
        soundManager.playLose();
        const updated = storage.recordHangman(false);
        setStats(updated.hangman);
      }
    }
  }, [guessedLetters, isGameOver, targetWord]);

  // Keyboard typing support (excluding global shortcut keys M, D, 1-7, ?, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const keyUpper = e.key.toUpperCase();
      if (['M', 'D', '?', 'ESCAPE', '1', '2', '3', '4', '5', '6', '7'].includes(keyUpper)) {
        return;
      }
      if (/^[A-Z]$/.test(keyUpper)) {
        handleGuessLetter(keyUpper);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGuessLetter]);

  const handleRequestHint = () => {
    soundManager.playClick();
    const hintData = getLetterFrequencyHint(targetWord, guessedLetters, category);
    setHint(hintData);
  };

  const frequencyConcept = AI_CONCEPTS_LIST.find((c) => c.id === 'frequency-prediction')!;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Header */}
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-200 border border-indigo-500/40 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-300" />
            <span>Quick Start</span>
          </button>

          <button
            onClick={() => setShowAlgorithmModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-700/40 transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>AI Frequency Strategy</span>
          </button>

          <button
            onClick={() => startNewGame()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New Word</span>
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-900/40 text-indigo-300 border border-indigo-600/30 mb-2">
          Game 7 · Statistical AI & Information Gain
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Hangman AI Advisor
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-lg mx-auto">
          Guess the hidden word before 6 misses. Request AI hints to inspect the probability distribution of remaining candidate letters based on corpus frequency analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Controls Sidebar */}
        <div className="space-y-5 rounded-2xl bg-[#0f172a]/90 border border-slate-800 p-5 shadow-xl">
          {/* Category Chooser */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
              Word Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {HANGMAN_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    soundManager.playClick();
                    setCategory(cat);
                    startNewGame(cat);
                  }}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left cursor-pointer ${
                    category === cat
                      ? 'bg-indigo-950/60 border-indigo-500/60 text-indigo-200 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* AI Hint Button */}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={handleRequestHint}
              disabled={isGameOver}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <Lightbulb className="w-4 h-4 text-amber-300" />
              <span>Request AI Letter Hint</span>
            </button>
          </div>

          {/* AI Hint Explanation Card */}
          {hint && (
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-slate-300 space-y-2 animate-in fade-in">
              <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>AI Frequency Recommendation</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center">
                  {hint.recommendedLetter}
                </span>
                <p className="text-slate-200">{hint.explanation}</p>
              </div>

              {hint.rankedLetters.length > 1 && (
                <div className="pt-2 border-t border-indigo-900/60">
                  <p className="text-[10px] uppercase font-semibold text-slate-400 mb-1">
                    Top Letter Probabilities:
                  </p>
                  <div className="flex gap-2">
                    {hint.rankedLetters.map((item) => (
                      <span
                        key={item.letter}
                        className="px-2 py-0.5 rounded bg-slate-900 text-slate-200 font-mono text-[11px] border border-slate-800"
                      >
                        {item.letter}: {item.percentage}%
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Career Stats */}
          <div className="pt-2 border-t border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Career Record</span>
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
                <span className="text-amber-400 font-semibold">Streak</span>
                <p className="text-base font-bold text-amber-300 font-mono">{stats.winStreak}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Central Stage */}
        <div className="lg:col-span-2 flex flex-col items-center">
          {/* Game Over Banner */}
          {isWon && (
            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-center text-emerald-200 font-bold text-sm w-full max-w-md animate-in zoom-in-95">
              🎉 Congratulations! You guessed the word "{targetWord}" correctly!
              <button
                onClick={() => startNewGame()}
                className="block mx-auto mt-2 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                Next Word
              </button>
            </div>
          )}

          {isLost && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500 text-center text-rose-200 font-bold text-sm w-full max-w-md animate-in zoom-in-95">
              💀 Game Over! The hidden word was "{targetWord}".
              <button
                onClick={() => startNewGame()}
                className="block mx-auto mt-2 px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Try Another
              </button>
            </div>
          )}

          {/* SVG Hangman Drawing */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border-2 border-indigo-500/20 shadow-2xl shadow-indigo-950/40 backdrop-blur-md mb-6 flex flex-col items-center">
            <svg
              viewBox="0 0 200 180"
              className="w-44 h-40 stroke-slate-300 fill-none stroke-[3] stroke-linecap-round"
            >
              {/* Gallows Base */}
              <line x1="20" y1="170" x2="100" y2="170" />
              {/* Gallows Upright */}
              <line x1="50" y1="170" x2="50" y2="20" />
              {/* Gallows Top Beam */}
              <line x1="50" y1="20" x2="140" y2="20" />
              {/* Support diagonal */}
              <line x1="50" y1="50" x2="80" y2="20" />
              {/* Rope */}
              <line x1="140" y1="20" x2="140" y2="40" className="stroke-amber-400" />

              {/* Head (1st miss) */}
              {incorrectCount >= 1 && (
                <circle cx="140" cy="55" r="15" className="stroke-rose-400 fill-rose-950/50" />
              )}
              {/* Body (2nd miss) */}
              {incorrectCount >= 2 && (
                <line x1="140" y1="70" x2="140" y2="115" className="stroke-rose-400" />
              )}
              {/* Left Arm (3rd miss) */}
              {incorrectCount >= 3 && (
                <line x1="140" y1="85" x2="120" y2="100" className="stroke-rose-400" />
              )}
              {/* Right Arm (4th miss) */}
              {incorrectCount >= 4 && (
                <line x1="140" y1="85" x2="160" y2="100" className="stroke-rose-400" />
              )}
              {/* Left Leg (5th miss) */}
              {incorrectCount >= 5 && (
                <line x1="140" y1="115" x2="125" y2="145" className="stroke-rose-400" />
              )}
              {/* Right Leg (6th miss) */}
              {incorrectCount >= 6 && (
                <line x1="140" y1="115" x2="155" y2="145" className="stroke-rose-400" />
              )}
            </svg>

            {/* Mistakes remaining indicator */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-xs text-slate-400">Mistakes:</span>
              <span className="font-mono font-bold text-xs text-rose-400">
                {incorrectCount} / {MAX_INCORRECT_GUESSES}
              </span>
            </div>
          </div>

          {/* Word Blanks */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
            {targetWord.split('').map((char, idx) => {
              const isRevealed = guessedLetters.has(char) || isLost;
              const isMissedAtEnd = isLost && !guessedLetters.has(char);
              return (
                <div
                  key={idx}
                  className={`w-9 h-11 sm:w-11 sm:h-14 rounded-xl border-b-4 flex items-center justify-center font-mono font-extrabold text-xl sm:text-2xl transition-all ${
                    isMissedAtEnd
                      ? 'bg-rose-950/40 border-rose-500 text-rose-300'
                      : isRevealed
                      ? 'bg-indigo-950/50 border-indigo-400 text-white shadow-sm'
                      : 'bg-slate-800/80 border-slate-600 text-transparent'
                  }`}
                >
                  {isRevealed ? char : ''}
                </div>
              );
            })}
          </div>

          {/* Letter Keyboard Pad */}
          <div className="w-full max-w-lg">
            <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5 sm:gap-2">
              {ALPHABET.map((letter) => {
                const isGuessed = guessedLetters.has(letter);
                const isCorrect = isGuessed && targetWord.includes(letter);
                const isIncorrect = isGuessed && !targetWord.includes(letter);
                const isHinted = hint?.recommendedLetter === letter;

                return (
                  <button
                    key={letter}
                    onClick={() => handleGuessLetter(letter)}
                    disabled={isGuessed || isGameOver}
                    className={`h-9 sm:h-11 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer select-none active:scale-95 disabled:cursor-not-allowed ${
                      isCorrect
                        ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/50 opacity-60'
                        : isIncorrect
                        ? 'bg-rose-950/60 text-rose-400 border border-rose-800/40 opacity-40 line-through'
                        : isHinted
                        ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-black font-extrabold ring-2 ring-yellow-300 shadow-md animate-bounce'
                        : 'bg-slate-800 hover:bg-indigo-600 text-white border border-slate-700/60 hover:border-indigo-400 shadow-sm'
                    }`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Algorithm Modal */}
      <AlgorithmModal
        concept={frequencyConcept}
        isOpen={showAlgorithmModal}
        onClose={() => setShowAlgorithmModal(false)}
      />

      {/* Quick Start Tutorial Modal */}
      <QuickStartModal
        guide={QUICK_START_GUIDES['hangman']}
        isOpen={showQuickStart}
        onClose={() => setShowQuickStart(false)}
      />
    </div>
  );
};
