import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync } from "node:fs";

// A browser stand-in with a URL, localStorage and sessionStorage, so the real modules run unchanged.
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

const install = ({ search = "", local = {}, session = {} } = {}) => {
  const localStorage = makeStore(local);
  const sessionStorage = makeStore(session);
  globalThis.window = { location: { search }, localStorage, sessionStorage };
  return { localStorage, sessionStorage };
};

const storage = await import("../app/storage.ts");
const { recordActivityToday } = await import("../app/streak.ts");
const { recordMistakes, readNotebookEntries } = await import("../app/notebook.ts");
const { markQuizCompleted, readQuizCompletion } = await import("../app/quiz-completion.ts");
const { readTopicSettings, writeTopicSettings } = await import("../app/topic-settings.ts");
const { updateStoredProgress } = await import("../app/stored-progress.ts");

const { TEST_KEY_PREFIX, TEST_MODE_FLAG_KEY } = storage;

const snapshot = (store, wantTest) =>
  Object.fromEntries([...store.map.entries()].filter(([key]) => key.startsWith(TEST_KEY_PREFIX) === wantTest));

/** One full session: a round saved, the streak and completion recorded, a mistake noted, settings changed. */
const runSession = () => {
  updateStoredProgress("gustar-quiz-progress-v1", () => [], (current) => [...current, { date: "2026-10-16T08:00:00.000Z", score: 4, percent: 80, questionIds: [1, 2, 3, 4, 5], answers: [], missedIds: [5], mode: "regular" }]);
  recordActivityToday("gustar", new Date("2026-10-16T08:00:00"));
  recordMistakes("ser-estar", [{ question: { id: 2001, infinitive: "ser / estar", tense: "present" }, answer: "está" }]);
  markQuizCompleted("gustar", new Date("2026-10-16T08:00:00"));
  writeTopicSettings("gustar", { roundLength: 10, mode: "choose" });
};

const REAL_SEED = {
  "gustar-quiz-progress-v1": JSON.stringify([{ date: "2026-10-01T08:00:00.000Z", score: 5, percent: 100, questionIds: [9], answers: [], missedIds: [], mode: "regular" }]),
  "spanish-quiz-notebook-v1": JSON.stringify({ Imperfect: { rule: "Imperfect", count: 2, lastMissedAt: "2026-10-02T08:00:00.000Z" } }),
  "spanish-flashcards-leitner-v2": JSON.stringify({ ser: { box: 2, attempts: 1, correct: 1, updatedAt: "2026-10-03T08:00:00.000Z", nextReviewAt: "2026-10-04T08:00:00.000Z" } }),
  "spanish-quiz-theme": "dark",
};

test("normal mode writes only real keys and never a test key", () => {
  const { localStorage } = install();
  runSession();
  assert.ok(localStorage.map.size > 0);
  assert.deepEqual(snapshot(localStorage, true), {});
});

test("a full test session leaves every real key byte for byte unchanged", () => {
  const { localStorage } = install({ search: "?test=1", local: REAL_SEED });
  const before = snapshot(localStorage, false);
  runSession();
  assert.deepEqual(snapshot(localStorage, false), before);
  assert.ok(Object.keys(snapshot(localStorage, true)).length > 0, "the session wrote into the test namespace");
});

test("a real session leaves every test key unchanged", () => {
  const testSeed = { [`${TEST_KEY_PREFIX}spanish-quiz-notebook-v1`]: JSON.stringify({ Preterite: { rule: "Preterite", count: 1, lastMissedAt: "2026-10-05T08:00:00.000Z" } }) };
  const { localStorage } = install({ local: testSeed });
  const before = snapshot(localStorage, true);
  runSession();
  assert.deepEqual(snapshot(localStorage, true), before);
});

test("test progress is its own: streak, notebook and completion start empty in test mode", () => {
  install({ search: "?test=1", local: REAL_SEED });
  assert.deepEqual(readNotebookEntries(), []);
  assert.equal(readQuizCompletion("gustar"), null);
  runSession();
  assert.equal(readNotebookEntries().length, 1);
  assert.ok(readQuizCompletion("gustar"));
});

test("reset removes only test keys, not real keys or the tab flag", () => {
  const { localStorage, sessionStorage } = install({ search: "?test=1", local: REAL_SEED });
  storage.rememberTestModeForTab();
  runSession();
  const realBefore = snapshot(localStorage, false);
  storage.clearTestData();
  assert.deepEqual(snapshot(localStorage, true), {});
  assert.deepEqual(snapshot(localStorage, false), realBefore);
  assert.equal(sessionStorage.getItem(TEST_MODE_FLAG_KEY), "1");
});

test("exit clears the tab flag and nothing else", () => {
  const { localStorage, sessionStorage } = install({ search: "?test=1", local: REAL_SEED });
  storage.rememberTestModeForTab();
  runSession();
  const testBefore = snapshot(localStorage, true);
  storage.forgetTestModeForTab();
  assert.equal(sessionStorage.getItem(TEST_MODE_FLAG_KEY), null);
  assert.deepEqual(snapshot(localStorage, true), testBefore);
});

