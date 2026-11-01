import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

// A browser stand-in, so the real notebook, streak and storage modules run unchanged.
const makeStore = (initial = {}) => {
  const map = new Map(Object.entries(initial));
  return {
    map,
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    key: (index) => [...map.keys()][index] ?? null,
    get length() {
      return map.size;
    },
  };
};
const install = (local = {}, search = "") => {
  const localStorage = makeStore(local);
  globalThis.window = { location: { search }, localStorage, sessionStorage: makeStore() };
  return localStorage;
};

const { QUIZ_CONFIG } = await import("../app/quiz-config.ts");
const { NOTEBOOK_KEY, readNotebookEntries, recordRetry, dismissEntry } = await import("../app/notebook.ts");
const { buildRetrySession } = await import("../app/notebook-retry.ts");
const { readStreakSummary, STREAK_STORAGE_KEYS } = await import("../app/streak.ts");
const { TEST_KEY_PREFIX } = await import("../app/storage.ts");

const NOW = new Date("2026-10-16T12:00:00");
const gustar = QUIZ_CONFIG.gustar.questions;

/** Every kind of progress a retry must not reach: quiz history (daily goal, due, accuracy, weekly recap,
 * recent rounds, completion), the streak ledger and counter, completion, flashcards and settings. */
const SEED = {
  "gustar-quiz-progress-v1": JSON.stringify([{ date: "2026-10-16T08:00:00.000Z", score: 3, percent: 60, questionIds: [1, 2, 3, 4, 5], answers: ["a", "b", "c", "d", "e"], missedIds: [1, 2], mode: "regular" }]),
  "ser-estar-quiz-progress-v1": JSON.stringify([{ date: "2026-10-15T08:00:00.000Z", score: 5, percent: 100, questionIds: [2001], answers: ["es"], missedIds: [], mode: "regular" }]),
  "spanish-quiz-streak-v2": JSON.stringify({ "2026-10-15": ["gustar"], "2026-10-16": ["gustar"] }),
  "spanish-quiz-streak-counter-v2": JSON.stringify({ count: 22, lastCompletedDay: "2026-10-15" }),
  "spanish-quiz-completed-days-v1": JSON.stringify({ "2026-10-15": ["gustar"] }),
  "spanish-flashcards-active-days-v1": JSON.stringify(["2026-10-15"]),
  "spanish-flashcards-leitner-v2": JSON.stringify({ ser: { box: 2, updatedAt: "2026-10-15T08:00:00.000Z", nextReviewAt: "2026-10-16T08:00:00.000Z" } }),
  "spanish-quiz-completions-v1": JSON.stringify({ "por-para": "2026-10-01T08:00:00.000Z" }),
  "gustar-topic-settings-v1": JSON.stringify({ roundLength: 5, mode: "choose" }),
  [NOTEBOOK_KEY]: JSON.stringify({
    version: 2,
    entries: {
      "q:gustar:1": { id: "q:gustar:1", kind: "question", quizId: "gustar", rule: "Gustar pattern: gustar", questionId: 1, wrongAnswer: "me gustan", missCount: 1, lastMissedAt: "2026-10-16T08:00:00.000Z", retryCount: 0, retryCorrectCount: 0 },
      "q:gustar:2": { id: "q:gustar:2", kind: "question", quizId: "gustar", rule: "Gustar pattern: gustar", questionId: 2, wrongAnswer: "me gusta", missCount: 1, lastMissedAt: "2026-10-16T08:00:00.000Z", retryCount: 0, retryCorrectCount: 0 },
      "rule:Gustar pattern: doler": { id: "rule:Gustar pattern: doler", kind: "rule", quizId: "gustar", rule: "Gustar pattern: doler", missCount: 3, lastMissedAt: "2026-10-01T08:00:00.000Z", retryCount: 0, retryCorrectCount: 0 },
    },
  }),
};

/** What MistakesActivity does: build a session, answer every item (right and wrong), dismiss one entry. */
const runRetrySession = () => {
  const session = buildRetrySession("gustar", readNotebookEntries(), gustar, 5);
  assert.equal(session.length, 5);
  session.forEach((item, i) => recordRetry(item.entryId, i % 2 === 0, NOW));
  dismissEntry("q:gustar:2");
};

const withoutNotebook = (store) => Object.fromEntries([...store.map].filter(([key]) => !key.endsWith(NOTEBOOK_KEY)));

test("a retry session leaves every progress key byte for byte unchanged and writes only the notebook", () => {
  const storage = install(SEED);
  const before = withoutNotebook(storage);
  const streakBefore = readStreakSummary(NOW);
  runRetrySession();
  assert.deepEqual(withoutNotebook(storage), before);
  assert.deepEqual(readStreakSummary(NOW), streakBefore, "streak, today's goal and week bars are unchanged");
  assert.ok(STREAK_STORAGE_KEYS.every((key) => storage.getItem(key) === SEED[key] || (!SEED[key] && storage.getItem(key) === null)));
  assert.notEqual(storage.getItem(NOTEBOOK_KEY), SEED[NOTEBOOK_KEY], "the notebook did record the retries");
});

test("retries update only the retry counts, and a correct retry never removes an entry", () => {
  install(SEED);
  runRetrySession();
  const entries = readNotebookEntries();
  assert.deepEqual(entries.map((entry) => entry.id).sort(), ["q:gustar:1", "rule:Gustar pattern: doler"]);
  const total = entries.reduce((sum, entry) => sum + entry.retryCount, 0);
  assert.ok(total >= 4, "every answer was counted on an entry still in the notebook (one was dismissed)");
  entries.forEach((entry) => assert.equal(entry.missCount, entry.kind === "rule" ? 3 : 1, "a retry is never a new miss"));
});

test("a retry session in test mode writes only test keys", () => {
  const testSeed = Object.fromEntries(Object.entries(SEED).map(([key, value]) => [`${TEST_KEY_PREFIX}${key}`, value]));
  const storage = install({ ...SEED, ...testSeed }, "?test=1");
  const real = Object.fromEntries([...storage.map].filter(([key]) => !key.startsWith(TEST_KEY_PREFIX)));
  runRetrySession();
  assert.deepEqual(Object.fromEntries([...storage.map].filter(([key]) => !key.startsWith(TEST_KEY_PREFIX))), real);
  assert.notEqual(storage.getItem(`${TEST_KEY_PREFIX}${NOTEBOOK_KEY}`), SEED[NOTEBOOK_KEY]);
});

test("the retry code never imports or calls daily goal, streak, history, completion or due queue writers", () => {
  const forbidden = /recordActivityToday|mergeActivityDays|updateStoredProgress|markQuizCompleted|clearQuizCompletion|recordFlashcardDayReviewed|recordMistakes|from "\.\/(streak|stored-progress|quiz-completion|quiz-progress|history|flashcards|round|results)(\.ts)?"/;
  ["mistakes-activity.tsx", "notebook-retry.ts", "round-question.tsx", "answer-choices.ts"].forEach((name) => {
    const source = readFileSync(new URL(`../app/${name}`, import.meta.url), "utf8");
    assert.doesNotMatch(source, forbidden, name);
  });
});

test("temporary mistakes activities are not registered activities, so the streak never requires them", async () => {
  const { ACTIVITY_REGISTRY } = await import("../app/activity-registry.ts");
  assert.ok(ACTIVITY_REGISTRY.every((entry) => !String(entry.id).includes("mistake")));
  const selector = readFileSync(new URL("../app/quiz-selector.tsx", import.meta.url), "utf8");
  assert.match(selector, /setMistakeGroups\(readNotebookGroups\(\)\);/);
});
