"use client";

import { useState } from "react";
import Link from "next/link";
import { QUIZ_CONFIG, quizPath, type QuizId } from "./quiz-config";
import { PRETERITE_IMPERFECT_CONJUGATIONS, PRETERITE_IMPERFECT_REGULARITY } from "./preterite-imperfect-data";
import { OBJECT_PRONOUN_CHART, type ObjectPronounType } from "./object-pronouns-data";
import { SABER_CONOCER_CONJUGATIONS } from "./saber-conocer-data";
import { speak, speakQueue } from "./speak";

type ChartRow = { pronoun: string; form: string };
type ChartBlock = { tenseLabel: string; accent: "primary" | "sun"; rows: ChartRow[] };

const SABER_CONOCER_VERB_LABELS = { saber: "Saber", conocer: "Conocer" } as const;

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
  if (quizId === "object-pronouns") {
    const rows = OBJECT_PRONOUN_CHART[infinitive as ObjectPronounType] ?? [];
    return [{ tenseLabel: "Pronouns", accent: "primary", rows: rows.map((row) => ({ pronoun: row.label, form: row.form })) }];
  }
  if (quizId === "saber-conocer") {
    // Past-meaning questions need the preterite/imperfect pair; every other usage is present.
    // The topic-level chart (no single usage) shows all three tenses.
    const tenses = infinitive === "past meaning" ? (["preterite", "imperfect"] as const)
      : infinitive ? (["present"] as const)
      : (["present", "preterite", "imperfect"] as const);
    return tenses.flatMap((tense) => (["saber", "conocer"] as const).map((verb) => ({
      tenseLabel: `${SABER_CONOCER_VERB_LABELS[verb]} · ${tense}`,
      accent: verb === "saber" ? "primary" as const : "sun" as const,
      rows: SABER_CONOCER_CONJUGATIONS.map((row) => ({ pronoun: row.subject, form: row[verb][tense] })),
    })));
  }
  if (quizId === "por-para") {
    const [por, para] = forms[infinitive] ?? ["por", "para"];
    return [{ tenseLabel: "Preposition", accent: "primary", rows: [{ pronoun: "por", form: por }, { pronoun: "para", form: para }] }];
  }
  const [singular, plural] = forms[infinitive] ?? ["", ""];
  return [{ tenseLabel: "Present", accent: "primary", rows: [{ pronoun: "one thing / to do something", form: singular }, { pronoun: "several things", form: plural }] }];
};

/** Only preterite/imperfect has verified regular/irregular classification data — see the note above blocksFor. */
const regularityFor = (quizId: QuizId, infinitive: string) =>
  quizId === "preterite-imperfect" ? PRETERITE_IMPERFECT_REGULARITY[infinitive] : undefined;

export default function VerbChart({ quizId, infinitive, onClose }: { quizId: QuizId; infinitive?: string; onClose?: () => void }) {
  const quiz = QUIZ_CONFIG[quizId];
  // Saber vs conocer's "forms" are usage categories, not verbs: the topic-level chart is one
  // section with both full paradigms rather than a repeat of them under every usage.
  const infinitives = infinitive && quiz.forms[infinitive] ? [infinitive] : quizId === "saber-conocer" ? [""] : Object.keys(quiz.forms);
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
        {onClose ? (
          <button type="button" className="round-back" aria-label={`Close ${(quiz.chartLabel ?? "conjugation chart").toLocaleLowerCase("en")}`} onClick={onClose}><span aria-hidden="true">←</span></button>
        ) : (
          <Link className="round-back" href={quizPath(quizId)} aria-label="Back to topic"><span aria-hidden="true">←</span></Link>
        )}
        <h1>{infinitives.length === 1 && quizId !== "saber-conocer" ? infinitives[0] : quiz.title.replace(" Quiz", "")}</h1>
        {infinitives.length === 1 && regularityFor(quizId, infinitives[0]) && (
          <span className="verb-chart-regularity-badge">{regularityFor(quizId, infinitives[0])}</span>
        )}
      </header>

      {infinitives.map((inf) => (
        <div className="verb-chart-verb" key={inf}>
          {infinitives.length > 1 && (
            <h2 className="verb-chart-verb-heading">
              {inf}
              {regularityFor(quizId, inf) && <span className="verb-chart-regularity-badge">{regularityFor(quizId, inf)}</span>}
            </h2>
          )}
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
