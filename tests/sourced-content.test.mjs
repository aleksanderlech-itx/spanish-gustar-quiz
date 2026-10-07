import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { FLASHCARD_VERBS } from "../app/flashcards-data.ts";
import { OBJECT_PRONOUN_QUESTIONS } from "../app/object-pronouns-data.ts";
import { POR_PARA_QUESTIONS } from "../app/por-para-data.ts";
import { PRETERITE_IMPERFECT_QUESTIONS } from "../app/preterite-imperfect-data.ts";
import { ALL_QUESTIONS } from "../app/quiz-data.ts";
import { SABER_CONOCER_QUESTIONS } from "../app/saber-conocer-data.ts";
import { SER_ESTAR_QUESTIONS } from "../app/ser-estar-data.ts";
import { SOURCED_FLASHCARD_PAIRS } from "../app/sourced-flashcard-content.ts";
import { SOURCED_QUIZ_PAIRS } from "../app/sourced-quiz-content.ts";

const quizzes = [
  ALL_QUESTIONS,
  SER_ESTAR_QUESTIONS,
  PRETERITE_IMPERFECT_QUESTIONS,
  POR_PARA_QUESTIONS,
  OBJECT_PRONOUN_QUESTIONS,
  SABER_CONOCER_QUESTIONS,
];

test("every runtime quiz sentence and translation comes from the sourced pair set", () => {
  assert.equal(Object.keys(SOURCED_QUIZ_PAIRS).length, 900);
  for (const question of quizzes.flat()) {
    const pair = SOURCED_QUIZ_PAIRS[question.id];
    assert.ok(pair, `missing sourced pair for #${question.id}`);
    assert.equal(pair.spanish.slice(0, question.before.length), question.before, `prefix mismatch for #${question.id}`);
    const remainder = pair.spanish.slice(question.before.length).trimStart();
    assert.equal(
      remainder.slice(0, question.answer.length).toLocaleLowerCase("es"),
      question.answer.toLocaleLowerCase("es"),
      `answer mismatch for #${question.id}`,
    );
    assert.equal(question.after, remainder.slice(question.answer.length).trimStart(), `suffix mismatch for #${question.id}`);
    assert.equal(question.translations.en, pair.english);
  }
});

test("every runtime flashcard example comes from the sourced pair set without fallback templates", () => {
  assert.equal(Object.keys(SOURCED_FLASHCARD_PAIRS).length, 500);
  const frames = new Set();
  for (const card of FLASHCARD_VERBS) {
    const pair = SOURCED_FLASHCARD_PAIRS[card.spanish];
    assert.deepEqual(
      { example: card.example, exampleEnglish: card.exampleEnglish },
      pair,
      `sourced pair mismatch for ${card.spanish}`,
    );
    assert.doesNotMatch(card.example, /^Voy a .+ (hoy|eso hoy|temprano)\.$/);
    const frame = card.example.toLocaleLowerCase("es").replace(card.spanish.toLocaleLowerCase("es"), "<verb>");
    assert.equal(frames.has(frame), false, `repeated example frame for ${card.spanish}`);
    frames.add(frame);
  }
});

test("attribution manifest covers every sourced quiz and flashcard pair", async () => {
  const manifest = await readFile(new URL("../docs/content-attribution.csv", import.meta.url), "utf8");
  const lines = manifest.trimEnd().split("\n");
  assert.equal(lines.length, 1 + 900 + 500);
  assert.match(lines[0], /^type,key,spanish,english,license,attribution,modified$/);
  assert.equal(
    lines.slice(1).filter((line) => line.includes("CC BY 2.0 France") || line.includes("CC BY 4.0")).length,
    900 + 500,
  );
  assert.equal(lines.some((line) => line.includes("Project content")), false);
});
