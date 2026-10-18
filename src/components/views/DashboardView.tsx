import React from 'react';
import { 
  Sparkles, 
  Play, 
  Gamepad2, 
  Trophy, 
  BookOpen, 
  BrainCircuit, 
  Layers, 
  Compass, 
  Grid3X3, 
  TableProperties, 
  Swords, 
  Columns3, 
  LayoutGrid, 
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { ActiveView, GameStats } from '../../types/index.ts';
import { GAMES_METADATA } from '../../utils/gamesData.ts';
import { soundManager } from '../../utils/audio.ts';

interface DashboardViewProps {
  setActiveView: (view: ActiveView) => void;
  stats: GameStats;
}

// Icon mapper for games
const ICON_COMPONENTS: Record<string, React.ElementType> = {
  Grid3X3,
  TableProperties,
  Swords,
  Compass,
  Columns3,
  LayoutGrid,
  HelpCircle,
};

export const DashboardView: React.FC<DashboardViewProps> = ({ setActiveView, stats }) => {
  const handleLaunchGame = (gameId: ActiveView) => {
    soundManager.playClick();
    setActiveView(gameId);
  };

  const totalWins = stats.tictactoe.wins + stats.connect4.wins + stats.rps.playerWins + stats.hangman.wins;

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0e1630] via-[#131b3d] to-[#1c1236] border border-indigo-500/30 p-8 sm:p-12 shadow-2xl shadow-indigo-950/60">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-900/50 border border-purple-500/40 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-5">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Interactive AI Gaming Suite · 7 Fully Playable Algorithms</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            AI Games <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">Arcade</span>
          </h1>

          <p className="mt-4 text-lg sm:text-xl text-slate-300 font-medium leading-relaxed">
            "Play. Think. Learn Artificial Intelligence."
          </p>

          <p className="mt-2 text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
            Experience classic games powered by foundational AI algorithms — from Minimax and Alpha-Beta game tree searches to A* pathfinding, CSP backtracking, and predictive Markov frequency models.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleLaunchGame('games')}
              className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-indigo-600/40 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Explore All 7 Games</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setActiveView('about');
              }}
              className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-all cursor-pointer flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>AI Learning Center</span>
            </button>
          </div>
        </div>

        {/* Floating Quick Stat Badges */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-800/80 pt-6">
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Total Games</span>
            </div>
            <p className="text-2xl font-black text-white font-mono mt-1">7 Active</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Games Played</span>
            </div>
            <p className="text-2xl font-black text-emerald-400 font-mono mt-1">{stats.totalGamesPlayed}</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Human Victories</span>
            </div>
            <p className="text-2xl font-black text-amber-300 font-mono mt-1">{totalWins}</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase">
              <Trophy className="w-3.5 h-3.5 text-pink-400" />
              <span>2048 High Score</span>
            </div>
            <p className="text-2xl font-black text-pink-300 font-mono mt-1">{stats.game2048.bestScore}</p>
          </div>
        </div>
      </section>

      {/* 7 Playable Games Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
              <BrainCircuit className="w-4 h-4" />
              <span>Playable AI Demonstrations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Select an AI Game to Play
            </h2>
          </div>
          <button
            onClick={() => setActiveView('about')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Learn how each algorithm works</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES_METADATA.map((game, index) => {
            const Icon = ICON_COMPONENTS[game.iconName] || Gamepad2;
            const shortcutNum = index + 1;
            return (
              <div
                key={game.id}
                className="group relative rounded-3xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-xl hover:shadow-2xl hover:shadow-indigo-950/40"
              >
                <div>
                  {/* Top card bar: icon + shortcut badge + difficulty */}
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
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                          : game.difficultyRating === 'Intermediate'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
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

                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed line-clamp-3">
                    {game.description}
                  </p>

                  {/* Algorithm Tag Pills */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {game.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Play Button */}
                <div className="mt-6 pt-4 border-t border-slate-800/80">
                  <button
                    onClick={() => handleLaunchGame(game.id as ActiveView)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-500 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-indigo-600 shadow-md shadow-indigo-600/30 flex items-center justify-between gap-2 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Play Now</span>
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
      </section>
    </div>
  );
};
