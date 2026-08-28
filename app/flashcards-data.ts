import { FLASHCARD_VERBS_PART_1 } from "./flashcards-verbs-part1.ts";
import { FLASHCARD_VERBS_PART_2 } from "./flashcards-verbs-part2.ts";
import { FLASHCARD_EXAMPLES } from "./flashcards-examples.ts";

export type FlashcardVerb = {
  rank: number;
  spanish: string;
  english: string;
  example: string;
  exampleEnglish: string;
};

export const FLASHCARD_VERBS_SOURCE = {
  corpus: "OpenSubtitles2016 Spanish frequency data via hermitdave/FrequencyWords",
  sourceUrl: "https://github.com/hermitdave/FrequencyWords/blob/master/content/2016/es/es_50k.txt",
  methodology:
    "Use the general Spanish frequency corpus as a ranking signal, then manually filter and normalize infinitive verbs. English glosses and examples are project-authored rather than copied from a ready-made verb list.",
  licenseNote: "FrequencyWords content is CC BY-SA 4.0; project-authored glosses and examples are original.",
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
  const authored = FLASHCARD_EXAMPLES[spanish];
  if (!authored) throw new Error(`Missing authored example for flashcard verb "${spanish}"`);
  return {
    rank: index + 1,
    spanish,
    english,
    example: authored.example,
    exampleEnglish: authored.exampleEnglish,
  };
});
