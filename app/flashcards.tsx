"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FLASHCARD_VERBS } from "./flashcards-data";
import { useTheme } from "./use-theme";

type LeitnerBox = 1 | 2 | 3 | 4 | 5;
type CardRecord = { box: LeitnerBox; attempts: number; correct: number; updatedAt: string; nextReviewAt: string };
type LeitnerProgress = Record<string, CardRecord>;
type LegacyProgress = Record<string, { remembered?: boolean; attempts?: number; updatedAt?: string }>;

const STORAGE_KEY = "spanish-flashcards-leitner-v2";
const LEGACY_STORAGE_KEY = "spanish-flashcards-progress-v1";
const ROUND_SIZE = 20;
const DAY = 86_400_000;
const REVIEW_INTERVAL_DAYS: Record<LeitnerBox, number> = { 1: 0, 2: 1, 3: 3, 4: 7, 5: 14 };

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);
const nextReviewDate = (box: LeitnerBox, from = Date.now()) => new Date(from + REVIEW_INTERVAL_DAYS[box] * DAY).toISOString();

const migrateLegacyProgress = (legacy: LegacyProgress): LeitnerProgress => Object.fromEntries(
  Object.entries(legacy).map(([spanish, item]) => {
    const box: LeitnerBox = item.remembered ? 2 : 1;
    const updatedAt = item.updatedAt ?? new Date().toISOString();
    return [spanish, { box, attempts: item.attempts ?? 1, correct: item.remembered ? 1 : 0, updatedAt, nextReviewAt: nextReviewDate(box, Date.parse(updatedAt)) }];
  }),
);

const readStoredProgress = (): LeitnerProgress => {
  if (typeof window === "undefined") return {};
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as LeitnerProgress;
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!legacy) return {};
    const migrated = migrateLegacyProgress(JSON.parse(legacy) as LegacyProgress);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    return migrated;
  } catch {
    return {};
  }
};

const selectRound = (source: LeitnerProgress, now = Date.now()) => {
  const due = shuffle(FLASHCARD_VERBS.filter((card) => {
    const record = source[card.spanish];
    return record && Date.parse(record.nextReviewAt) <= now;
  })).sort((a, b) => (source[a.spanish]?.box ?? 1) - (source[b.spanish]?.box ?? 1));
  const unseen = shuffle(FLASHCARD_VERBS.filter((card) => !source[card.spanish]));
  return [...due, ...unseen].slice(0, ROUND_SIZE);
};

