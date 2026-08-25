"use client";

import { useState } from "react";
import Link from "next/link";
import { QUIZ_CONFIG, type QuizId } from "./quiz-config";
import { PRETERITE_IMPERFECT_CONJUGATIONS } from "./preterite-imperfect-data";
import { speak, speakQueue } from "./speak";

type ChartRow = { pronoun: string; form: string };
type ChartBlock = { tenseLabel: string; accent: "primary" | "sun"; rows: ChartRow[] };

/** Full six-pronoun paradigms only exist for preterite/imperfect verbs. Gustar-pattern
 * verbs are impersonal (they never conjugate for "yo, tú..."), and the ser/estar quiz
 * compares two different verbs rather than conjugating one — both get an honest,
 * simpler block instead of a fabricated pronoun table. */
const blocksFor = (quizId: QuizId, infinitive: string, forms: Record<string, [string, string]>): ChartBlock[] => {
  if (quizId === "preterite-imperfect") {
    const conjugations = PRETERITE_IMPERFECT_CONJUGATIONS[infinitive] ?? [];
    return [
      { tenseLabel: "Preterite", accent: "primary", rows: conjugations.map((c) => ({ pronoun: c.subject, form: c.preterite })) },
      { tenseLabel: "Imperfect", accent: "sun", rows: conjugations.map((c) => ({ pronoun: c.subject, form: c.imperfect })) },
    ];
  }
  if (quizId === "ser-estar") {
    const [ser, estar] = forms[infinitive] ?? ["ser", "estar"];
    return [{ tenseLabel: "Present", accent: "primary", rows: [{ pronoun: "ser", form: ser }, { pronoun: "estar", form: estar }] }];
  }
  const [singular, plural] = forms[infinitive] ?? ["", ""];
  return [{ tenseLabel: "Present", accent: "primary", rows: [{ pronoun: "one thing / to do something", form: singular }, { pronoun: "several things", form: plural }] }];
};

export default function VerbChart({ quizId, infinitive }: { quizId: QuizId; infinitive?: string }) {
  const quiz = QUIZ_CONFIG[quizId];
  const infinitives = infinitive && quiz.forms[infinitive] ? [infinitive] : Object.keys(quiz.forms);
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);

  const speakRow = (key: string, text: string) => {
    setSpeakingKey(key);
    speak(text, { onEnd: () => setSpeakingKey((current) => (current === key ? null : current)) });
  };

  const playAll = (blockKey: string, rows: ChartRow[]) => {
    speakQueue(
      rows.map((row, rowIndex) => ({ id: `${blockKey}-${rowIndex}`, text: row.form })),
      {
        onItemStart: (id) => setSpeakingKey(id),
        onItemEnd: (id) => setSpeakingKey((current) => (current === id ? null : current)),
        onDone: () => setSpeakingKey(null),
      },
    );
  };

  return (
    <main className="app-shell verb-chart">
      <header className="verb-chart-header">
        <Link className="round-back" href={`/?quiz=${quizId}`} aria-label="Back to topic"><span aria-hidden="true">←</span></Link>
        <h1>{infinitives.length === 1 ? infinitives[0] : quiz.title.replace(" Quiz", "")}</h1>
      </header>

      {infinitives.map((inf) => (
        <div className="verb-chart-verb" key={inf}>
          {infinitives.length > 1 && <h2 className="verb-chart-verb-heading">{inf}</h2>}
          {blocksFor(quizId, inf, quiz.forms).map((block) => {
            const blockKey = `${inf}-${block.tenseLabel}`;
            return (
              <section className={`verb-chart-block verb-chart-block-${block.accent}`} key={blockKey}>
                <div className="verb-chart-block-header">
                  <span className="verb-chart-tense-name">{block.tenseLabel}</span>
                  <button type="button" className="verb-chart-play-all" onClick={() => playAll(blockKey, block.rows)}>🔊 Play all</button>
                </div>
                {block.rows.map((row, rowIndex) => {
                  const rowKey = `${blockKey}-${rowIndex}`;
                  const isSpeaking = speakingKey === rowKey;
                  return (
                    <button
                      type="button"
                      key={rowKey}
                      className={`verb-chart-row ${isSpeaking ? "verb-chart-row-speaking" : ""}`}
                      onClick={() => speakRow(rowKey, row.form)}
                    >
                      <span className="verb-chart-pronoun">{row.pronoun}</span>
                      <span className="verb-chart-form">{row.form}<span className="verb-chart-speaker" aria-hidden="true" style={{ opacity: isSpeaking ? 1 : undefined }}>🔊</span></span>
                    </button>
                  );
                })}
              </section>
            );
          })}
        </div>
      ))}
    </main>
  );
}
