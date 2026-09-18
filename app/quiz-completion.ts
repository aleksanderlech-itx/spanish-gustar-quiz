import type { QuizId } from "./quiz-config";

const COMPLETION_KEY = "spanish-quiz-completions-v1";

type Completions = Record<string, string>;

const readCompletions = (): Completions => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(COMPLETION_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : {};
    if (!parsed || typeof parsed !== "object") return {};
    const completions: Completions = {};
    for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof value === "string") completions[id] = value;
    }
    return completions;
  } catch {
    return {};
  }
};

const writeCompletions = (completions: Completions) => {
  try {
    window.localStorage.setItem(COMPLETION_KEY, JSON.stringify(completions));
  } catch {
    // Storage can be unavailable (private mode, quota); the completion mark just won't persist this session.
  }
};

/** Marks every sentence in a quiz as done today. Overwrites any earlier completion, which pushes the repeat date out. */
export const markQuizCompleted = (quizId: QuizId, date = new Date()) => {
  if (typeof window === "undefined") return;
  const completions = readCompletions();
  completions[quizId] = date.toISOString();
  writeCompletions(completions);
};

export const clearQuizCompletion = (quizId: QuizId) => {
  if (typeof window === "undefined") return;
  const completions = readCompletions();
  delete completions[quizId];
  writeCompletions(completions);
};

/** ISO date the quiz was last fully completed, or null if it never has been (or was reset by a redo). */
export const readQuizCompletion = (quizId: QuizId): string | null => readCompletions()[quizId] ?? null;

export const readAllCompletions = (): Completions => readCompletions();

/** A finished quiz is suggested for a repeat one month after its completion date. */
export const repeatDueDate = (completedAt: string): Date => {
  const due = new Date(completedAt);
  due.setMonth(due.getMonth() + 1);
  return due;
};

export const isRepeatDue = (completedAt: string, now = new Date()): boolean => now >= repeatDueDate(completedAt);
