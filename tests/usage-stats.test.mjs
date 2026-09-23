import assert from "node:assert/strict";
import test from "node:test";
import { formatUsageMarkdown, summarizeUsage } from "../scripts/usage-stats-lib.ts";

const now = new Date("2026-09-23T12:00:00.000Z");
const row = (updatedAt, history) => ({ payload: JSON.stringify({ version: 2, history, filters: {} }), updated_at: updatedAt });
const round = (date, questionIds, missedIds, mode = "regular") => ({
  date, questionIds, missedIds, mode, answers: questionIds.map(() => "secret answer"),
  score: questionIds.length - missedIds.length,
  percent: Math.round(((questionIds.length - missedIds.length) / questionIds.length) * 100),
});

const rows = [
  row("2026-09-22T10:00:00.000Z", [
    round("2026-09-20T10:00:00.000Z", [1, 2], [1]),
    round("2026-09-21T10:00:00.000Z", [1], [1], "review"),
  ]),
  row("2026-09-01T10:00:00.000Z", [round("2026-09-01T10:00:00.000Z", [2001, 2002], [])]),
  row("2026-06-01T10:00:00.000Z", [round("2026-06-01T10:00:00.000Z", [1, 4001], [1])]),
  { payload: "not json", updated_at: "2026-09-22T10:00:00.000Z" },
];

test("summarizeUsage counts users, activity windows and rounds", () => {
  const stats = summarizeUsage(rows, { now, minAttempts: 1 });
  assert.equal(stats.syncedUsers, 4);
  assert.equal(stats.activeUsers7d, 2);
  assert.equal(stats.activeUsers30d, 3);
  assert.equal(stats.rounds, 4);
  assert.equal(stats.reviewRounds, 1);
  assert.equal(stats.rounds30d, 3);
  assert.equal(stats.unreadableRows, 1);
});

test("summarizeUsage attributes rounds to quizzes by question id and skips review rounds for accuracy", () => {
  const stats = summarizeUsage(rows, { now, minAttempts: 1 });
  const gustar = stats.quizzes.find((quiz) => quiz.quizId === "gustar");
  const serEstar = stats.quizzes.find((quiz) => quiz.quizId === "ser-estar");
  assert.equal(gustar.users, 2);
  assert.equal(gustar.rounds, 3);
  assert.equal(gustar.reviewRounds, 1);
  // Question 4001 belongs to por vs para, so it is not counted as a gustar answer.
  assert.equal(gustar.answers, 3);
  assert.equal(gustar.misses, 2);
  assert.equal(gustar.mostMissed[0].id, 1);
  assert.equal(gustar.mostMissed[0].missRate, 100);
  assert.equal(serEstar.averagePercent, 100);
});

test("mostMissed respects the minimum attempts threshold", () => {
  const stats = summarizeUsage(rows, { now, minAttempts: 3 });
  assert.ok(stats.quizzes.every((quiz) => quiz.mostMissed.length === 0));
});

test("markdown output never includes typed answers", () => {
  const markdown = formatUsageMarkdown(summarizeUsage(rows, { now, minAttempts: 1 }));
  assert.match(markdown, /Synced users: 4/);
  assert.match(markdown, /## Most missed: Gustar Patterns Quiz/);
  assert.doesNotMatch(markdown, /secret answer/);
});
