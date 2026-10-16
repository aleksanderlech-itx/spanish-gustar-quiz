import type { Question } from "./quiz-data";
import type { QuizId } from "./quiz-config";
import { appStorage } from "./storage.ts";

/**
 * One mistake in the notebook. A `question` entry is one missed sentence. A `rule` entry is a
 * subtopic missed before the notebook tracked sentences (schema v1); it has no sentence of its own,
 * so a retry draws sentences from that subtopic instead.
 */
export type NotebookEntry = {
  id: string;
  kind: "question" | "rule";
  quizId: QuizId;
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

/** Short, stable label for the grammar point a missed question exercises. */
export const ruleLabelFor = (question: Question, quizId: QuizId): string => {
  if (quizId === "ser-estar") return "Ser vs estar";
  if (quizId === "por-para") return "Por vs para";
  if (quizId === "object-pronouns") return `Object pronouns: ${question.infinitive}`;
  if (quizId === "saber-conocer") return `Saber vs conocer: ${question.infinitive}`;
  if (quizId === "reflexive-verbs") return `Reflexive verbs: ${question.infinitive}`;
  if (quizId === "preterite-imperfect") return question.tense === "preterite" ? "Preterite" : "Imperfect";
  return `Gustar pattern: ${question.infinitive}`;
};

/** The activity a rule label belongs to: the inverse of ruleLabelFor, used to migrate v1 entries. */
export const quizIdForRule = (rule: string): QuizId => {
  if (rule === "Ser vs estar") return "ser-estar";
  if (rule === "Por vs para") return "por-para";
  if (rule.startsWith("Object pronouns:")) return "object-pronouns";
  if (rule.startsWith("Saber vs conocer:")) return "saber-conocer";
  if (rule.startsWith("Reflexive verbs:")) return "reflexive-verbs";
  if (rule === "Preterite" || rule === "Imperfect") return "preterite-imperfect";
  return "gustar";
};

export const questionEntryId = (quizId: QuizId, questionId: number) => `q:${quizId}:${questionId}`;
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
export const recordMistakes = (quizId: QuizId, misses: Miss[], now = new Date()) => {
  if (!misses.length) return;
  const at = now.toISOString();
  updateNotebook((notebook) => {
    misses.forEach(({ question, answer }) => {
      const id = questionEntryId(quizId, question.id);
      const existing = notebook[id];
      notebook[id] = existing
        ? { ...existing, wrongAnswer: answer, missCount: existing.missCount + 1, lastMissedAt: at }
        : {
          id,
          kind: "question",
          quizId,
          rule: ruleLabelFor(question, quizId),
          questionId: question.id,
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
