"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { QuizResult } from "./quiz-logic";
import { readStreakSummary } from "./streak";
import SupportPrompt from "./support-prompt";
import SiteHeader from "./site-header";
import type { QuizId } from "./quiz-config";
import { mistakesPath } from "./notebook-retry";

export default function Results({
  quizId,
  result,
  missedRuleLabels,
  hasMissedOverall,
  onPractiseMisses,
  standalone = false,
}: {
  quizId: QuizId;
  result: QuizResult;
  missedRuleLabels: string[];
  hasMissedOverall: boolean;
  onPractiseMisses: () => void;
  standalone?: boolean;
}) {
  const total = result.questionIds.length;
  const [streakDays, setStreakDays] = useState(0);

  useEffect(() => {
    // Browser storage is unavailable during the server render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStreakDays(readStreakSummary().streak);
  }, []);

  const uniqueRules = [...new Set(missedRuleLabels)];

  const headline = total === 0
    ? "Round skipped."
    : result.score >= total - 1
      ? "Casi perfecto."
      : result.score >= total / 2
        ? "Solid round."
        : "Worth another pass.";

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
        <p className="results-accuracy">{total > 0 ? `${result.percent}% accuracy` : "No questions answered"}</p>
        <div className="results-score-bar" aria-hidden="true"><span style={{ width: `${result.percent}%` }} /></div>
        {streakDays > 0 && <p className="results-streak-note">Streak extended to {streakDays} day{streakDays === 1 ? "" : "s"}.</p>}
      </section>

      {uniqueRules.length > 0 && (
        <section className="results-notebook">
          <p className="eyebrow">Added to your mistake notebook</p>
          <div className="results-chip-row">
            {uniqueRules.map((rule) => <span className="results-chip" key={rule}>{rule}</span>)}
          </div>
          <p className="results-notebook-footnote">
            Retry them in <a href={mistakesPath(quizId)}>this topic&apos;s mistakes</a>, also listed under Mistakes to retry on the board. Retries are practice only and do not count toward today&apos;s goal.
          </p>
        </section>
      )}

      <div className="results-actions">
        {hasMissedOverall && <button type="button" className="primary results-practise" onClick={onPractiseMisses}>Practise the misses</button>}
        <Link className="secondary results-back" href="/">Back to board</Link>
      </div>

      <SupportPrompt />
    </main>
  );
}
