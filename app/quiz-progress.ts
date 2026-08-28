import { getMissedIds, type QuizResult } from "./quiz-logic";
import { QUIZ_CONFIG, type QuizId } from "./quiz-config";
import { readTopicSettings } from "./topic-settings";
import { dayKey } from "./streak";
import type { BoardTileProgress } from "./board";

export type QuizProgress = Omit<BoardTileProgress, "id">;

export const emptyQuizProgress = (total: number): QuizProgress => ({
  completed: 0, total, percent: 0, due: 0, mastered: 0, accuracy: 0, lastActivity: null,
});

/** Derives board/topic-detail progress from the grammar quiz's own stored history — no new storage shape. */
export const readQuizProgress = (quizId: QuizId): QuizProgress => {
  const quiz = QUIZ_CONFIG[quizId];
  const total = quiz.questions.length;
  if (typeof window === "undefined") return emptyQuizProgress(total);

  try {
    const raw = window.localStorage.getItem(quiz.storageKey);
    const history = raw ? (JSON.parse(raw) as QuizResult[]) : [];
    const regular = history.filter((item) => item.mode !== "review");
    const completed = new Set(regular.flatMap((item) => item.questionIds)).size;
    const due = getMissedIds(history).length;
    const mastered = Math.max(0, completed - due);
    const accuracy = regular.length ? Math.round(regular.reduce((sum, r) => sum + r.percent, 0) / regular.length) : 0;
    const lastActivity = history.length ? history[history.length - 1].date : null;

    return {
      completed,
      total,
      percent: total ? Math.min(100, Math.round((completed / total) * 100)) : 0,
      due,
      mastered,
      accuracy,
      lastActivity,
    };
  } catch {
    return emptyQuizProgress(total);
  }
};

export type DailyRoundProgress = { correct: number; roundLength: number; percent: number; done: boolean };

/**
 * The daily goal isn't measured against the whole question bank — it's the round you
 * chose (topic settings' round length) finished today. `percent` gauges accuracy within
 * that round (correct / round length); `done` is true once any regular round is finished
 * today, whatever the score, since finishing the round is what meets the goal.
 */
export const readDailyRoundProgress = (quizId: QuizId): DailyRoundProgress => {
  const roundLength = readTopicSettings(quizId).roundLength;
  const empty: DailyRoundProgress = { correct: 0, roundLength, percent: 0, done: false };
  if (typeof window === "undefined") return empty;

  try {
    const quiz = QUIZ_CONFIG[quizId];
    const raw = window.localStorage.getItem(quiz.storageKey);
    const history = raw ? (JSON.parse(raw) as QuizResult[]) : [];
    const today = dayKey(new Date());
    const todaysRounds = history.filter((item) => item.mode !== "review" && dayKey(new Date(item.date)) === today);
    if (!todaysRounds.length) return empty;

    const latest = todaysRounds[todaysRounds.length - 1];
    const latestRoundLength = latest.questionIds.length;
    return {
      correct: latest.score,
      roundLength: latestRoundLength,
      percent: latestRoundLength ? Math.round((latest.score / latestRoundLength) * 100) : 0,
      done: true,
    };
  } catch {
    return empty;
  }
};
