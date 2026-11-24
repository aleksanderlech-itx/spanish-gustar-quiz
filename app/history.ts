import { isGustarQuestion, type Question } from "./quiz-data.ts";
import type { QuizId } from "./quiz-config";
import type { QuizResult } from "./quiz-logic";

export type RecentRound = { quizTitle: string; date: string; percent: number; mode?: "regular" | "review" };

/** Merges every quiz's history into one newest-first list, capped so the drawer stays short. */
export const computeRecentRounds = (
  byQuiz: Array<{ title: string; history: QuizResult[] }>,
  limit = 15,
): RecentRound[] => {
  const merged = byQuiz.flatMap(({ title, history }) =>
    history.map((result) => ({ quizTitle: title, date: result.date, percent: result.percent, mode: result.mode })));
  return merged.sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
};

export type WeakArea = [string, { attempts: number; misses: number }];

/**
 * Weak areas merged across quizzes: every question's group, its tense where the quiz contrasts tenses,
 * and for Gustar patterns the agreement, the kind of subject and the pronoun (fields only Gustar has).
 */
export const computeWeakAreas = (
  byQuiz: Array<{ quizId: QuizId; questions: Question[]; history: QuizResult[] }>,
  limit = 6,
): WeakArea[] => {
  const totals = new Map<string, { attempts: number; misses: number }>();
  const record = (key: string, missed: boolean) => {
    const value = totals.get(key) ?? { attempts: 0, misses: 0 };
    value.attempts += 1;
    if (missed) value.misses += 1;
    totals.set(key, value);
  };

  byQuiz.forEach(({ questions, history }) => {
    const regularHistory = history.filter((item) => item.mode !== "review");
    regularHistory.forEach((result) => result.questionIds.forEach((id) => {
      const question = questions.find((q) => q.id === id);
      if (!question) return;
      const missed = result.missedIds.includes(id);
      record(`Verb: ${question.group}`, missed);
      if (question.tense) record(`Tense: ${question.tense}`, missed);
      if (isGustarQuestion(question)) {
        record(`Agreement: ${question.subjectNumber}`, missed);
        record(question.isActivity ? "Subject: infinitive activity" : "Subject: noun", missed);
        record(`Pronoun: ${question.objectPronoun}`, missed);
      }
    }));
  });

  return [...totals]
    .filter(([, value]) => value.misses)
    .sort((a, b) => (b[1].misses / b[1].attempts) - (a[1].misses / a[1].attempts))
    .slice(0, limit);
};
