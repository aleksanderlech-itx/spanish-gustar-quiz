import type { Question } from "./quiz-data";
import type { QuizId } from "./quiz-config";

export type NotebookEntry = { rule: string; count: number; lastMissedAt: string };

const NOTEBOOK_KEY = "spanish-quiz-notebook-v1";

/** Short, stable label for the grammar point a missed question exercises. */
export const ruleLabelFor = (question: Question, quizId: QuizId): string => {
  if (quizId === "ser-estar") return "Ser vs estar";
  if (quizId === "preterite-imperfect") return question.tense === "preterite" ? "Preterite" : "Imperfect";
  return `Gustar pattern: ${question.infinitive}`;
};

const readNotebook = (): Record<string, NotebookEntry> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(NOTEBOOK_KEY);
    return raw ? (JSON.parse(raw) as Record<string, NotebookEntry>) : {};
  } catch {
    return {};
  }
};

const writeNotebook = (entries: Record<string, NotebookEntry>) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(NOTEBOOK_KEY, JSON.stringify(entries));
  } catch {
    // Storage can be unavailable (private mode, quota); the notebook just won't persist this session.
  }
};

/** Records one miss per rule, written at round submission. */
export const recordMistakes = (rules: string[]) => {
  if (!rules.length) return;
  const notebook = readNotebook();
  const now = new Date().toISOString();
  rules.forEach((rule) => {
    const existing = notebook[rule];
    notebook[rule] = { rule, count: (existing?.count ?? 0) + 1, lastMissedAt: now };
  });
  writeNotebook(notebook);
};

export const readNotebookEntries = (): NotebookEntry[] =>
  Object.values(readNotebook()).sort((a, b) => b.lastMissedAt.localeCompare(a.lastMissedAt));
