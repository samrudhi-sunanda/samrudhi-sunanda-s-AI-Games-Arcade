export type RPSChoice = 'rock' | 'paper' | 'scissors';
export type RPSResult = 'win' | 'loss' | 'draw';

export const CHOICES: RPSChoice[] = ['rock', 'paper', 'scissors'];

export const WINNING_PAIRS: Record<RPSChoice, RPSChoice> = {
  rock: 'scissors',      // rock beats scissors
  paper: 'rock',        // paper beats rock
  scissors: 'paper',    // scissors beats paper
};

export const COUNTER_MOVES: Record<RPSChoice, RPSChoice> = {
  rock: 'paper',        // play paper to beat rock
  paper: 'scissors',    // play scissors to beat paper
  scissors: 'rock',     // play rock to beat scissors
};

export function determineRPSWinner(player: RPSChoice, computer: RPSChoice): RPSResult {
  if (player === computer) return 'draw';
  if (WINNING_PAIRS[player] === computer) return 'win';
  return 'loss';
}

export interface RPSPrediction {
  choice: RPSChoice;
  predictedPlayerMove: RPSChoice;
  strategyUsed: 'random' | 'frequency' | 'transition';
  explanation: string;
}

/**
 * AI Decision Maker for RPS:
 * - If random mode: uniform choice
 * - If adaptive mode:
 *   1. Analyzes player's historical frequency
 *   2. If last 2+ rounds exist, analyzes transition probabilities (Markov chain)
 *   3. Predicts human next move and counters it!
 */
export function getRPSComputerMove(
  history: RPSChoice[],
  strategy: 'random' | 'adaptive'
): RPSPrediction {
  const getRandom = (): RPSChoice => CHOICES[Math.floor(Math.random() * 3)];

  if (strategy === 'random' || history.length < 3) {
    const randomChoice = getRandom();
    return {
      choice: randomChoice,
      predictedPlayerMove: COUNTER_MOVES[randomChoice],
      strategyUsed: 'random',
      explanation: history.length < 3 
        ? 'Gathering initial observation data (playing uniformly at random).'
        : 'Playing pure Nash equilibrium random move (1/3 probability each).'
    };
  }

  // Adaptive Strategy:
  // 1. Check Markov 1st-order transition: given previous move, what does player play next?
  const lastMove = history[history.length - 1];
  const transitions: Record<RPSChoice, number> = { rock: 0, paper: 0, scissors: 0 };
  let transitionSamples = 0;

  for (let i = 0; i < history.length - 1; i++) {
    if (history[i] === lastMove) {
      const next = history[i + 1];
      transitions[next]++;
      transitionSamples++;
    }
  }

  if (transitionSamples >= 2) {
    // Pick the most likely transition
    let maxCount = -1;
    let predictedMove: RPSChoice = 'rock';
    for (const c of CHOICES) {
      if (transitions[c] > maxCount) {
        maxCount = transitions[c];
        predictedMove = c;
      }
    }
    const aiCounter = COUNTER_MOVES[predictedMove];
    return {
      choice: aiCounter,
      predictedPlayerMove: predictedMove,
      strategyUsed: 'transition',
      explanation: `Markov Transition: After playing "${lastMove}", you played "${predictedMove}" ${maxCount}/${transitionSamples} times. Countering with "${aiCounter}".`
    };
  }

  // 2. Fallback to global letter frequency:
  const frequencies: Record<RPSChoice, number> = { rock: 0, paper: 0, scissors: 0 };
  history.forEach((choice) => frequencies[choice]++);

  let mostFrequent: RPSChoice = 'rock';
  let highestFreq = -1;
  for (const c of CHOICES) {
    if (frequencies[c] > highestFreq) {
      highestFreq = frequencies[c];
      mostFrequent = c;
    }
  }

  const aiChoice = COUNTER_MOVES[mostFrequent];
  return {
    choice: aiChoice,
    predictedPlayerMove: mostFrequent,
    strategyUsed: 'frequency',
    explanation: `Frequency Analysis: Your most frequent choice is "${mostFrequent}" (${highestFreq}/${history.length} games). AI plays "${aiChoice}" to beat it.`
  };
}