test("a new tab without the parameter is normal mode and reads real data; the parameter resumes the test session", () => {
  const { localStorage } = install({ search: "?test=1", local: REAL_SEED });
  runSession();
  const withTest = { ...Object.fromEntries(localStorage.map) };

  // New tab: no parameter, empty sessionStorage.
  install({ search: "", local: withTest });
  assert.equal(storage.isTestMode(), false);
  assert.equal(readNotebookEntries()[0].rule, "Imperfect");

  // Back with the parameter: same test session.
  install({ search: "?test=1", local: withTest });
  assert.equal(storage.isTestMode(), true);
  assert.equal(readNotebookEntries()[0].rule, "Ser vs estar");
});

test("within one tab, test mode survives navigation that drops the parameter", () => {
  install({ search: "?test=1" });
  assert.equal(storage.rememberTestModeForTab(), true);
  window.location.search = "";
  assert.equal(storage.isTestMode(), true);
  assert.ok(storage.storageKeyPrefix().startsWith(TEST_KEY_PREFIX));
});

test("blocked sessionStorage: the parameter alone keeps the mode, and the tab flag reports it was not kept", () => {
  install({ search: "?test=1" });
  window.sessionStorage = {
    getItem: () => {
      throw new Error("blocked");
    },
    setItem: () => {
      throw new Error("blocked");
    },
    removeItem: () => {
      throw new Error("blocked");
    },
  };
  assert.equal(storage.isTestMode(), true);
  assert.equal(storage.rememberTestModeForTab(), false);
  window.location.search = "";
  assert.equal(storage.isTestMode(), false);
});

test("test mode starts topics in choice mode; normal mode keeps typed answers; saved choices win", () => {
  install({ search: "?test=1" });
  assert.equal(readTopicSettings("gustar").mode, "choose");
  writeTopicSettings("gustar", { roundLength: 5, mode: "type" });
  assert.equal(readTopicSettings("gustar").mode, "type");

  install({});
  assert.equal(readTopicSettings("gustar").mode, "type");
});

test("every progress and settings read or write goes through the storage wrapper", () => {
  const allowed = new Set(["storage.ts", "use-theme.ts", "layout.tsx"]);
  const offenders = readdirSync(new URL("../app/", import.meta.url))
    .filter((name) => /\.(ts|tsx)$/.test(name) && !allowed.has(name))
    .filter((name) => /\b(window\.)?(localStorage|sessionStorage)\.(getItem|setItem|removeItem)\b/.test(readFileSync(new URL(`../app/${name}`, import.meta.url), "utf8")));
  assert.deepEqual(offenders, []);
});

test("highlight and prefill are gated on test mode and absent otherwise", () => {
  const round = readFileSync(new URL("../app/round-question.tsx", import.meta.url), "utf8");
  assert.match(round, /testMode && !isSubmitted && choice === question\.answer \? " round-option-test-hint" : ""/);
  assert.match(round, /setTyped\(isTestMode\(\) \? question\.answer : ""\)/);
  const flashcards = readFileSync(new URL("../app/flashcards.tsx", import.meta.url), "utf8");
  assert.match(flashcards, /data-test-hint=\{isTestMode\(\) \? "" : undefined\}/);
  const css = readFileSync(new URL("../app/test-mode.css", import.meta.url), "utf8");
  assert.match(css, /\.flashcard-known\[data-test-hint\] \{/);
});

test("the indicator chip is a fixed overlay that cannot shift the layout", () => {
  const css = readFileSync(new URL("../app/test-mode.css", import.meta.url), "utf8");
  const chip = css.match(/\.test-chip \{([^}]*)\}/)[1];
  const menu = css.match(/\.test-chip-menu \{([^}]*)\}/)[1];
  assert.match(chip, /position: fixed;/);
  assert.match(menu, /position: fixed;/);
  assert.match(chip, /left: 50%;/);
  assert.match(chip, /border-radius: calc\(var\(--radius\) \/ 2\);/);
  assert.doesNotMatch(chip, /\b(width|height|padding|margin)[^;]*(%|vw|vh)/);
  const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
  assert.match(layout, /<TestMode \/>/);
  const component = readFileSync(new URL("../app/test-mode.tsx", import.meta.url), "utf8");
  assert.match(component, /if \(!active\) return null;/);
});

test("analytics scripts are not loaded in test sessions", () => {
  const scripts = readFileSync(new URL("../app/analytics-scripts.tsx", import.meta.url), "utf8");
  assert.match(scripts, /setEnabled\(!isTestMode\(\)\)/);
  assert.match(scripts, /if \(!enabled\) return null;/);
  const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
  assert.match(layout, /\{isProduction && <AnalyticsScripts /);
});
