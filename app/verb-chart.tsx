"use client";

import { useState } from "react";
import Link from "next/link";
import { QUIZ_CONFIG, quizPath, type QuizId } from "./quiz-config";
import type { ChartRow } from "./chart-blocks";
import { speak, speakQueue } from "./speak";

/** Which group sections the chart shows, by the quiz's declared `chart.sections` (issue #151). */
const sectionsFor = (quizId: QuizId, group?: string): string[] => {
  const { forms, chart } = QUIZ_CONFIG[quizId];
  if (chart.sections === "shared") return [""];
  if (group && forms[group]) return [group];
  return chart.sections === "group-or-shared" ? [""] : Object.keys(forms);
};

export default function VerbChart({ quizId, infinitive, onClose }: { quizId: QuizId; infinitive?: string; onClose?: () => void }) {
  const quiz = QUIZ_CONFIG[quizId];
  const infinitives = sectionsFor(quizId, infinitive);
  const regularityFor = (group: string) => quiz.chart.regularity?.[group];
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
        <h1>{infinitives.length === 1 && infinitives[0] ? infinitives[0] : quiz.title.replace(" Quiz", "")}</h1>
        {infinitives.length === 1 && regularityFor(infinitives[0]) && (
          <span className="verb-chart-regularity-badge">{regularityFor(infinitives[0])}</span>
        )}
      </header>

      {infinitives.map((inf) => (
        <div className="verb-chart-verb" key={inf}>
          {infinitives.length > 1 && (
            <h2 className="verb-chart-verb-heading">
              {inf}
              {regularityFor(inf) && <span className="verb-chart-regularity-badge">{regularityFor(inf)}</span>}
            </h2>
          )}
          {quiz.chart.blocks(inf, quiz.forms).map((block) => {
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
