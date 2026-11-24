import { QUIZ_CONFIG, QUIZ_IDS } from "./quiz-config.ts";
import { STREAK_STORAGE_KEYS } from "./streak.ts";
import { QUIZ_COMPLETION_STORAGE_KEYS } from "./quiz-completion.ts";
import { NOTEBOOK_KEY } from "./notebook.ts";
import { topicSettingsKey } from "./topic-settings.ts";
import { appStorage } from "./storage.ts";
import { BOARD_KEY, boardFromSchema1, isBoardStateShape } from "./board-state.ts";
import { SENTENCE_BUILDER_FILTER_KEY, SENTENCE_BUILDER_ID, SENTENCE_BUILDER_STORAGE_KEY } from "./sentence-builder-config.ts";

/**
 * One schema version for everything the app keeps in browser storage, the shape check for every
 * key, and the one place old data is upgraded: on page load and when a backup is restored.
 * The rule for changing a stored shape is decision 0010 in `docs/decisions/`.
 */

/** The shapes the code reads today. Raise it by one, and add the step below, whenever a stored shape changes. */
export const SCHEMA_VERSION = 2;
/** Holds the schema version of what is stored on this device. Missing means schema 1. */
export const SCHEMA_VERSION_KEY = "spanish-quiz-schema-version";

/** Flashcard keys, owned by `app/flashcards.tsx` (a client component, so not imported here). */
export const FLASHCARD_PROGRESS_KEY = "spanish-flashcards-leitner-v2";
export const FLASHCARD_LEGACY_KEY = "spanish-flashcards-progress-v1";
export const FLASHCARD_DIFFICULTY_KEY = "spanish-flashcards-difficulty-v1";

const [STREAK_KEY, FLASHCARD_DAYS_KEY, COMPLETED_DAYS_KEY, STREAK_COUNTER_KEY] = STREAK_STORAGE_KEYS;
const [COMPLETION_KEY, REINSTATED_KEY] = QUIZ_COMPLETION_STORAGE_KEYS;

/** Stored data as plain values: parsed JSON for JSON keys, the raw string for text keys. */
export type StoreSnapshot = Record<string, unknown>;

/**
 * Upgrade steps. `STEPS[n]` turns schema n data into schema n + 1. Each step is a pure function of the
 * snapshot, so the same step upgrades a device on page load and a backup on restore.
 */
const STEPS: Record<number, (data: StoreSnapshot) => StoreSnapshot> = {
  /** 1 to 2: the user-chosen Board (decision 0008). An existing user's Board is what their board showed
   * that day; "show on main screen" choices fold into it and their key goes away. */
  1: (data) => {
    const rest = { ...data };
    delete rest[REINSTATED_KEY];
    if (rest[BOARD_KEY] !== undefined) return rest;
    const board = boardFromSchema1(data, new Date());
    return board ? { ...rest, [BOARD_KEY]: board } : rest;
  },
};

type Guard = (value: unknown) => boolean;
type KeySpec = { key: string; format: "json" | "text"; guard: Guard };

const isObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);
const isStringArray = (value: unknown) => Array.isArray(value) && value.every((item) => typeof item === "string");
const isNumberArray = (value: unknown) => Array.isArray(value) && value.every((item) => typeof item === "number");
const optional = (value: unknown, check: (value: unknown) => boolean) => value === undefined || check(value);
const objectOf = (check: (value: unknown) => boolean): Guard =>
  (value) => isObject(value) && Object.values(value).every(check);

/** A round as `readQuizProgress` and the board read it: a date and the sentences it covered. */
const isQuizResult = (value: unknown) => isObject(value)
  && typeof value.date === "string"
  && isNumberArray(value.questionIds)
  && optional(value.missedIds, isNumberArray)
  && optional(value.answers, isStringArray)
  && optional(value.score, (v) => typeof v === "number")
  && optional(value.percent, (v) => typeof v === "number");

const isCardRecord = (value: unknown) => isObject(value)
  && optional(value.box, (v) => typeof v === "number")
  && optional(value.updatedAt, (v) => typeof v === "string")
  && optional(value.nextReviewAt, (v) => typeof v === "string");

