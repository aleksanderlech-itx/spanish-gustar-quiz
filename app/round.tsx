"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { type Question } from "./quiz-data";
import { OBJECT_PRONOUN_TYPES } from "./object-pronouns-data";
import { availableQuestions, clearRegularHistory, filterQuestions, getMissedIds, normalizeAnswer, scoreRound, type QuizResult } from "./quiz-logic";
import { DEFAULT_CHART_LABEL, QUIZ_CONFIG, quizPath, type QuizId } from "./quiz-config";
import { recordActivityToday } from "./streak";
import { markQuizCompleted, readQuizCompletion, repeatDueDate } from "./quiz-completion";
import { readTopicSettings, type AnswerMode } from "./topic-settings";
import { readQuizFilters } from "./quiz-filters";
import { recordMistakes, ruleLabelFor } from "./notebook";
import Results from "./results";
import VerbChart from "./verb-chart";
import { SkipLink } from "./activity-chrome";
import SiteHeader from "./site-header";
import HelpButton from "./help-modal";
import { updateStoredProgress } from "./stored-progress";

type Result = QuizResult;

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);
const PRONOUNS = ["me", "te", "le", "nos", "les"];
const ACCENTS = ["á", "é", "í", "ó", "ú", "ñ"];

const LEVEL_BADGE: Record<Question["level"], string> = {
  basic: "A1",
  intermediate: "A2",
  advanced: "B1",
};

