import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Play, 
  Shuffle, 
  Trophy,
  Brain,
  HelpCircle
} from 'lucide-react';
import { 
  SudokuGrid, 
  cloneSudokuGrid, 
  solveSudoku, 
  isValidSudokuMove, 
  isSudokuComplete, 
  PRESET_PUZZLES, 
  SudokuPreset 
} from '../../algorithms/sudoku.ts';
import { storage } from '../../utils/storage.ts';
import { soundManager } from '../../utils/audio.ts';
import { AlgorithmModal } from '../AlgorithmModal.tsx';
import { QuickStartModal } from '../QuickStartModal.tsx';
import { AI_CONCEPTS_LIST } from '../../utils/gamesData.ts';
import { QUICK_START_GUIDES } from '../../utils/quickStartData.ts';

interface SudokuGameProps {
  onBack: () => void;
}

export const SudokuGame: React.FC<SudokuGameProps> = ({ onBack }) => {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [initialClues, setInitialClues] = useState<boolean[][]>(() =>
    PRESET_PUZZLES[0].puzzle.map((row) => row.map((cell) => cell !== 0))
  );
  const [grid, setGrid] = useState<SudokuGrid>(() => cloneSudokuGrid(PRESET_PUZZLES[0].puzzle));
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'info' | 'success' | 'error' } | null>({
    text: 'Fill the empty cells with 1–9. Ensure no duplicate numbers in any row, column, or 3×3 box.',
    type: 'info',
  });
  const [isSolving, setIsSolving] = useState(false);
  const [solveStats, setSolveStats] = useState<{ steps: number; timeMs: number } | null>(null);
  const [showAlgorithmModal, setShowAlgorithmModal] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(() => !storage.hasSeenTutorial('sudoku'));
  const [stats, setStats] = useState(() => storage.getStats().sudoku);

  const loadPreset = (index: number) => {
    soundManager.playClick();
    const preset = PRESET_PUZZLES[index];
    setSelectedPresetIndex(index);
    setInitialClues(preset.puzzle.map((row) => row.map((c) => c !== 0)));
    setGrid(cloneSudokuGrid(preset.puzzle));
    setSelectedCell(null);
    setSolveStats(null);
    setStatusMessage({
      text: `Loaded puzzle "${preset.name}" (${preset.difficulty}). You can play manually or let the AI solve it!`,
      type: 'info',
    });
  };

  const handleCellClick = (r: number, c: number) => {
    soundManager.playClick();
    setSelectedCell({ r, c });
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;
    if (initialClues[r][c]) return; // Cannot edit original clue

    soundManager.playMove();
    const newGrid = cloneSudokuGrid(grid);
    newGrid[r][c] = num;
    setGrid(newGrid);

    // Provide immediate feedback if conflicted
    if (num !== 0 && !isValidSudokuMove(newGrid, r, c, num)) {
      setStatusMessage({
        text: `Conflict detected: Number ${num} violates row, column, or 3×3 subgrid constraint.`,
        type: 'error',
      });
    } else {
      setStatusMessage({
        text: `Placed ${num} at (${r + 1}, ${c + 1}).`,
        type: 'info',
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;

    if (e.key >= '1' && e.key <= '9') {
      e.stopPropagation();
      handleNumberInput(parseInt(e.key, 10));
    } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
      e.stopPropagation();
      handleNumberInput(0);
    } else if (e.key === 'Escape') {
      e.stopPropagation();
      setSelectedCell(null);
    } else if (e.key === 'ArrowUp' && r > 0) {
      e.stopPropagation();
      setSelectedCell({ r: r - 1, c });
    } else if (e.key === 'ArrowDown' && r < 8) {
      e.stopPropagation();
      setSelectedCell({ r: r + 1, c });
    } else if (e.key === 'ArrowLeft' && c > 0) {
      e.stopPropagation();
      setSelectedCell({ r, c: c - 1 });
    } else if (e.key === 'ArrowRight' && c < 8) {
      e.stopPropagation();
      setSelectedCell({ r, c: c + 1 });
    }
  };

  const handleCheckSolution = () => {
    soundManager.playClick();
    if (isSudokuComplete(grid)) {
      soundManager.playWin();
      setStatusMessage({
        text: '🎉 Brilliant! The entire Sudoku puzzle is completely valid and solved!',
        type: 'success',
      });
      const updated = storage.recordSudoku(true, 0, null);
      setStats(updated.sudoku);
    } else {
      soundManager.playLose();
      setStatusMessage({
        text: 'Puzzle is not yet complete or contains constraint conflicts. Check rows, cols, and 3×3 boxes.',
        type: 'error',
      });
    }
  };

  const handleSolveWithAI = () => {
    soundManager.playClick();
    setIsSolving(true);
    setStatusMessage({
      text: 'AI is running depth-first backtracking with Minimum Remaining Values (MRV) constraint propagation...',
      type: 'info',
    });

    const startTime = performance.now();
    setTimeout(() => {
      const { solved, solution, steps } = solveSudoku(grid);
      const elapsed = Math.round(performance.now() - startTime);

      if (solved) {
        soundManager.playWin();
        setGrid(solution);
        setSolveStats({ steps, timeMs: elapsed });
        setStatusMessage({
          text: `Solved in ${elapsed}ms! Backtracking explored ${steps} recursive states to resolve all constraints.`,
          type: 'success',
        });
        const updated = storage.recordSudoku(true, 1, Math.round(elapsed / 1000));
        setStats(updated.sudoku);
      } else {
        soundManager.playLose();
        setStatusMessage({
          text: 'No valid solution exists for the current board state due to existing constraint conflicts.',
          type: 'error',
        });
      }
      setIsSolving(false);
    }, 200);
  };

  const handleReset = () => {
    soundManager.playClick();
    const preset = PRESET_PUZZLES[selectedPresetIndex];
    setGrid(cloneSudokuGrid(preset.puzzle));
    setSolveStats(null);
    setStatusMessage({
      text: 'Board reset to original clues.',
      type: 'info',
    });
  };

  const cspConcept = AI_CONCEPTS_LIST.find((c) => c.id === 'csp')!;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" onKeyDown={handleKeyDown} tabIndex={0}>
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
            <span>AI Algorithm (CSP & Backtracking)</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-900/40 text-purple-300 border border-purple-600/30 mb-2">
          Game 2 · Constraint Satisfaction Problem
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Sudoku Solver & CSP
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-lg mx-auto">
          Play manually by typing numbers or clicking the dial, or watch the AI solve any valid board in milliseconds using MRV heuristics and Backtracking.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Control Panel */}
        <div className="space-y-5 rounded-2xl bg-[#0f172a]/90 border border-slate-800 p-5 shadow-xl">
          {/* Preset Selector */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
              Choose Puzzle
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_PUZZLES.map((preset, idx) => (
                <button
                  key={preset.id}
                  onClick={() => loadPreset(idx)}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-left border transition-all cursor-pointer ${
                    selectedPresetIndex === idx
                      ? 'bg-purple-900/50 border-purple-500/60 text-purple-200 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <p className="font-bold text-white truncate">{preset.name}</p>
                  <span className={`text-[10px] uppercase font-mono px-1.5 py-0.2 rounded ${
                    preset.difficulty === 'Easy' ? 'bg-emerald-950 text-emerald-400' :
                    preset.difficulty === 'Medium' ? 'bg-amber-950 text-amber-400' : 'bg-red-950 text-red-400'
                  }`}>
                    {preset.difficulty}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <button
              onClick={handleCheckSolution}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Check Solution</span>
            </button>

            <button
              onClick={handleSolveWithAI}
              disabled={isSolving}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <Brain className="w-4 h-4" />
              <span>{isSolving ? 'Solving...' : 'Solve with AI (CSP)'}</span>
            </button>
          </div>

          {/* Performance stats if solved by AI */}
          {solveStats && (
            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/40 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Algorithm:</span>
                <span className="font-mono text-purple-300">MRV + Backtrack</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Recursive Steps:</span>
                <span className="font-mono text-white font-bold">{solveStats.steps.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Execution Time:</span>
                <span className="font-mono text-emerald-400 font-bold">{solveStats.timeMs} ms</span>
              </div>
            </div>
          )}

          {/* Statistics summary */}
          <div className="pt-2 border-t border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Sudoku Solves</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Puzzles Solved</span>
                <p className="text-base font-bold text-white font-mono">{stats.solved}</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Total Played</span>
                <p className="text-base font-bold text-white font-mono">{stats.gamesPlayed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Central 9x9 Board */}
        <div className="lg:col-span-2 flex flex-col items-center">
          {/* Status Message Banner */}
          {statusMessage && (
            <div className={`mb-4 w-full p-3 rounded-xl border text-xs leading-relaxed flex items-center gap-2.5 transition-all ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                : statusMessage.type === 'error'
                ? 'bg-rose-950/50 border-rose-500/50 text-rose-300'
                : 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300'
            }`}>
              {statusMessage.type === 'success' ? (
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : statusMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              ) : (
                <Info className="w-4 h-4 shrink-0 text-indigo-400" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* 9x9 Grid */}
          <div className="p-2 sm:p-3 rounded-3xl bg-slate-900/90 border-2 border-purple-500/30 shadow-2xl shadow-purple-950/40 backdrop-blur-md">
            <div className="grid grid-cols-9 gap-1 sm:gap-1.5">
              {grid.map((row, r) =>
                row.map((cellValue, c) => {
                  const isInitial = initialClues[r][c];
                  const isSelected = selectedCell?.r === r && selectedCell?.c === c;
                  const isSameValue = selectedCell && grid[selectedCell.r][selectedCell.c] !== 0 && grid[selectedCell.r][selectedCell.c] === cellValue;
                  
                  // Thicker border on 3x3 blocks
                  const borderRight = (c + 1) % 3 === 0 && c !== 8 ? 'border-r-2 border-r-purple-500/50' : '';
                  const borderBottom = (r + 1) % 3 === 0 && r !== 8 ? 'border-b-2 border-b-purple-500/50' : '';

                  return (
                    <button
                      key={`${r}-${c}`}
                      onClick={() => handleCellClick(r, c)}
                      className={`w-8 h-8 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center font-bold text-sm sm:text-base transition-all select-none cursor-pointer ${borderRight} ${borderBottom} ${
                        isSelected
                          ? 'bg-purple-600 text-white ring-2 ring-purple-400 shadow-lg scale-105 z-10'
                          : isSameValue
                          ? 'bg-purple-950/70 text-purple-200 border border-purple-500/40'
                          : isInitial
                          ? 'bg-slate-800/90 text-white font-extrabold border border-slate-700/60'
                          : cellValue !== 0
                          ? 'bg-indigo-950/60 text-cyan-300 font-semibold border border-indigo-700/40'
                          : 'bg-slate-900/70 text-transparent hover:bg-slate-800/60 border border-slate-800/80'
                      }`}
                      aria-label={`Row ${r + 1}, Column ${c + 1}: ${cellValue || 'Empty'}`}
                    >
                      {cellValue !== 0 ? cellValue : ''}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Number Dial / Pad */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-sm">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberInput(num)}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-slate-800 hover:bg-purple-600 text-white font-bold text-sm sm:text-base border border-slate-700 hover:border-purple-400 transition-all cursor-pointer shadow-sm active:scale-95"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => handleNumberInput(0)}
              className="px-3 h-9 sm:h-11 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-semibold transition-all cursor-pointer"
            >
              Erase
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Tip: You can also use your keyboard numbers (1–9), arrow keys, and Backspace.
          </p>
        </div>
      </div>

      {/* Algorithm Modal */}
      <AlgorithmModal
        concept={cspConcept}
        isOpen={showAlgorithmModal}
        onClose={() => setShowAlgorithmModal(false)}
      />

      {/* Quick Start Tutorial Modal */}
      <QuickStartModal
        guide={QUICK_START_GUIDES['sudoku']}
        isOpen={showQuickStart}
        onClose={() => setShowQuickStart(false)}
      />
    </div>
  );
};
