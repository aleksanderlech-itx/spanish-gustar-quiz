"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { QUIZ_CONFIG, type QuizId } from "./quiz-config";
import { useTheme } from "./use-theme";
import { orderBoard, type BoardTileProgress } from "./board";
import { readStreakSummary, type StreakSummary } from "./streak";
import { emptyQuizProgress, readQuizProgress } from "./quiz-progress";
import Drawer from "./drawer";

type LibraryQuizId = QuizId | "flashcards";

type BoardItem = BoardTileProgress & {
  id: LibraryQuizId;
  kind: "quiz" | "deck";
  title: string;
  noun: string;
  href: string;
};

/** A checkmark reads as "quiz" without borrowing the "?" glyph, which looks like a help button. */
const QuizIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 12.5l5 5L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Two fanned, empty playing cards for the flashcard deck. The front card's fill is
 * set in CSS (scoped per tile variant) so it occludes the back card like a real fan
 * of cards, rather than showing both outlines crossing through each other. */
const FlashcardsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3.5" y="4.5" width="12" height="16" rx="2.2" transform="rotate(-14 9.5 12.5)" stroke="currentColor" strokeWidth="2" />
    <rect className="card-front" x="8.5" y="3.5" width="12" height="16" rx="2.2" transform="rotate(14 14.5 11.5)" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const BoardIcon = ({ kind }: { kind: "quiz" | "deck" }) => (kind === "deck" ? <FlashcardsIcon /> : <QuizIcon />);

/** Replaces the plain "☀"/"☾" text glyphs, which rendered thin and small at the
 * inherited body font-size — these fill the 44px button like every other icon. */
const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
  </svg>
);

const QUIZ_IDS = Object.keys(QUIZ_CONFIG) as QuizId[];
const EMPTY_STREAK: StreakSummary = {
  streak: 0,
  completedToday: false,
  week: [
    { letter: "Lu", status: "future" }, { letter: "Ma", status: "future" }, { letter: "Mi", status: "future" },
    { letter: "Ju", status: "future" }, { letter: "Vi", status: "future" }, { letter: "Sá", status: "future" },
    { letter: "Do", status: "future" },
  ],
};

/** Grammar quizzes route to the topic detail screen; the round itself is `&play=1` from there. */
const detailPath = (quizId: QuizId) => `/?quiz=${quizId}`;

const FLASHCARD_TOTAL = 500;

const readFlashcardProgress = (): Omit<BoardTileProgress, "id"> => {
  try {
    const raw = window.localStorage.getItem("spanish-flashcards-leitner-v2") ?? window.localStorage.getItem("spanish-flashcards-progress-v1");
    const saved = raw ? JSON.parse(raw) as Record<string, { box?: number; nextReviewAt?: string; updatedAt?: string }> : {};
    const entries = Object.values(saved);
    const completed = entries.length;
    const now = Date.now();
    const due = entries.filter((item) => item.nextReviewAt && Date.parse(item.nextReviewAt) <= now).length;
    const mastered = entries.filter((item) => item.box === 5).length;
    const lastActivity = entries.reduce<string | null>(
      (latest, item) => (item.updatedAt && (!latest || item.updatedAt > latest) ? item.updatedAt : latest),
      null,
    );

    return {
      completed,
      total: FLASHCARD_TOTAL,
      percent: Math.round((completed / FLASHCARD_TOTAL) * 100),
      due,
      mastered,
      accuracy: 0,
      lastActivity,
    };
  } catch {
    return emptyQuizProgress(FLASHCARD_TOTAL);
  }
};

const dueBarFill = (percent: number) => (percent >= 90 ? "var(--sage)" : "var(--primary)");

