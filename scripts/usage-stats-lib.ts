import { QUIZ_CONFIG, QUIZ_IDS, type QuizId } from "../app/quiz-config.ts";
import type { QuizResult } from "../app/quiz-logic.ts";

/**
 * Broad, anonymous usage stats over the D1 `quiz_progress` table. Rows carry only
 * `payload` and `updated_at`: the email column is never selected, and typed answers
 * are never reported, so the output is safe to paste into a PR or a chat.
 *
 * A row has no quiz id of its own, so each round is attributed to a quiz by its
 * question ids (every quiz's ids are unique across the whole question bank).
 */
export type ProgressRow = { payload: string; updated_at: string };

type QuizStats = {
  quizId: QuizId;
  title: string;
  users: number;
  rounds: number;
  reviewRounds: number;
  answers: number;
  misses: number;
  averagePercent: number | null;
  mostMissed: Array<{ id: number; sentence: string; attempts: number; misses: number; missRate: number }>;
};

export type UsageStats = {
  generatedAt: string;
  syncedUsers: number;
  activeUsers7d: number;
  activeUsers30d: number;
  rounds: number;
  reviewRounds: number;
  rounds30d: number;
  unreadableRows: number;
  quizzes: QuizStats[];
};

const DAY_MS = 24 * 60 * 60 * 1000;

const QUIZ_BY_QUESTION_ID = new Map<number, QuizId>(
  QUIZ_IDS.flatMap((quizId) => QUIZ_CONFIG[quizId].questions.map((question) => [question.id, quizId] as const)),
);

const QUESTION_BY_ID = new Map(
  QUIZ_IDS.flatMap((quizId) => QUIZ_CONFIG[quizId].questions.map((question) => [question.id, question] as const)),
);

const quizForRound = (result: QuizResult): QuizId | null => {
  for (const id of result.questionIds) {
    const quizId = QUIZ_BY_QUESTION_ID.get(id);
    if (quizId) return quizId;
  }
  return null;
};

const readHistory = (row: ProgressRow): QuizResult[] | null => {
  try {
    const payload = JSON.parse(row.payload) as { history?: unknown };
    if (!Array.isArray(payload.history)) return null;
    return payload.history.filter((item): item is QuizResult =>
      !!item && typeof item === "object" && Array.isArray((item as QuizResult).questionIds)
      && Array.isArray((item as QuizResult).missedIds) && typeof (item as QuizResult).date === "string");
  } catch {
    return null;
  }
};

