import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

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

const install = ({ search = "", local = {} } = {}) => {
  const localStorage = makeStore(local);
  globalThis.window = { location: { search }, localStorage, sessionStorage: makeStore() };
  return localStorage;
};

install();
const {
  BACKUP_KEYS, SCHEMA_VERSION, SCHEMA_VERSION_KEY, FLASHCARD_LEGACY_KEY, FLASHCARD_PROGRESS_KEY, FLASHCARD_DIFFICULTY_KEY,
  applyBackup, buildBackup, parseBackup, readSnapshot, resetStoredData, upgradeSnapshot, upgradeStoredData,
} = await import("../app/stored-data.ts");
const { readNotebookEntries } = await import("../app/notebook.ts");
const { readTopicSettings } = await import("../app/topic-settings.ts");
const { readQuizCompletion } = await import("../app/quiz-completion.ts");
const { BOARD_KEY, readBoardState } = await import("../app/board-state.ts");
const { ACTIVITY_REGISTRY } = await import("../app/activity-registry.ts");
// The Activities that existed at schema 1: an old device or backup is upgraded to exactly these.
const ALL_IDS = ACTIVITY_REGISTRY.map((entry) => entry.id).filter((id) => id !== "sentence-builder");
const REINSTATED_KEY = "spanish-quiz-reinstated-v1";
/** The fixture after every step: the Board replaces the "show on main screen" choices (schema 2), and the
 * notebook stores rule keys instead of labels (schema 3, decision 0015). */
const upgradedFixture = () => {
  const rest = { ...FIXTURE };
  delete rest[REINSTATED_KEY];
  rest["spanish-quiz-notebook-v1"] = FIXTURE["spanish-quiz-notebook-v1"].replace('"rule":"Gustar pattern: encantar"', '"rule":"encantar"');
  return rest;
};
const { readStreakSummary } = await import("../app/streak.ts");

/** localStorage exactly as production wrote it in November 2026: schema 1, before any version key. */
const FIXTURE = JSON.parse(readFileSync(new URL("./fixtures/storage-2026-11.json", import.meta.url), "utf8")).storage;
const snapshotOf = (store) => Object.fromEntries([...store.map.entries()].filter(([key]) => key !== SCHEMA_VERSION_KEY));
/** A backup file in the format the site has always written: version 1 and parsed values. */
const backupFileFromFixture = () => {
  const file = { version: 1, exportedAt: "2026-11-20T10:00:00.000Z" };
  for (const [key, raw] of Object.entries(FIXTURE)) file[key] = key === FLASHCARD_DIFFICULTY_KEY ? raw : JSON.parse(raw);
  return JSON.stringify(file);
};

test("the fixture covers every key a backup carries that today's app writes", () => {
  const stored = new Set(Object.keys(FIXTURE));
  for (const { key } of BACKUP_KEYS) {
    if (key === BOARD_KEY) continue; // schema 2: not in a schema 1 device
    if (key.startsWith("sentence-builder-")) continue; // Sentence Builder came after schema 1 (decision 0013)
    if (/-quiz-progress-v1$|-quiz-filters-v1$|-topic-settings-v1$/.test(key)) continue;
    assert.ok(stored.has(key), `fixture is missing ${key}`);
  }
});

test("a backup file taken from production today restores and the app reads it back", () => {
  install();
  const parsed = parseBackup(backupFileFromFixture());
  assert.equal(parsed.ok, true);
  applyBackup(parsed.data);

  const { [BOARD_KEY]: board, ...rest } = snapshotOf(window.localStorage);
  assert.deepEqual(rest, upgradedFixture());
  // Finished Por vs para was shown on the main screen again, so the Board keeps every Activity.
  assert.deepEqual(JSON.parse(board), { onBoard: ALL_IDS, known: ALL_IDS, suggestion: null });
  assert.equal(window.localStorage.getItem(SCHEMA_VERSION_KEY), String(SCHEMA_VERSION));
  assert.equal(JSON.parse(window.localStorage.getItem("gustar-quiz-progress-v1")).length, 2);
  assert.deepEqual(readTopicSettings("gustar"), { roundLength: 10, mode: "choose" });
  assert.equal(readNotebookEntries().length, 1);
  assert.equal(readQuizCompletion("por-para"), "2026-11-02T12:00:00.000Z");
  assert.equal(readBoardState().onBoard.includes("por-para"), true);
  assert.equal(readStreakSummary(new Date("2026-11-20T09:00:00")).streak, 1);
});

