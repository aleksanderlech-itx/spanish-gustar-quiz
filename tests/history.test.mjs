import assert from "node:assert/strict";
import test from "node:test";
import { computeRecentRounds, computeWeakAreas } from "../app/history.ts";

test("computeRecentRounds merges quizzes newest-first and caps to the limit", () => {
  const byQuiz = [
    { title: "Gustar", history: [
      { date: "2026-08-01T00:00:00.000Z", percent: 80, mode: "regular", score: 4, questionIds: [], answers: [], missedIds: [] },
      { date: "2026-08-10T00:00:00.000Z", percent: 60, mode: "regular", score: 3, questionIds: [], answers: [], missedIds: [] },
    ] },
    { title: "Ser vs Estar", history: [
      { date: "2026-08-05T00:00:00.000Z", percent: 100, mode: "regular", score: 5, questionIds: [], answers: [], missedIds: [] },
    ] },
  ];
  const result = computeRecentRounds(byQuiz);
  assert.deepEqual(result.map((r) => r.date), ["2026-08-10T00:00:00.000Z", "2026-08-05T00:00:00.000Z", "2026-08-01T00:00:00.000Z"]);
  assert.equal(result[0].quizTitle, "Gustar");
  assert.equal(result[1].quizTitle, "Ser vs Estar");
});

test("computeRecentRounds caps to the given limit", () => {
  const history = Array.from({ length: 20 }, (_, i) => ({
    date: new Date(2026, 0, i + 1).toISOString(), percent: 50, mode: "regular", score: 2, questionIds: [], answers: [], missedIds: [],
  }));
  const result = computeRecentRounds([{ title: "Gustar", history }], 5);
  assert.equal(result.length, 5);
});

const gustarQuestion = (overrides) => ({
  id: 1, before: "", after: "", group: "doler", answer: "", distractors: [], verbAnswer: "", objectPronoun: "me",
  explanation: "", translation: "", subjectNumber: "singular", isActivity: false, level: "basic", ...overrides,
});
const pairQuestion = (overrides) => ({
  id: 1, before: "", after: "", group: "ser / estar", answer: "", distractors: [""], explanation: "", translation: "", level: "basic", ...overrides,
});

test("computeWeakAreas records group, agreement, subject and pronoun for gustar, sorted by miss rate", () => {
  const questions = [gustarQuestion({ id: 1 }), gustarQuestion({ id: 2, group: "gustar" })];
  const history = [
    { date: "2026-08-01", percent: 0, mode: "regular", score: 0, questionIds: [1, 2], answers: ["", ""], missedIds: [1, 2] },
  ];
  const result = computeWeakAreas([{ quizId: "gustar", questions, history }]);
  const keys = result.map(([key]) => key);
  assert.ok(keys.includes("Verb: doler"));
  assert.ok(keys.includes("Agreement: singular"));
  assert.ok(keys.includes("Pronoun: me"));
  assert.ok(!keys.some((key) => key.startsWith("Tense:")), "Gustar sentences have no tense of their own");
});

test("computeWeakAreas skips Agreement/Subject/Pronoun outside Gustar, and records tense only where a quiz has one", () => {
  const history = [
    { date: "2026-08-01", percent: 0, mode: "regular", score: 0, questionIds: [1], answers: [""], missedIds: [1] },
  ];
  const keys = computeWeakAreas([{ quizId: "ser-estar", questions: [pairQuestion()], history }]).map(([key]) => key);
  assert.ok(keys.includes("Verb: ser / estar"));
  assert.ok(!keys.some((key) => /^(Agreement|Subject|Pronoun|Tense):/.test(key)));
  const preterite = computeWeakAreas([{ quizId: "preterite-imperfect", questions: [pairQuestion({ group: "tener", tense: "imperfect" })], history }]);
  assert.ok(preterite.some(([key]) => key === "Tense: imperfect"));
});

test("computeWeakAreas excludes review-mode rounds, only correct-recall/misses do not appear without a miss", () => {
  const questions = [gustarQuestion({ id: 1 })];
  const history = [
    { date: "2026-08-01", percent: 100, mode: "review", score: 1, questionIds: [1], answers: ["duele"], missedIds: [] },
  ];
  const result = computeWeakAreas([{ quizId: "gustar", questions, history }]);
  assert.equal(result.length, 0);
});
