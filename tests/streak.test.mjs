import assert from "node:assert/strict";
import test from "node:test";
import { currentStreak, dayKey, weekBars } from "../app/streak.ts";

const daysAgo = (today, count) => {
  const date = new Date(today);
  date.setDate(date.getDate() - count);
  return dayKey(date);
};

test("currentStreak counts consecutive practised days ending today", () => {
  const today = new Date("2026-08-25T12:00:00");
  const days = new Set([daysAgo(today, 0), daysAgo(today, 1), daysAgo(today, 2)]);
  assert.equal(currentStreak(days, today), 3);
});

test("currentStreak still counts yesterday's streak when today is not done yet", () => {
  const today = new Date("2026-08-25T08:00:00");
  const days = new Set([daysAgo(today, 1), daysAgo(today, 2)]);
  assert.equal(currentStreak(days, today), 2);
});

test("currentStreak resets to zero after a gap", () => {
  const today = new Date("2026-08-25T12:00:00");
  const days = new Set([daysAgo(today, 0), daysAgo(today, 3)]);
  assert.equal(currentStreak(days, today), 1);
});

test("weekBars marks today distinctly and only marks past days done", () => {
  // Tuesday.
  const today = new Date("2026-08-25T12:00:00");
  const days = new Set([daysAgo(today, 1)]); // Monday practised
  const week = weekBars(days, today);
  assert.equal(week.length, 7);
  assert.deepEqual(week.map((day) => day.letter), ["L", "M", "X", "J", "V", "S", "D"]);
  assert.equal(week[0].status, "done"); // Monday
  assert.equal(week[1].status, "today"); // Tuesday
  assert.ok(week.slice(2).every((day) => day.status === "future"));
});
