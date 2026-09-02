"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { QuizResult } from "./quiz-logic";
import { readStreakSummary } from "./streak";
import { shouldShowEnjoymentGate, markEnjoymentGateShown, markEnjoymentAnswered } from "./enjoyment";
import { SITE_CONFIG } from "./site-config";
import SiteHeader from "./site-header";

type EnjoymentAnswer = "yes" | "no" | "sent" | null;

export default function Results({
  result,
  missedRuleLabels,
  hasMissedOverall,
  onPractiseMisses,
  standalone = false,
}: {
  result: QuizResult;
  missedRuleLabels: string[];
  hasMissedOverall: boolean;
  onPractiseMisses: () => void;
  standalone?: boolean;
}) {
  const total = result.questionIds.length;
  const [streakDays, setStreakDays] = useState(0);
  const [showGate, setShowGate] = useState(false);
  const [enjoyment, setEnjoyment] = useState<EnjoymentAnswer>(null);

  useEffect(() => {
    // Browser storage is unavailable during the server render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStreakDays(readStreakSummary().streak);
    setShowGate(shouldShowEnjoymentGate());
  }, []);

  const uniqueRules = [...new Set(missedRuleLabels)];

  const headline = total === 0
    ? "Round skipped."
    : result.score >= total - 1
      ? "Casi perfecto."
      : result.score >= total / 2
        ? "Solid round."
        : "Worth another pass.";

  const answerYes = () => {
    setEnjoyment("yes");
    markEnjoymentAnswered();
  };

  const answerNo = () => {
    setEnjoyment("no");
    markEnjoymentGateShown();
  };

  const sendFeedback = () => {
    setEnjoyment("sent");
    markEnjoymentAnswered();
  };

  return (
    <main className="app-shell results-screen">
      {standalone && <SiteHeader />}
      <p className="eyebrow-clay">Round complete</p>
      <h1 className="results-heading">{headline}</h1>

      <section className="results-score-card">
        <div className="results-score-top">
          <strong className="results-score-number">{result.score}</strong>
          <span className="results-score-of">of {total} correct</span>
        </div>
        <div className="results-score-bar" aria-hidden="true"><span style={{ width: `${result.percent}%` }} /></div>
        {streakDays > 0 && <p className="results-streak-note">Streak extended to {streakDays} day{streakDays === 1 ? "" : "s"}.</p>}
      </section>

      {uniqueRules.length > 0 && (
        <section className="results-notebook">
          <p className="eyebrow">Added to your mistake notebook</p>
          <div className="results-chip-row">
            {uniqueRules.map((rule) => <span className="results-chip" key={rule}>{rule}</span>)}
          </div>
          <p className="results-notebook-footnote">These come back as cards tomorrow, and in your next round here.</p>
        </section>
      )}

      <div className="results-actions">
        {hasMissedOverall && <button type="button" className="primary results-practise" onClick={onPractiseMisses}>Practise the misses</button>}
        <Link className="secondary results-back" href="/">Back to board</Link>
      </div>

      {showGate && (
        <section className="results-enjoyment">
          {enjoyment === null && (
            <>
              <p className="results-enjoyment-question">Did you enjoy this round?</p>
              <div className="results-enjoyment-buttons">
                <button type="button" className="results-enjoyment-yes" onClick={answerYes}>Yes, it was fun</button>
                <button type="button" className="results-enjoyment-no" onClick={answerNo}>Not really</button>
              </div>
            </>
          )}

          {enjoyment === "yes" && (
            <div className="results-kofi-panel">
              <p>Glad to hear it. Spanish Quizzes is free and made by one person — a coffee keeps new questions coming.</p>
              <a className="results-kofi-link" href={SITE_CONFIG.kofiUrl} target="_blank" rel="noreferrer">
                <span>☕ Help build more quizzes</span>
                <span className="results-kofi-muted">ko-fi</span>
              </a>
            </div>
          )}

          {enjoyment === "no" && (
            <div className="results-feedback-panel">
              <p>Noted — what would make it better?</p>
              <button type="button" className="results-feedback-send" onClick={sendFeedback}>Send feedback</button>
            </div>
          )}

          {enjoyment === "sent" && (
            <div className="results-feedback-confirm">✓ Thanks — feedback sent.</div>
          )}
        </section>
      )}
    </main>
  );
}
