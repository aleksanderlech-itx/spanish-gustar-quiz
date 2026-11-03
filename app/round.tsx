"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { type Question } from "./quiz-data";
import { availableQuestions, clearRegularHistory, filterQuestions, getMissedIds, scoreRound, type QuizResult } from "./quiz-logic";
import { QUIZ_CONFIG, quizPath, type QuizId } from "./quiz-config";
import { recordActivityToday } from "./streak";
import { markQuizCompleted, readQuizCompletion, repeatDueDate } from "./quiz-completion";
import { readTopicSettings, type AnswerMode } from "./topic-settings";
import { readQuizFilters } from "./quiz-filters";
import { recordMistakes, ruleLabelFor } from "./notebook";
import Results from "./results";
import RoundQuestion from "./round-question";
import SiteHeader from "./site-header";
import { updateStoredProgress } from "./stored-progress";
import { appStorage } from "./storage";
import { answerChoicesFor, shuffle } from "./answer-choices";

type Result = QuizResult;

const presentOnlyHistory = (items: Result[], questions: Question[]) => items.flatMap((result) => {
  const currentIds = new Set(questions.map((question) => question.id));
  const kept = result.questionIds.map((id, index) => ({ id, index })).filter(({ id }) => currentIds.has(id));
  if (!kept.length) return [];
  const questionIds = kept.map(({ id }) => id);
  const answers = kept.map(({ index }) => result.answers[index] ?? "");
  const missedIds = result.missedIds.filter((id) => currentIds.has(id));
  const score = questionIds.length - missedIds.length;
  return [{ ...result, questionIds, answers, missedIds, score, percent: Math.round((score / questionIds.length) * 100), tense: "present" as const }];
});

