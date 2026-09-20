import type { QuizId } from "./quiz-config";

const COMPLETION_KEY = "spanish-quiz-completions-v1";
const REINSTATED_KEY = "spanish-quiz-reinstated-v1";

type Completions = Record<string, string>;
type Reinstated = Record<string, boolean>;

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

const readReinstated = (): Reinstated => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(REINSTATED_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : {};
    if (!parsed || typeof parsed !== "object") return {};
    const reinstated: Reinstated = {};
    for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (value === true) reinstated[id] = true;
    }
    return reinstated;
  } catch {
    return {};
  }
};

const writeReinstated = (reinstated: Reinstated) => {
  try {
    window.localStorage.setItem(REINSTATED_KEY, JSON.stringify(reinstated));
  } catch {
    // Storage can be unavailable (private mode, quota); the reinstate choice just won't persist this session.
  }
};

/** Whether the user has chosen, from settings, to show a finished topic on the main screen again. */
export const isQuizReinstated = (quizId: QuizId): boolean => !!readReinstated()[quizId];

export const setQuizReinstated = (quizId: QuizId, reinstated: boolean) => {
  if (typeof window === "undefined") return;
  const current = readReinstated();
  if (reinstated) current[quizId] = true;
  else delete current[quizId];
  writeReinstated(current);
};

/** Marks every sentence in a quiz as done today. Overwrites any earlier completion, which pushes the repeat date out.
 * A fresh completion also clears any earlier "show on main screen" choice, so the topic goes back through
 * settings again rather than staying pinned to the board it was just cleared off. */
export const markQuizCompleted = (quizId: QuizId, date = new Date()) => {
  if (typeof window === "undefined") return;
  const completions = readCompletions();
  completions[quizId] = date.toISOString();
  writeCompletions(completions);
  setQuizReinstated(quizId, false);
};

export const clearQuizCompletion = (quizId: QuizId) => {
  if (typeof window === "undefined") return;
  const completions = readCompletions();
  delete completions[quizId];
  writeCompletions(completions);
  setQuizReinstated(quizId, false);
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

/**
 * A finished topic drops off the main screen: it's done, and repeating it is the user's
 * call, not the app's default. It reappears on its own once a month has passed since
 * completion (the repeat check), or immediately if the user chose "show on main screen"
 * from settings.
 */
export const isQuizHiddenFromBoard = (quizId: QuizId): boolean => {
  const completedAt = readQuizCompletion(quizId);
  if (!completedAt) return false;
  if (isRepeatDue(completedAt)) return false;
  return !isQuizReinstated(quizId);
};