export default function Flashcards() {
  const [progress, setProgress] = useState<LeitnerProgress>(readStoredProgress);
  const [round, setRound] = useState(() => selectRound(readStoredProgress()));
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === "dark";
  const [currentTime, setCurrentTime] = useState(Date.now);

  const startRound = (source: LeitnerProgress) => {
    const now = Date.now();
    setCurrentTime(now);
    setRound(selectRound(source, now));
    setIndex(0);
    setRevealed(false);
  };

  const totals = useMemo(() => {
    const boxes = [1, 2, 3, 4, 5].map((box) => Object.values(progress).filter((item) => item.box === box).length);
    const due = Object.values(progress).filter((item) => Date.parse(item.nextReviewAt) <= currentTime).length;
    return { studied: Object.keys(progress).length, boxes, due };
  }, [currentTime, progress]);

  const card = round[index];
  const finished = index >= round.length;
  const currentBox = card ? progress[card.spanish]?.box ?? 1 : 1;

  const recordAnswer = (remembered: boolean) => {
    if (!card || !revealed) return;
    const previous = progress[card.spanish];
    const box = (remembered ? Math.min(5, (previous?.box ?? 1) + 1) : 1) as LeitnerBox;
    const updatedAt = new Date().toISOString();
    const next = { ...progress, [card.spanish]: { box, attempts: (previous?.attempts ?? 0) + 1, correct: (previous?.correct ?? 0) + (remembered ? 1 : 0), updatedAt, nextReviewAt: nextReviewDate(box) } };
    setProgress(next);
    setCurrentTime(Date.now());
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setIndex((current) => current + 1);
    setRevealed(false);
  };

  const speak = () => {
    if (!card || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(card.spanish);
    utterance.lang = "es-ES";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <main className="app-shell flashcard-shell">
      <header className="hero flashcard-hero">
        <div className="hero-topline">
          <Link className="brand flashcard-home" href="/" aria-label="Back to quiz library"><span className="brand-mark">ES</span><span className="brand-title">Spanish Quiz Studio</span></Link>
          <button type="button" className="mode-switch" aria-pressed={darkMode} aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"} onClick={toggleTheme}><svg className="header-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d={darkMode ? "M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" : "M20.25 14.48A7.7 7.7 0 0 1 9.52 3.75 8.55 8.55 0 1 0 20.25 14.48Z"} />{darkMode && <circle cx="12" cy="12" r="4" />}</svg></button>
        </div>
        <div><p className="eyebrow">Leitner system · 500 essential verbs</p><h1>Recall it today. Review it at the right time.</h1><p className="hero-copy">Correct answers move forward through five boxes. A missed card returns to Box 1 for more frequent review.</p></div>
        <div className="flashcard-progress-copy"><span>{finished ? round.length : index + 1} of {round.length}</span><span>{totals.due} due · {totals.studied} studied</span></div>
        <div className="progress" aria-label={`${index} of ${round.length} cards completed in this round`}><span style={{ width: `${(index / Math.max(1, round.length)) * 100}%` }} /></div>
      </header>

      {finished ? (
        <section className="completion-card flashcard-complete"><p className="eyebrow">Session complete</p><h2>{totals.studied} of 500 verbs entered into the system</h2><p>{totals.due ? `${totals.due} due card${totals.due === 1 ? " is" : "s are"} ready for another session.` : "You are caught up. Return when the next box becomes due."}</p>{totals.due > 0 && <button type="button" className="primary" onClick={() => startRound(progress)}>Review due cards</button>}</section>
      ) : (
        <section className="flashcard-stage" aria-live="polite">
          <button type="button" className={`flashcard ${revealed ? "revealed" : ""}`} onClick={() => setRevealed(true)} aria-expanded={revealed}>
            <span className="flashcard-inner">
              <span className="flashcard-face flashcard-front" aria-hidden={revealed}>
                <span className="flashcard-rank">Box {currentBox} · Verb {card.rank}</span><strong lang="es">{card.spanish}</strong><span className="flashcard-prompt">Think of the English meaning, then reveal</span>
              </span>
              <span className="flashcard-face flashcard-back" aria-hidden={!revealed}>
                <span className="flashcard-rank">Box {currentBox} · Verb {card.rank}</span><strong lang="es">{card.spanish}</strong><span className="flashcard-answer"><b lang="en">{card.english}</b><span lang="es">{card.example}</span></span>
              </span>
            </span>
          </button>
          <button type="button" className="flashcard-listen" onClick={speak} aria-label={`Listen to ${card.spanish}`}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M4 9.25h4.1L13.5 5v14l-5.4-4.25H4Z"/><path d="M16.5 8.25a5 5 0 0 1 0 7.5M18.9 5.85a8.4 8.4 0 0 1 0 12.3"/></svg>Listen</button>
          <div className={`flashcard-actions ${revealed ? "visible" : ""}`} aria-hidden={!revealed}>
            <button type="button" className="flashcard-again" disabled={!revealed} onClick={() => recordAnswer(false)}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m7 7 10 10M17 7 7 17" /></svg>Back to Box 1</button>
            <button type="button" className="flashcard-known" disabled={!revealed} onClick={() => recordAnswer(true)}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m5 12.5 4.2 4.2L19 7" /></svg>Move to Box {Math.min(5, currentBox + 1)}</button>
          </div>
        </section>
      )}

      <section className="stats leitner-stats" aria-label="Leitner box progress">
        {totals.boxes.map((count, index) => { const box = (index + 1) as LeitnerBox; const days = REVIEW_INTERVAL_DAYS[box]; return <div key={box}><span className="leitner-box-label">Box {box}</span><strong>{count}</strong><span>{days === 0 ? "Every session" : `${days} day${days === 1 ? "" : "s"}`}</span></div>; })}
      </section>
      <p className="leitner-note"><strong>How it works:</strong> Box 1 cards are reviewed immediately. Boxes 2–5 return after 1, 3, 7 and 14 days. One wrong answer sends a card back to Box 1.</p>
    </main>
  );
}