export default function Round({ quizId, standalone = false }: { quizId: QuizId; standalone?: boolean }) {
  const quiz = QUIZ_CONFIG[quizId];
  const { questions, forms, storageKey } = quiz;

  const [hydrated, setHydrated] = useState(false);
  const [history, setHistory] = useState<Result[]>([]);
  const [round, setRound] = useState<Question[]>([]);
  const [choiceSets, setChoiceSets] = useState<Record<number, string[]>>({});
  const [mode, setMode] = useState<AnswerMode>("type");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<string | null>>([]);
  const [submitted, setSubmitted] = useState<boolean[]>([]);
  const [practiceMissed, setPracticeMissed] = useState(false);
  const [poolExhausted, setPoolExhausted] = useState(false);
  const [fullSetDone, setFullSetDone] = useState(false);
  const [finished, setFinished] = useState(false);
  const [lastResult, setLastResult] = useState<Result | null>(null);
  const [missedRules, setMissedRules] = useState<string[]>([]);

  const missedIds = useMemo(() => getMissedIds(history), [history]);

  const startRound = (missedOnly: boolean, sourceHistory: Result[]) => {
    const filteredQuestions = filterQuestions(questions, readQuizFilters(quiz.filterKey));
    let pool = availableQuestions(filteredQuestions, sourceHistory, missedOnly);
    if (missedOnly && pool.length === 0) {
      missedOnly = false;
      pool = availableQuestions(filteredQuestions, sourceHistory, false);
    }
    if (!missedOnly && pool.length === 0) {
      setFullSetDone(availableQuestions(questions, sourceHistory, false).length === 0);
      setPoolExhausted(true);
      return;
    }
    setPoolExhausted(false);
    setFinished(false);
    setPracticeMissed(missedOnly);
    const topicSettings = readTopicSettings(quizId);
    setMode(topicSettings.mode);
    const selected = shuffle(pool).slice(0, topicSettings.roundLength);
    setRound(selected);
    setChoiceSets(Object.fromEntries(selected.map((question) => [question.id, answerChoicesFor(question, forms)])));
    setAnswers(Array(selected.length).fill(null));
    setSubmitted(Array(selected.length).fill(false));
    setIndex(0);
  };

  const readStoredHistory = () => {
    const saved = appStorage.getItem(storageKey);
    return presentOnlyHistory(saved ? (JSON.parse(saved) as Result[]) : [], questions);
  };

  useEffect(() => {
    const initial = readStoredHistory();
    // Progress lives only in this device's localStorage, which isn't readable until the client mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistory(initial);
    startRound(false, initial);
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId, questions, storageKey]);

  const updateHistory = (update: (stored: Result[]) => Result[]) => {
    const next = updateStoredProgress(storageKey, readStoredHistory, update);
    setHistory(next);
    return next;
  };

  if (!hydrated) return <main className="loading">Preparing your quiz…</main>;

  if (poolExhausted && !fullSetDone) {
    return (
      <main className="app-shell">
        {standalone && <SiteHeader />}
        <section className="completion-card" aria-live="polite">
            <p className="eyebrow">Filtered sentences done</p>
            <h2>You&apos;ve answered every sentence that matches your filters.</h2>
            <p>
              Change the filters on the topic page to keep going. The topic counts as finished once every
              {" "}{quiz.title.replace(" Quiz", "")} sentence is done, so it stays in today&apos;s goal until then.
            </p>
            <div>
              {missedIds.length > 0 && <button type="button" className="secondary" onClick={() => startRound(true, history)}>Practise the misses</button>}
              <Link className="primary" href={quizPath(quizId)}>Back to topic</Link>
            </div>
        </section>
      </main>
    );
  }

  if (poolExhausted) {
    const completedAt = readQuizCompletion(quizId);
    const dueDate = completedAt ? repeatDueDate(completedAt) : null;
    const redoSet = () => {
      const resetHistory = updateHistory(clearRegularHistory);
      startRound(false, resetHistory);
    };
    return (
      <main className="app-shell">
        {standalone && <SiteHeader />}
        <section className="completion-card" aria-live="polite">
            <p className="eyebrow">Set completed</p>
            <h2>You&apos;ve completed every {quiz.title.replace(" Quiz", "")} sentence.</h2>
            <p>
              Your results are saved{completedAt ? ` (done ${new Date(completedAt).toLocaleDateString()})` : ""}.
              This topic isn&apos;t required for today&apos;s goal anymore
              {dueDate ? `. We'll suggest a repeat from ${dueDate.toLocaleDateString()}, but you can redo it any time.` : "."}
            </p>
            <div>
              {missedIds.length > 0 && <button type="button" className="primary" onClick={() => startRound(true, history)}>Practise the misses</button>}
              <button type="button" className="secondary" onClick={redoSet}>Redo the whole set</button>
              <Link className="secondary" href={quizPath(quizId)}>Back to topic</Link>
            </div>
        </section>
      </main>
    );
  }

  if (finished && lastResult) {
    return (
      <Results
        quizId={quizId}
        result={lastResult}
        missedRuleLabels={missedRules}
        hasMissedOverall={missedIds.length > 0}
        onPractiseMisses={() => startRound(true, history)}
        standalone={standalone}
      />
    );
  }

  const question = round[index];
  if (!question) return <main className="loading">Preparing your quiz…</main>;

  const choices = choiceSets[question.id] ?? answerChoicesFor(question, forms);
  const isSubmitted = submitted[index];
  const isLast = index === round.length - 1;

  const commit = (choice: string) => {
    if (isSubmitted) return;
    setAnswers((current) => current.map((value, i) => (i === index ? choice : value)));
    setSubmitted((current) => current.map((value, i) => (i === index ? true : value)));
  };

  const finishRound = (finalAnswers: Array<string | null>) => {
    const committed = round
      .map((q, i) => ({ q, a: finalAnswers[i] }))
      .filter((entry): entry is { q: Question; a: string } => entry.a !== null);
    if (committed.length === 0) {
      setMissedRules([]);
      setLastResult({ date: new Date().toISOString(), score: 0, percent: 0, questionIds: [], answers: [], missedIds: [], mode: practiceMissed ? "review" : "regular" });
      setFinished(true);
      return;
    }
    const { missedIds: missed, score, percent } = scoreRound(committed.map((c) => c.q), committed.map((c) => c.a));
    const missedSet = new Set(missed);
    const misses = committed.filter((c) => missedSet.has(c.q.id));
    const rules = misses.map((c) => ruleLabelFor(c.q, quizId));
    recordMistakes(quizId, misses.map((c) => ({ question: c.q, answer: c.a })));
    const result: Result = {
      date: new Date().toISOString(),
      score,
      percent,
      questionIds: committed.map((c) => c.q.id),
      answers: committed.map((c) => c.a),
      missedIds: missed,
      mode: practiceMissed ? "review" : "regular",
      tense: committed[0]?.q.tense,
    };
    const next = updateHistory((stored) => [...stored, result]);
    recordActivityToday(quizId);
    // Finished means every sentence in the full set, whatever the filters.
    const regularPoolExhausted = availableQuestions(questions, next, false).length === 0;
    // A regular round marks completion as soon as every sentence has been attempted once, misses
    // or not: that's the existing "you've completed every sentence" milestone. A review round
    // (practising misses) only reaches that milestone once it clears the last outstanding miss,
    // since the regular pool was already exhausted before the review round started.
    if (regularPoolExhausted && (!practiceMissed || getMissedIds(next).length === 0)) markQuizCompleted(quizId);
    setMissedRules(rules);
    setLastResult(result);
    setFinished(true);
  };

  const goNext = () => {
    if (isLast) {
      finishRound(answers);
      return;
    }
    setIndex((current) => current + 1);
  };

  const skip = () => {
    if (!isSubmitted) {
      setSubmitted((current) => current.map((value, i) => (i === index ? true : value)));
    }
    goNext();
  };

  return (
    <RoundQuestion
      quizId={quizId}
      standalone={standalone}
      question={question}
      index={index}
      stepKeys={round.map((q) => q.id)}
      mode={mode}
      choices={choices}
      picked={answers[index]}
      isSubmitted={isSubmitted}
      backHref={quizPath(quizId)}
      backLabel="Back to topic"
      eyebrow={quiz.eyebrow}
      onCommit={commit}
      onNext={goNext}
      onSkip={skip}
    />
  );
}
