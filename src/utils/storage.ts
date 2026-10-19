import { GameStats } from '../types/index.ts';

const STATS_KEY = 'ai_arcade_stats_v1';
const THEME_KEY = 'ai_arcade_theme';

const defaultStats: GameStats = {
  tictactoe: { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 },
  sudoku: { solved: 0, hintsUsed: 0, fastestTime: null, gamesPlayed: 0 },
  rps: { playerWins: 0, aiWins: 0, draws: 0, gamesPlayed: 0 },
  maze: { mazesSolved: 0, shortestPathLength: null, gamesPlayed: 0 },
  connect4: { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 },
  game2048: { bestScore: 0, gamesPlayed: 0, reached2048Count: 0 },
  hangman: { wins: 0, losses: 0, gamesPlayed: 0, winStreak: 0, bestStreak: 0 },
  totalGamesPlayed: 0,
};

export const storage = {
  getStats(): GameStats {
    try {
      const raw = localStorage.getItem(STATS_KEY);
      if (!raw) return { ...defaultStats };
      const parsed = JSON.parse(raw);
      return {
        ...defaultStats,
        ...parsed,
        tictactoe: { ...defaultStats.tictactoe, ...(parsed.tictactoe || {}) },
        sudoku: { ...defaultStats.sudoku, ...(parsed.sudoku || {}) },
        rps: { ...defaultStats.rps, ...(parsed.rps || {}) },
        maze: { ...defaultStats.maze, ...(parsed.maze || {}) },
        connect4: { ...defaultStats.connect4, ...(parsed.connect4 || {}) },
        game2048: { ...defaultStats.game2048, ...(parsed.game2048 || {}) },
        hangman: { ...defaultStats.hangman, ...(parsed.hangman || {}) },
      };
    } catch {
      return { ...defaultStats };
    }
  },

  saveStats(stats: GameStats): void {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch {
      // storage unavailable or quota exceeded
    }
  },

  recordTicTacToe(result: 'win' | 'loss' | 'draw'): GameStats {
    const s = this.getStats();
    s.totalGamesPlayed += 1;
    s.tictactoe.gamesPlayed += 1;
    if (result === 'win') s.tictactoe.wins += 1;
    else if (result === 'loss') s.tictactoe.losses += 1;
    else s.tictactoe.draws += 1;
    this.saveStats(s);
    return s;
  },

  recordSudoku(solved: boolean, hintsCount: number, timeSeconds: number | null): GameStats {
    const s = this.getStats();
    s.totalGamesPlayed += 1;
    s.sudoku.gamesPlayed += 1;
    if (solved) {
      s.sudoku.solved += 1;
      s.sudoku.hintsUsed += hintsCount;
      if (timeSeconds !== null) {
        if (s.sudoku.fastestTime === null || timeSeconds < s.sudoku.fastestTime) {
          s.sudoku.fastestTime = timeSeconds;
        }
      }
    }
    this.saveStats(s);
    return s;
  },

  recordRPS(result: 'win' | 'loss' | 'draw'): GameStats {
    const s = this.getStats();
    s.totalGamesPlayed += 1;
    s.rps.gamesPlayed += 1;
    if (result === 'win') s.rps.playerWins += 1;
    else if (result === 'loss') s.rps.aiWins += 1;
    else s.rps.draws += 1;
    this.saveStats(s);
    return s;
  },

  recordMazeSolved(pathLength: number): GameStats {
    const s = this.getStats();
    s.totalGamesPlayed += 1;
    s.maze.gamesPlayed += 1;
    s.maze.mazesSolved += 1;
    if (s.maze.shortestPathLength === null || pathLength < s.maze.shortestPathLength) {
      s.maze.shortestPathLength = pathLength;
    }
    this.saveStats(s);
    return s;
  },

  recordConnect4(result: 'win' | 'loss' | 'draw'): GameStats {
    const s = this.getStats();
    s.totalGamesPlayed += 1;
    s.connect4.gamesPlayed += 1;
    if (result === 'win') s.connect4.wins += 1;
    else if (result === 'loss') s.connect4.losses += 1;
    else s.connect4.draws += 1;
    this.saveStats(s);
    return s;
  },

  record2048(score: number, reached2048: boolean): GameStats {
    const s = this.getStats();
    s.totalGamesPlayed += 1;
    s.game2048.gamesPlayed += 1;
    if (score > s.game2048.bestScore) {
      s.game2048.bestScore = score;
    }
    if (reached2048) {
      s.game2048.reached2048Count += 1;
    }
    this.saveStats(s);
    return s;
  },

  recordHangman(won: boolean): GameStats {
    const s = this.getStats();
    s.totalGamesPlayed += 1;
    s.hangman.gamesPlayed += 1;
    if (won) {
      s.hangman.wins += 1;
      s.hangman.winStreak += 1;
      if (s.hangman.winStreak > s.hangman.bestStreak) {
        s.hangman.bestStreak = s.hangman.winStreak;
      }
    } else {
      s.hangman.losses += 1;
      s.hangman.winStreak = 0;
    }
    this.saveStats(s);
    return s;
  },

  clearAllStats(): void {
    try {
      localStorage.removeItem(STATS_KEY);
    } catch {}
  },

  getTheme(): 'dark' | 'light' {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {}
    return 'light'; // default to light theme as requested
  },

  setTheme(theme: 'dark' | 'light'): void {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  },

  hasSeenTutorial(gameId: string): boolean {
    try {
      return localStorage.getItem(`ai_arcade_tutorial_${gameId}`) === 'true';
    } catch {
      return false;
    }
  },

  setTutorialSeen(gameId: string, seen: boolean): void {
    try {
      localStorage.setItem(`ai_arcade_tutorial_${gameId}`, seen ? 'true' : 'false');
    } catch {}
  }
};
