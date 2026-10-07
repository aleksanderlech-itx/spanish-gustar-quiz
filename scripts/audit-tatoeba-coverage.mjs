#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { ALL_QUESTIONS } from "../app/quiz-data.ts";
import { SER_ESTAR_QUESTIONS } from "../app/ser-estar-data.ts";
import { PRETERITE_IMPERFECT_QUESTIONS } from "../app/preterite-imperfect-data.ts";
import { POR_PARA_QUESTIONS } from "../app/por-para-data.ts";
import { OBJECT_PRONOUN_QUESTIONS } from "../app/object-pronouns-data.ts";
import { SABER_CONOCER_QUESTIONS } from "../app/saber-conocer-data.ts";
import { FLASHCARD_VERBS } from "../app/flashcards-data.ts";

const corpusPath = process.argv[2];
if (!corpusPath) {
  throw new Error("Usage: node --experimental-strip-types scripts/audit-tatoeba-coverage.mjs <spa.txt>");
}

const rows = (await readFile(resolve(corpusPath), "utf8"))
  .split("\n")
  .filter(Boolean)
  .map((line, index) => {
    const [english, spanish, attribution] = line.split("\t");
    if (!english || !spanish || !attribution) {
      throw new Error(`Malformed corpus row ${index + 1}`);
    }
    return { english, spanish, attribution };
  });

const quizzes = [
  ["gustar", ALL_QUESTIONS],
  ["ser-estar", SER_ESTAR_QUESTIONS],
  ["preterite-imperfect", PRETERITE_IMPERFECT_QUESTIONS],
  ["por-para", POR_PARA_QUESTIONS],
  ["object-pronouns", OBJECT_PRONOUN_QUESTIONS],
  ["saber-conocer", SABER_CONOCER_QUESTIONS],
];

const fold = (value) => value.normalize("NFC").toLocaleLowerCase("es");
const tokens = (value) => fold(value).match(/\p{L}+/gu) ?? [];
const requiredPhrases = new Map();
for (const [, questions] of quizzes) {
  for (const question of questions) requiredPhrases.set(tokens(question.answer).join(" "), 0);
}
for (const card of FLASHCARD_VERBS) requiredPhrases.set(tokens(card.spanish).join(" "), 0);

const phraseLengths = [...new Set([...requiredPhrases].map(([phrase]) => phrase.split(" ").length))];
for (const row of rows) {
  const rowTokens = tokens(row.spanish);
  const found = new Set();
  for (const length of phraseLengths) {
    for (let index = 0; index <= rowTokens.length - length; index += 1) {
      const phrase = rowTokens.slice(index, index + length).join(" ");
      if (requiredPhrases.has(phrase)) found.add(phrase);
    }
  }
  for (const phrase of found) requiredPhrases.set(phrase, requiredPhrases.get(phrase) + 1);
}

const candidateCount = (phrase) => requiredPhrases.get(tokens(phrase).join(" ")) ?? 0;

for (const [name, questions] of quizzes) {
  const uncovered = questions
    .map((question) => ({ id: question.id, answer: question.answer, candidates: candidateCount(question.answer) }))
    .filter((item) => item.candidates === 0);
  console.log(`${name}: ${questions.length - uncovered.length}/${questions.length} questions have a direct corpus match`);
  if (uncovered.length) console.log(`  missing: ${uncovered.map((item) => `#${item.id} ${item.answer}`).join(", ")}`);
  const demand = new Map();
  for (const question of questions) demand.set(question.answer, (demand.get(question.answer) ?? 0) + 1);
  const shortages = [...demand].map(([answer, needed]) => ({ answer, needed, available: candidateCount(answer) }))
    .filter((item) => item.available < item.needed);
  if (shortages.length) {
    console.log(`  unique-pair shortages: ${shortages.map((item) => `${item.answer} ${item.available}/${item.needed}`).join(", ")}`);
  }
}

const flashcardCoverage = FLASHCARD_VERBS.map((card) => ({
  verb: card.spanish,
  candidates: candidateCount(card.spanish),
}));
const missingFlashcards = flashcardCoverage.filter((item) => item.candidates === 0);
console.log(`flashcards: ${FLASHCARD_VERBS.length - missingFlashcards.length}/${FLASHCARD_VERBS.length} infinitives have a direct corpus match`);
if (missingFlashcards.length) console.log(`  missing: ${missingFlashcards.map((item) => item.verb).join(", ")}`);
