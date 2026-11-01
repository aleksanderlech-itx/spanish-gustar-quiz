"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { type Question } from "./quiz-data";
import { normalizeAnswer, sentenceParts } from "./quiz-logic";
import { DEFAULT_CHART_LABEL, QUIZ_CONFIG, type QuizId } from "./quiz-config";
import type { AnswerMode } from "./topic-settings";
import VerbChart from "./verb-chart";
import { SkipLink } from "./activity-chrome";
import SiteHeader from "./site-header";
import HelpButton from "./help-modal";
import { isTestMode } from "./storage";

const ACCENTS = ["á", "é", "í", "ó", "ú", "ñ"];

const LEVEL_BADGE: Record<Question["level"], string> = {
  basic: "A1",
  intermediate: "A2",
  advanced: "B1",
};

/**
 * One question of a round on screen: the sentence, the answer controls, the feedback once answered and the
 * footer. It holds no progress of its own. The parent owns the answers and decides what an answer, a skip or
 * the end of the round writes, so regular rounds and mistake retries share this view but not their storage.
 */
export default function RoundQuestion({
  quizId,
  standalone,
  question,
  index,
  stepKeys,
  mode,
  choices,
  picked,
  isSubmitted,
  backHref,
  backLabel,
  eyebrow,
  onCommit,
  onNext,
  onSkip,
  feedback,
}: {
  quizId: QuizId;
  standalone: boolean;
  question: Question;
  index: number;
  /** One stable key per question in the round, for the step indicator. */
  stepKeys: Array<string | number>;
  mode: AnswerMode;
  choices: string[];
  picked: string | null;
  isSubmitted: boolean;
  backHref: string;
  backLabel: string;
  eyebrow: string;
  onCommit: (answer: string) => void;
  onNext: () => void;
  onSkip: () => void;
  /** The feedback body once answered; defaults to the sentence's own explanation. */
  feedback?: (isCorrect: boolean) => ReactNode;
}) {
  const quiz = QUIZ_CONFIG[quizId];
  const [typed, setTyped] = useState("");
  const [showChart, setShowChart] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const total = stepKeys.length;

  useEffect(() => {
    // A fresh question starts with a focused input: empty, or in test mode prefilled with the correct answer
    // so a tester who does not read Spanish only has to submit.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTyped(isTestMode() ? question.answer : "");
    if (mode === "type") window.requestAnimationFrame(() => inputRef.current?.focus());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, question]);

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

  const blankPlaceholder = question.blankHint ?? (quiz.showInfinitiveBlank === false ? "?" : question.infinitive);
  const sentence = sentenceParts(question);
  const chartLabel = quiz.chartLabel ?? DEFAULT_CHART_LABEL;
  const isLast = index === total - 1;
  const isCorrect = picked !== null && normalizeAnswer(picked) === normalizeAnswer(question.answer);
  // Test mode only (readable after hydration, since this view renders once the client has mounted).
  const testMode = isTestMode();

  const commit = (choice: string) => {
    if (isSubmitted) return;
    onCommit(choice);
  };

  const commitTyped = () => {
    if (isSubmitted || !typed.trim()) return;
    onCommit(typed);
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

  const optionState = (choice: string) => {
    if (!isSubmitted) return "unanswered";
    if (choice === question.answer) return "correct";
    if (choice === picked) return "wrong";
    return "other";
  };

  const primaryAction = mode === "type" && !isSubmitted ? commitTyped : onNext;
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
        <Link className="round-back" href={backHref} aria-label={backLabel}><span aria-hidden="true">←</span></Link>
        <div className="round-steps" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={index} aria-label="Completed questions">
          {stepKeys.map((key, i) => (
            <span key={key} className={`round-step ${i < index ? "round-step-past" : ""} ${i === index ? "round-step-current" : ""}`} />
          ))}
        </div>
        <span className="round-counter">Question {index + 1} of {total}</span>
        <HelpButton topic="round" />
      </header>

      <section className="round-question-card">
        <div className="round-question-top">
          <p className="eyebrow-clay">{eyebrow}</p>
          <span className="round-level-badge">{LEVEL_BADGE[question.level]}</span>
        </div>
        <p className="round-sentence" lang="es">
          {sentence.before}<span className={`round-blank ${isSubmitted ? "round-blank-filled" : ""}`}>
            {isSubmitted ? sentence.answer : mode === "type" ? (typed || blankPlaceholder) : blankPlaceholder}
          </span>{sentence.after}
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
              className={`round-option round-option-${state}${testMode && !isSubmitted && choice === question.answer ? " round-option-test-hint" : ""}`}
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
              {isCorrect ? "Correct" : `Not quite: ${question.answer}`}
            </span>
            {feedback ? feedback(isCorrect) : <p className="round-explain-body">{question.explanation}</p>}
          </div>
        )}
      </section>

      <footer className="round-footer">
        <button type="button" className="round-skip" onClick={onSkip}>Skip</button>
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
