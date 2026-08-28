import assert from "node:assert/strict";
import test from "node:test";
import { ALL_QUESTIONS } from "../app/quiz-data.ts";
import { SER_ESTAR_QUESTIONS } from "../app/ser-estar-data.ts";
import { PRETERITE_IMPERFECT_QUESTIONS } from "../app/preterite-imperfect-data.ts";
import { FLASHCARD_VERBS } from "../app/flashcards-data.ts";

// Stage 6 of docs/issue-24-implementation-plan.md: a single, cross-cutting
// content-quality suite that checks every dataset against the same bar,
// rather than relying only on each dataset's own test file. The individual
// quiz-data.test.mjs / ser-estar-data.test.mjs / preterite-imperfect-data.test.mjs
// / flashcards.test.mjs files stay in place; this file is the one place that
// enumerates every bullet from the plan's Stage 6 checklist explicitly, and
// adds cross-dataset checks (id collisions across quizzes, duplicate
// prompt/answer content) that no single per-file test covers.

const QUIZZES = [
  { name: "Gustar-style verbs", questions: ALL_QUESTIONS },
  { name: "Ser vs Estar", questions: SER_ESTAR_QUESTIONS },
  { name: "Preterite vs Imperfect", questions: PRETERITE_IMPERFECT_QUESTIONS },
];

test("each quiz dataset contains exactly 150 questions", () => {
  for (const { name, questions } of QUIZZES) {
    assert.equal(questions.length, 150, `${name} should have exactly 150 questions, has ${questions.length}`);
  }
});

test("every quiz question has all required fields populated", () => {
  for (const { name, questions } of QUIZZES) {
    for (const question of questions) {
      assert.ok(question.before.length || question.after.length, `${name} #${question.id}: missing prompt text`);
      assert.ok(question.answer.trim(), `${name} #${question.id}: missing answer`);
      assert.ok(question.infinitive.trim(), `${name} #${question.id}: missing infinitive`);
      assert.ok(question.explanation.trim(), `${name} #${question.id}: missing explanation`);
      assert.ok(question.translations.en.trim(), `${name} #${question.id}: missing English translation`);
      assert.ok(question.objectPronoun.trim(), `${name} #${question.id}: missing objectPronoun/distractor`);
      assert.notEqual(question.answer, question.objectPronoun, `${name} #${question.id}: answer and distractor are identical`);
      assert.ok(["singular", "plural"].includes(question.subjectNumber), `${name} #${question.id}: invalid subjectNumber`);
      assert.ok(["present", "preterite", "imperfect"].includes(question.tense), `${name} #${question.id}: invalid tense`);
      assert.ok(["basic", "intermediate", "advanced"].includes(question.level), `${name} #${question.id}: invalid level`);
    }
  }
});

test("question IDs are unique within each quiz and never collide across quizzes", () => {
  const seenGlobally = new Map();
  for (const { name, questions } of QUIZZES) {
    const ids = new Set();
    for (const question of questions) {
      assert.ok(!ids.has(question.id), `${name}: duplicate id ${question.id} within the same quiz`);
      ids.add(question.id);
      const owner = seenGlobally.get(question.id);
      assert.ok(!owner, owner && `id ${question.id} is used by both ${owner} and ${name}`);
      seenGlobally.set(question.id, name);
    }
  }
});

test("no quiz repeats the identical prompt/answer combination", () => {
  for (const { name, questions } of QUIZZES) {
    const seen = new Map();
    for (const question of questions) {
      const key = `${question.before}|${question.after}|${question.answer}`.trim().toLocaleLowerCase("es");
      const prior = seen.get(key);
      assert.ok(!prior, prior && `${name}: question #${question.id} duplicates #${prior}`);
      seen.set(key, question.id);
    }
  }
});

test("flashcard corpus is complete: 500 verbs, each with real Spanish/English content", () => {
  assert.equal(FLASHCARD_VERBS.length, 500);
  assert.equal(new Set(FLASHCARD_VERBS.map((card) => card.spanish)).size, 500);
  for (const card of FLASHCARD_VERBS) {
    assert.ok(card.spanish.trim(), `flashcard #${card.rank}: missing Spanish verb`);
    assert.ok(card.english.trim(), `flashcard #${card.rank}: missing English gloss`);
    assert.ok(card.example.trim(), `${card.spanish}: missing Spanish example`);
    assert.ok(card.exampleEnglish.trim(), `${card.spanish}: missing English example translation`);
    assert.notEqual(card.example, card.exampleEnglish, `${card.spanish}: example and translation are identical`);
  }
});

test("no flashcard example is a leftover generic placeholder", () => {
  for (const card of FLASHCARD_VERBS) {
    const generic = [`Voy a ${card.spanish} hoy.`, `Voy a ${card.spanish} eso hoy.`, `Voy a ${card.spanish} temprano.`];
    assert.ok(!generic.includes(card.example), `${card.spanish} still uses a generic placeholder example`);
  }
});

test("no two flashcards share the identical example sentence", () => {
  const seen = new Map();
  for (const card of FLASHCARD_VERBS) {
    const key = card.example.trim().toLocaleLowerCase("es");
    const prior = seen.get(key);
    assert.ok(!prior, prior && `${card.spanish} and ${prior} share the identical example sentence`);
    seen.set(key, card.spanish);
  }
});
