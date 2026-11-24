"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SENTENCE_BUILDER_GROUPS, SENTENCE_BUILDER_ITEMS } from "./sentence-builder-data";
import { SENTENCE_BUILDER_DESCRIPTION, SENTENCE_BUILDER_FILTER_KEY, SENTENCE_BUILDER_ID, SENTENCE_BUILDER_PATH, SENTENCE_BUILDER_STORAGE_KEY } from "./sentence-builder-config";
import { emptyQuizProgress, readHistoryProgress, type QuizProgress } from "./quiz-progress";
import { DEFAULT_SETTINGS, readTopicSettings, writeTopicSettings, type RoundLength } from "./topic-settings";
import { DEFAULT_FILTERS, readQuizFilters, writeQuizFilters } from "./quiz-filters";
import type { QuizFilters } from "./quiz-logic";
import { ActivityChips, SkipLink } from "./activity-chrome";
import SiteHeader from "./site-header";
import HelpButton from "./help-modal";
import TopicExplainer from "./topic-explainer";
import { SENTENCE_BUILDER_CONTENT } from "./sentence-builder-content";

const ROUND_LENGTHS: RoundLength[] = [5, 10, 20];
const LEVELS: Array<QuizFilters["level"]> = ["all", "basic", "intermediate", "advanced"];
const capital = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

/** Sentence Builder's own page: progress, round length and filters by level and pattern group. */
export default function SentenceBuilderTopic() {
  const [progress, setProgress] = useState<QuizProgress>(() => emptyQuizProgress(SENTENCE_BUILDER_ITEMS.length));
  // Same defaults on the server and the first client render; saved choices are restored after hydration.
  const [roundLength, setRoundLength] = useState<RoundLength>(DEFAULT_SETTINGS.roundLength);
  const [filters, setFilters] = useState<QuizFilters>(DEFAULT_FILTERS);

  useEffect(() => {
    // Browser storage is unavailable during the server render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(readHistoryProgress(SENTENCE_BUILDER_STORAGE_KEY, SENTENCE_BUILDER_ITEMS.length));
    setRoundLength(readTopicSettings(SENTENCE_BUILDER_ID).roundLength);
    setFilters(readQuizFilters(SENTENCE_BUILDER_FILTER_KEY));
  }, []);

  const chooseLength = (length: RoundLength) => {
    setRoundLength(length);
    writeTopicSettings(SENTENCE_BUILDER_ID, { ...readTopicSettings(SENTENCE_BUILDER_ID), roundLength: length });
  };
  const updateFilters = (next: Partial<QuizFilters>) => {
    setFilters((current) => {
      const merged = { ...current, ...next };
      writeQuizFilters(SENTENCE_BUILDER_FILTER_KEY, merged);
      return merged;
    });
  };

  const filteredCount = SENTENCE_BUILDER_ITEMS.filter((item) =>
    (filters.level === "all" || item.level === filters.level) && (filters.verb === "all" || item.group === filters.verb)).length;

  return (
    <>
      <SkipLink targetId="sentence-builder-setup" label="Skip to Sentence Builder" />
      <main id="sentence-builder-setup" className="app-shell topic-detail">
        <SiteHeader />
        <header className="topic-detail-header">
          <Link className="topic-back" href="/" aria-label="Back to board"><span aria-hidden="true">←</span></Link>
          <p className="eyebrow-clay">Word order · Spanish</p>
          <HelpButton topic="sentence-builder" />
        </header>

        <h1>Sentence Builder</h1>
        <p className="sb-intro">Read the English, then tap the Spanish words in the right order. Capitals and punctuation are added for you.</p>

        <section className="topic-summary-card">
          <div
            className="board-ring topic-summary-ring"
            style={{ background: `conic-gradient(var(--primary) ${progress.percent}%, var(--line) ${progress.percent}%)` }}
          >
            <div className="board-ring-inner topic-summary-ring-inner"><strong>{progress.percent}%</strong></div>
          </div>
          <div className="topic-summary-text">
            <p className="topic-summary-count">{progress.completed} of {progress.total} sentences</p>
            <p className="topic-summary-meta">Accuracy {progress.accuracy}% · {progress.due} due today</p>
          </div>
        </section>

        <details className="topic-practice-options" open>
          <summary>Practice options</summary>
          <section className="topic-setting">
            <p className="eyebrow">Round length</p>
            <div className="round-length-picker" role="group" aria-label="Round length">
              {ROUND_LENGTHS.map((length) => (
                <button type="button" key={length} className={roundLength === length ? "active" : ""} aria-pressed={roundLength === length} onClick={() => chooseLength(length)}>
                  {length}
                </button>
              ))}
            </div>
          </section>
          <section className="topic-setting">
            <p className="eyebrow">Filters</p>
            <div className="topic-filter-fields">
              <label className="topic-filter-field">
                <span>Difficulty</span>
                <select value={filters.level} onChange={(event) => updateFilters({ level: event.target.value as QuizFilters["level"] })}>
                  {LEVELS.map((level) => <option value={level} key={level}>{level === "all" ? "All levels" : capital(level)}</option>)}
                </select>
              </label>
              <label className="topic-filter-field">
                <span>Pattern</span>
                <select value={filters.verb} onChange={(event) => updateFilters({ verb: event.target.value })}>
                  <option value="all">All patterns</option>
                  {SENTENCE_BUILDER_GROUPS.map((group) => <option value={group} key={group}>{capital(group)}</option>)}
                </select>
              </label>
            </div>
            <p className="topic-setting-hint">{filteredCount} sentence{filteredCount === 1 ? "" : "s"} selected</p>
          </section>
        </details>

        <Link className="topic-chart-link" href="/notes/spanish-word-order">
          <span className="board-icon" aria-hidden="true">▦</span>
          <span className="topic-chart-link-label">Spanish word order, explained</span>
          <span aria-hidden="true">→</span>
        </Link>

        <footer className="topic-detail-footer">
          {filteredCount > 0 ? (
            <a className="primary topic-start" href={`${SENTENCE_BUILDER_PATH}?play=1`}>Start round of {Math.min(roundLength, filteredCount)}</a>
          ) : (
            <span className="primary topic-start topic-start-disabled" aria-disabled="true">No sentences match these filters</span>
          )}
        </footer>

        <TopicExplainer id={SENTENCE_BUILDER_ID} content={SENTENCE_BUILDER_CONTENT} />

        <p className="activity-lede">{SENTENCE_BUILDER_DESCRIPTION}</p>
        <ActivityChips
          chips={[
            { label: "A1-B1", tone: "primary" },
            { label: "About 100 sentences", tone: "neutral" },
            { label: "No sign-up", tone: "sage" },
          ]}
        />
      </main>
    </>
  );
}
