import React, { useState } from 'react';
import { 
  Gamepad2, 
  Home, 
  Trophy, 
  Info, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  Menu, 
  X,
  Sparkles,
  Layers,
  Keyboard
} from 'lucide-react';
import { ActiveView } from '../types/index.ts';
import { soundManager } from '../utils/audio.ts';

interface NavbarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  onOpenShortcuts: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  isDark,
  setIsDark,
  isMuted,
  setIsMuted,
  onOpenShortcuts,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as ActiveView, label: 'Home', icon: Home },
    { id: 'games' as ActiveView, label: 'Games', icon: Layers },
    { id: 'leaderboard' as ActiveView, label: 'Leaderboard', icon: Trophy },
    { id: 'about' as ActiveView, label: 'About & AI Lab', icon: Info },
  ];

  const handleNavClick = (view: ActiveView) => {
    soundManager.playClick();
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  const toggleSound = () => {
    const nextMuted = !isMuted;
    soundManager.setMuted(nextMuted);
    setIsMuted(nextMuted);
    if (!nextMuted) {
      soundManager.playClick();
    }
  };

  const toggleTheme = () => {
    soundManager.playClick();
    setIsDark(!isDark);
  };

  return (
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-200 border-slate-200/90 bg-white/90 text-slate-800 shadow-xs dark:border-indigo-900/30 dark:bg-[#0b1021]/90 dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
            aria-label="AI Games Arcade Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white dark:bg-[#0d132b] rounded-[10px] flex items-center justify-center transition-colors">
                <Gamepad2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold tracking-tight text-lg text-slate-900 dark:text-white transition-colors">
                <span>AI Games</span>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">Arcade</span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-900/60 dark:text-purple-300 dark:border-purple-500/30 transition-colors">
                  AI Lab
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block transition-colors">Play · Think · Learn AI</p>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id || (item.id === 'games' && activeView !== 'home' && activeView !== 'leaderboard' && activeView !== 'about');
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/90 shadow-xs font-semibold dark:bg-indigo-600/20 dark:text-indigo-300 dark:border-indigo-500/40'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Utility Buttons: Sound, Theme, Shortcuts, Mobile Hamburger */}
          <div className="flex items-center gap-2">
            {/* Keyboard Shortcuts Trigger Button */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenShortcuts();
              }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/70 dark:border-slate-700/50 transition-colors cursor-pointer text-xs font-medium"
              aria-label="Open keyboard shortcuts cheat sheet"
              title="Global Keyboard Shortcuts (?)"
            >
              <Keyboard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[10px] font-mono text-slate-600 dark:text-slate-400 font-bold">
                ?
              </kbd>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="flex items-center gap-1 p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/70 dark:border-slate-700/50 transition-colors cursor-pointer"
              aria-label={isMuted ? 'Unmute game audio (Shortcut: M)' : 'Mute game audio (Shortcut: M)'}
              title={isMuted ? 'Unmute audio [M]' : 'Mute audio [M]'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-400 dark:text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
              <span className="hidden xl:inline text-[10px] font-mono text-slate-400 font-bold">M</span>
            </button>

            {/* Light / Dark Theme Toggle with Sun & Moon Icons */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-xl border transition-all duration-300 cursor-pointer text-xs font-medium bg-slate-100 hover:bg-slate-200/80 text-slate-700 border-slate-300/80 shadow-xs dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700/60"
              aria-label={isDark ? 'Switch to light mode (Shortcut: D)' : 'Switch to dark mode (Shortcut: D)'}
              title={isDark ? 'Switch to Light Mode [D]' : 'Switch to Dark Mode [D]'}
            >
              <div className="flex items-center gap-0.5 bg-white dark:bg-slate-900/90 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700/70 shadow-xs">
                <span
                  className={`p-1 rounded-md transition-all duration-200 flex items-center justify-center ${
                    !isDark
                      ? 'bg-amber-100 text-amber-600 shadow-xs scale-105'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                  title="Light Mode"
                >
                  <Sun className="w-3.5 h-3.5" />
                </span>
                <span
                  className={`p-1 rounded-md transition-all duration-200 flex items-center justify-center ${
                    isDark
                      ? 'bg-indigo-900/80 text-indigo-300 shadow-xs scale-105'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title="Dark Mode"
                >
                  <Moon className="w-3.5 h-3.5" />
                </span>
              </div>
              <span className="hidden md:inline font-semibold text-xs ml-0.5">
                {isDark ? 'Dark' : 'Light'}
              </span>
              <kbd className="hidden lg:inline-block px-1 py-0.2 rounded text-[10px] font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                D
              </kbd>
            </button>

            {/* Quick Play CTA */}
            <button
              onClick={() => handleNavClick('games')}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>7 Games</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/70 dark:border-slate-700/50 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 text-slate-800 dark:border-indigo-900/40 dark:bg-[#0d132b] dark:text-slate-100 px-4 pt-2 pb-4 space-y-2 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-600/25 dark:text-indigo-300 dark:border-indigo-500/40'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Mobile Theme Toggle Row */}
          <button
            onClick={() => {
              toggleTheme();
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-700/60"
            aria-label="Switch Theme"
          >
            <div className="flex items-center gap-2.5">
              {isDark ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>Theme Mode</span>
            </div>
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 rounded-md p-0.5 border border-slate-300 dark:border-slate-700 text-xs">
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${!isDark ? 'bg-amber-100 text-amber-700 shadow-xs' : 'text-slate-400'}`}>Light</span>
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${isDark ? 'bg-indigo-900/80 text-indigo-300 shadow-xs' : 'text-slate-400'}`}>Dark</span>
            </div>
          </button>

          {/* Mobile Sound Toggle Row */}
          <button
            onClick={() => {
              toggleSound();
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-700/60"
            aria-label="Toggle Sound"
          >
            <div className="flex items-center gap-2.5">
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
              <span>Sound Effects</span>
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isMuted ? 'Muted' : 'Enabled'}
            </span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setMobileMenuOpen(false);
              onOpenShortcuts();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60 transition-colors"
          >
            <Keyboard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Keyboard Shortcuts (?)</span>
          </button>
        </div>
      )}
    </header>
  );
};