test("export, reset, import restores every key exactly", () => {
  install({ local: FIXTURE });
  upgradeStoredData();
  const expected = snapshotOf(window.localStorage);
  const file = JSON.stringify(buildBackup(new Date("2026-11-21T10:00:00Z")));
  assert.equal(JSON.parse(file).version, SCHEMA_VERSION);
  resetStoredData();
  assert.deepEqual(readSnapshot(), {});
  const parsed = parseBackup(file);
  assert.equal(parsed.ok, true);
  applyBackup(parsed.data);
  assert.deepEqual(snapshotOf(window.localStorage), expected);
});

test("a file with one key in the wrong shape is rejected and changes nothing", () => {
  const store = install({ local: FIXTURE });
  const before = new Map(store.map);
  const file = JSON.parse(backupFileFromFixture());
  for (const [key, bad] of [
    ["gustar-quiz-progress-v1", { a: 1 }],
    ["spanish-quiz-streak-v2", { "2026-11-19": "gustar" }],
    ["spanish-quiz-streak-counter-v2", { count: "3" }],
    [FLASHCARD_DIFFICULTY_KEY, "impossible"],
  ]) {
    const result = parseBackup(JSON.stringify({ ...file, [key]: bad }));
    assert.deepEqual(result, { ok: false, reason: "invalid" }, key);
  }
  assert.deepEqual(store.map, before);
});

test("a file from a newer version is rejected as newer", () => {
  const file = JSON.parse(backupFileFromFixture());
  assert.deepEqual(parseBackup(JSON.stringify({ ...file, version: SCHEMA_VERSION + 1 })), { ok: false, reason: "newer" });
});

test("non-JSON, a non-object, and JSON with no recognised key are rejected", () => {
  assert.deepEqual(parseBackup("not json"), { ok: false, reason: "invalid" });
  assert.deepEqual(parseBackup("[1, 2]"), { ok: false, reason: "invalid" });
  assert.deepEqual(parseBackup(JSON.stringify({ version: 1, hello: "world" })), { ok: false, reason: "invalid" });
  assert.deepEqual(parseBackup(JSON.stringify({ version: "1", "spanish-flashcards-active-days-v1": [] })), { ok: false, reason: "invalid" });
});

test("restoring clears keys the backup does not contain, including legacy flashcard progress", () => {
  install({ local: { ...FIXTURE, [FLASHCARD_LEGACY_KEY]: JSON.stringify({ ser: { remembered: true } }) } });
  const parsed = parseBackup(JSON.stringify({ version: 1, "spanish-flashcards-active-days-v1": ["2026-10-01"] }));
  assert.equal(parsed.ok, true);
  applyBackup(parsed.data);
  assert.deepEqual(snapshotOf(window.localStorage), { "spanish-flashcards-active-days-v1": JSON.stringify(["2026-10-01"]) });
});

test("reset clears progress, settings, filters, flashcard difficulty and legacy flashcard progress", () => {
  const store = install({ local: { ...FIXTURE, [FLASHCARD_LEGACY_KEY]: "{}", "spanish-tutorial-dismissed": "1" } });
  resetStoredData();
  assert.deepEqual([...store.map.keys()].sort(), [SCHEMA_VERSION_KEY, "spanish-tutorial-dismissed"].sort());
  assert.equal(store.getItem(FLASHCARD_PROGRESS_KEY), null);
});

test("in test mode, restore and reset touch only test keys", () => {
  const store = install({ search: "?test=1", local: FIXTURE });
  const parsed = parseBackup(JSON.stringify({ version: 1, "spanish-flashcards-active-days-v1": ["2026-10-01"] }));
  applyBackup(parsed.data);
  resetStoredData();
  for (const [key, value] of Object.entries(FIXTURE)) assert.equal(store.getItem(key), value, key);
  assert.equal(store.getItem(SCHEMA_VERSION_KEY), null);
  assert.equal(store.getItem(`sq_test_${SCHEMA_VERSION_KEY}`), String(SCHEMA_VERSION));
});

