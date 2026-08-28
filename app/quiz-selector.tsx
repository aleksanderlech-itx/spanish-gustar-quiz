"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { QUIZ_CONFIG, type QuizId } from "./quiz-config";
import { useTheme } from "./use-theme";
import { orderBoard, type BoardTileProgress } from "./board";
import { readStreakSummary, dayKey, ACTIVITY_IDS, type StreakSummary } from "./streak";
import { emptyQuizProgress, readQuizProgress, readDailyRoundProgress, type DailyRoundProgress } from "./quiz-progress";
import { ROUND_SIZE as FLASHCARDS_ROUND_SIZE } from "./flashcards";
import Drawer from "./drawer";
import Logo from "./logo";

type LibraryQuizId = QuizId | "flashcards";

type BoardItem = BoardTileProgress & {
  id: LibraryQuizId;
  kind: "quiz" | "deck";
  title: string;
  noun: string;
  href: string;
  daily: DailyRoundProgress;
};

const EMPTY_DAILY: DailyRoundProgress = { correct: 0, roundLength: 0, percent: 0, done: false };

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
const EMPTY_WEEK_DAY = { status: "future" as const, doneCount: 0, total: ACTIVITY_IDS.length };
const EMPTY_STREAK: StreakSummary = {
  streak: 0,
  completedToday: false,
  todayDone: 0,
  todayTotal: ACTIVITY_IDS.length,
  week: [
    { letter: "Lu", ...EMPTY_WEEK_DAY }, { letter: "Ma", ...EMPTY_WEEK_DAY }, { letter: "Mi", ...EMPTY_WEEK_DAY },
    { letter: "Ju", ...EMPTY_WEEK_DAY }, { letter: "Vi", ...EMPTY_WEEK_DAY }, { letter: "Sá", ...EMPTY_WEEK_DAY },
    { letter: "Do", ...EMPTY_WEEK_DAY },
  ],
};

/** Grammar quizzes route to the topic detail screen; the round itself is `&play=1` from there. */
const detailPath = (quizId: QuizId) => `/?quiz=${quizId}`;

const FLASHCARD_TOTAL = 500;

/**
 * Flashcards has no round history to read back (each card writes only its current
 * Leitner box, not a per-day log), so the daily gauge is a proxy: cards reviewed today
 * — right or wrong, the Leitner box mechanics stay untouched — against the fixed
 * session size, capped at 100%.
 */
const readFlashcardProgress = (): { progress: Omit<BoardTileProgress, "id">; daily: DailyRoundProgress } => {
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

    const today = dayKey(new Date());
    const reviewedToday = entries.filter((item) => item.updatedAt && dayKey(new Date(item.updatedAt)) === today).length;
    const daily: DailyRoundProgress = {
      correct: reviewedToday,
      roundLength: FLASHCARDS_ROUND_SIZE,
      percent: Math.min(100, Math.round((reviewedToday / FLASHCARDS_ROUND_SIZE) * 100)),
      done: reviewedToday >= FLASHCARDS_ROUND_SIZE,
    };

    return {
      progress: {
        completed,
        total: FLASHCARD_TOTAL,
        percent: Math.round((completed / FLASHCARD_TOTAL) * 100),
        due,
        mastered,
        accuracy: 0,
        lastActivity,
      },
      daily,
    };
  } catch {
    return { progress: emptyQuizProgress(FLASHCARD_TOTAL), daily: EMPTY_DAILY };
  }
};

const dueBarFill = (percent: number) => (percent >= 90 ? "var(--sage)" : "var(--primary)");

