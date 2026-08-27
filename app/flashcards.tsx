"use client";

import { type MouseEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FLASHCARD_VERBS, type FlashcardVerb } from "./flashcards-data";
import { recordActivityToday } from "./streak";
import { speak } from "./speak";

type LeitnerBox = 1 | 2 | 3 | 4 | 5;
type CardRecord = { box: LeitnerBox; attempts: number; correct: number; updatedAt: string; nextReviewAt: string };
type LeitnerProgress = Record<string, CardRecord>;
type LegacyProgress = Record<string, { remembered?: boolean; attempts?: number; updatedAt?: string }>;

const STORAGE_KEY = "spanish-flashcards-leitner-v2";
const LEGACY_STORAGE_KEY = "spanish-flashcards-progress-v1";
const ROUND_SIZE = 20;
const DAY = 86_400_000;
const REVIEW_INTERVAL_DAYS: Record<LeitnerBox, number> = { 1: 0, 2: 1, 3: 3, 4: 7, 5: 14 };
const BOXES: LeitnerBox[] = [1, 2, 3, 4, 5];

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);
const nextReviewDate = (box: LeitnerBox, from = Date.now()) => new Date(from + REVIEW_INTERVAL_DAYS[box] * DAY).toISOString();
const dueCopy = (box: LeitnerBox) => (REVIEW_INTERVAL_DAYS[box] === 0 ? "due now" : `due in ${REVIEW_INTERVAL_DAYS[box]} day${REVIEW_INTERVAL_DAYS[box] === 1 ? "" : "s"}`);

/** Where a box sits relative to the card currently on screen. */
const boxState = (box: LeitnerBox, currentBox: LeitnerBox): "current" | "next" | "mastered" | "unreached" => {
  if (box === currentBox) return "current";
  if (box === currentBox + 1) return "next";
  if (box === 5) return "mastered";
  return "unreached";
};

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
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState<LeitnerProgress>({});
  const [round, setRound] = useState<FlashcardVerb[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    // Selecting a round reads localStorage and shuffles with Math.random — both
    // unavailable/non-deterministic during the server render. Resolving them as
    // useState lazy initializers (the previous approach) ran that same shuffle
    // again on the client during hydration, so the round rendered on the server
    // (empty progress, one random order) never matched the client's first render
    // (a different random order), corrupting hydration for this whole screen and
    // silently breaking the reveal tap along with it.
    const stored = readStoredProgress();
    const now = Date.now();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(stored);
    setRound(selectRound(stored, now));
    setCurrentTime(now);
    setReady(true);
  }, []);

  const startRound = (source: LeitnerProgress) => {
    const now = Date.now();
    setCurrentTime(now);
    setRound(selectRound(source, now));
    setIndex(0);
    setRevealed(false);
  };

  const totals = useMemo(() => {
    const boxes = BOXES.map((box) => Object.values(progress).filter((item) => item.box === box).length);
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
    recordActivityToday();
    setIndex((current) => current + 1);
    setRevealed(false);
  };

  const reveal = () => setRevealed(true);
  const speakCard = (event: MouseEvent) => {
    event.stopPropagation();
    if (card) speak(card.spanish);
  };

  if (!ready) return null;

  return (
    <main className="flashcard-shell">
      <header className="flashcard-top-header">
        <Link className="round-back" href="/" aria-label="Back to board"><span aria-hidden="true">←</span></Link>
        <span className="flashcard-counter">Card {finished ? round.length : index + 1} of {round.length}</span>
        <div className="flashcard-box-row" aria-label="Leitner box progress">
          {BOXES.map((box) => <span key={box} className={`flashcard-box-dot flashcard-box-dot-${boxState(box, currentBox)}`} />)}
        </div>
      </header>

      {finished ? (
        <section className="completion-card flashcard-complete"><p className="eyebrow">Session complete</p><h2>{totals.studied} of 500 verbs entered into the system</h2><p>{totals.due ? `${totals.due} due card${totals.due === 1 ? " is" : "s are"} ready for another session.` : "You are caught up. Return when the next box becomes due."}</p>{totals.due > 0 && <button type="button" className="primary" onClick={() => startRound(progress)}>Review due cards</button>}</section>
      ) : (
        <section className="flashcard-stage" aria-live="polite">
          <div
            className={`flashcard ${revealed ? "revealed" : ""}`}
            role="button"
            tabIndex={0}
            aria-expanded={revealed}
            onClick={reveal}
            onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); reveal(); } }}
          >
            <span className="flashcard-inner">
              <span className="flashcard-face flashcard-front" aria-hidden={revealed}>
                <p className="eyebrow-clay">Tap to reveal</p>
                <div className="flashcard-term-row">
                  <strong lang="es">{card.spanish}</strong>
                  <button type="button" className="flashcard-speak" aria-label={`Listen to ${card.spanish}`} onClick={speakCard}>🔊</button>
                </div>
                <span className="flashcard-due-pill">Box {currentBox} · {dueCopy(currentBox)}</span>
              </span>
              <span className="flashcard-face flashcard-back" aria-hidden={!revealed}>
                <p className="eyebrow-clay">Spanish → English</p>
                <div className="flashcard-term-row">
                  <strong lang="es">{card.spanish}</strong>
                  <button type="button" className="flashcard-speak" aria-label={`Listen to ${card.spanish}`} onClick={speakCard}>🔊</button>
                </div>
                <div className="flashcard-reveal-divider" />
                <p className="flashcard-meaning" lang="en">{card.english}</p>
                <p className="flashcard-example" lang="es">{card.example}</p>
                <span className="flashcard-due-pill">Box {currentBox} · {dueCopy(currentBox)}</span>
              </span>
            </span>
          </div>

          <footer className="flashcard-footer">
            {!revealed ? (
              <button type="button" className="flashcard-reveal" onClick={reveal}>Reveal</button>
            ) : (
              <>
                <button type="button" className="flashcard-again" disabled={!revealed} onClick={() => recordAnswer(false)}><span aria-hidden="true">↺</span> Again</button>
                <button type="button" className="flashcard-known" disabled={!revealed} onClick={() => recordAnswer(true)}><span aria-hidden="true">✓</span> Knew it</button>
              </>
            )}
          </footer>
        </section>
      )}

      <section className="stats leitner-stats" aria-label="Leitner box progress">
        {totals.boxes.map((count, boxIndex) => { const box = (boxIndex + 1) as LeitnerBox; const days = REVIEW_INTERVAL_DAYS[box]; return <div key={box}><span className="leitner-box-label">Box {box}</span><strong>{count}</strong><span>{days === 0 ? "Every session" : `${days} day${days === 1 ? "" : "s"}`}</span></div>; })}
      </section>
      <p className="leitner-note"><strong>How it works:</strong> Box 1 cards are reviewed immediately. Boxes 2–5 return after 1, 3, 7 and 14 days. One wrong answer sends a card back to Box 1.</p>
    </main>
  );
}