/** Up to 3 options: the correct answer plus distractors drawn from the quiz's own verb forms/pronouns. */
const answerChoicesFor = (question: Question, forms: Record<string, [string, string]>) => {
  if (question.infinitive === "ser / estar" || question.infinitive === "por / para" || (OBJECT_PRONOUN_TYPES as readonly string[]).includes(question.infinitive) || question.tense === "preterite" || question.tense === "imperfect") {
    return shuffle([question.answer, question.objectPronoun].filter(Boolean));
  }
  const choices = new Set<string>([question.answer]);
  const verbForms = forms[question.infinitive] ?? [question.verbAnswer, question.verbAnswer];
  choices.add(`${question.objectPronoun} ${verbForms.find((form) => form !== question.verbAnswer) ?? question.verbAnswer}`);
  PRONOUNS.filter((pronoun) => pronoun !== question.objectPronoun).forEach((pronoun) => choices.add(`${pronoun} ${question.verbAnswer}`));
  return shuffle([...choices].slice(0, 3));
};

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
  const [typed, setTyped] = useState("");
  const [practiceMissed, setPracticeMissed] = useState(false);
  const [poolExhausted, setPoolExhausted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [lastResult, setLastResult] = useState<Result | null>(null);
  const [missedRules, setMissedRules] = useState<string[]>([]);
  const [showChart, setShowChart] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const missedIds = useMemo(() => getMissedIds(history), [history]);

  const startRound = (missedOnly: boolean, sourceHistory: Result[]) => {
    const filteredQuestions = filterQuestions(questions, readQuizFilters(quiz.filterKey));
    let pool = availableQuestions(filteredQuestions, sourceHistory, missedOnly);
    if (missedOnly && pool.length === 0) {
      missedOnly = false;
      pool = availableQuestions(filteredQuestions, sourceHistory, false);
    }
    if (!missedOnly && pool.length === 0) {
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

  useEffect(() => {
    // A fresh question always starts with an empty, focused input.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTyped("");
    if (mode === "type") window.requestAnimationFrame(() => inputRef.current?.focus());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, round]);

  useEffect(() => {
    // Fallback for iOS Safari, where 100dvh doesn't always react to the on-screen keyboard:
    // measure the gap between the layout and visual viewports and lift the footer above it.
    const viewport = window.visualViewport;
    if (!viewport) return;
    const updateKeyboardInset = () => {
      const inset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      document.documentElement.style.setProperty("--keyboard-inset", `${inset}px`);
    };
    updateKeyboardInset();
    viewport.addEventListener("resize", updateKeyboardInset);
    viewport.addEventListener("scroll", updateKeyboardInset);
    return () => {
      viewport.removeEventListener("resize", updateKeyboardInset);
      viewport.removeEventListener("scroll", updateKeyboardInset);
      document.documentElement.style.removeProperty("--keyboard-inset");
    };
  }, []);

  const readStoredHistory = () => {
    const saved = localStorage.getItem(storageKey);
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
              {dueDate ? ` — we'll suggest a repeat from ${dueDate.toLocaleDateString()}, but you can redo it any time.` : "."}
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
  const blankPlaceholder = question.blankHint ?? (quiz.showInfinitiveBlank === false ? "?" : question.infinitive);
  const chartLabel = quiz.chartLabel ?? DEFAULT_CHART_LABEL;
  const isSubmitted = submitted[index];
  const picked = answers[index];
  const isLast = index === round.length - 1;
  const isCorrect = picked !== null && normalizeAnswer(picked) === normalizeAnswer(question.answer);

  const commit = (choice: string) => {
    if (isSubmitted) return;
    setAnswers((current) => current.map((value, i) => (i === index ? choice : value)));
    setSubmitted((current) => current.map((value, i) => (i === index ? true : value)));
  };

  const commitTyped = () => {
    if (isSubmitted || !typed.trim()) return;
    setAnswers((current) => current.map((value, i) => (i === index ? typed : value)));
    setSubmitted((current) => current.map((value, i) => (i === index ? true : value)));
  };

  const insertAccent = (char: string) => {
    const el = inputRef.current;
    const start = el?.selectionStart ?? typed.length;
    const end = el?.selectionEnd ?? typed.length;
    const next = typed.slice(0, start) + char + typed.slice(end);
    setTyped(next);
    const caret = start + char.length;
    window.requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(caret, caret);
    });
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
    const rules = committed.filter((c) => missedSet.has(c.q.id)).map((c) => ruleLabelFor(c.q, quizId));
    recordMistakes(rules);
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
    const filteredQuestions = filterQuestions(questions, readQuizFilters(quiz.filterKey));
    const regularPoolExhausted = availableQuestions(filteredQuestions, next, false).length === 0;
    // A regular round marks completion as soon as every sentence has been attempted once, misses
    // or not — that's the existing "you've completed every sentence" milestone. A review round
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

  const optionState = (choice: string) => {
    if (!isSubmitted) return "unanswered";
    if (choice === question.answer) return "correct";
    if (choice === picked) return "wrong";
    return "other";
  };

  const primaryAction = mode === "type" && !isSubmitted ? commitTyped : goNext;
  const primaryDisabled = mode === "type" ? (!isSubmitted && !typed.trim()) : !isSubmitted;
  const primaryLabel = mode === "type" && !isSubmitted
    ? "Check"
    : !isSubmitted
      ? "Pick an answer"
      : isLast ? "See results" : "Next question";

  return (
    <>
      {standalone && <SkipLink targetId="round-question" label="Skip to the question" />}
      <main id={standalone ? "round-question" : undefined} className="round-shell">
      {standalone && <SiteHeader />}
      <header className="round-header">
        <Link className="round-back" href={quizPath(quizId)} aria-label="Back to topic"><span aria-hidden="true">←</span></Link>
        <div className="round-steps" role="progressbar" aria-valuemin={0} aria-valuemax={round.length} aria-valuenow={index} aria-label="Completed questions">
          {round.map((q, i) => (
            <span key={q.id} className={`round-step ${i < index ? "round-step-past" : ""} ${i === index ? "round-step-current" : ""}`} />
          ))}
        </div>
        <span className="round-counter">Question {index + 1} of {round.length}</span>
        <HelpButton topic="round" />
      </header>

      <section className="round-question-card">
        <div className="round-question-top">
          <p className="eyebrow-clay">{quiz.eyebrow}</p>
          <span className="round-level-badge">{LEVEL_BADGE[question.level]}</span>
        </div>
        <p className="round-sentence" lang="es">
          {question.before} <span className={`round-blank ${isSubmitted ? "round-blank-filled" : ""}`}>
            {isSubmitted ? question.answer : mode === "type" ? (typed || blankPlaceholder) : blankPlaceholder}
          </span> {question.after}
        </p>
        <p className="round-translation" lang="en">{question.translations.en}</p>
      </section>

      <section className="round-answer-area">
        {!isSubmitted && (
          // Shown as an in-place overlay, not a navigation, so the in-progress round (not yet saved to history) is never lost.
          <button type="button" className="round-stuck" onClick={() => setShowChart(true)}>
            Stuck? Open the {quiz.chartLabel ? chartLabel.toLocaleLowerCase("en") : "conjugation chart"}
          </button>
        )}
        {mode === "choose" ? choices.map((choice) => {
          const state = optionState(choice);
          return (
            <button
              type="button"
              key={choice}
              className={`round-option round-option-${state}`}
              disabled={isSubmitted}
              onClick={() => commit(choice)}
            >
              {state === "correct" && "✓ "}
              {state === "wrong" && "✕ "}
              {choice}
            </button>
          );
        }) : (
          <>
            <input
              ref={inputRef}
              type="text"
              inputMode="text"
              lang="es"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className={`round-type-input ${isSubmitted ? (isCorrect ? "round-type-input-correct" : "round-type-input-wrong") : ""}`}
              value={typed}
              disabled={isSubmitted}
              placeholder="Type the missing form"
              aria-label={`Type your answer for question ${index + 1}`}
              onChange={(event) => setTyped(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  commitTyped();
                }
              }}
            />
            <div className="round-accent-row" role="group" aria-label="Accented letters">
              {ACCENTS.map((char) => (
                <button type="button" key={char} className="round-accent-key" disabled={isSubmitted} onClick={() => insertAccent(char)}>
                  {char}
                </button>
              ))}
            </div>
          </>
        )}

        {isSubmitted && (
          <div className={`round-explain ${isCorrect ? "round-explain-correct" : "round-explain-wrong"}`}>
            <span className={`round-explain-label ${isCorrect ? "round-explain-label-correct" : "round-explain-label-wrong"}`}>
              {isCorrect ? "Correct" : `Not quite — ${question.answer}`}
            </span>
            <p className="round-explain-body">{question.explanation}</p>
          </div>
        )}
      </section>

      <footer className="round-footer">
        <button type="button" className="round-skip" onClick={skip}>Skip</button>
        <button type="button" className="round-next" disabled={primaryDisabled} onClick={primaryAction}>
          {primaryLabel}
        </button>
      </footer>

      {showChart && (
        <div className="round-chart-overlay" role="dialog" aria-modal="true" aria-label={chartLabel}>
          <VerbChart quizId={quizId} infinitive={question.infinitive} onClose={() => setShowChart(false)} />
        </div>
      )}
      </main>
    </>
  );
}
