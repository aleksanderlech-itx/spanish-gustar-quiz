import type { Question } from "./quiz-data";
import { QUIZ_CONFIG, QUIZ_IDS, type QuizId } from "./quiz-config.ts";
import type { ProgressActivityId } from "./activity-registry.ts";
import { ownsSentenceBuilderRule, SENTENCE_BUILDER_ID } from "./sentence-builder-config.ts";
import { appStorage } from "./storage.ts";

/**
 * One mistake in the notebook. A `question` entry is one missed sentence. A `rule` entry is a
 * subtopic missed before the notebook tracked sentences (schema v1); it has no sentence of its own,
 * so a retry draws sentences from that subtopic instead.
 */
export type NotebookEntry = {
  id: string;
  kind: "question" | "rule";
  /** The Activity the entry belongs to (named quizId in stored data, so it never changes). */
  quizId: ProgressActivityId;
  /** Subtopic label, the same text as the notebook chips. */
  rule: string;
  questionId?: number;
  /** The most recent wrong answer given in a regular round. */
  wrongAnswer?: string;
  missCount: number;
  lastMissedAt: string;
  retryCount: number;
  retryCorrectCount: number;
  lastRetriedAt?: string;
};

type StoredNotebook = { version: typeof NOTEBOOK_VERSION; entries: Record<string, NotebookEntry> };

/** Same key as schema v1, so a backup made before the migration still restores into it. */
export const NOTEBOOK_KEY = "spanish-quiz-notebook-v1";
export const NOTEBOOK_VERSION = 2;
/** Oldest misses are dropped beyond this, so storage stays bounded. */
export const NOTEBOOK_CAP = 500;

/** Short, stable label for the grammar point a missed question exercises: declared by each quiz (issue #151). */
export const ruleLabelFor = (question: Question, quizId: QuizId): string => QUIZ_CONFIG[quizId].ruleLabel(question);

/** The activity a rule label belongs to: the inverse of ruleLabelFor, used to migrate v1 entries.
 * A label no quiz claims falls back to gustar, as v1 did. */
export const quizIdForRule = (rule: string): ProgressActivityId =>
  (ownsSentenceBuilderRule(rule) ? SENTENCE_BUILDER_ID : QUIZ_IDS.find((id) => QUIZ_CONFIG[id].ownsRule(rule))) ?? "gustar";

export const questionEntryId = (activityId: ProgressActivityId, questionId: number) => `q:${activityId}:${questionId}`;
const ruleEntryId = (rule: string) => `rule:${rule}`;

const count = (value: unknown) => (typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : 0);

/** v1 stored `{ [rule]: { rule, count, lastMissedAt } }`. Each becomes a rule entry with its count kept. */
const migrateV1 = (raw: Record<string, unknown>): Record<string, NotebookEntry> => {
  const entries: Record<string, NotebookEntry> = {};
  Object.entries(raw).forEach(([key, value]) => {
    const old = (value && typeof value === "object" ? value : {}) as { rule?: unknown; count?: unknown; lastMissedAt?: unknown };
    const rule = typeof old.rule === "string" && old.rule ? old.rule : key;
    const id = ruleEntryId(rule);
    entries[id] = {
      id,
      kind: "rule",
      quizId: quizIdForRule(rule),
      rule,
      missCount: Math.max(1, count(old.count)),
      lastMissedAt: typeof old.lastMissedAt === "string" ? old.lastMissedAt : new Date(0).toISOString(),
      retryCount: 0,
      retryCorrectCount: 0,
    };
  });
  return entries;
};

/** Parses whatever is stored (v2, v1 or a v1 backup restored over v2) into v2 entries. */
export const parseNotebook = (raw: string | null): Record<string, NotebookEntry> => {
  if (!raw) return {};
  const parsed = JSON.parse(raw) as unknown;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
  const stored = parsed as Partial<StoredNotebook>;
  if (stored.version === NOTEBOOK_VERSION && stored.entries && typeof stored.entries === "object") return stored.entries;
  return migrateV1(parsed as Record<string, unknown>);
};

const readNotebook = (): Record<string, NotebookEntry> => {
  if (typeof window === "undefined") return {};
  try {
    return parseNotebook(appStorage.getItem(NOTEBOOK_KEY));
  } catch {
    return {};
  }
};

