import assert from "node:assert/strict";
import test from "node:test";
import { ACTIVITY_IDS, currentStreak, dayKey, weekBars } from "../app/streak.ts";

const daysAgo = (today, count) => {
  const date = new Date(today);
  date.setDate(date.getDate() - count);
  return dayKey(date);
};

const fullDay = () => new Set(ACTIVITY_IDS);

test("currentStreak counts consecutive fully-completed days ending today", () => {
  const today = new Date("2026-08-25T12:00:00");
  const records = new Map([
    [daysAgo(today, 0), fullDay()],
    [daysAgo(today, 1), fullDay()],
    [daysAgo(today, 2), fullDay()],
  ]);
  assert.equal(currentStreak(records, today), 3);
});

test("currentStreak still counts yesterday's streak when today is not fully done yet", () => {
  const today = new Date("2026-08-25T08:00:00");
  const records = new Map([
    [daysAgo(today, 1), fullDay()],
    [daysAgo(today, 2), fullDay()],
  ]);
  assert.equal(currentStreak(records, today), 2);
});

test("currentStreak resets to zero after a gap", () => {
  const today = new Date("2026-08-25T12:00:00");
  const records = new Map([
    [daysAgo(today, 0), fullDay()],
    [daysAgo(today, 3), fullDay()],
  ]);
  assert.equal(currentStreak(records, today), 1);
});

test("a day with only some activities done does not count toward the streak", () => {
  const today = new Date("2026-08-25T12:00:00");
  const records = new Map([
    [daysAgo(today, 0), fullDay()],
    [daysAgo(today, 1), new Set(["gustar"])],
  ]);
  assert.equal(currentStreak(records, today), 1);
});

test("weekBars marks today distinctly and only marks fully-completed past days done", () => {
  // Tuesday.
  const today = new Date("2026-08-25T12:00:00");
  const records = new Map([[daysAgo(today, 1), fullDay()]]); // Monday: every activity done
  const week = weekBars(records, today);
  assert.equal(week.length, 7);
  assert.deepEqual(week.map((day) => day.letter), ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"]);
  assert.equal(week[0].status, "done"); // Monday
  assert.equal(week[1].status, "today"); // Tuesday
  assert.ok(week.slice(2).every((day) => day.status === "future"));
});

test("weekBars reports partial completion counts for today", () => {
  const today = new Date("2026-08-25T12:00:00");
  const records = new Map([[dayKey(today), new Set(["gustar", "flashcards"])]]);
  const week = weekBars(records, today);
  const todayBar = week.find((day) => day.status === "today");
  assert.equal(todayBar.doneCount, 2);
  assert.equal(todayBar.total, ACTIVITY_IDS.length);
});
