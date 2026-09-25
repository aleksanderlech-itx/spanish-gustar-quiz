"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { QUIZ_CONFIG, QUIZ_IDS, type QuizId } from "./quiz-config";
import { ACTIVITY_REGISTRY, type ActivityId, type ActivityRegistryEntry } from "./activity-registry";
import { useTheme } from "./use-theme";
import { orderBoard, type BoardTileProgress } from "./board";
import { readStreakSummary, mergeActivityDays, dayKey, readFlashcardDaysReviewed, ACTIVITY_IDS, type StreakSummary } from "./streak";
import { emptyQuizProgress, readQuizProgress, readDailyRoundProgress, type DailyRoundProgress, type QuizProgress } from "./quiz-progress";
import { isQuizHiddenFromBoard, readQuizCompletion, markQuizCompleted } from "./quiz-completion";
import type { QuizResult } from "./quiz-logic";
import { ROUND_SIZE as FLASHCARDS_ROUND_SIZE, MAX_BOX as MAX_FLASHCARD_BOX } from "./flashcards";
import Drawer from "./drawer";
import Logo from "./logo";
import { SunIcon, MoonIcon } from "./theme-icons";

type BoardItem = BoardTileProgress & {
  id: ActivityId;
  kind: "quiz" | "deck";
  title: string;
  noun: string;
  href: string;
  daily: DailyRoundProgress;
};

const EMPTY_DAILY: DailyRoundProgress = { correct: 0, roundLength: 0, percent: 0, done: false };

/** The first four paths match the approved Library reference exactly. */
const TOPIC_ICON_PATHS: Record<QuizId, string> = {
  "ser-estar": "m3 10 9-7 9 7M4 10h16M5 10v9m5-9v9m4-9v9m5-9v9M3 21h18",
  gustar: "M20.8 8.6c0 4.1-5.1 8.4-8.8 11.2C8.3 17 3.2 12.7 3.2 8.6a5 5 0 0 1 8.8-3.2 5 5 0 0 1 8.8 3.2Z",
  "por-para": "M12 3v18M4 7h14l3 3-3 3H4l-3-3 3-3Zm16 9H6l-3 3 3 3h14l3-3-3-3Z",
  "preterite-imperfect": "M12 6c-3.2-2-6.3-2.3-10-1v14c3.7-1.3 6.8-1 10 1 3.2-2 6.3-2.3 10-1V5c-3.7-1.3-6.8-1-10 1Zm0 0v14",
  "object-pronouns": "M4 12.5l5 5L20 7",
};

/** Two fanned, empty playing cards for the flashcard deck. The front card's fill is
 * set in CSS (scoped per tile variant) so it occludes the back card like a real fan
 * of cards, rather than showing both outlines crossing through each other. */
const FlashcardsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3.5" y="4.5" width="12" height="16" rx="2.2" transform="rotate(-14 9.5 12.5)" stroke="currentColor" strokeWidth="2" />
    <rect className="card-front" x="8.5" y="3.5" width="12" height="16" rx="2.2" transform="rotate(14 14.5 11.5)" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const BoardIcon = ({ id }: { id: ActivityId }) => (id === "flashcards" ? <FlashcardsIcon /> : (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={TOPIC_ICON_PATHS[id]} />
  </svg>
));

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

const FLASHCARD_TOTAL = 500;

/** Assembles one board tile from a registry entry plus its progress/daily numbers, so the
 * quiz and flashcards branches of the board share one shape instead of two hand-built objects. */
const boardItem = (entry: ActivityRegistryEntry, progress: QuizProgress, daily: DailyRoundProgress): BoardItem => ({
  id: entry.id,
  kind: entry.icon,
  title: entry.title,
  noun: entry.activityType === "flashcards" ? "card" : "question",
  href: entry.path,
  daily,
  ...progress,
});

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
    const mastered = entries.filter((item) => item.box === MAX_FLASHCARD_BOX).length;
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