/** Keeps the newest NOTEBOOK_CAP entries by last miss. */
const capped = (entries: Record<string, NotebookEntry>): Record<string, NotebookEntry> => {
  const list = Object.values(entries);
  if (list.length <= NOTEBOOK_CAP) return entries;
  const kept = list.sort((a, b) => b.lastMissedAt.localeCompare(a.lastMissedAt)).slice(0, NOTEBOOK_CAP);
  return Object.fromEntries(kept.map((entry) => [entry.id, entry]));
};

const writeNotebook = (entries: Record<string, NotebookEntry>) => {
  if (typeof window === "undefined") return;
  try {
    const stored: StoredNotebook = { version: NOTEBOOK_VERSION, entries: capped(entries) };
    appStorage.setItem(NOTEBOOK_KEY, JSON.stringify(stored));
  } catch {
    // Storage can be unavailable (private mode, quota); the notebook just won't persist this session.
  }
};

/** Read-modify-write, so a change starts from what is stored now. Never throws. */
const updateNotebook = (update: (entries: Record<string, NotebookEntry>) => void) => {
  const entries = readNotebook();
  update(entries);
  writeNotebook(entries);
};

export type Miss = { question: Question; answer: string };

/**
 * Records a regular round's misses, written at round submission. A sentence already in the
 * notebook is updated in place (one more miss, the latest wrong answer) rather than added twice.
 */
export const recordMistakes = (quizId: QuizId, misses: Miss[], now = new Date()) =>
  recordItemMistakes(quizId, misses.map(({ question, answer }) => ({ id: question.id, rule: ruleLabelFor(question, quizId), answer })), now);

/** One missed Item of any Activity with rounds: its id, its rule label and the wrong answer given. */
export type ItemMiss = { id: number; rule: string; answer: string };

export const recordItemMistakes = (activityId: ProgressActivityId, misses: ItemMiss[], now = new Date()) => {
  if (!misses.length) return;
  const at = now.toISOString();
  updateNotebook((notebook) => {
    misses.forEach(({ id: itemId, rule, answer }) => {
      const id = questionEntryId(activityId, itemId);
      const existing = notebook[id];
      notebook[id] = existing
        ? { ...existing, wrongAnswer: answer, missCount: existing.missCount + 1, lastMissedAt: at }
        : {
          id,
          kind: "question",
          quizId: activityId,
          rule,
          questionId: itemId,
          wrongAnswer: answer,
          missCount: 1,
          lastMissedAt: at,
          retryCount: 0,
          retryCorrectCount: 0,
        };
    });
  });
};

/** Every entry, most recent miss first. */
export const readNotebookEntries = (): NotebookEntry[] =>
  Object.values(readNotebook()).sort((a, b) => b.lastMissedAt.localeCompare(a.lastMissedAt));

/**
 * Records one retry answer on its entry. This is the only write a retry makes: it never touches
 * quiz history, the streak, the daily goal or any due count. A correct retry keeps the entry,
 * which leaves the notebook only when dismissed.
 */
export const recordRetry = (entryId: string, correct: boolean, now = new Date()) => {
  updateNotebook((notebook) => {
    const entry = notebook[entryId];
    if (!entry) return;
    notebook[entryId] = {
      ...entry,
      retryCount: entry.retryCount + 1,
      retryCorrectCount: entry.retryCorrectCount + (correct ? 1 : 0),
      lastRetriedAt: now.toISOString(),
    };
  });
};

/** Removes one entry. The only way an entry leaves the notebook. */
export const dismissEntry = (entryId: string) => {
  updateNotebook((notebook) => {
    delete notebook[entryId];
  });
};

export type NotebookGroup = { quizId: ProgressActivityId; entries: NotebookEntry[]; rules: string[] };

/** Entries grouped by activity, the group with the most recent miss first. Each group is one
 * temporary mistakes activity, shown only while it has entries. */
export const groupByActivity = (entries: NotebookEntry[]): NotebookGroup[] => {
  const groups = new Map<ProgressActivityId, NotebookEntry[]>();
  [...entries]
    .sort((a, b) => b.lastMissedAt.localeCompare(a.lastMissedAt))
    .forEach((entry) => groups.set(entry.quizId, [...(groups.get(entry.quizId) ?? []), entry]));
  return [...groups].map(([quizId, list]) => ({ quizId, entries: list, rules: [...new Set(list.map((entry) => entry.rule))] }));
};

export const readNotebookGroups = (): NotebookGroup[] => groupByActivity(readNotebookEntries());
