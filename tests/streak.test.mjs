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
const { ACTIVITY_IDS, currentStreak, dayKey, weekBars, recordFlashcardDayReviewed, readFlashcardDaysReviewed, recordActivityToday, readStreakSummary, STREAK_COUNTER_KEY } = await import("../app/streak.ts");

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

test("weekBars doesn't count a practised exempt activity toward today's bar", () => {
  const today = new Date("2026-08-25T12:00:00");
  const exempt = ACTIVITY_IDS.find((id) => id !== "flashcards");
  // Fully completed yesterday, so it's exempt today; practising it again must not fill the bar.
  const completions = { [exempt]: new Date("2026-08-24T12:00:00").toISOString() };
  const done = ACTIVITY_IDS.filter((id) => id !== "flashcards");
  const records = new Map([[dayKey(today), new Set(done)]]);
  const todayBar = weekBars(records, today, completions).find((day) => day.status === "today");
  assert.ok(todayBar.doneCount < todayBar.total);
  assert.equal(todayBar.doneCount, todayBar.total - 1); // only flashcards is still missing
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

// --- Stored counter: +1 per completed day, reset if the next day isn't completed within 24h ---

const LEDGER_KEY = "spanish-quiz-streak-v2";
const at = (iso) => new Date(iso);
const hoursAfter = (date, hours) => new Date(date.getTime() + hours * 3600 * 1000);
const requiredOn = (date) => ACTIVITY_REGISTRY
  .filter((entry) => !entry.introducedOn || entry.introducedOn <= dayKey(date))
  .map((entry) => entry.id);
/** Finishes a round in every activity required that day; the last one completes the day at `date`. */
const completeDay = (date) => requiredOn(date).forEach((id) => recordActivityToday(id, date));
const freshStart = (count, lastCompletedAt) => {
  store.clear();
  store.set(STREAK_COUNTER_KEY, JSON.stringify({ count, lastCompletedAt: lastCompletedAt.toISOString(), lastCompletedDay: dayKey(lastCompletedAt) }));
};

test("completing a day within 24h of the last completed day adds one", () => {
  const monday = at("2026-10-05T22:00:00");
  freshStart(4, monday);
  completeDay(hoursAfter(monday, 20));
  assert.equal(readStreakSummary(hoursAfter(monday, 20)).streak, 5);
});

test("completing the next day more than 24h later resets, then counts that day as 1", () => {
  const monday = at("2026-10-05T22:00:00");
  freshStart(4, monday);
  const tuesday = hoursAfter(monday, 25.5); // Tue 23:30
  recordActivityToday(requiredOn(tuesday)[0], hoursAfter(monday, 23)); // a round inside the window doesn't save it
  completeDay(tuesday);
  assert.equal(readStreakSummary(tuesday).streak, 1);
});

test("the counter shows 0 as soon as 24h pass without a completed day, and a later round stores 0", () => {
  const monday = at("2026-10-05T22:00:00");
  freshStart(4, monday);
  recordActivityToday(requiredOn(monday)[0], hoursAfter(monday, 23)); // partial Tuesday
  assert.equal(readStreakSummary(hoursAfter(monday, 23.5)).streak, 4);
  assert.equal(readStreakSummary(hoursAfter(monday, 24.1)).streak, 0);
  recordActivityToday(requiredOn(monday)[0], hoursAfter(monday, 36)); // Wednesday round
  assert.equal(JSON.parse(store.get(STREAK_COUNTER_KEY)).count, 0);
});

test("finishing more rounds on an already completed day doesn't count it twice", () => {
  const monday = at("2026-10-05T22:00:00");
  freshStart(4, monday);
  const tuesday = hoursAfter(monday, 12);
  completeDay(tuesday);
  completeDay(hoursAfter(tuesday, 1));
  assert.equal(readStreakSummary(hoursAfter(tuesday, 1)).streak, 5);
});

test("a device without the counter seeds it once from the ledger streak, ending at 23:59:59", () => {
  store.clear();
  const today = at("2026-10-02T09:00:00"); // today not completed yet
  const ledger = {};
  for (let i = 1; i <= 9; i += 1) {
    const day = new Date(today);
    day.setDate(day.getDate() - i);
    ledger[dayKey(day)] = requiredOn(day);
  }
  store.set(LEDGER_KEY, JSON.stringify(ledger));
  assert.equal(readStreakSummary(today).streak, 9);
  const counter = JSON.parse(store.get(STREAK_COUNTER_KEY));
  assert.equal(counter.lastCompletedDay, "2026-10-01");
  assert.equal(new Date(counter.lastCompletedAt).getTime(), at("2026-10-01T23:59:59").getTime());
  // Completing today extends it to 10.
  completeDay(today);
  assert.equal(readStreakSummary(today).streak, 10);
});

test("the banked count isn't recomputed from the ledger, so a newly required activity can't lower it", () => {
  const monday = at("2026-10-05T22:00:00");
  freshStart(9, monday);
  store.set(LEDGER_KEY, JSON.stringify({})); // ledger shows nothing, as if every past day were now incomplete
  assert.equal(readStreakSummary(hoursAfter(monday, 2)).streak, 9);
});
