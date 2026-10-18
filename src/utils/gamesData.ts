import { GameMetadata } from '../types/index.ts';

export const GAMES_METADATA: GameMetadata[] = [
  {
    id: 'tictactoe',
    title: 'Tic-Tac-Toe',
    tagline: 'Zero-Sum Game Theory with Minimax',
    concept: 'Minimax Algorithm',
    algorithmName: 'Minimax Tree Search',
    difficultyRating: 'Beginner',
    description: 'Face off against an AI opponent powered by the Minimax algorithm. Experience how tree search evaluates all future game states to guarantee an unbeatable game on Hard mode.',
    iconName: 'Grid3X3',
    accentColor: '#3b82f6',
    tags: ['Minimax', 'Zero-Sum', 'Game Tree', 'Recursion'],
  },
  {
    id: 'sudoku',
    title: 'Sudoku Solver',
    tagline: 'Constraint Satisfaction & Depth-First Backtracking',
    concept: 'CSP & Backtracking',
    algorithmName: 'MRV Heuristic & Backtracking',
    difficultyRating: 'Intermediate',
    description: 'Solve classic 9×9 puzzles or watch the AI solve complex boards step-by-step using Constraint Satisfaction Problem (CSP) rules and Minimum Remaining Values (MRV) depth-first backtracking.',
    iconName: 'TableProperties',
    accentColor: '#8b5cf6',
    tags: ['CSP', 'Backtracking', 'MRV Heuristic', 'Constraint Propagation'],
  },
  {
    id: 'rps',
    title: 'Rock-Paper-Scissors',
    tagline: 'Predictive Modeling & Adaptive Decision-Making',
    concept: 'Decision-Making & Markov Chains',
    algorithmName: 'Frequency & 1st-Order Transition Analysis',
    difficultyRating: 'Beginner',
    description: 'Test your behavioral randomness against an adaptive AI that tracks your historical tendencies and uses Markov state transitions to predict your next move in real time.',
    iconName: 'Swords',
    accentColor: '#ec4899',
    tags: ['Decision Trees', 'Markov Chains', 'Frequency Modeling', 'Game Theory'],
  },
  {
    id: 'maze',
    title: 'Maze Solver',
    tagline: 'Heuristic-Guided Shortest Pathfinding',
    concept: 'A* Search Algorithm',
    algorithmName: 'A* Search with Manhattan Heuristic',
    difficultyRating: 'Intermediate',
    description: 'Design custom labyrinths or generate procedural mazes. Watch the A* algorithm intelligently explore nodes by balancing actual path cost g(n) with estimated Manhattan distance h(n).',
    iconName: 'Compass',
    accentColor: '#10b981',
    tags: ['A* Search', 'Heuristics', 'Priority Queue', 'Graph Traversal'],
  },
  {
    id: 'connect4',
    title: 'Connect Four',
    tagline: 'Adversarial Search with Alpha-Beta Pruning',
    concept: 'Alpha-Beta Pruning',
    algorithmName: 'Minimax with Alpha-Beta Cutoffs',
    difficultyRating: 'Advanced',
    description: 'Drop discs into a 7×6 vertical grid against an AI that prunes unpromising search branches to calculate deep tactical combinations up to 5 plies ahead in milliseconds.',
    iconName: 'Columns3',
    accentColor: '#f59e0b',
    tags: ['Alpha-Beta Pruning', 'Board Evaluation', 'Branch Pruning', 'Adversarial AI'],
  },
  {
    id: '2048',
    title: '2048 Puzzle',
    tagline: 'Multi-Factor Heuristic Evaluation & Lookahead',
    concept: 'Heuristic Evaluation & Expectimax',
    algorithmName: 'Multi-Criteria Utility Function',
    difficultyRating: 'Advanced',
    description: 'Slide numbered tiles to reach 2048. Utilize the AI Move Advisor which scores board states using monotonicity, smoothness, empty cell density, and corner tile locking.',
    iconName: 'LayoutGrid',
    accentColor: '#06b6d4',
    tags: ['Utility Functions', 'Heuristics', 'State Evaluation', 'Optimization'],
  },
  {
    id: 'hangman',
    title: 'Hangman',
    tagline: 'Statistical Corpus Analysis & Information Theory',
    concept: 'Letter-Frequency Strategy',
    algorithmName: 'Corpus Pattern & Frequency Modeling',
    difficultyRating: 'Beginner',
    description: 'Guess words across Science, Tech, and Animals. Activate the AI Hint engine to analyze conditional letter distributions in dictionary candidate subsets to maximize information gain.',
    iconName: 'HelpCircle',
    accentColor: '#6366f1',
    tags: ['Information Gain', 'Corpus Frequency', 'Pattern Matching', 'Statistical AI'],
  },
];

export interface AIConceptInfo {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  associatedGame: string;
  gameId: string;
  description: string;
  howItWorks: string[];
  formula?: string;
  complexity: { time: string; space: string };
  realWorldApplications: string[];
}