/**
 * Rebuilds the full activity/day ledger from each quiz's and the flashcard deck's own
 * stored history, not just today's. The streak ledger is only ever written at the moment
 * a round finishes (round.tsx/flashcards.tsx); if that write ever missed a day — an old
 * app version, a closed tab, this one storage key cleared — the streak silently
 * under-reports forever after, even though the quiz/flashcard history it's derived from
 * is still there. Re-deriving every day on each board load makes the ledger self-healing.
 */
const backfillEntries = (): Array<{ activity: ActivityId; day: string }> => {
  const entries: Array<{ activity: ActivityId; day: string }> = [];

  QUIZ_IDS.forEach((quizId) => {
    try {
      const raw = window.localStorage.getItem(QUIZ_CONFIG[quizId].storageKey);
      const history = raw ? (JSON.parse(raw) as QuizResult[]) : [];
      history.filter((item) => item.mode !== "review").forEach((item) => {
        entries.push({ activity: quizId, day: dayKey(new Date(item.date)) });
      });
    } catch {
      // Corrupt or unavailable history for this quiz; skip its backfill.
    }
  });

  // Each Leitner card record only keeps its own most recent `updatedAt`, so it can't
  // tell us every day flashcards were reviewed — only readFlashcardDaysReviewed can.
  readFlashcardDaysReviewed().forEach((day) => entries.push({ activity: "flashcards", day }));

  return entries;
};

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
  const [items, setItems] = useState<BoardItem[]>(() => ACTIVITY_REGISTRY.map((entry) => boardItem(
    entry,
    emptyQuizProgress(entry.activityType === "flashcards" ? FLASHCARD_TOTAL : QUIZ_CONFIG[entry.id as QuizId].questions.length),
    EMPTY_DAILY,
  )));
  const [streak, setStreak] = useState<StreakSummary>(EMPTY_STREAK);

  useEffect(() => {
    // Re-reads progress every time the board becomes visible again, not just on
    // first mount, so returning from a round shows the round's updated numbers.
    // Also re-reads when the drawer opens/closes, so a "show on main screen" choice
    // made in Settings (drawer.tsx) appears on the board without a page reload.
    if (!open) return;
    const flashcards = readFlashcardProgress();
    const progressById = Object.fromEntries(QUIZ_IDS.map((id) => [id, readQuizProgress(id)])) as Record<QuizId, QuizProgress>;
    // Self-heal: a quiz fully mastered before this device ever recorded a completion timestamp
    // (e.g. its last outstanding miss was cleared by a review round, which used to skip the mark)
    // gets backfilled here, the same way the streak ledger backfills from history on every load.
    QUIZ_IDS.forEach((id) => {
      const progress = progressById[id];
      if (progress.completed > 0 && progress.due === 0 && progress.percent === 100 && !readQuizCompletion(id)) {
        markQuizCompleted(id, progress.lastActivity ? new Date(progress.lastActivity) : new Date());
      }
    });
    const nextItems: BoardItem[] = ACTIVITY_REGISTRY
      .filter((entry) => entry.activityType === "flashcards" || !isQuizHiddenFromBoard(entry.id as QuizId))
      .map((entry) => entry.activityType === "flashcards"
        ? boardItem(entry, flashcards.progress, flashcards.daily)
        : boardItem(entry, progressById[entry.id as QuizId], readDailyRoundProgress(entry.id as QuizId)));
    // Backfill the whole streak ledger from the same ground truth the tiles just read, so
    // the streak panel can never under-report what the quiz/flashcard history already shows.
    mergeActivityDays(backfillEntries());

    // Browser storage is unavailable during the server render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(nextItems);
    setStreak(readStreakSummary());
    setReady(true);
  }, [open, drawerOpen]);

  useEffect(() => {
    document.body.classList.toggle("quiz-library-open", ready && open);
    return () => document.body.classList.remove("quiz-library-open");
  }, [open, ready]);

  const board = useMemo(() => orderBoard(items), [items]);
  const pinnedItem = board.find((item) => item.pinned);
  const featuredItem = pinnedItem ?? board[0];
  const restItems = board.filter((item) => item.id !== featuredItem?.id);
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
          <a href="/notes" className="board-nav-link"><span className="board-nav-dot" aria-hidden="true" />Notes</a>
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
            <p className="board-page-sub">Your current quiz stays at the top. Everything else below is sorted by what still needs practice.</p>
          </div>
          <div className="board-total"><strong>{totalLogged}</strong><span>cards &amp; questions logged</span></div>
        </div>

        {featuredItem && (
          <a className="board-tile board-tile-pinned" href={featuredItem.href}>
            <div className="board-feature-intro">
              <p className="eyebrow">Keep learning</p>
              <h2>Make Spanish part of your day.</h2>
              <p>A little practice. A little more confidence.</p>
            </div>
            <span className="board-tile-top-pills">
              <span className="board-tile-pill board-tile-pill-progress">{featuredItem.pinned ? "In progress" : "New"}</span>
              {featuredItem.daily.done ? (
                <span className="board-tile-pill board-tile-pill-today">✓ Today</span>
              ) : featuredItem.daily.roundLength ? (
                <span className="board-tile-pill board-tile-pill-today board-tile-pill-today-pending">
                  {featuredItem.daily.correct}/{featuredItem.daily.roundLength} today
                </span>
              ) : null}
            </span>
            <div className="board-tile-pinned-body">
              <h3>{featuredItem.title}</h3>
              <p className="board-tile-meta">
                {featuredItem.completed} of {featuredItem.total} {featuredItem.noun}s studied · {featuredItem.percent}% complete{featuredItem.kind === "quiz" ? ` · ${featuredItem.accuracy}% accuracy` : ""}
              </p>
            </div>
            <div className="board-feature-progress" role="progressbar" aria-label="Topic progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={featuredItem.percent}>
              <span style={{ width: `${featuredItem.percent}%` }} />
            </div>
            <span className="board-icon board-icon-pinned"><BoardIcon id={featuredItem.id} /></span>
            <span className="board-tile-pinned-cta" aria-hidden="true">{featuredItem.completed > 0 ? "Continue practice" : "Start practice"} →</span>
          </a>
        )}

        {restItems.length > 0 && (
          <div className="board-section-head board-section-head-secondary">
            <h2 className="eyebrow">All topics</h2>
          </div>
        )}

        <section className="board-grid" aria-label="Available quizzes and decks">
        {restItems.map((item) => {
          const isDue = item.due > 0;
          const tilePercent = isDue ? (item.total ? Math.round((item.mastered / item.total) * 100) : 0) : item.percent;
          const todayPill = item.daily.done ? (
            <span className="board-tile-pill board-tile-pill-today">✓ Today</span>
          ) : item.daily.roundLength ? (
            <span className="board-tile-pill board-tile-pill-today board-tile-pill-today-pending">
              {item.daily.correct}/{item.daily.roundLength} today
            </span>
          ) : null;

          return (
            <a className={`board-tile board-tile-${isDue ? "due" : "quiet"}`} href={item.href} key={item.id}>
              <span className={`board-icon${isDue ? "" : " board-icon-quiet"}`}><BoardIcon id={item.id} /></span>
              <div className="board-tile-content">
                <div className="board-tile-content-header">
                  <h2>{item.title}</h2>
                  <span className="board-tile-top-pills">
                    {todayPill}
                    {isDue ? (
                      <span className="board-tile-pill board-tile-pill-due">{item.due} due</span>
                    ) : (
                      <span className="board-tile-note board-tile-note-quiet">nothing due</span>
                    )}
                  </span>
                </div>
                <span className="board-tile-note">
                  {isDue ? `${item.mastered} of ${item.total} mastered` : `${item.completed} of ${item.total} ${item.noun}s studied`}
                </span>
                <div className={`board-bar${isDue ? "" : " board-bar-quiet"}`} aria-hidden="true">
                  <span style={{ width: `${tilePercent}%`, background: isDue ? undefined : dueBarFill(item.percent) }} />
                </div>
              </div>
            </a>
          );
        })}
      </section>

        <p className="library-note">Progress, filters, scoring, audio and review history remain attached to each quiz.</p>
      </div>
    </main>
  );
}
