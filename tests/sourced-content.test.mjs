import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { FLASHCARD_VERBS } from "../app/flashcards-data.ts";
import { QUIZ_CONFIG, QUIZ_IDS } from "../app/quiz-config.ts";
import { SENTENCE_BUILDER_ITEMS } from "../app/sentence-builder-data.ts";
import { SOURCED_FLASHCARD_PAIRS } from "../app/sourced-flashcard-content.ts";
import { SOURCED_QUIZ_PAIRS } from "../app/sourced-quiz-content.ts";

// Every registered quiz (issue #162); totals are computed, never typed in.
const quizzes = QUIZ_IDS.map((id) => QUIZ_CONFIG[id].questions);
const QUIZ_TOTAL = quizzes.flat().length;

test("every runtime quiz sentence and translation comes from the sourced pair set", () => {
  assert.equal(Object.keys(SOURCED_QUIZ_PAIRS).length, QUIZ_TOTAL);
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
  assert.equal(Object.keys(SOURCED_FLASHCARD_PAIRS).length, FLASHCARD_VERBS.length);
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
  assert.equal(lines.length, 1 + QUIZ_TOTAL + SENTENCE_BUILDER_ITEMS.length + FLASHCARD_VERBS.length);
  assert.match(lines[0], /^type,key,spanish,english,license,attribution,modified$/);
  assert.equal(
    lines.slice(1).filter((line) => line.includes("CC BY 2.0 France") || line.includes("CC BY 4.0")).length,
    QUIZ_TOTAL + SENTENCE_BUILDER_ITEMS.length + FLASHCARD_VERBS.length,
  );
  assert.equal(lines.some((line) => line.includes("Project content")), false);
});

test("every Sentence Builder Item is in the attribution manifest with its corpus attribution", async () => {
  const manifest = await readFile(new URL("../docs/content-attribution.csv", import.meta.url), "utf8");
  for (const item of SENTENCE_BUILDER_ITEMS) {
    const line = manifest.split("\n").find((row) => row.startsWith(`sentence-builder,${item.id},`));
    assert.ok(line, `#${item.id} missing from the manifest`);
    assert.ok(line.includes(item.attribution), `#${item.id} attribution`);
  }
});
