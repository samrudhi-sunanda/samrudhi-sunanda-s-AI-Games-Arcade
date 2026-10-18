export interface QuickStartControl {
  keyOrAction: string;
  label: string;
  description: string;
}

export interface GameQuickStart {
  gameId: string;
  gameTitle: string;
  subtitle: string;
  aiConceptTitle: string;
  aiConceptSummary: string;
  aiAlgorithmTag: string;
  objective: string;
  controls: QuickStartControl[];
  proTip: string;
  difficultyRating: 'Beginner' | 'Intermediate' | 'Advanced';
}

export const QUICK_START_GUIDES: Record<string, GameQuickStart> = {
  tictactoe: {
    gameId: 'tictactoe',
    gameTitle: 'Tic-Tac-Toe Minimax',
    subtitle: 'Zero-Sum Adversarial Tree Search',
    aiConceptTitle: 'Minimax Algorithm & Depth Penalization',
    aiConceptSummary:
      'The AI evaluates the entire game tree of future states. Max nodes pick moves yielding maximum human disadvantage, while Min nodes simulate the human playing optimally to guarantee zero mistakes on Hard mode.',
    aiAlgorithmTag: 'Minimax Search',
    objective: 'Place 3 of your marks in a horizontal, vertical, or diagonal line before the AI does.',
    controls: [
      {
        keyOrAction: 'Left Click',
        label: 'Place Mark',
        description: 'Click any vacant cell on the 3×3 grid to place your mark.',
      },
      {
        keyOrAction: 'Side Picker',
        label: 'Choose X or O',
        description: 'Selecting "X" lets you move first; selecting "O" lets the AI play first.',
      },
      {
        keyOrAction: 'Difficulty',
        label: 'Easy / Medium / Hard',
        description: 'Hard activates the unbeatable recursive Minimax algorithm.',
      },
    ],
    proTip:
      'On Hard difficulty, Minimax is mathematically unbeatable. The theoretical best possible outcome against it is an optimal draw (stalemate)!',
    difficultyRating: 'Beginner',
  },

  sudoku: {
    gameId: 'sudoku',
    gameTitle: 'Sudoku Solver & CSP',
    subtitle: 'Constraint Satisfaction & Depth-First Backtracking',
    aiConceptTitle: 'Constraint Propagation & MRV Heuristic',
    aiConceptSummary:
      'Sudoku is formulated as a Constraint Satisfaction Problem (CSP). Empty cells are variables, numbers 1–9 are domains, and all-different rules are constraints. The AI uses Minimum Remaining Values (MRV) to explore cells with the fewest legal options first.',
    aiAlgorithmTag: 'CSP + Backtracking',
    objective: 'Fill every cell so digits 1–9 appear exactly once in each row, column, and 3×3 box without any duplicates.',
    controls: [
      {
        keyOrAction: 'Keys 1–9 / Dial',
        label: 'Input Numbers',
        description: 'Select a cell and press keyboard keys 1–9 or click the on-screen numbers.',
      },
      {
        keyOrAction: 'Arrow Keys',
        label: 'Navigate Grid',
        description: 'Use keyboard arrows (↑, ↓, ←, →) to move your cursor across cells.',
      },
      {
        keyOrAction: 'Backspace / Erase',
        label: 'Clear Cell',
        description: 'Delete user-entered numbers (original puzzle clues are locked).',
      },
      {
        keyOrAction: 'Solve with AI',
        label: 'Run CSP Solver',
        description: 'Instantly runs recursive backtracking and displays execution steps.',
      },
    ],
    proTip:
      'Click "Solve with AI (CSP)" on any difficulty preset to watch how fast MRV backtracking resolves all 81 constraint variables in under 250 milliseconds.',
    difficultyRating: 'Intermediate',
  },

  rps: {
    gameId: 'rps',
    gameTitle: 'Rock Paper Scissors AI',
    subtitle: 'Predictive Modeling & Markov State Transitions',
    aiConceptTitle: '1st-Order Markov Chains & Frequency Modeling',
    aiConceptSummary:
      'Humans tend to repeat unconscious patterns when playing. In Adaptive mode, the AI maintains a transition matrix P(Next | Previous) and a frequency histogram of your choices to predict your next weapon and counter it.',
    aiAlgorithmTag: 'Markov Chains',
    objective: 'Anticipate the AI and win rounds: Rock beats Scissors, Paper beats Rock, Scissors beats Paper.',
    controls: [
      {
        keyOrAction: 'Click Cards',
        label: 'Choose Throw',
        description: 'Click Rock, Paper, or Scissors to lock in your move and trigger the duel.',
      },
      {
        keyOrAction: 'Strategy Toggle',
        label: 'Adaptive vs Random',
        description: 'Switch between the learning Markov predictor and pure 1/3 Nash equilibrium.',
      },
      {
        keyOrAction: 'Reset History',
        label: 'Wipe Memory',
        description: 'Clear the AI observation buffer to restart the learning model.',
      },
    ],
    proTip:
      'Try playing a predictable pattern (e.g. Rock → Paper → Scissors) for 4 rounds, then watch the AI Decision Log accurately predict your subsequent moves!',
    difficultyRating: 'Beginner',
  },

  maze: {
    gameId: 'maze',
    gameTitle: 'A* Search Maze Solver',
    subtitle: 'Informed Graph Search with Manhattan Heuristics',
    aiConceptTitle: 'A* Heuristic Evaluation: f(n) = g(n) + h(n)',
    aiConceptSummary:
      'A* finds the mathematically shortest route by balancing g(n) (cost from start to current cell) with h(n) (admissible Manhattan distance estimate to the goal). Nodes with the lowest f(n) are expanded first.',
    aiAlgorithmTag: 'A* Pathfinding',
    objective: 'Find the optimal shortest collision-free path from Start (Green S) to Goal (Red G).',
    controls: [
      {
        keyOrAction: 'Click / Drag',
        label: 'Draw & Erase Walls',
        description: 'Click or drag across grid tiles to place or remove wall obstacles.',
      },
      {
        keyOrAction: 'Start / Goal Mode',
        label: 'Reposition Nodes',
        description: 'Select Start or Goal action to move the entry and exit points.',
      },
      {
        keyOrAction: 'Find Path (A*)',
        label: 'Run Search',
        description: 'Animates the explored closed set in cyan, then illuminates the shortest path in gold.',
      },
      {
        keyOrAction: 'Speed Slider',
        label: 'Playback Rate',
        description: 'Adjust the animation step speed from Fast to Slow.',
      },
    ],
    proTip:
      'Generate a procedural maze and observe how A* avoids expanding dead-end corridors that lead away from the goal, exploring far fewer cells than Dijkstra or BFS.',
    difficultyRating: 'Intermediate',
  },

  connect4: {
    gameId: 'connect4',
    gameTitle: 'Connect Four AI',
    subtitle: 'Adversarial Minimax with Alpha-Beta Pruning',
    aiConceptTitle: 'Branch Elimination with Alpha-Beta Cutoffs',
    aiConceptSummary:
      'Connect Four has over 4.5 trillion board positions. Alpha-Beta pruning eliminates search branches that are provably worse than previously examined options (α ≥ β), allowing 5-ply deep tactical search in milliseconds.',
    aiAlgorithmTag: 'Alpha-Beta Pruning',
    objective: 'Connect four consecutive discs in a row, column, or diagonal while blocking the AI.',
    controls: [
      {
        keyOrAction: 'Click Column / Arrow',
        label: 'Drop Disc',
        description: 'Click any column header arrow to drop your piece into the lowest vacant slot.',
      },
      {
        keyOrAction: 'Color Picker',
        label: 'Select Disc Color',
        description: 'Choose Red or Yellow discs for your player piece.',
      },
      {
        keyOrAction: 'Difficulty',
        label: 'Search Depth',
        description: 'Hard depth evaluates 5 moves ahead and prioritizes strategic center control.',
      },
    ],
    proTip:
      'Control the center column (Column 4) whenever possible! Center discs can participate in significantly more horizontal and diagonal combinations than edge discs.',
    difficultyRating: 'Advanced',
  },

  '2048': {
    gameId: '2048',
    gameTitle: '2048 Puzzle & AI Advisor',
    subtitle: 'Multi-Factor Heuristic Evaluation & Lookahead',
    aiConceptTitle: 'Heuristic Utility Functions & Monotonicity',
    aiConceptSummary:
      'The AI evaluates non-terminal board states using a weighted utility function: rewarding free empty cells, penalizing smoothness disparity, and encouraging a monotonic snake ordering with the maximum tile anchored in a corner.',
    aiAlgorithmTag: 'Heuristic Evaluation',
    objective: 'Slide and merge equal numbered tiles to create larger values and reach the 2048 tile.',
    controls: [
      {
        keyOrAction: 'Arrow Keys (↑ ↓ ← →)',
        label: 'Slide Tiles',
        description: 'Use your keyboard arrows or on-screen directional buttons to shift tiles.',
      },
      {
        keyOrAction: 'AI Suggest Move',
        label: 'Get Move Advice',
        description: 'Evaluates the current state and highlights the highest-utility direction.',
      },
      {
        keyOrAction: 'Start AI Auto-Play',
        label: 'Autonomous Mode',
        description: 'Lets the heuristic engine play the game automatically in real-time.',
      },
      {
        keyOrAction: 'Undo',
        label: 'Revert Move',
        description: 'Step back to your previous board position if you make a slip.',
      },
    ],
    proTip:
      'Keep your highest-value tile locked in one corner (e.g. top-left) and build descending values along the edge to avoid fragmentation.',
    difficultyRating: 'Advanced',
  },

  hangman: {
    gameId: 'hangman',
    gameTitle: 'Hangman AI Advisor',
    subtitle: 'Statistical Corpus Analysis & Information Gain',
    aiConceptTitle: 'Conditional Letter Probability Distribution',
    aiConceptSummary:
      'The AI filters the category dictionary to candidate words that strictly match the target word length and already revealed letters. It then computes the exact probability distribution of all unguessed letters to maximize information gain.',
    aiAlgorithmTag: 'Frequency Analysis',
    objective: 'Discover the hidden word before making 6 incorrect guesses and completing the gallows drawing.',
    controls: [
      {
        keyOrAction: 'Keyboard / Buttons',
        label: 'Guess Letter',
        description: 'Type any letter on your physical keyboard or click the on-screen alphabet pad.',
      },
      {
        keyOrAction: 'Request AI Letter Hint',
        label: 'Statistical Hint',
        description: 'Highlights the letter with the highest presence probability in the candidate set.',
      },
      {
        keyOrAction: 'Word Category',
        label: 'Switch Topic',
        description: 'Choose between Technology, Science, Animals, and General Knowledge words.',
      },
      {
        keyOrAction: 'New Word',
        label: 'Generate Word',
        description: 'Start a fresh round with a newly drawn secret word.',
      },
    ],
    proTip:
      'In early rounds when few letters are revealed, activate the AI Hint to see why high-frequency letters (like E, A, R, T) give the highest statistical probability of a hit.',
    difficultyRating: 'Beginner',
  },
};
