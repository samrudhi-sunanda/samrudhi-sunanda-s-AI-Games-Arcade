import React, { useState } from 'react';
import { 
  Search, 
  Play, 
  Gamepad2, 
  Sparkles, 
  Grid3X3, 
  TableProperties, 
  Swords, 
  Compass, 
  Columns3, 
  LayoutGrid, 
  HelpCircle,
  Brain
} from 'lucide-react';
import { ActiveView } from '../../types/index.ts';
import { GAMES_METADATA } from '../../utils/gamesData.ts';
import { soundManager } from '../../utils/audio.ts';

interface GamesViewProps {
  setActiveView: (view: ActiveView) => void;
}

const ICON_COMPONENTS: Record<string, React.ElementType> = {
  Grid3X3,
  TableProperties,
  Swords,
  Compass,
  Columns3,
  LayoutGrid,
  HelpCircle,
};

export const GamesView: React.FC<GamesViewProps> = ({ setActiveView }) => {
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = GAMES_METADATA.filter((game) => {
    const matchesDifficulty =
      filterDifficulty === 'all' || game.difficultyRating.toLowerCase() === filterDifficulty;
    const matchesQuery =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDifficulty && matchesQuery;
  });

  const handlePlayGame = (id: ActiveView) => {
    soundManager.playClick();
    setActiveView(id);
  };

  return (
    <div className="space-y-8 py-6 sm:py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-900/40 text-purple-300 border border-purple-600/30">
          Curated AI Game Collection
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          All 7 Playable AI Games
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Explore interactive algorithms: test game-tree search in Tic-Tac-Toe and Connect 4, graph pathfinding in Maze Solver, constraint solving in Sudoku, and more.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by game, algorithm, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-800 text-white border border-slate-700/80 focus:border-indigo-500 focus:outline-none placeholder:text-slate-500"
          />
        </div>

        {/* Difficulty Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          {['all', 'beginner', 'intermediate', 'advanced'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                soundManager.playClick();
                setFilterDifficulty(lvl);
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider capitalize transition-all cursor-pointer ${
                filterDifficulty === lvl
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of games */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => {
          const Icon = ICON_COMPONENTS[game.iconName] || Gamepad2;
          const shortcutNum = GAMES_METADATA.findIndex((g) => g.id === game.id) + 1;
          return (
            <div
              key={game.id}
              className="group rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-xl hover:shadow-2xl hover:shadow-indigo-950/40"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${game.accentColor}25`, borderColor: game.accentColor, borderWidth: '1px' }}
                  >
                    <Icon className="w-6 h-6" style={{ color: game.accentColor }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd 
                      className="px-2 py-0.5 rounded-lg bg-indigo-950/90 text-indigo-300 border border-indigo-700/50 text-[11px] font-mono font-bold shadow-sm"
                      title={`Press ${shortcutNum} to play`}
                    >
                      [{shortcutNum}]
                    </kbd>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      game.difficultyRating === 'Beginner'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : game.difficultyRating === 'Intermediate'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                    }`}>
                      {game.difficultyRating}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                  {game.title}
                </h3>
                <p className="text-xs font-semibold text-purple-400 mt-0.5">
                  {game.concept}
                </p>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                  {game.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {game.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={() => handlePlayGame(game.id as ActiveView)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 flex items-center justify-between gap-2 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Play {game.title}</span>
                  </div>
                  <kbd className="px-1.5 py-0.5 rounded bg-black/30 text-[10px] font-mono text-indigo-200">
                    Press {shortcutNum}
                  </kbd>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
