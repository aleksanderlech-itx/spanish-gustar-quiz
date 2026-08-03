import assert from "node:assert/strict";
import test from "node:test";
import { availableQuestions, filterQuestions, getMissedIds, restartSelectedHistory, ruleForTense, scoreRound } from "../app/quiz-logic.ts";

const questions = [
  { id: 1, infinitive: "gustar", answer: "gusta", tense: "present", level: "basic" },
  { id: 2, infinitive: "gustar", answer: "gustaron", tense: "past", level: "intermediate" },
  { id: 3, infinitive: "doler", answer: "dolerán", tense: "future", level: "advanced" },
  { id: 4, infinitive: "gustar", answer: "gustó", tense: "past", level: "basic" },
];

const history = [{
  date: "2026-08-03T08:00:00.000Z", score: 1, percent: 50,
  questionIds: [1, 2], answers: ["gusta", "gustó"], missedIds: [2], mode: "regular", tense: "present",
}];

test("filters combine tense, level and verb without incompatible empty defaults", () => {
  assert.deepEqual(filterQuestions(questions, { tense: "past", level: "basic", verb: "gustar" }).map((q) => q.id), [4]);
  assert.deepEqual(filterQuestions(questions, { tense: "future", level: "advanced", verb: "doler" }).map((q) => q.id), [3]);
});

test("scores trimmed, case-insensitive answers and reports missed IDs", () => {
  assert.deepEqual(scoreRound(questions.slice(0, 2), [" GUSTA ", "gustaron"]), { missedIds: [], score: 2, percent: 100 });
  assert.deepEqual(scoreRound(questions.slice(0, 2), ["gustan", "gustaron"]), { missedIds: [1], score: 1, percent: 50 });
});

test("regular rounds avoid seen questions while review is limited to filtered missed questions", () => {
  assert.deepEqual(availableQuestions(questions, history, false).map((q) => q.id), [3, 4]);
  assert.deepEqual(availableQuestions(filterQuestions(questions, { tense: "past", level: "all", verb: "all" }), history, true).map((q) => q.id), [2]);
});

test("a later correct review removes an item from the missed list", () => {
  const reviewed = [...history, { date: "2026-08-03T08:05:00.000Z", score: 1, percent: 100, questionIds: [2], answers: ["gustaron"], missedIds: [], mode: "review", tense: "past" }];
  assert.deepEqual(getMissedIds(reviewed), []);
});

test("restarting a selected set preserves unrelated regular and all review history", () => {
  const extended = [...history, { date: "2026-08-03T09:00:00.000Z", score: 1, percent: 100, questionIds: [3], answers: ["dolerán"], missedIds: [], mode: "regular", tense: "future" }, { date: "2026-08-03T09:05:00.000Z", score: 0, percent: 0, questionIds: [2], answers: ["gustó"], missedIds: [2], mode: "review", tense: "past" }];
  const restarted = restartSelectedHistory(extended, new Set([2]));
  assert.deepEqual(restarted.map((item) => item.questionIds), [[1], [3], [2]]);
  assert.equal(restarted[0].percent, 100);
  assert.equal(restarted[2].mode, "review");
});

test("learning guidance changes with the selected tense", () => {
  assert.match(ruleForTense("past").singular, /gustó/);
  assert.match(ruleForTense("future").plural, /gustarán/);
  assert.match(ruleForTense("all").body, /present, completed past, or future/);
});