export const summarizeUsage = (
  rows: ProgressRow[],
  { now = new Date(), minAttempts = 3, mostMissedLimit = 5 } = {},
): UsageStats => {
  const since7d = now.getTime() - 7 * DAY_MS;
  const since30d = now.getTime() - 30 * DAY_MS;

  const perQuiz = new Map(QUIZ_IDS.map((quizId) => [quizId, {
    users: new Set<number>(),
    rounds: 0,
    reviewRounds: 0,
    percentSum: 0,
    regularRounds: 0,
    answers: 0,
    misses: 0,
    byQuestion: new Map<number, { attempts: number; misses: number }>(),
  }]));

  let activeUsers7d = 0;
  let activeUsers30d = 0;
  let rounds = 0;
  let reviewRounds = 0;
  let rounds30d = 0;
  let unreadableRows = 0;

  rows.forEach((row, userIndex) => {
    const updated = Date.parse(row.updated_at);
    if (updated >= since7d) activeUsers7d += 1;
    if (updated >= since30d) activeUsers30d += 1;

    const history = readHistory(row);
    if (!history) {
      unreadableRows += 1;
      return;
    }

    history.forEach((result) => {
      const quizId = quizForRound(result);
      if (!quizId) return;
      const stats = perQuiz.get(quizId)!;
      const review = result.mode === "review";

      rounds += 1;
      stats.rounds += 1;
      stats.users.add(userIndex);
      if (Date.parse(result.date) >= since30d) rounds30d += 1;
      if (review) {
        reviewRounds += 1;
        stats.reviewRounds += 1;
        return;
      }

      // Review rounds re-ask questions already missed, so only regular rounds count
      // towards accuracy, the same rule the drawer's weak areas follow.
      stats.regularRounds += 1;
      if (typeof result.percent === "number") stats.percentSum += result.percent;
      const missed = new Set(result.missedIds);
      result.questionIds.forEach((id) => {
        if (QUIZ_BY_QUESTION_ID.get(id) !== quizId) return;
        const entry = stats.byQuestion.get(id) ?? { attempts: 0, misses: 0 };
        entry.attempts += 1;
        stats.answers += 1;
        if (missed.has(id)) {
          entry.misses += 1;
          stats.misses += 1;
        }
        stats.byQuestion.set(id, entry);
      });
    });
  });

  const quizzes: QuizStats[] = QUIZ_IDS.map((quizId) => {
    const stats = perQuiz.get(quizId)!;
    const mostMissed = [...stats.byQuestion]
      .filter(([, value]) => value.misses && value.attempts >= minAttempts)
      .map(([id, value]) => {
        const question = QUESTION_BY_ID.get(id)!;
        return {
          id,
          sentence: `${question.before} ___${question.after}`.replace(/\s+/g, " ").trim(),
          attempts: value.attempts,
          misses: value.misses,
          missRate: Math.round((value.misses / value.attempts) * 100),
        };
      })
      .sort((a, b) => b.missRate - a.missRate || b.attempts - a.attempts)
      .slice(0, mostMissedLimit);

    return {
      quizId,
      title: QUIZ_CONFIG[quizId].title,
      users: stats.users.size,
      rounds: stats.rounds,
      reviewRounds: stats.reviewRounds,
      answers: stats.answers,
      misses: stats.misses,
      averagePercent: stats.regularRounds ? Math.round(stats.percentSum / stats.regularRounds) : null,
      mostMissed,
    };
  });

  return {
    generatedAt: now.toISOString(),
    syncedUsers: rows.length,
    activeUsers7d,
    activeUsers30d,
    rounds,
    reviewRounds,
    rounds30d,
    unreadableRows,
    quizzes,
  };
};

const percentOf = (part: number, whole: number) => (whole ? `${Math.round((part / whole) * 100)}%` : "n/a");

export const formatUsageMarkdown = (stats: UsageStats): string => {
  const lines = [
    `# Usage stats (${stats.generatedAt.slice(0, 10)})`,
    "",
    "Signed-in users with synced progress only; anonymous localStorage-only play is not included.",
    "",
    `- Synced users: ${stats.syncedUsers} (active in last 7 days: ${stats.activeUsers7d}, last 30 days: ${stats.activeUsers30d})`,
    `- Rounds: ${stats.rounds} (review: ${stats.reviewRounds}, last 30 days: ${stats.rounds30d})`,
  ];
  if (stats.unreadableRows) lines.push(`- Unreadable rows skipped: ${stats.unreadableRows}`);

  lines.push("", "## By quiz", "", "| Quiz | Users | Rounds | Review rounds | Avg score | Answers | Miss rate |", "| --- | --- | --- | --- | --- | --- | --- |");
  stats.quizzes.forEach((quiz) => {
    lines.push(`| ${quiz.title} | ${quiz.users} | ${quiz.rounds} | ${quiz.reviewRounds} | ${quiz.averagePercent === null ? "n/a" : `${quiz.averagePercent}%`} | ${quiz.answers} | ${percentOf(quiz.misses, quiz.answers)} |`);
  });

  stats.quizzes.filter((quiz) => quiz.mostMissed.length).forEach((quiz) => {
    lines.push("", `## Most missed: ${quiz.title}`, "");
    quiz.mostMissed.forEach((item) => {
      lines.push(`- #${item.id} ${item.sentence} (${item.misses}/${item.attempts} missed, ${item.missRate}%)`);
    });
  });

  return `${lines.join("\n")}\n`;
};
