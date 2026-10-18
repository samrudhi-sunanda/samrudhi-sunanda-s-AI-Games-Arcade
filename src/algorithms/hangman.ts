export type HangmanCategory = 'Technology' | 'Science' | 'Animals' | 'General Knowledge';

export const HANGMAN_CATEGORIES: HangmanCategory[] = [
  'Technology',
  'Science',
  'Animals',
  'General Knowledge',
];

export const CATEGORY_WORDS: Record<HangmanCategory, string[]> = {
  Technology: [
    'ALGORITHM', 'DATABASE', 'COMPILER', 'NETWORK', 'PROCESSOR',
    'FIREWALL', 'BROWSER', 'FUNCTION', 'VARIABLE', 'CONTAINER',
    'RECURSION', 'INTERFACE', 'BITCOIN', 'SOFTWARE', 'HARDWARE',
    'ROBOTICS', 'BACKEND', 'FRONTEND', 'PYTHON', 'JAVASCRIPT',
    'ENCRYPTION', 'ETHERNET', 'DEBUGGER', 'PIPELINE', 'INTELLIGENCE'
  ],
  Science: [
    'GRAVITY', 'QUANTUM', 'MOLECULE', 'GENETICS', 'ORGANISM',
    'ELEMENT', 'ELECTRON', 'VELOCITY', 'FRICTION', 'CATALYST',
    'NEUTRON', 'RADIATION', 'SPECTRUM', 'THERMODYNAMICS', 'PHOTOSYNTHESIS',
    'ASTRONOMY', 'CELLULAR', 'PLANET', 'HYPOTHESIS', 'BIOLOGY'
  ],
  Animals: [
    'CHEETAH', 'DOLPHIN', 'ELEPHANT', 'GIRAFFE', 'KANGAROO',
    'LEOPARD', 'OCTOPUS', 'PENGUIN', 'PLATYPUS', 'RHINOCEROS',
    'SQUIRREL', 'FLAMINGO', 'CHAMELEON', 'PORCUPINE', 'TORTOISE',
    'BUFFALO', 'ALLIGATOR', 'HEDGEHOG', 'JELLYFISH', 'MEERKAT'
  ],
  'General Knowledge': [
    'HORIZON', 'PYRAMID', 'SYMPHONY', 'MONUMENT', 'ODYSSEY',
    'LABYRINTH', 'CHAMPION', 'NAVIGATOR', 'DISCOVERY', 'PARADOX',
    'AQUEDUCT', 'CONTINENT', 'ARCHIPELAGO', 'HARMONY', 'METROPOLIS',
    'AVALANCHE', 'HERITAGE', 'CITADEL', 'SANCTUARY', 'ECLIPSE'
  ]
};

export interface LetterFrequencyHint {
  recommendedLetter: string;
  rankedLetters: { letter: string; count: number; percentage: number }[];
  matchingWordsCount: number;
  explanation: string;
}

/**
 * Standard English corpus letter frequency baseline (ETAOIN SHRDLU...)
 */
export const ENGLISH_LETTER_FREQUENCIES: Record<string, number> = {
  E: 12.02, T: 9.10, A: 8.12, O: 7.68, I: 7.31, N: 6.95, S: 6.28, R: 6.02,
  H: 5.92, D: 4.32, L: 3.98, U: 2.88, C: 2.71, M: 2.61, F: 2.30, Y: 2.11,
  W: 2.09, G: 2.03, P: 1.82, B: 1.49, V: 1.11, K: 0.69, X: 0.17, Q: 0.11,
  J: 0.10, Z: 0.07,
};

/**
 * AI Letter-Frequency Strategy:
 * Filters the category corpus to words that match:
 * 1. The target word length
 * 2. Already revealed letter positions
 * 3. Does not contain letters already guessed that are not in the word
 * Then computes the exact frequency of all remaining candidate letters.
 */
export function getLetterFrequencyHint(
  targetWord: string,
  guessedLetters: Set<string>,
  category: HangmanCategory
): LetterFrequencyHint {
  const words = CATEGORY_WORDS[category];
  const targetLength = targetWord.length;

  // Build matching regex pattern from current guessed state
  // e.g., if word is 'ALGORITHM' and 'A', 'O' guessed -> A _ _ O _ _ _ _ _
  const matchingWords = words.filter((w) => {
    if (w.length !== targetLength) return false;
    for (let i = 0; i < targetLength; i++) {
      const char = targetWord[i];
      if (guessedLetters.has(char)) {
        if (w[i] !== char) return false;
      } else {
        // If w[i] has already been guessed incorrectly or correctly elsewhere, skip
        if (guessedLetters.has(w[i])) return false;
      }
    }
    return true;
  });

  const corpus = matchingWords.length > 0 ? matchingWords : words;
  const letterCounts: Record<string, number> = {};

  for (let c = 65; c <= 90; c++) {
    const letter = String.fromCharCode(c);
    if (!guessedLetters.has(letter)) {
      letterCounts[letter] = 0;
    }
  }

  let totalOccurrences = 0;
  for (const w of corpus) {
    // Count each letter once per candidate word (presence probability)
    const uniqueInWord = new Set(w.split(''));
    for (const letter of uniqueInWord) {
      if (!guessedLetters.has(letter) && letterCounts[letter] !== undefined) {
        letterCounts[letter]++;
        totalOccurrences++;
      }
    }
  }

  const rankedLetters = Object.entries(letterCounts)
    .filter(([_, count]) => count > 0)
    .map(([letter, count]) => ({
      letter,
      count,
      percentage: totalOccurrences > 0 ? Math.round((count / corpus.length) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count || (ENGLISH_LETTER_FREQUENCIES[b.letter] || 0) - (ENGLISH_LETTER_FREQUENCIES[a.letter] || 0));

  let recommendedLetter = rankedLetters.length > 0 ? rankedLetters[0].letter : 'E';
  if (!rankedLetters.length) {
    // Fallback to highest general frequency letter not yet guessed
    const remaining = Object.keys(ENGLISH_LETTER_FREQUENCIES).filter((l) => !guessedLetters.has(l));
    recommendedLetter = remaining[0] || 'A';
  }

  const topMatch = rankedLetters[0];
  const explanation = topMatch
    ? `Letter '${topMatch.letter}' appears in ${topMatch.count} of ${corpus.length} matching words (${topMatch.percentage}% occurrence in category '${category}').`
    : `Using general English letter frequency table. Highest unguessed letter is '${recommendedLetter}'.`;

  return {
    recommendedLetter,
    rankedLetters: rankedLetters.slice(0, 5),
    matchingWordsCount: corpus.length,
    explanation,
  };
}