const GUARDS = {
  quizHistory: (value: unknown) => Array.isArray(value) && value.every(isQuizResult),
  flashcards: objectOf(isCardRecord),
  dayLists: objectOf(isStringArray),
  days: isStringArray,
  counter: (value: unknown) => isObject(value) && typeof value.count === "number"
    && optional(value.lastCompletedDay, (v) => v === null || typeof v === "string"),
  completions: objectOf((v) => typeof v === "string"),
  reinstated: objectOf((v) => typeof v === "boolean"),
  // v2 `{ version, entries }` or a v1 map of rule entries; `parseNotebook` reads both.
  notebook: (value: unknown) => isObject(value) && (isObject(value.entries) || Object.values(value).every(isObject)),
  settings: isObject,
  difficulty: (value: unknown) => value === "all" || value === "easy" || value === "medium" || value === "hard",
};


/** Every key a backup carries and a reset clears, with its shape check. */
export const BACKUP_KEYS: readonly KeySpec[] = [
  ...QUIZ_IDS.map((id): KeySpec => ({ key: QUIZ_CONFIG[id].storageKey, format: "json", guard: GUARDS.quizHistory })),
  ...QUIZ_IDS.map((id): KeySpec => ({ key: QUIZ_CONFIG[id].filterKey, format: "json", guard: GUARDS.settings })),
  ...QUIZ_IDS.map((id): KeySpec => ({ key: topicSettingsKey(id), format: "json", guard: GUARDS.settings })),
  { key: SENTENCE_BUILDER_STORAGE_KEY, format: "json", guard: GUARDS.quizHistory },
  { key: SENTENCE_BUILDER_FILTER_KEY, format: "json", guard: GUARDS.settings },
  { key: topicSettingsKey(SENTENCE_BUILDER_ID), format: "json", guard: GUARDS.settings },
  { key: FLASHCARD_PROGRESS_KEY, format: "json", guard: GUARDS.flashcards },
  { key: FLASHCARD_DIFFICULTY_KEY, format: "text", guard: GUARDS.difficulty },
  { key: STREAK_KEY, format: "json", guard: GUARDS.dayLists },
  { key: FLASHCARD_DAYS_KEY, format: "json", guard: GUARDS.days },
  { key: COMPLETED_DAYS_KEY, format: "json", guard: GUARDS.dayLists },
  { key: STREAK_COUNTER_KEY, format: "json", guard: GUARDS.counter },
  { key: COMPLETION_KEY, format: "json", guard: GUARDS.completions },
  // Schema 1 only: read from old backups so step 1 can fold it into the Board, never written again.
  { key: REINSTATED_KEY, format: "json", guard: GUARDS.reinstated },
  { key: BOARD_KEY, format: "json", guard: isBoardStateShape },
  { key: NOTEBOOK_KEY, format: "json", guard: GUARDS.notebook },
];

/** Cleared with the backup keys but never exported: the legacy flashcard key would otherwise be migrated back in. */
const CLEARED_ONLY_KEYS = [FLASHCARD_LEGACY_KEY];

/** Applies every step from `from` up to the current schema. */
export const upgradeSnapshot = (data: StoreSnapshot, from: number): StoreSnapshot => {
  let next = data;
  for (let version = from; version < SCHEMA_VERSION; version += 1) {
    const step = STEPS[version];
    if (!step) throw new Error(`No upgrade step from schema ${version}`);
    next = step(next);
  }
  return next;
};

const readValue = (spec: KeySpec): unknown => {
  const raw = appStorage.getItem(spec.key);
  if (raw === null) return undefined;
  if (spec.format === "text") return raw;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return undefined;
  }
};

const writeValue = (spec: KeySpec, value: unknown) => {
  if (value === undefined) appStorage.removeItem(spec.key);
  else appStorage.setItem(spec.key, spec.format === "text" ? String(value) : JSON.stringify(value));
};

