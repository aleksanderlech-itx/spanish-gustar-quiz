"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QUIZ_CONFIG, type QuizId } from "./quiz-config";
import { emptyQuizProgress, readQuizProgress, type QuizProgress } from "./quiz-progress";
import { readTopicSettings, writeTopicSettings, type AnswerMode, type RoundLength } from "./topic-settings";
import { filterQuestions, type QuizFilters } from "./quiz-logic";
import { readQuizFilters, writeQuizFilters } from "./quiz-filters";

const ROUND_LENGTHS: RoundLength[] = [5, 10, 20];
const LEVELS: Array<QuizFilters["level"]> = ["all", "basic", "intermediate", "advanced"];

export default function TopicDetail({ quizId }: { quizId: QuizId }) {
  const quiz = QUIZ_CONFIG[quizId];
  const [progress, setProgress] = useState<QuizProgress>(() => emptyQuizProgress(quiz.questions.length));
  const [settings, setSettings] = useState(() => readTopicSettings(quizId));
  const [filters, setFilters] = useState<QuizFilters>(() => readQuizFilters(quiz.filterKey));

  useEffect(() => {
    // Browser storage is unavailable during the server render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(readQuizProgress(quizId));
    setSettings(readTopicSettings(quizId));
    setFilters(readQuizFilters(quiz.filterKey));
  }, [quizId, quiz.filterKey]);

  const updateSettings = (next: Partial<{ roundLength: RoundLength; mode: AnswerMode }>) => {
    setSettings((current) => {
      const merged = { ...current, ...next };
      writeTopicSettings(quizId, merged);
      return merged;
    });
  };

  const updateFilters = (next: Partial<QuizFilters>) => {
    setFilters((current) => {
      const merged = { ...current, ...next };
      writeQuizFilters(quiz.filterKey, merged);
      return merged;
    });
  };

  const filteredCount = filterQuestions(quiz.questions, filters).length;
  const roundLength = Math.min(settings.roundLength, filteredCount);

  return (
    <main className="app-shell topic-detail">
      <header className="topic-detail-header">
        <Link className="topic-back" href="/" aria-label="Back to board">
          <span aria-hidden="true">←</span>
        </Link>
        <p className="eyebrow-clay">{quiz.eyebrow}</p>
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

      <section className="topic-setting">
        <p className="eyebrow">Filters</p>
        <div className="topic-filter-fields">
          <label className="topic-filter-field">
            <span>Difficulty</span>
            <select value={filters.level} onChange={(event) => updateFilters({ level: event.target.value as QuizFilters["level"] })}>
              {LEVELS.map((level) => <option value={level} key={level}>{level === "all" ? "All levels" : level[0].toUpperCase() + level.slice(1)}</option>)}
            </select>
          </label>
          <label className="topic-filter-field">
            <span>Verb</span>
            <select value={filters.verb} onChange={(event) => updateFilters({ verb: event.target.value })}>
              <option value="all">All verbs</option>
              {Object.keys(quiz.forms).map((verb) => <option value={verb} key={verb}>{verb}</option>)}
            </select>
          </label>
        </div>
        <p className="topic-setting-hint">{filteredCount} sentence{filteredCount === 1 ? "" : "s"} selected</p>
      </section>

      <Link className="topic-chart-link" href={`/?quiz=${quizId}&chart=1`}>
        <span className="board-icon" aria-hidden="true">▦</span>
        <span className="topic-chart-link-label">Verb conjugation chart</span>
        <span aria-hidden="true">→</span>
      </Link>

      <footer className="topic-detail-footer">
        {filteredCount > 0 ? (
          <a className="primary topic-start" href={`/?quiz=${quizId}&play=1`}>Start round of {roundLength}</a>
        ) : (
          <span className="primary topic-start topic-start-disabled" aria-disabled="true">No sentences match these filters</span>
        )}
      </footer>
    </main>
  );
}
