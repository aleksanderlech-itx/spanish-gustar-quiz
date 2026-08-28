"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { type Question } from "./quiz-data";
import { availableQuestions, filterQuestions, getMissedIds, normalizeAnswer, scoreRound, type QuizResult } from "./quiz-logic";
import { QUIZ_CONFIG, type QuizId } from "./quiz-config";
import { recordActivityToday } from "./streak";
import { readTopicSettings, type AnswerMode } from "./topic-settings";
import { readQuizFilters } from "./quiz-filters";
import { recordMistakes, ruleLabelFor } from "./notebook";
import Results from "./results";

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
  if (question.infinitive === "ser / estar" || question.tense === "preterite" || question.tense === "imperfect") {
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

const mergeHistory = (local: Result[], remote: Result[]) => {
  const unique = new Map<string, Result>();
  [...remote, ...local].forEach((item) => unique.set(`${item.date}|${item.mode ?? "regular"}|${item.questionIds.join(",")}`, item));
  return [...unique.values()].sort((a, b) => a.date.localeCompare(b.date));
};

export default function Round({ quizId }: { quizId: QuizId }) {
  const quiz = QUIZ_CONFIG[quizId];
  const { questions, forms, storageKey } = quiz;

  const [hydrated, setHydrated] = useState(false);
  const [history, setHistory] = useState<Result[]>([]);
  const [syncState, setSyncState] = useState<"checking" | "signed-out" | "synced" | "saving" | "error">("checking");
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

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    const initial = saved ? (JSON.parse(saved) as Result[]) : [];
    const initialise = async () => {
      let merged = presentOnlyHistory(initial, questions);
      try {
        const response = await fetch("/api/progress", { cache: "no-store" });
        if (response.status === 401) setSyncState("signed-out");
        else if (response.ok) {
          const data = await response.json() as { progress?: { history?: Result[] } | null };
          merged = presentOnlyHistory(mergeHistory(initial, data.progress?.history ?? []), questions);
          localStorage.setItem(storageKey, JSON.stringify(merged));
          setSyncState("synced");
        } else setSyncState("error");
      } catch { setSyncState("error"); }
      setHistory(merged);
      startRound(false, merged);
      setHydrated(true);
    };
    void initialise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId, questions, storageKey]);

  const persistProgress = async (nextHistory: Result[]) => {
    localStorage.setItem(storageKey, JSON.stringify(nextHistory));
    if (syncState !== "synced" && syncState !== "saving") return;
    setSyncState("saving");
    try {
      const response = await fetch("/api/progress", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ history: nextHistory, filters: { level: "all", verb: "all" } }) });
      setSyncState(response.ok ? "synced" : response.status === 401 ? "signed-out" : "error");
    } catch { setSyncState("error"); }
  };

  if (!hydrated) return <main className="loading">Preparing your quiz…</main>;

  if (poolExhausted) {
    return (
      <main className="app-shell">
        <section className="completion-card" aria-live="polite">
          <p className="eyebrow">Set completed</p>
          <h2>You&apos;ve completed every {quiz.title.replace(" Quiz", "")} sentence.</h2>
          <p>Your results are saved. Practise the ones you missed, or head back to the board.</p>
          <div>
            {missedIds.length > 0 && <button type="button" className="primary" onClick={() => startRound(true, history)}>Practise the misses</button>}
            <Link className="secondary" href={`/?quiz=${quizId}`}>Back to topic</Link>
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
      />
    );
  }

  const question = round[index];
  if (!question) return <main className="loading">Preparing your quiz…</main>;

  const choices = choiceSets[question.id] ?? answerChoicesFor(question, forms);
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
    const next = [...history, result];
    setHistory(next);
    void persistProgress(next);
    recordActivityToday(quizId);
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
    <main className="round-shell">
      <header className="round-header">
        <Link className="round-back" href={`/?quiz=${quizId}`} aria-label="Back to topic"><span aria-hidden="true">←</span></Link>
        <div className="round-steps" role="progressbar" aria-valuemin={1} aria-valuemax={round.length} aria-valuenow={index + 1} aria-label={`Question ${index + 1} of ${round.length}`}>
          {round.map((q, i) => (
            <span key={q.id} className={`round-step ${i < index ? "round-step-past" : ""} ${i === index ? "round-step-current" : ""}`} />
          ))}
        </div>
        <span className="round-counter">{index + 1}/{round.length}</span>
      </header>

      <section className="round-question-card">
        <div className="round-question-top">
          <p className="eyebrow-clay">{quiz.eyebrow}</p>
          <span className="round-level-badge">{LEVEL_BADGE[question.level]}</span>
        </div>
        <p className="round-sentence">
          {question.before} <span className={`round-blank ${isSubmitted ? "round-blank-filled" : ""}`}>
            {isSubmitted ? question.answer : mode === "type" ? (typed || "?") : "?"}
          </span> {question.after}
        </p>
        <p className="round-translation" lang="en">{question.translations.en}</p>
      </section>

      <section className="round-answer-area">
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
            {!isSubmitted && (
              // Opens in a new tab so the in-progress round (not yet saved to history) isn't lost mid-navigation.
              <a className="round-stuck" href={`/?quiz=${quizId}&chart=1&verb=${encodeURIComponent(question.infinitive)}`} target="_blank" rel="noreferrer">
                Stuck? Open the conjugation chart
              </a>
            )}
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
    </main>
  );
}