/** Every backup key's stored value; keys with nothing stored (or unreadable JSON) are left out. */
export const readSnapshot = (): StoreSnapshot => {
  const data: StoreSnapshot = {};
  BACKUP_KEYS.forEach((spec) => {
    const value = readValue(spec);
    if (value !== undefined) data[spec.key] = value;
  });
  return data;
};

const readStoredVersion = (): number => {
  const raw = appStorage.getItem(SCHEMA_VERSION_KEY);
  const version = raw === null ? 1 : Number(raw);
  return Number.isInteger(version) && version >= 1 ? version : 1;
};

/**
 * Brings this device's stored data up to the current schema. Runs once per page load, before any
 * component reads storage. A device already current (or newer, after a rollback) is left alone.
 */
export const upgradeStoredData = () => {
  if (typeof window === "undefined") return;
  try {
    const stored = readStoredVersion();
    if (stored === SCHEMA_VERSION) {
      if (appStorage.getItem(SCHEMA_VERSION_KEY) === null) appStorage.setItem(SCHEMA_VERSION_KEY, String(SCHEMA_VERSION));
      return;
    }
    if (stored > SCHEMA_VERSION) return;
    const before = readSnapshot();
    const after = upgradeSnapshot(before, stored);
    BACKUP_KEYS.forEach((spec) => {
      if (after[spec.key] !== before[spec.key]) writeValue(spec, after[spec.key]);
    });
    appStorage.setItem(SCHEMA_VERSION_KEY, String(SCHEMA_VERSION));
  } catch {
    // Storage blocked or full; the readers fall back to their defaults and the upgrade runs next load.
  }
};

/** The backup file's contents: the schema version, the time, and every stored key. */
export const buildBackup = (now = new Date()): Record<string, unknown> =>
  ({ version: SCHEMA_VERSION, exportedAt: now.toISOString(), ...readSnapshot() });

export type ParsedBackup =
  | { ok: true; data: StoreSnapshot }
  | { ok: false; reason: "newer" | "invalid" };

/**
 * Checks a backup file without touching storage: a known version, at least one recognised key, and
 * every recognised key in the shape the code reads. The data comes back upgraded to the current schema.
 */
export const parseBackup = (text: string): ParsedBackup => {
  let file: unknown;
  try {
    file = JSON.parse(text);
  } catch {
    return { ok: false, reason: "invalid" };
  }
  if (!isObject(file)) return { ok: false, reason: "invalid" };
  // Backups made before the version was checked all say 1; a file without one is read as 1.
  const version = file.version === undefined ? 1 : file.version;
  if (typeof version !== "number" || !Number.isInteger(version) || version < 1) return { ok: false, reason: "invalid" };
  if (version > SCHEMA_VERSION) return { ok: false, reason: "newer" };

  const data: StoreSnapshot = {};
  for (const spec of BACKUP_KEYS) {
    if (file[spec.key] === undefined) continue;
    if (!spec.guard(file[spec.key])) return { ok: false, reason: "invalid" };
    data[spec.key] = file[spec.key];
  }
  if (!Object.keys(data).length) return { ok: false, reason: "invalid" };
  try {
    return { ok: true, data: upgradeSnapshot(data, version) };
  } catch {
    return { ok: false, reason: "invalid" };
  }
};

/** Replaces everything stored with a parsed backup: keys the backup lacks are cleared, not kept. */
export const applyBackup = (data: StoreSnapshot) => {
  CLEARED_ONLY_KEYS.forEach((key) => appStorage.removeItem(key));
  BACKUP_KEYS.forEach((spec) => writeValue(spec, data[spec.key]));
  appStorage.setItem(SCHEMA_VERSION_KEY, String(SCHEMA_VERSION));
};

/** Removes every progress and settings key. What remains is an empty store at the current schema. */
export const resetStoredData = () => {
  CLEARED_ONLY_KEYS.forEach((key) => appStorage.removeItem(key));
  BACKUP_KEYS.forEach((spec) => appStorage.removeItem(spec.key));
  appStorage.setItem(SCHEMA_VERSION_KEY, String(SCHEMA_VERSION));
};