export default function QuizSelector() {
  // useSearchParams is router-connected, so this re-evaluates on every client-side
  // Link navigation — a one-shot read of the browser's own location (the previous
  // approach) only ever saw the URL at first mount, so the board stayed hidden/stale
  // after navigating back to it from a round, chart, or results screen.
  const params = useSearchParams();
  const open = !params.has("quiz") && params.get("play") !== "1";
  const [ready, setReady] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const [items, setItems] = useState<BoardItem[]>(() => [
    ...QUIZ_IDS.map((id) => ({ id: id as LibraryQuizId, kind: "quiz" as const, title: QUIZ_CONFIG[id].title.replace(" Quiz", ""), noun: "question", href: detailPath(id), ...emptyQuizProgress(QUIZ_CONFIG[id].questions.length) })),
    { id: "flashcards" as LibraryQuizId, kind: "deck" as const, title: "Spanish Verb Flashcards", noun: "card", href: "/?quiz=flashcards&play=1", ...emptyQuizProgress(FLASHCARD_TOTAL) },
  ]);
  const [streak, setStreak] = useState<StreakSummary>(EMPTY_STREAK);

  useEffect(() => {
    // Re-reads progress every time the board becomes visible again, not just on
    // first mount, so returning from a round shows the round's updated numbers.
    if (!open) return;
    const nextItems: BoardItem[] = [
      ...QUIZ_IDS.map((id) => ({
        id,
        kind: "quiz" as const,
        title: QUIZ_CONFIG[id].title.replace(" Quiz", ""),
        noun: "question",
        href: detailPath(id),
        ...readQuizProgress(id),
      })),
      {
        id: "flashcards",
        kind: "deck",
        title: "Spanish Verb Flashcards",
        noun: "card",
        href: "/?quiz=flashcards&play=1",
        ...readFlashcardProgress(),
      },
    ];
    // Browser storage is unavailable during the server render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(nextItems);
    setStreak(readStreakSummary());
    setReady(true);
  }, [open]);

  useEffect(() => {
    document.body.classList.toggle("quiz-library-open", ready && open);
    return () => document.body.classList.remove("quiz-library-open");
  }, [open, ready]);

  const board = useMemo(() => orderBoard(items), [items]);

  if (!ready || !open) return null;

  return (
    <main className="quiz-library board-home" aria-labelledby="quiz-library-title">
      <header className="board-header">
        <button
          type="button"
          className="mode-switch"
          aria-label="Open menu"
          aria-haspopup="dialog"
          aria-expanded={drawerOpen}
          ref={hamburgerRef}
          onClick={() => setDrawerOpen(true)}
        >
          <span className="hamburger-icon" aria-hidden="true"><span /><span /><span /></span>
        </button>
        <h1 id="quiz-library-title" className="board-title">Quiz Studio</h1>
        <button
          type="button"
          className="mode-switch"
          aria-pressed={theme === "dark"}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          onClick={toggleTheme}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          <span className="sr-only">{theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}</span>
        </button>
      </header>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} returnFocusRef={hamburgerRef} />

      <section className="streak-panel" aria-label={`${streak.streak} day streak`}>
        <div className="streak-panel-top">
          <div className="streak-count">
            <strong>{streak.streak}</strong>
            <div>
              <span className="streak-label">días seguidos</span>
              <span className="streak-goal">Goal: 1 round a day</span>
            </div>
          </div>
        </div>
        <div className="streak-week" role="list" aria-label="This week's practice">
          {streak.week.map((day, index) => (
            <span key={index} className={`streak-day streak-day-${day.status}`} role="listitem" aria-label={day.status === "done" ? "Practised" : day.status === "today" ? "Today" : "Not yet"} />
          ))}
        </div>
        <div className="streak-week-letters" aria-hidden="true">
          {streak.week.map((day, index) => <span key={index}>{day.letter}</span>)}
        </div>
      </section>

      <div className="board-section-head">
        <p className="eyebrow">Today&apos;s board</p>
        <span>sized by what&apos;s due</span>
      </div>

      <section className="board-grid" aria-label="Available quizzes and decks">
        {board.map((item) => {
          if (item.pinned) {
            return (
              <a className="board-tile board-tile-pinned" href={item.href} key={item.id}>
                <span className="board-tile-pill board-tile-pill-progress">In progress</span>
                <span className="board-icon board-icon-pinned"><BoardIcon kind={item.kind} /></span>
                <div className="board-ring" style={{ background: `conic-gradient(var(--primary) ${item.percent}%, var(--line) ${item.percent}%)` }}>
                  <div className="board-ring-inner"><strong>{item.percent}%</strong></div>
                </div>
                <h2>{item.title}</h2>
                <p className="board-tile-meta">
                  {item.due} {item.noun}{item.due === 1 ? "" : "s"} due · {item.completed} of {item.total} done
                </p>
              </a>
            );
          }

          if (item.due > 0) {
            return (
              <a className="board-tile board-tile-due" href={item.href} key={item.id}>
                <div className="board-tile-top">
                  <span className="board-icon"><BoardIcon kind={item.kind} /></span>
                  <span className="board-tile-pill board-tile-pill-due">{item.due} due</span>
                </div>
                <h2>{item.title}</h2>
                <div className="board-tile-bottom">
                  <div className="board-bar" aria-hidden="true"><span style={{ width: `${item.total ? Math.round((item.mastered / item.total) * 100) : 0}%` }} /></div>
                  <span className="board-tile-note">{item.mastered} of {item.total} mastered</span>
                </div>
              </a>
            );
          }

          return (
            <a className="board-tile board-tile-quiet" href={item.href} key={item.id}>
              <div className="board-tile-top">
                <span className="board-icon board-icon-quiet"><BoardIcon kind={item.kind} /></span>
                <span className="board-tile-note board-tile-note-quiet">nothing due</span>
              </div>
              <h2>{item.title}</h2>
              <div className="board-bar board-bar-quiet" aria-hidden="true"><span style={{ width: `${item.percent}%`, background: dueBarFill(item.percent) }} /></div>
            </a>
          );
        })}
      </section>

      <p className="library-note">Progress, filters, scoring, audio and review history remain attached to each quiz.</p>
    </main>
  );
}