export const AI_CONCEPTS_LIST: AIConceptInfo[] = [
  {
    id: 'intelligent-agents',
    number: 1,
    title: 'Intelligent Agents & Decision-Making',
    subtitle: 'Perceiving Environments & Taking Rational Actions',
    associatedGame: 'Rock-Paper-Scissors & Overall Arcade',
    gameId: 'rps',
    description: 'An intelligent agent is an autonomous entity that observes its environment through sensors, processes information according to a decision policy, and directs its activity through actuators towards achieving goals.',
    howItWorks: [
      'Agent perceives state: observes history of player actions, game scores, and environmental cues.',
      'Decision logic processes inputs: runs utility evaluation, statistical inference, or policy lookups.',
      'Agent executes action: performs optimal or satisficing choice to maximize expected reward.',
      'Feedback loop: stores the outcome in memory to refine future predictions (adaptive learning).'
    ],
    complexity: { time: 'O(1) to O(N)', space: 'O(N) history buffer' },
    realWorldApplications: ['Autonomous driving vehicles', 'Algorithmic trading engines', 'Smart thermostats', 'Robotic process automation']
  },
  {
    id: 'minimax',
    number: 2,
    title: 'Minimax Search Algorithm',
    subtitle: 'Optimal Decision-Making in Zero-Sum Games',
    associatedGame: 'Tic-Tac-Toe',
    gameId: 'tictactoe',
    description: 'Minimax is a recursive backtracking algorithm used in two-player zero-sum decision games. It provides an optimal move for the maximizing player assuming the minimizing opponent is also playing optimally.',
    howItWorks: [
      'Construct a game tree of all legal successor states down to leaf terminal positions.',
      'Evaluate terminal states: assign +10 for AI win, -10 for Human win, 0 for draw, adjusted for depth.',
      'Propagate values upward: maximizing node picks highest child score; minimizing node picks lowest child score.',
      'Root selection: AI chooses the move corresponding to the child with the highest minimax value.'
    ],
    formula: 'V(s) = max_{a} V(Result(s, a)) [MAX node]  |  min_{a} V(Result(s, a)) [MIN node]',
    complexity: { time: 'O(b^d) where b is branching factor, d is depth', space: 'O(b * d)' },
    realWorldApplications: ['Chess engines', 'Checkers solvers', 'Economic duopoly models', 'Military conflict simulations']
  },
  {
    id: 'csp',
    number: 3,
    title: 'Constraint Satisfaction Problems (CSP)',
    subtitle: 'Formulating Problems as Variables, Domains & Constraints',
    associatedGame: 'Sudoku Solver',
    gameId: 'sudoku',
    description: 'A CSP models a problem as a set of variables {X1, ..., Xn}, each with a domain of possible values D, subject to constraints C that specify allowable combinations of values.',
    howItWorks: [
      'Define Variables: 81 individual grid cells in a 9×9 Sudoku grid.',
      'Define Domains: values {1, 2, ..., 9} for empty cells, fixed singleton for clues.',
      'Enforce Constraints: all-different across every row, column, and 3×3 subgrid box.',
      'Search & Consistency: test value assignments and propagate constraints to prune invalid branches immediately.'
    ],
    formula: 'CSP = ⟨X, D, C⟩ where X = {X1...Xn}, D = {D1...Dn}, C = {C1...Cm}',
    complexity: { time: 'NP-complete in general, O(9^k) worst-case', space: 'O(n) recursion stack' },
    realWorldApplications: ['University course scheduling', 'Airline crew rostering', 'Circuit layout design', 'Supply chain routing']
  },
  {
    id: 'backtracking',
    number: 4,
    title: 'Depth-First Backtracking',
    subtitle: 'Systematic Exhaustive Search with Smart Pruning',
    associatedGame: 'Sudoku Solver',
    gameId: 'sudoku',
    description: 'Backtracking is an algorithmic paradigm that systematically explores candidate solutions depth-first and immediately abandons ("backtracks" from) partial solutions that violate problem constraints.',
    howItWorks: [
      'Select next variable using MRV (Minimum Remaining Values / Most Constrained Variable).',
      'Try each valid value from the variable\'s domain one at a time.',
      'Recursively solve the remaining subproblem with the newly chosen assignment.',
      'If a conflict arises where no valid assignment exists, undo the current assignment (backtrack) and try the next value.'
    ],
    complexity: { time: 'O(d^n) worst case, dramatically accelerated with heuristics', space: 'O(n) stack depth' },
    realWorldApplications: ['Graph coloring problems', 'Syntax parsing in compilers', 'DNA sequencing assembly', 'Puzzle solvers']
  },
  {
    id: 'astar',
    number: 5,
    title: 'A* Pathfinding Algorithm',
    subtitle: 'Informed Search with Admissible Heuristics',
    associatedGame: 'Maze Solver',
    gameId: 'maze',
    description: 'A* is a best-first graph traversal algorithm that finds the shortest path between start and goal nodes by combining the known travel cost with an optimistic heuristic estimate.',
    howItWorks: [
      'Maintain an Open Set prioritized by f(n) = g(n) + h(n).',
      'g(n): Exact cost accrued from the start node to current node n.',
      'h(n): Heuristic estimated cost from node n to the goal (Manhattan distance |dx| + |dy|).',
      'Expand the node with minimal f-score, inspect neighbors, update tentative g-scores, and record predecessor pointers until the goal is reached.'
    ],
    formula: 'f(n) = g(n) + h(n)  where h(n) <= h*(n) [Admissible]',
    complexity: { time: 'O(|E| log |V|) with priority queue', space: 'O(|V|) stored nodes' },
    realWorldApplications: ['GPS navigation systems (Google Maps)', 'Video game NPC movement', 'Automated warehouse robotics', 'Network routing protocols']
  },
  {
    id: 'alphabeta',
    number: 6,
    title: 'Alpha-Beta Pruning',
    subtitle: 'Branch Elimination in Adversarial Trees',
    associatedGame: 'Connect Four',
    gameId: 'connect4',
    description: 'Alpha-Beta pruning is an optimization technique for Minimax that eliminates branches of the search tree that cannot possibly influence the final decision, allowing deeper lookahead within identical compute limits.',
    howItWorks: [
      'Alpha (α): Best value that the Maximizer can guarantee so far along the search path.',
      'Beta (β): Best value that the Minimizer can guarantee so far along the search path.',
      'Pruning condition: Whenever α >= β, the current branch is guaranteed to be worse than an existing alternative, so search is immediately terminated.',
      'Move ordering: searching the center columns first maximizes the frequency of early cut-offs.'
    ],
    formula: 'Cutoff condition: α >= β  (Branch pruned)',
    complexity: { time: 'O(b^(d/2)) under optimal move ordering (effectively doubles search depth!)', space: 'O(b * d)' },
    realWorldApplications: ['Deep Blue & Stockfish chess engines', 'Othello / Reversi bots', 'Automated bidding in multi-agent auctions', 'Financial portfolio hedging']
  },
  {
    id: 'heuristics',
    number: 7,
    title: 'Heuristic Evaluation Functions',
    subtitle: 'Domain-Specific Approximation of State Quality',
    associatedGame: '2048 Puzzle',
    gameId: '2048',
    description: 'In games with massive state spaces where exploring down to terminal states is computationally intractable, heuristic utility functions estimate the strategic desirability of intermediate non-terminal states.',
    howItWorks: [
      'Multi-factor formulation: combine multiple weighted domain-specific metrics into a single scalar fitness score.',
      'Empty cells factor: penalizes board clutter, awarding high utility to free space.',
      'Monotonicity factor: rewards boards where values strictly increase toward a designated anchor corner.',
      'Smoothness factor: penalizes adjacent tile disparity to encourage seamless merging.',
      'Corner lockdown: heavily weights placing the maximum valued tile at the top-left boundary.'
    ],
    formula: 'Utility(s) = w1*Empty(s) + w2*Monotonicity(s) + w3*Smoothness(s) + w4*Corner(s)',
    complexity: { time: 'O(R * C) per board evaluation', space: 'O(1) memory overhead' },
    realWorldApplications: ['Machine learning loss functions', 'Combinatorial optimization (TSP)', 'Robotics motion planning', 'Resource allocation algorithms']
  },
  {
    id: 'frequency-prediction',
    number: 8,
    title: 'Frequency-Based Prediction & Information Gain',
    subtitle: 'Statistical Modeling of Likelihood & Uncertainty',
    associatedGame: 'Hangman & Rock-Paper-Scissors',
    gameId: 'hangman',
    description: 'Frequency-based prediction applies probability distributions and entropy reduction to select actions that maximize expected accuracy or information discovery.',
    howItWorks: [
      'Corpus filtering: narrow the universe of possible words to those strictly matching current length and revealed character constraints.',
      'Conditional probability: compute P(Letter | Remaining Candidates) for every unguessed alphabet character.',
      'Entropy reduction / Information gain: selecting the most frequent letter guarantees maximum expected reduction in the search hypothesis space.',
      'Rock-Paper-Scissors application: models human non-randomness by tracking empirical choice distributions and Markov next-choice transitions.'
    ],
    formula: 'P(c | Candidates) = (Count of candidate words containing c) / |Candidates|',
    complexity: { time: 'O(|Dictionary| * |WordLength|)', space: 'O(|Alphabet|)' },
    realWorldApplications: ['Spam filtering (Naive Bayes)', 'Search engine query auto-complete', 'Compression (Huffman / Shannon-Fano coding)', 'Bioinformatics motif discovery']
  }
];
