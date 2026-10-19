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
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-purple-50/60 to-white border border-indigo-100 shadow-xl shadow-indigo-100/50 dark:from-[#0e1630] dark:via-[#131b3d] dark:to-[#1c1236] dark:border-indigo-500/30 dark:shadow-2xl dark:shadow-indigo-950/60 p-8 sm:p-12 transition-all">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-purple-500/10 dark:bg-purple-600/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-500/10 dark:bg-blue-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-800 dark:bg-purple-900/50 dark:border-purple-500/40 dark:text-purple-300 text-xs font-semibold uppercase tracking-wider mb-5 transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-pink-500 dark:text-pink-400" />
            <span>Interactive AI Gaming Suite · 7 Fully Playable Algorithms</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] transition-colors">
            AI Games <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 dark:from-purple-400 dark:via-pink-400 dark:to-indigo-400 bg-clip-text text-transparent">Arcade</span>
          </h1>

          <p className="mt-4 text-lg sm:text-xl text-slate-700 dark:text-slate-300 font-semibold leading-relaxed transition-colors">
            "Play. Think. Learn Artificial Intelligence."
          </p>

          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl transition-colors">
            Experience classic games powered by foundational AI algorithms — from Minimax and Alpha-Beta game tree searches to A* pathfinding, CSP backtracking, and predictive Markov frequency models.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleLaunchGame('games')}
              className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Explore All 7 Games</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setActiveView('about');
              }}
              className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-xs dark:text-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 dark:border-slate-700/60 transition-all cursor-pointer flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>AI Learning Center</span>
            </button>
          </div>
        </div>

        {/* Floating Quick Stat Badges */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-200 dark:border-slate-800/80 pt-6 transition-colors">
          <div className="p-3 rounded-2xl bg-white/90 border border-slate-200/90 shadow-xs dark:bg-slate-900/60 dark:border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">
              <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Total Games</span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">7 Active</p>
          </div>

          <div className="p-3 rounded-2xl bg-white/90 border border-slate-200/90 shadow-xs dark:bg-slate-900/60 dark:border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Games Played</span>
            </div>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">{stats.totalGamesPlayed}</p>
          </div>

          <div className="p-3 rounded-2xl bg-white/90 border border-slate-200/90 shadow-xs dark:bg-slate-900/60 dark:border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">
              <Award className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>Human Victories</span>
            </div>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-300 font-mono mt-1">{totalWins}</p>
          </div>

          <div className="p-3 rounded-2xl bg-white/90 border border-slate-200/90 shadow-xs dark:bg-slate-900/60 dark:border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">
              <Trophy className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
              <span>2048 High Score</span>
            </div>
            <p className="text-2xl font-black text-pink-600 dark:text-pink-300 font-mono mt-1">{stats.game2048.bestScore}</p>
          </div>
        </div>
      </section>

      {/* 7 Playable Games Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
              <BrainCircuit className="w-4 h-4" />
              <span>Playable AI Demonstrations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1 transition-colors">
              Select an AI Game to Play
            </h2>
          </div>
          <button
            onClick={() => setActiveView('about')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
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
                className="group relative rounded-3xl bg-white dark:bg-slate-900/90 hover:bg-slate-50/80 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-md hover:shadow-xl dark:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-indigo-950/40"
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
                        className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/90 dark:text-indigo-300 dark:border-indigo-700/50 text-[11px] font-mono font-bold shadow-xs"
                        title={`Press ${shortcutNum} to play`}
                      >
                        [{shortcutNum}]
                      </kbd>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        game.difficultyRating === 'Beginner'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-500/30'
                          : game.difficultyRating === 'Intermediate'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-500/30'
                          : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-500/30'
                      }`}>
                        {game.difficultyRating}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                    {game.title}
                  </h3>

                  <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-0.5">
                    {game.concept}
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed line-clamp-3">
                    {game.description}
                  </p>

                  {/* Algorithm Tag Pills */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {game.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Play Button */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    onClick={() => handleLaunchGame(game.id as ActiveView)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-500 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-indigo-600 shadow-md shadow-indigo-600/30 flex items-center justify-between gap-2 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Play Now</span>
                    </div>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/20 text-[10px] font-mono text-indigo-100">
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