export default function QuizSelector() {
  // useSearchParams is router-connected, so this re-evaluates on every client-side
  // Link navigation. usePathname keeps the board scoped to the home route, so
  // content routes such as /how-to-use can use the shared root layout without
  // rendering the board behind them.
  const pathname = usePathname();
  const params = useSearchParams();
  const open = pathname === "/" && !params.has("quiz") && params.get("play") !== "1";
  const [ready, setReady] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const [items, setItems] = useState<BoardItem[]>(() => [
    ...QUIZ_IDS.map((id) => ({ id: id as LibraryQuizId, kind: "quiz" as const, title: QUIZ_CONFIG[id].title.replace(" Quiz", ""), noun: "question", href: detailPath(id), daily: EMPTY_DAILY, ...emptyQuizProgress(QUIZ_CONFIG[id].questions.length) })),
    { id: "flashcards" as LibraryQuizId, kind: "deck" as const, title: "Spanish Verb Flashcards", noun: "card", href: "/?quiz=flashcards&play=1", daily: EMPTY_DAILY, ...emptyQuizProgress(FLASHCARD_TOTAL) },
  ]);
  const [streak, setStreak] = useState<StreakSummary>(EMPTY_STREAK);

  useEffect(() => {
    // Re-reads progress every time the board becomes visible again, not just on
    // first mount, so returning from a round shows the round's updated numbers.
    if (!open) return;
    const flashcards = readFlashcardProgress();
    const nextItems: BoardItem[] = [
      ...QUIZ_IDS.map((id) => ({
        id,
        kind: "quiz" as const,
        title: QUIZ_CONFIG[id].title.replace(" Quiz", ""),
        noun: "question",
        href: detailPath(id),
        daily: readDailyRoundProgress(id),
        ...readQuizProgress(id),
      })),
      {
        id: "flashcards" as LibraryQuizId,
        kind: "deck" as const,
        title: "Spanish Verb Flashcards",
        noun: "card",
        href: "/?quiz=flashcards&play=1",
        daily: flashcards.daily,
        ...flashcards.progress,
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
  const pinnedItem = board.find((item) => item.pinned);
  const restItems = board.filter((item) => !item.pinned);
  const totalLogged = items.reduce((sum, item) => sum + item.completed, 0);

  if (!ready || !open) return null;

  return (
    <main className="quiz-library board-home" aria-labelledby="quiz-library-title">
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} returnFocusRef={hamburgerRef} />

      <div className="board-rail">
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
          <h1 id="quiz-library-title" className="board-title">
            <Logo size={24} />
            <span>Spanish Quizzes</span>
          </h1>
          <button
            type="button"
            className="mode-switch board-header-theme"
            aria-pressed={theme === "dark"}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggleTheme}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            <span className="sr-only">{theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}</span>
          </button>
        </header>

        <nav className="board-nav" aria-label="Sections">
          <span className="board-nav-link board-nav-link-active" aria-current="page"><span className="board-nav-dot" aria-hidden="true" />Today&apos;s board</span>
          <button type="button" className="board-nav-link" onClick={() => setDrawerOpen(true)}><span className="board-nav-dot" aria-hidden="true" />Progress &amp; history</button>
          <button type="button" className="board-nav-link" onClick={() => setDrawerOpen(true)}><span className="board-nav-dot" aria-hidden="true" />Mistake notebook</button>
          <a href="/how-to-use" className="board-nav-link"><span className="board-nav-dot" aria-hidden="true" />How to use</a>
        </nav>

        <section className="streak-panel" aria-label={`${streak.streak} day streak`}>
          <div className="streak-panel-top">
            <div className="streak-count">
              <strong>{streak.streak}</strong>
              <div>
                <span className="streak-label">días seguidos</span>
                <span className="streak-goal">Goal: a round in all {streak.todayTotal} activities · {streak.todayDone}/{streak.todayTotal} today</span>
              </div>
            </div>
          </div>
          <div className="streak-week" role="list" aria-label="This week's practice">
            {streak.week.map((day, index) => {
              const isToday = day.status === "today";
              const fill = isToday && day.total ? Math.round((day.doneCount / day.total) * 100) : undefined;
              return (
                <span
                  key={index}
                  className={`streak-day streak-day-${day.status}`}
                  style={isToday ? { background: `linear-gradient(90deg, var(--sun) ${fill}%, transparent ${fill}%)` } : undefined}
                  role="listitem"
                  aria-label={day.status === "done" ? "All activities done" : day.status === "today" ? `${day.doneCount} of ${day.total} activities done today` : "Not yet"}
                />
              );
            })}
          </div>
          <div className="streak-week-letters" aria-hidden="true">
            {streak.week.map((day, index) => <span key={index}>{day.letter}</span>)}
          </div>
        </section>

        <button type="button" className="board-nav-theme" onClick={toggleTheme}>
          <span>{theme === "dark" ? "Dark mode" : "Light mode"}</span>
          <span aria-hidden="true">{theme === "dark" ? "☾" : "☀"}</span>
        </button>
      </div>

      <div className="board-content">
        <div className="board-section-head board-section-head-primary">
          <p className="eyebrow">Today&apos;s board</p>
          <span>sized by what&apos;s due</span>
        </div>

        <div className="board-page-head">
          <div>
            <p className="eyebrow">Today&apos;s board</p>
            <h2 className="board-page-title">Pick up where you left off</h2>
            <p className="board-page-sub">Your current quiz leads as one wide row; the rest of the board sits underneath, sized by what&apos;s actually due.</p>
          </div>
          <div className="board-total"><strong>{totalLogged}</strong><span>cards &amp; questions logged</span></div>
        </div>

        {pinnedItem && (
          <a className="board-tile board-tile-pinned" href={pinnedItem.href}>
            <span className="board-tile-top-pills">
              <span className="board-tile-pill board-tile-pill-progress">In progress</span>
              {pinnedItem.daily.done ? (
                <span className="board-tile-pill board-tile-pill-today">✓ Today</span>
              ) : pinnedItem.daily.roundLength ? (
                <span className="board-tile-pill board-tile-pill-today board-tile-pill-today-pending">
                  {pinnedItem.daily.correct}/{pinnedItem.daily.roundLength} today
                </span>
              ) : null}
            </span>
            <div className="board-ring" style={{ background: `conic-gradient(var(--primary) ${pinnedItem.daily.percent}%, var(--line) ${pinnedItem.daily.percent}%)` }}>
              <div className="board-ring-inner"><strong>{pinnedItem.daily.percent}%</strong></div>
            </div>
            <div className="board-tile-pinned-body">
              <h2>{pinnedItem.title}</h2>
              <p className="board-tile-meta">
                Today: {pinnedItem.daily.correct} of {pinnedItem.daily.roundLength || "–"} correct · {pinnedItem.completed} of {pinnedItem.total} total done
              </p>
            </div>
            <span className="board-icon board-icon-pinned"><BoardIcon kind={pinnedItem.kind} /></span>
            <span className="board-tile-pinned-cta" aria-hidden="true">Continue →</span>
          </a>
        )}

        {pinnedItem && restItems.length > 0 && (
          <div className="board-section-head board-section-head-secondary">
            <p className="eyebrow">Other activities</p>
          </div>
        )}

        <section className="board-grid" aria-label="Available quizzes and decks">
        {restItems.map((item) => {
          const todayPill = item.daily.done ? (
            <span className="board-tile-pill board-tile-pill-today">✓ Today</span>
          ) : item.daily.roundLength ? (
            <span className="board-tile-pill board-tile-pill-today board-tile-pill-today-pending">
              {item.daily.correct}/{item.daily.roundLength} today
            </span>
          ) : null;

          if (item.due > 0) {
            return (
              <a className="board-tile board-tile-due" href={item.href} key={item.id}>
                <div className="board-tile-top">
                  <span className="board-icon"><BoardIcon kind={item.kind} /></span>
                  <span className="board-tile-top-pills">
                    {todayPill}
                    <span className="board-tile-pill board-tile-pill-due">{item.due} due</span>
                  </span>
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
                <span className="board-tile-top-pills">
                  {todayPill}
                  <span className="board-tile-note board-tile-note-quiet">nothing due</span>
                </span>
              </div>
              <h2>{item.title}</h2>
              <div className="board-bar board-bar-quiet" aria-hidden="true"><span style={{ width: `${item.percent}%`, background: dueBarFill(item.percent) }} /></div>
            </a>
          );
        })}
      </section>

        <p className="library-note">Progress, filters, scoring, audio and review history remain attached to each quiz.</p>
      </div>
    </main>
  );
}
