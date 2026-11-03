import type { Question } from "./quiz-data";
import { QUIZ_CONFIG, quizPath, type QuizId } from "./quiz-config.ts";
import { ruleLabelFor, type NotebookEntry } from "./notebook.ts";
import { subtopicExplanation } from "./subtopic-explanations.ts";

/** One question in a retry session and the notebook entry its answer is credited to. */
export type RetryItem = { question: Question; entryId: string };

const defaultShuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

/**
 * Picks up to `length` questions for one activity's retry session, optionally narrowed to one
 * subtopic. Missed sentences come first. Rule entries (from before the notebook tracked
 * sentences) fill the remaining slots with sentences from their subtopic, taking turns between
 * rules and never repeating a sentence already in the session.
 */
export const buildRetrySession = (
  quizId: QuizId,
  entries: NotebookEntry[],
  questions: Question[],
  length: number,
  rule: string | null = null,
  shuffle: <T>(items: T[]) => T[] = defaultShuffle,
): RetryItem[] => {
  const inScope = entries.filter((entry) => entry.quizId === quizId && (!rule || entry.rule === rule));
  const byId = new Map(questions.map((question) => [question.id, question]));

  const sentences: RetryItem[] = inScope
    .filter((entry) => entry.kind === "question" && entry.questionId !== undefined)
    .flatMap((entry) => {
      const question = byId.get(entry.questionId as number);
      return question ? [{ question, entryId: entry.id }] : [];
    });

  const session = shuffle(sentences).slice(0, length);
  const used = new Set(session.map((item) => item.question.id));
  const pools = shuffle(inScope.filter((entry) => entry.kind === "rule")).map((entry) => ({
    entryId: entry.id,
    pool: shuffle(questions.filter((question) => !used.has(question.id) && ruleLabelFor(question, quizId) === entry.rule)),
  }));

  while (session.length < length && pools.some((item) => item.pool.length)) {
    for (const item of pools) {
      if (session.length >= length) break;
      const question = item.pool.find((candidate) => !used.has(candidate.id));
      item.pool = item.pool.filter((candidate) => candidate !== question && !used.has(candidate.id));
      if (!question) continue;
      used.add(question.id);
      session.push({ question, entryId: item.entryId });
    }
  }
  return session;
};

export type RetryExplanation = { given: string | null; rule: string | null; sentence: string | null };

/**
 * What a wrong retry shows under the "Not quite" label (which already names the right answer): the answer
 * given, the subtopic rule filled from this sentence, and the sentence's own explanation. When one of the two
 * explanations already contains the other, only the longer one is kept, so nothing is said twice.
 */
export const retryExplanation = (quizId: QuizId, question: Question, answer: string): RetryExplanation => {
  const rule = subtopicExplanation(quizId, question).trim();
  const sentence = question.explanation.trim();
  const given = answer.trim();
  const covers = (longer: string, shorter: string) => longer.toLocaleLowerCase("en").includes(shorter.toLocaleLowerCase("en"));
  const sentenceCoversRule = !!sentence && covers(sentence, rule);
  return {
    given: given ? `You answered “${given}”.` : null,
    rule: sentenceCoversRule ? null : rule,
    sentence: !sentence || (!sentenceCoversRule && covers(rule, sentence)) ? null : sentence,
  };
};

/** URL of an activity's temporary mistakes activity, optionally opened on one subtopic. */
export const mistakesPath = (quizId: QuizId, rule?: string) =>
  `${quizPath(quizId)}?mistakes=1${rule ? `&rule=${encodeURIComponent(rule)}` : ""}`;

export const mistakesTitle = (quizId: QuizId) => `${QUIZ_CONFIG[quizId].title.replace(" Quiz", "")}: mistakes`;
