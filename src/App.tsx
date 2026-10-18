import React, { useState, useEffect } from 'react';
import { ActiveView, GameStats } from './types/index.ts';
import { storage } from './utils/storage.ts';
import { soundManager } from './utils/audio.ts';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { DashboardView } from './components/views/DashboardView.tsx';
import { GamesView } from './components/views/GamesView.tsx';
import { LeaderboardView } from './components/views/LeaderboardView.tsx';
import { AboutView } from './components/views/AboutView.tsx';

// Game Components
import { TicTacToeGame } from './components/games/TicTacToeGame.tsx';
import { SudokuGame } from './components/games/SudokuGame.tsx';
import { RPSGame } from './components/games/RPSGame.tsx';
import { MazeSolverGame } from './components/games/MazeSolverGame.tsx';
import { ConnectFourGame } from './components/games/ConnectFourGame.tsx';
import { Game2048 } from './components/games/Game2048.tsx';
import { HangmanGame } from './components/games/HangmanGame.tsx';

// Keyboard Shortcuts
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal.tsx';
import { ShortcutToast } from './components/ShortcutToast.tsx';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts.ts';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [isDark, setIsDark] = useState<boolean>(() => storage.getTheme() === 'dark');
  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.getMuted());
  const [stats, setStats] = useState<GameStats>(() => storage.getStats());
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  const { notification } = useKeyboardShortcuts({
    activeView,
    setActiveView: (view) => {
      refreshStats();
      setActiveView(view);
    },
    isDark,
    setIsDark,
    isMuted,
    setIsMuted,
    isShortcutsModalOpen,
    setIsShortcutsModalOpen,
  });

  useEffect(() => {
    soundManager.init();
    setIsMuted(soundManager.getMuted());
    const initialTheme = storage.getTheme();
    setIsDark(initialTheme === 'dark');

    // Handle URL param ?game= or ?autostart=1
    const params = new URLSearchParams(window.location.search);
    const gameParam = params.get('game') as ActiveView;
    if (gameParam && ['tictactoe', 'sudoku', 'rps', 'maze', 'connect4', '2048', 'hangman'].includes(gameParam)) {
      setActiveView(gameParam);
    } else if (params.get('autostart') === '1') {
      setActiveView('games');
    }
  }, []);

  useEffect(() => {
    storage.setTheme(isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const refreshStats = () => {
    setStats(storage.getStats());
  };

  const handleBackToArcade = () => {
    soundManager.playClick();
    refreshStats();
    setActiveView('home');
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 flex flex-col font-sans ${
      isDark ? 'bg-[#080d1e] text-slate-100' : 'bg-slate-900 text-slate-100'
    }`}>
      {/* Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={(view) => {
          refreshStats();
          setActiveView(view);
        }}
        isDark={isDark}
        setIsDark={setIsDark}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {activeView === 'home' && (
          <DashboardView setActiveView={setActiveView} stats={stats} />
        )}

        {activeView === 'games' && (
          <GamesView setActiveView={setActiveView} />
        )}

        {activeView === 'leaderboard' && (
          <LeaderboardView stats={stats} onStatsUpdated={refreshStats} />
        )}

        {activeView === 'about' && (
          <AboutView setActiveView={setActiveView} />
        )}

        {/* Seven Playable Game Views */}
        {activeView === 'tictactoe' && (
          <TicTacToeGame onBack={handleBackToArcade} />
        )}

        {activeView === 'sudoku' && (
          <SudokuGame onBack={handleBackToArcade} />
        )}

        {activeView === 'rps' && (
          <RPSGame onBack={handleBackToArcade} />
        )}

        {activeView === 'maze' && (
          <MazeSolverGame onBack={handleBackToArcade} />
        )}

        {activeView === 'connect4' && (
          <ConnectFourGame onBack={handleBackToArcade} />
        )}

        {activeView === '2048' && (
          <Game2048 onBack={handleBackToArcade} />
        )}

        {activeView === 'hangman' && (
          <HangmanGame onBack={handleBackToArcade} />
        )}
      </main>

      {/* Footer */}
      <Footer 
        setActiveView={setActiveView} 
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)} 
      />

      {/* Global Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
        onSelectView={(view) => {
          refreshStats();
          setActiveView(view);
        }}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        isMuted={isMuted}
        onToggleMute={() => {
          const nextMuted = !isMuted;
          soundManager.setMuted(nextMuted);
          setIsMuted(nextMuted);
        }}
      />

      {/* Shortcut Action Feedback Toast */}
      <ShortcutToast notification={notification} />
    </div>
  );
}
