import type { ActiveView } from '../types/index.ts';

export type ShortcutActionType =
  | 'launch_game'
  | 'toggle_mute'
  | 'toggle_theme'
  | 'navigate'
  | 'open_shortcuts_modal'
  | 'back_to_home';

export interface ShortcutDefinition {
  key: string;
  label: string;
  description: string;
  category: 'Games' | 'Controls' | 'Navigation';
  targetView?: ActiveView;
}

export const SHORTCUT_DEFINITIONS: ShortcutDefinition[] = [
  { key: '1', label: '1', description: 'Launch Tic-Tac-Toe (Minimax AI)', category: 'Games', targetView: 'tictactoe' },
  { key: '2', label: '2', description: 'Launch Sudoku Solver (CSP & Backtracking)', category: 'Games', targetView: 'sudoku' },
  { key: '3', label: '3', description: 'Launch Rock-Paper-Scissors (Markov Model)', category: 'Games', targetView: 'rps' },
  { key: '4', label: '4', description: 'Launch Maze Solver (A* Pathfinding)', category: 'Games', targetView: 'maze' },
  { key: '5', label: '5', description: 'Launch Connect Four (Alpha-Beta Pruning)', category: 'Games', targetView: 'connect4' },
  { key: '6', label: '6', description: 'Launch 2048 (Heuristic Evaluation)', category: 'Games', targetView: '2048' },
  { key: '7', label: '7', description: 'Launch Hangman (Corpus Frequency)', category: 'Games', targetView: 'hangman' },
  { key: 'M', label: 'M', description: 'Toggle sound mute on/off', category: 'Controls' },
  { key: 'D', label: 'D', description: 'Toggle dark / light display mode', category: 'Controls' },
  { key: 'H', label: 'H', description: 'Navigate to Arcade Home / Dashboard', category: 'Navigation', targetView: 'home' },
  { key: 'G', label: 'G', description: 'Navigate to All Games Catalog', category: 'Navigation', targetView: 'games' },
  { key: 'L', label: 'L', description: 'Navigate to Leaderboard & High Scores', category: 'Navigation', targetView: 'leaderboard' },
  { key: 'A', label: 'A', description: 'Navigate to About & Team Members page', category: 'Navigation', targetView: 'about' },
  { key: '?', label: '?', description: 'Open Keyboard Shortcuts cheat sheet', category: 'Navigation' },
  { key: 'Esc', label: 'Escape', description: 'Close modals or return to arcade', category: 'Navigation' },
];

export const GAME_KEY_MAP: Record<string, ActiveView> = {
  '1': 'tictactoe',
  '2': 'sudoku',
  '3': 'rps',
  '4': 'maze',
  '5': 'connect4',
  '6': '2048',
  '7': 'hangman',
};

export const GAME_NAME_MAP: Record<ActiveView, string> = {
  home: 'Home Dashboard',
  games: 'All Games',
  leaderboard: 'Leaderboard',
  about: 'About & Team',
  tictactoe: 'Tic-Tac-Toe',
  sudoku: 'Sudoku Solver',
  rps: 'Rock-Paper-Scissors',
  maze: 'Maze Solver',
  connect4: 'Connect Four',
  '2048': '2048 Puzzle',
  hangman: 'Hangman',
};

export interface ResolvedShortcut {
  type: ShortcutActionType;
  targetView?: ActiveView;
  label: string;
  message: string;
}

/**
 * Resolves a keyboard key event into a structured shortcut action.
 * Handles case-insensitivity, prevents collision with text editing,
 * and restricts single-letter navigation inside word-guessing games like Hangman.
 */
export function resolveKeyboardShortcut(
  key: string,
  options: {
    isEditingText?: boolean;
    hasModifier?: boolean;
    currentView?: ActiveView;
    isModalOpen?: boolean;
  } = {}
): ResolvedShortcut | null {
  const { isEditingText = false, hasModifier = false, currentView = 'home', isModalOpen = false } = options;

  // Never process shortcuts if modifier keys (Ctrl/Cmd/Alt) are held down
  if (hasModifier) return null;

  // Never process shortcuts if the user is focused on an input/textarea/select
  if (isEditingText) return null;

  // Escape key: close modal if open, otherwise return home if inside a game
  if (key === 'Escape') {
    if (isModalOpen) {
      return {
        type: 'back_to_home',
        label: 'Escape',
        message: 'Closed dialog',
      };
    }
    if (currentView !== 'home') {
      return {
        type: 'navigate',
        targetView: 'home',
        label: 'Escape',
        message: 'Returned to Arcade Home',
      };
    }
    return null;
  }

  // Help shortcut: '?' or '/'
  if (key === '?' || (key === '/' && !isEditingText)) {
    return {
      type: 'open_shortcuts_modal',
      label: '?',
      message: 'Keyboard Shortcuts Cheat Sheet',
    };
  }

  // Game launch keys '1' through '7'
  if (GAME_KEY_MAP[key]) {
    const targetGame = GAME_KEY_MAP[key];
    const gameName = GAME_NAME_MAP[targetGame];
    return {
      type: 'launch_game',
      targetView: targetGame,
      label: key,
      message: `Launched ${gameName} [${key}]`,
    };
  }

  const upperKey = key.toUpperCase();

  // Audio mute toggle: 'M' or 'm'
  if (upperKey === 'M') {
    return {
      type: 'toggle_mute',
      label: 'M',
      message: 'Toggled Audio Mute [M]',
    };
  }

  // Dark/Light theme toggle: 'D' or 'd'
  if (upperKey === 'D') {
    return {
      type: 'toggle_theme',
      label: 'D',
      message: 'Toggled Theme [D]',
    };
  }

  // In Hangman, prevent accidental navigation if the user is trying to guess letters
  if (currentView === 'hangman') {
    return null;
  }

  // Navigation shortcuts: H, G, L, A
  if (upperKey === 'H') {
    return {
      type: 'navigate',
      targetView: 'home',
      label: 'H',
      message: 'Navigated to Home [H]',
    };
  }

  if (upperKey === 'G') {
    return {
      type: 'navigate',
      targetView: 'games',
      label: 'G',
      message: 'Navigated to Games Catalog [G]',
    };
  }

  if (upperKey === 'L') {
    return {
      type: 'navigate',
      targetView: 'leaderboard',
      label: 'L',
      message: 'Navigated to Leaderboard [L]',
    };
  }

  if (upperKey === 'A') {
    return {
      type: 'navigate',
      targetView: 'about',
      label: 'A',
      message: 'Navigated to About & Team [A]',
    };
  }

  return null;
}
