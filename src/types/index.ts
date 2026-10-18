export type ActiveView = 
  | 'home' 
  | 'games' 
  | 'leaderboard' 
  | 'about' 
  | 'tictactoe' 
  | 'sudoku' 
  | 'rps' 
  | 'maze' 
  | 'connect4' 
  | '2048' 
  | 'hangman';

export type GameId = 
  | 'tictactoe' 
  | 'sudoku' 
  | 'rps' 
  | 'maze' 
  | 'connect4' 
  | '2048' 
  | 'hangman';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameStats {
  tictactoe: { wins: number; losses: number; draws: number; gamesPlayed: number };
  sudoku: { solved: number; hintsUsed: number; fastestTime: number | null; gamesPlayed: number };
  rps: { playerWins: number; aiWins: number; draws: number; gamesPlayed: number };
  maze: { mazesSolved: number; shortestPathLength: number | null; gamesPlayed: number };
  connect4: { wins: number; losses: number; draws: number; gamesPlayed: number };
  game2048: { bestScore: number; gamesPlayed: number; reached2048Count: number };
  hangman: { wins: number; losses: number; gamesPlayed: number; winStreak: number; bestStreak: number };
  totalGamesPlayed: number;
}

export interface GameMetadata {
  id: GameId;
  title: string;
  tagline: string;
  concept: string;
  algorithmName: string;
  difficultyRating: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  iconName: string;
  accentColor: string;
  tags: string[];
}
