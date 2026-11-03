import { FLASHCARD_VERBS_PART_1 } from "./flashcards-verbs-part1.ts";
import { FLASHCARD_VERBS_PART_2 } from "./flashcards-verbs-part2.ts";
import { SOURCED_FLASHCARD_PAIRS } from "./sourced-flashcard-content.ts";

export type FlashcardDifficulty = "easy" | "medium" | "hard";

export type FlashcardVerb = {
  rank: number;
  spanish: string;
  english: string;
  example: string;
  exampleEnglish: string;
  difficulty: FlashcardDifficulty;
};

// No authored difficulty data exists for these verbs, so difficulty is derived
// from the frequency rank already assigned to each word: the most common third
// reads as elementary-level vocabulary, the middle third as middle-school level,
// and the least common third as high-school/advanced level.
function difficultyForRank(rank: number): FlashcardDifficulty {
  if (rank <= 166) return "easy";
  if (rank <= 333) return "medium";
  return "hard";
}

export const FLASHCARD_VERBS_SOURCE = {
  corpus: "FrequencyWords ranking plus Tatoeba Spanish-English sentence pairs",
  frequencySourceUrl: "https://github.com/hermitdave/FrequencyWords",
  sentenceSourceUrl: "https://www.manythings.org/anki/",
  methodology:
    "Use FrequencyWords as the verb-ranking signal, then select unique native-speaker/proofread sentence pairs from the Tatoeba-derived corpus. Curated gaps are individually authored after corpus review.",
  licenseNote: "FrequencyWords content is CC BY-SA 4.0. Sourced sentence pairs are CC BY 2.0 France. Original curated pairs are CC BY 4.0.",
} as const;

function parseRows(raw: string): Array<{ spanish: string; english: string }> {
  return raw.split("\n").map((line) => {
    const separator = line.indexOf("|");
    if (separator < 1) throw new Error(`Invalid flashcard row: ${line}`);
    return {
      spanish: line.slice(0, separator),
      english: line.slice(separator + 1),
    };
  });
}

const rows = [
  ...parseRows(FLASHCARD_VERBS_PART_1),
  ...parseRows(FLASHCARD_VERBS_PART_2),
];

if (rows.length !== 500) {
  throw new Error(`Expected 500 flashcard verbs, received ${rows.length}`);
}

export const FLASHCARD_VERBS: FlashcardVerb[] = rows.map(({ spanish, english }, index) => {
  const sourced = SOURCED_FLASHCARD_PAIRS[spanish];
  if (!sourced) throw new Error(`Missing sourced example for flashcard verb "${spanish}"`);
  const rank = index + 1;
  return {
    rank,
    spanish,
    english,
    example: sourced.example,
    exampleEnglish: sourced.exampleEnglish,
    difficulty: difficultyForRank(rank),
  };
});