test("page load upgrades a schema 1 device: the Board is what it showed, the reinstated key goes", () => {
  const store = install({ local: FIXTURE });
  upgradeStoredData();
  assert.equal(store.getItem(SCHEMA_VERSION_KEY), String(SCHEMA_VERSION));
  const { [BOARD_KEY]: board, ...rest } = snapshotOf(store);
  assert.deepEqual(rest, upgradedFixture());
  assert.deepEqual(JSON.parse(board).onBoard, ALL_IDS);
  // An Activity added after schema 1 is not put on the Board and stays New (Project rule 15).
  assert.equal(JSON.parse(board).onBoard.includes("sentence-builder"), false);
  assert.equal(JSON.parse(board).known.includes("sentence-builder"), false);
});

test("schema 1 to 2: a Finished quiz neither Repeat due nor shown again starts on the Shelf", () => {
  const recent = new Date(Date.now() - 3 * 86_400_000).toISOString();
  const old = new Date(Date.now() - 40 * 86_400_000).toISOString();
  const store = install({ local: {
    "gustar-quiz-progress-v1": FIXTURE["gustar-quiz-progress-v1"],
    "spanish-quiz-completions-v1": JSON.stringify({ gustar: recent, "ser-estar": old, "por-para": recent }),
    [REINSTATED_KEY]: JSON.stringify({ "por-para": true }),
  } });
  upgradeStoredData();
  const board = JSON.parse(store.getItem(BOARD_KEY));
  assert.equal(board.onBoard.includes("gustar"), false);
  assert.equal(board.onBoard.includes("ser-estar"), true);
  assert.equal(board.onBoard.includes("por-para"), true);
  assert.equal(board.onBoard.includes("flashcards"), true);
  assert.equal(store.getItem(REINSTATED_KEY), null);
});

test("schema 1 to 2: a device with no progress gets no Board, so its user sees the Selection screen", () => {
  const store = install({ local: { "spanish-flashcards-difficulty-v1": "easy" } });
  upgradeStoredData();
  assert.equal(store.getItem(BOARD_KEY), null);
  assert.equal(store.getItem(SCHEMA_VERSION_KEY), String(SCHEMA_VERSION));
});

test("page load leaves a device stamped with a newer version alone", () => {
  const store = install({ local: { ...FIXTURE, [SCHEMA_VERSION_KEY]: String(SCHEMA_VERSION + 1) } });
  upgradeStoredData();
  assert.equal(store.getItem(SCHEMA_VERSION_KEY), String(SCHEMA_VERSION + 1));
  assert.deepEqual(snapshotOf(store), FIXTURE);
});

test("upgrading from the current schema is a no-op, and a missing step is an error", () => {
  const data = { a: 1 };
  assert.equal(upgradeSnapshot(data, SCHEMA_VERSION), data);
  assert.throws(() => upgradeSnapshot(data, 0));
});

test("the flashcard key names match the ones flashcards.tsx writes", () => {
  const source = readFileSync(new URL("../app/flashcards.tsx", import.meta.url), "utf8");
  assert.match(source, new RegExp(`STORAGE_KEY = "${FLASHCARD_PROGRESS_KEY}"`));
  assert.match(source, new RegExp(`LEGACY_STORAGE_KEY = "${FLASHCARD_LEGACY_KEY}"`));
  assert.match(source, new RegExp(`DIFFICULTY_STORAGE_KEY = "${FLASHCARD_DIFFICULTY_KEY}"`));
});

test("the root layout runs the page-load upgrade", () => {
  const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
  assert.match(layout, /<StoredDataUpgrade \/>/);
  const component = readFileSync(new URL("../app/stored-data-upgrade.tsx", import.meta.url), "utf8");
  assert.match(component, /if \(typeof window !== "undefined"\) upgradeStoredData\(\);/);
});
