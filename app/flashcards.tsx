"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FLASHCARD_VERBS } from "./flashcards-data";

type CardProgress = Record<string, { remembered: boolean; attempts: number; updatedAt: string }>;

const STORAGE_KEY = "spanish-flashcards-progress-v1";
const ROUND_SIZE = 20;

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

const readStoredProgress = (): CardProgress => {
  if (typeof window === "undefined") return {};
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) as CardProgress : {};
  } catch {
    return {};
  }
};

const selectRound = (source: CardProgress) => {
  const learning = shuffle(FLASHCARD_VERBS.filter((card) => source[card.spanish]?.remembered === false));
  const unseen = shuffle(FLASHCARD_VERBS.filter((card) => !source[card.spanish]));
  const remembered = shuffle(FLASHCARD_VERBS.filter((card) => source[card.spanish]?.remembered === true));
  return [...learning, ...unseen, ...remembered].slice(0, ROUND_SIZE);
};

export default function Flashcards() {
  const [progress, setProgress] = useState<CardProgress>(readStoredProgress);
  const [round, setRound] = useState(() => selectRound(readStoredProgress()));
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const startRound = (source: CardProgress) => {
    setRound(selectRound(source));
    setIndex(0);
    setRevealed(false);
  };

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    return () => document.body.classList.remove("dark");
  }, [darkMode]);

  const totals = useMemo(() => {
    const values = Object.values(progress);
    return {
      studied: values.length,
      remembered: values.filter((item) => item.remembered).length,
      learning: values.filter((item) => !item.remembered).length,
    };
  }, [progress]);

  const card = round[index];
  const finished = index >= round.length;

  const recordAnswer = (remembered: boolean) => {
    if (!card || !revealed) return;
    const previous = progress[card.spanish];
    const next = {
      ...progress,
      [card.spanish]: {
        remembered,
        attempts: (previous?.attempts ?? 0) + 1,
        updatedAt: new Date().toISOString(),
      },
    };
    setProgress(next);
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
          <Link className="brand flashcard-home" href="/" aria-label="Back to quiz library">
            <span className="brand-mark">ES</span>
            <span className="brand-title">Spanish Quiz Studio</span>
          </Link>
          <button type="button" className="mode-switch" aria-pressed={darkMode} aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"} onClick={() => setDarkMode((value) => !value)}>
            <svg className="header-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d={darkMode ? "M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" : "M20.25 14.48A7.7 7.7 0 0 1 9.52 3.75 8.55 8.55 0 1 0 20.25 14.48Z"} />{darkMode && <circle cx="12" cy="12" r="4" />}</svg>
          </button>
        </div>
        <div>
          <p className="eyebrow">500 essential verbs</p>
          <h1>Recall the meaning before you turn the card.</h1>
          <p className="hero-copy">Cards you are still learning return first. Your result is saved after every answer.</p>
        </div>
        <div className="flashcard-progress-copy"><span>{finished ? round.length : index + 1} of {round.length}</span><span>{totals.remembered} remembered · {totals.learning} learning</span></div>
        <div className="progress" aria-label={`${index} of ${round.length} cards completed in this round`}><span style={{ width: `${(index / Math.max(1, round.length)) * 100}%` }} /></div>
      </header>

      {finished ? (
        <section className="completion-card flashcard-complete">
          <p className="eyebrow">Round complete</p>
          <h2>{totals.studied} of 500 verbs studied</h2>
          <p>{totals.learning ? `${totals.learning} card${totals.learning === 1 ? "" : "s"} will return early in the next round.` : "Every studied card is currently remembered."}</p>
          <button type="button" className="primary" onClick={() => startRound(progress)}>Start next round</button>
        </section>
      ) : (
        <section className="flashcard-stage" aria-live="polite">
          <button type="button" className={`flashcard ${revealed ? "revealed" : ""}`} onClick={() => setRevealed(true)} aria-expanded={revealed}>
            <span className="flashcard-rank">Verb {card.rank}</span>
            <strong lang="es">{card.spanish}</strong>
            {revealed ? (
              <span className="flashcard-answer">
                <b lang="en">{card.english}</b>
                <span lang="es">{card.example}</span>
              </span>
            ) : <span className="flashcard-prompt">Think of the English meaning, then reveal</span>}
          </button>

          <button type="button" className="flashcard-listen" onClick={speak} aria-label={`Listen to ${card.spanish}`}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M4 9.25h4.1L13.5 5v14l-5.4-4.25H4Z"/><path d="M16.5 8.25a5 5 0 0 1 0 7.5M18.9 5.85a8.4 8.4 0 0 1 0 12.3"/></svg>
            Listen
          </button>

          <div className={`flashcard-actions ${revealed ? "visible" : ""}`} aria-hidden={!revealed}>
            <button type="button" className="flashcard-again" disabled={!revealed} onClick={() => recordAnswer(false)}>
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m7 7 10 10M17 7 7 17" /></svg>
              Still learning
            </button>
            <button type="button" className="flashcard-known" disabled={!revealed} onClick={() => recordAnswer(true)}>
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m5 12.5 4.2 4.2L19 7" /></svg>
              Remembered
            </button>
          </div>
        </section>
      )}

      <section className="stats flashcard-stats" aria-label="Flashcard progress">
        <div><strong>{totals.studied}</strong><span>Studied</span></div>
        <div><strong>{totals.remembered}</strong><span>Remembered</span></div>
        <div><strong>{totals.learning}</strong><span>Still learning</span></div>
      </section>
    </main>
  );
}
