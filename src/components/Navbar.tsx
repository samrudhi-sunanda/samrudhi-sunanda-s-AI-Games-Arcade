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
    <header className="sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-200 border-indigo-900/30 bg-[#0b1021]/90 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
            aria-label="AI Games Arcade Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0d132b] rounded-[10px] flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-indigo-400 group-hover:text-purple-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold tracking-tight text-lg text-white">
                <span>AI Games</span>
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Arcade</span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-purple-900/60 text-purple-300 border border-purple-500/30">
                  AI Lab
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Play · Think · Learn AI</p>
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
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
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
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/70 border border-slate-700/50 transition-colors cursor-pointer text-xs font-medium"
              aria-label="Open keyboard shortcuts cheat sheet"
              title="Global Keyboard Shortcuts (?)"
            >
              <Keyboard className="w-4 h-4 text-indigo-400" />
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400 font-bold">
                ?
              </kbd>
            </button>

            <button
              onClick={toggleSound}
              className="flex items-center gap-1 p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/70 border border-slate-700/50 transition-colors cursor-pointer"
              aria-label={isMuted ? 'Unmute game audio (Shortcut: M)' : 'Mute game audio (Shortcut: M)'}
              title={isMuted ? 'Unmute audio [M]' : 'Mute audio [M]'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              <span className="hidden xl:inline text-[10px] font-mono text-slate-400 font-bold">M</span>
            </button>

            <button
              onClick={toggleTheme}
              className="flex items-center gap-1 p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/70 border border-slate-700/50 transition-colors cursor-pointer"
              aria-label={isDark ? 'Switch to light mode (Shortcut: D)' : 'Switch to dark mode (Shortcut: D)'}
              title={isDark ? 'Light Mode [D]' : 'Dark Mode [D]'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-300" />}
              <span className="hidden xl:inline text-[10px] font-mono text-slate-400 font-bold">D</span>
            </button>

            {/* Quick Play CTA */}
            <button
              onClick={() => handleNavClick('games')}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>7 Games</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/70 border border-slate-700/50 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-indigo-900/40 bg-[#0d132b] px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600/25 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => {
              soundManager.playClick();
              setMobileMenuOpen(false);
              onOpenShortcuts();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800/60 transition-colors"
          >
            <Keyboard className="w-4 h-4 text-indigo-400" />
            <span>Keyboard Shortcuts (?)</span>
          </button>
        </div>
      )}
    </header>
  );
};
