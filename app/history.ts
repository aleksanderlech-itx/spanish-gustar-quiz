import type { Question } from "./quiz-data";
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
 * Same categorization the old per-quiz page.tsx used, merged across quizzes. Verb and Tense vary
 * meaningfully for every quiz; Agreement/Subject/Pronoun only vary for gustar-pattern questions —
 * for ser/estar and preterite/imperfect those fields are constant (or repurposed to hold the
 * tense), so recording them there would produce misleading, always-100%-or-0% "insights".
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

  byQuiz.forEach(({ quizId, questions, history }) => {
    const regularHistory = history.filter((item) => item.mode !== "review");
    regularHistory.forEach((result) => result.questionIds.forEach((id) => {
      const question = questions.find((q) => q.id === id);
      if (!question) return;
      const missed = result.missedIds.includes(id);
      record(`Verb: ${question.infinitive}`, missed);
      record(`Tense: ${question.tense}`, missed);
      if (quizId === "gustar") {
        record(`Agreement: ${question.subjectNumber}`, missed);
        record(question.isActivity ? "Subject: infinitive activity" : "Subject: noun", missed);
        record(`Pronoun: ${question.indirectObject}`, missed);
      }
    }));
  });

  return [...totals]
    .filter(([, value]) => value.misses)
    .sort((a, b) => (b[1].misses / b[1].attempts) - (a[1].misses / a[1].attempts))
    .slice(0, limit);
};
