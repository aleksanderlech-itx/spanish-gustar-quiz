import assert from "node:assert/strict";
import test from "node:test";

// A minimal localStorage stand-in for Node, since streak.ts is a plain browser
// module (no DOM test runner here).
const store = new Map();
globalThis.window = {
  localStorage: {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, value),
    clear: () => store.clear(),
  },
};

const { ACTIVITY_REGISTRY } = await import("../app/activity-registry.ts");
const { ACTIVITY_IDS, currentStreak, dayKey, weekBars, recordFlashcardDayReviewed, readFlashcardDaysReviewed } = await import("../app/streak.ts");

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
  const liveThen = ACTIVITY_REGISTRY.filter((entry) => !entry.introducedOn || entry.introducedOn <= dayKey(today));
  assert.equal(todayBar.total, liveThen.length);
});

test("a newly introduced activity is not required on days before it went live", () => {
  const added = ACTIVITY_REGISTRY.find((entry) => entry.introducedOn);
  assert.ok(added, "expected at least one activity with an introducedOn date");
  const launch = new Date(`${added.introducedOn}T08:00:00`);
  const before = (count) => daysAgo(launch, count);
  const withoutAdded = () => new Set(ACTIVITY_IDS.filter((id) => id !== added.id));
  // Nine full days before the launch, done with every activity that existed then.
  const records = new Map(Array.from({ length: 9 }, (_, i) => [before(i + 1), withoutAdded()]));
  for (const [, set] of records) {
    for (const entry of ACTIVITY_REGISTRY) if (entry.introducedOn && entry.introducedOn > added.introducedOn) set.delete(entry.id);
  }
  assert.equal(currentStreak(records, launch, {}), 9);
  // On launch day it is required: a day done without it does not extend the streak.
  records.set(dayKey(launch), withoutAdded());
  assert.equal(currentStreak(records, launch, {}), 9);
  records.get(dayKey(launch)).add(added.id);
  assert.equal(currentStreak(records, launch, {}), 10);
});

test("recordFlashcardDayReviewed/readFlashcardDaysReviewed keep every distinct day, not just the most recent", () => {
  store.clear();
  recordFlashcardDayReviewed("2026-09-11");
  recordFlashcardDayReviewed("2026-09-12");
  recordFlashcardDayReviewed("2026-09-12"); // Re-reviewing a card the same day must not duplicate the entry.
  recordFlashcardDayReviewed("2026-09-13");
  assert.deepEqual(readFlashcardDaysReviewed(), ["2026-09-11", "2026-09-12", "2026-09-13"]);
});
