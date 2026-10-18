import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  Sparkles, 
  Compass, 
  Play, 
  Pause, 
  Shuffle, 
  Trash2, 
  Info, 
  Trophy, 
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { 
  Point, 
  runAStarSearch, 
  generateProceduralMaze, 
  pointToKey, 
  keyToPoint,
  manhattanDistance 
} from '../../algorithms/astar.ts';
import { storage } from '../../utils/storage.ts';
import { soundManager } from '../../utils/audio.ts';
import { AlgorithmModal } from '../AlgorithmModal.tsx';
import { QuickStartModal } from '../QuickStartModal.tsx';
import { AI_CONCEPTS_LIST } from '../../utils/gamesData.ts';
import { QUICK_START_GUIDES } from '../../utils/quickStartData.ts';

interface MazeSolverGameProps {
  onBack: () => void;
}

const ROWS = 15;
const COLS = 19;
const INITIAL_START: Point = { r: 1, c: 1 };
const INITIAL_GOAL: Point = { r: ROWS - 2, c: COLS - 2 };

export const MazeSolverGame: React.FC<MazeSolverGameProps> = ({ onBack }) => {
  const [start, setStart] = useState<Point>(INITIAL_START);
  const [goal, setGoal] = useState<Point>(INITIAL_GOAL);
  const [walls, setWalls] = useState<Set<string>>(() =>
    generateProceduralMaze(ROWS, COLS, INITIAL_START, INITIAL_GOAL)
  );
  const [visitedNodes, setVisitedNodes] = useState<Point[]>([]);
  const [finalPath, setFinalPath] = useState<Point[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(20); // ms per step
  const [editMode, setEditMode] = useState<'wall' | 'start' | 'goal'>('wall');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [searchStatus, setSearchStatus] = useState<string | null>(
    'Click "Find Path (A*)" to watch the heuristic search explore the maze.'
  );
  const [stats, setStats] = useState(() => storage.getStats().maze);
  const [showAlgorithmModal, setShowAlgorithmModal] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(() => !storage.hasSeenTutorial('maze'));

  const animationRef = useRef<number | null>(null);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

  const handleClearPath = () => {
    soundManager.playClick();
    if (animationRef.current) clearTimeout(animationRef.current);
    setIsSearching(false);
    setIsPaused(false);
    setVisitedNodes([]);
    setFinalPath([]);
    setSearchStatus('Path cleared. Ready to search.');
  };

  const handleGenerateMaze = () => {
    soundManager.playClick();
    handleClearPath();
    const newWalls = generateProceduralMaze(ROWS, COLS, start, goal);
    setWalls(newWalls);
    setSearchStatus('Generated new procedural labyrinth.');
  };

  const handleClearAll = () => {
    soundManager.playClick();
    handleClearPath();
    setWalls(new Set<string>());
    setSearchStatus('Cleared all walls. You can draw custom obstacles.');
  };

  const handleCellInteraction = (r: number, c: number) => {
    if (isSearching) return;
    const key = `${r},${c}`;

    if (editMode === 'start') {
      if (key !== pointToKey(goal) && !walls.has(key)) {
        soundManager.playClick();
        setStart({ r, c });
        handleClearPath();
      }
    } else if (editMode === 'goal') {
      if (key !== pointToKey(start) && !walls.has(key)) {
        soundManager.playClick();
        setGoal({ r, c });
        handleClearPath();
      }
    } else {
      // Toggle wall
      if (key === pointToKey(start) || key === pointToKey(goal)) return;
      soundManager.playStep();
      const newWalls = new Set(walls);
      if (newWalls.has(key)) {
        newWalls.delete(key);
      } else {
        newWalls.add(key);
      }
      setWalls(newWalls);
      handleClearPath();
    }
  };

  const handleStartSearch = () => {
    soundManager.playClick();
    handleClearPath();
    setIsSearching(true);
    setSearchStatus('Running A* Search: evaluating f(n) = g(n) + h(n)...');

    const result = runAStarSearch(ROWS, COLS, start, goal, walls);

    if (!result.found) {
      soundManager.playLose();
      setIsSearching(false);
      setSearchStatus('No path exists! The goal is completely barricaded by walls.');
      return;
    }

    // Step-by-step visual playback
    const visited = result.visitedNodesInOrder;
    let step = 0;

    const animateExploration = () => {
      const batchSize = animationSpeed <= 10 ? 4 : 1;
      step += batchSize;
      const currentSlice = visited.slice(0, Math.min(step, visited.length));
      setVisitedNodes(currentSlice);

      if (step < visited.length) {
        animationRef.current = window.setTimeout(animateExploration, animationSpeed);
      } else {
        // Animate shortest path
        animatePath(result.path);
      }
    };

    const animatePath = (path: Point[]) => {
      let pathIdx = 0;
      const stepPath = () => {
        pathIdx++;
        setFinalPath(path.slice(0, pathIdx));
        if (pathIdx < path.length) {
          animationRef.current = window.setTimeout(stepPath, Math.max(25, animationSpeed));
        } else {
          soundManager.playWin();
          setIsSearching(false);
          setSearchStatus(
            `Goal reached! Optimal path found: ${path.length} steps (Explored ${visited.length} nodes).`
          );
          const updated = storage.recordMazeSolved(path.length);
          setStats(updated.maze);
        }
      };
      stepPath();
    };

    animateExploration();
  };

  const astarConcept = AI_CONCEPTS_LIST.find((c) => c.id === 'astar')!;

  const visitedSet = new Set(visitedNodes.map(pointToKey));
  const pathSet = new Set(finalPath.map(pointToKey));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-200 border border-emerald-500/40 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-300" />
            <span>Quick Start</span>
          </button>

          <button
            onClick={() => setShowAlgorithmModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/40 transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>AI Algorithm (A* Search)</span>
          </button>

          <button
            onClick={handleClearPath}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Path</span>
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-900/40 text-emerald-300 border border-emerald-600/30 mb-2">
          Game 4 · Informed Heuristic Search
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          A* Search Maze Solver
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-lg mx-auto">
          Draw walls or generate mazes. Watch A* balance historical cost g(n) with Manhattan heuristic distance h(n) to guarantee the shortest optimal path.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Controls Sidebar */}
        <div className="space-y-4 rounded-2xl bg-[#0f172a]/90 border border-slate-800 p-5 shadow-xl">
          {/* Main Action */}
          <button
            onClick={handleStartSearch}
            disabled={isSearching}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isSearching ? 'Exploring Nodes...' : 'Find Path (A*)'}</span>
          </button>

          {/* Edit Mode Selector */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
              Grid Click Action
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
              <button
                onClick={() => setEditMode('wall')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  editMode === 'wall'
                    ? 'bg-slate-700 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🧱 Wall
              </button>
              <button
                onClick={() => setEditMode('start')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  editMode === 'start'
                    ? 'bg-emerald-700 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🟢 Start
              </button>
              <button
                onClick={() => setEditMode('goal')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  editMode === 'goal'
                    ? 'bg-rose-700 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🔴 Goal
              </button>
            </div>
          </div>

          {/* Maze Generators */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <button
              onClick={handleGenerateMaze}
              disabled={isSearching}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Shuffle className="w-3.5 h-3.5 text-purple-400" />
              <span>Generate New Maze</span>
            </button>

            <button
              onClick={handleClearAll}
              disabled={isSearching}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Clear All Walls</span>
            </button>
          </div>

          {/* Animation Speed Slider */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-slate-400">Search Speed:</span>
              <span className="font-mono text-emerald-400">
                {animationSpeed <= 10 ? 'Fast' : animationSpeed <= 30 ? 'Normal' : 'Slow'}
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Heuristic Distance Formula */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 text-xs">
            <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              A* Evaluation
            </span>
            <p className="font-mono text-emerald-300">f(n) = g(n) + h(n)</p>
            <p className="text-[11px] text-slate-400">
              h(start, goal) = {manhattanDistance(start, goal)} blocks
            </p>
          </div>

          {/* Stats Bar */}
          <div className="pt-2 border-t border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Mazes Solved</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Solved</span>
                <p className="text-base font-bold text-white font-mono">{stats.mazesSolved}</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Best Path</span>
                <p className="text-base font-bold text-emerald-400 font-mono">
                  {stats.shortestPathLength ? `${stats.shortestPathLength}` : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Central Grid Board */}
        <div className="lg:col-span-3 flex flex-col items-center">
          {/* Status Message */}
          <div className="mb-4 w-full p-3 rounded-xl border border-emerald-900/50 bg-[#0c1825] text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{searchStatus}</span>
          </div>

          {/* Interactive Grid Canvas */}
          <div 
            className="p-3 rounded-3xl bg-slate-900/90 border-2 border-emerald-500/20 shadow-2xl shadow-emerald-950/40 backdrop-blur-md overflow-x-auto max-w-full"
            onMouseLeave={() => setIsMouseDown(false)}
          >
            <div 
              className="grid gap-1 select-none"
              style={{
                gridTemplateColumns: `repeat(${COLS}, minmax(16px, 28px))`,
              }}
            >
              {Array.from({ length: ROWS }).map((_, r) =>
                Array.from({ length: COLS }).map((_, c) => {
                  const key = `${r},${c}`;
                  const isStart = r === start.r && c === start.c;
                  const isGoal = r === goal.r && c === goal.c;
                  const isWall = walls.has(key);
                  const isPath = pathSet.has(key) && !isStart && !isGoal;
                  const isVisited = visitedSet.has(key) && !isStart && !isGoal && !isPath;

                  return (
                    <div
                      key={key}
                      onClick={() => handleCellInteraction(r, c)}
                      onMouseEnter={() => {
                        if (isMouseDown && editMode === 'wall') {
                          handleCellInteraction(r, c);
                        }
                      }}
                      onMouseDown={() => setIsMouseDown(true)}
                      onMouseUp={() => setIsMouseDown(false)}
                      className={`h-5 w-5 sm:h-7 sm:w-7 rounded-md transition-all duration-75 flex items-center justify-center cursor-pointer text-xs font-bold ${
                        isStart
                          ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/50 ring-2 ring-emerald-300 scale-105 z-10'
                          : isGoal
                          ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/50 ring-2 ring-rose-300 scale-105 z-10'
                          : isPath
                          ? 'bg-amber-400 text-black animate-in zoom-in-75 duration-150 shadow-md shadow-amber-400/40'
                          : isVisited
                          ? 'bg-cyan-900/70 border border-cyan-500/40 animate-in fade-in duration-100'
                          : isWall
                          ? 'bg-slate-950 border border-slate-800 shadow-inner'
                          : 'bg-slate-800/80 hover:bg-slate-700/60 border border-slate-700/40'
                      }`}
                    >
                      {isStart && 'S'}
                      {isGoal && 'G'}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Color Legend */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-emerald-500" />
              <span>Start Node (S)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-rose-500" />
              <span>Goal Node (G)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-slate-950 border border-slate-700" />
              <span>Wall Barrier</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-cyan-900 border border-cyan-500" />
              <span>Explored (Closed Set)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-amber-400" />
              <span>Optimal Shortest Path</span>
            </div>
          </div>
        </div>
      </div>

      {/* Algorithm Modal */}
      <AlgorithmModal
        concept={astarConcept}
        isOpen={showAlgorithmModal}
        onClose={() => setShowAlgorithmModal(false)}
      />

      {/* Quick Start Tutorial Modal */}
      <QuickStartModal
        guide={QUICK_START_GUIDES['maze']}
        isOpen={showQuickStart}
        onClose={() => setShowQuickStart(false)}
      />
    </div>
  );
};
