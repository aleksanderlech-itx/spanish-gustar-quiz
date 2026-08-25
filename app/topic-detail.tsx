"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QUIZ_CONFIG, type QuizId } from "./quiz-config";
import { emptyQuizProgress, readQuizProgress, type QuizProgress } from "./quiz-progress";
import { readTopicSettings, writeTopicSettings, type AnswerMode, type RoundLength } from "./topic-settings";

const ROUND_LENGTHS: RoundLength[] = [5, 10, 20];

export default function TopicDetail({ quizId }: { quizId: QuizId }) {
  const quiz = QUIZ_CONFIG[quizId];
  const [progress, setProgress] = useState<QuizProgress>(() => emptyQuizProgress(quiz.questions.length));
  const [settings, setSettings] = useState(() => readTopicSettings(quizId));

  useEffect(() => {
    // Browser storage is unavailable during the server render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(readQuizProgress(quizId));
    setSettings(readTopicSettings(quizId));
  }, [quizId]);

  const updateSettings = (next: Partial<{ roundLength: RoundLength; mode: AnswerMode }>) => {
    setSettings((current) => {
      const merged = { ...current, ...next };
      writeTopicSettings(quizId, merged);
      return merged;
    });
  };

  const roundLength = Math.min(settings.roundLength, quiz.questions.length);

  return (
    <main className="app-shell topic-detail">
      <header className="topic-detail-header">
        <Link className="topic-back" href="/" aria-label="Back to board">
          <span aria-hidden="true">←</span>
        </Link>
        <p className="topic-detail-eyebrow">{quiz.eyebrow}</p>
      </header>

      <h1>{quiz.heading}</h1>

      <section className="topic-summary-card">
        <div
          className="board-ring topic-summary-ring"
          style={{ background: `conic-gradient(var(--primary) ${progress.percent}%, var(--line) ${progress.percent}%)` }}
        >
          <div className="board-ring-inner topic-summary-ring-inner"><strong>{progress.percent}%</strong></div>
        </div>
        <p className="topic-summary-meta">Accuracy {progress.accuracy}% · {progress.due} due today</p>
      </section>

      <section className="topic-setting">
        <p className="eyebrow">Round length</p>
        <div className="round-length-picker" role="group" aria-label="Round length">
          {ROUND_LENGTHS.map((length) => (
            <button
              type="button"
              key={length}
              className={settings.roundLength === length ? "active" : ""}
              aria-pressed={settings.roundLength === length}
              onClick={() => updateSettings({ roundLength: length })}
            >
              {length}
            </button>
          ))}
        </div>
      </section>

      <section className="topic-setting">
        <p className="eyebrow">Answer mode</p>
        <div className="mode-segmented" role="group" aria-label="Answer mode">
          <button type="button" className={settings.mode === "choose" ? "active" : ""} aria-pressed={settings.mode === "choose"} onClick={() => updateSettings({ mode: "choose" })}>Choose</button>
          <button type="button" className={settings.mode === "type" ? "active" : ""} aria-pressed={settings.mode === "type"} onClick={() => updateSettings({ mode: "type" })}>Type</button>
        </div>
        <p className="topic-setting-hint">
          {settings.mode === "choose" ? "Pick from three options. Fastest way through a round." : "You write the verb yourself — harder, and it sticks better."}
        </p>
      </section>

      <footer className="topic-detail-footer">
        <a className="primary topic-start" href={`/?quiz=${quizId}&play=1`}>Start round of {roundLength}</a>
      </footer>
    </main>
  );
}
