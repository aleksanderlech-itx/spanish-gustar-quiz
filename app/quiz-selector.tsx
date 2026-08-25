"use client";

import { useEffect, useMemo, useState } from "react";
import { QUIZ_CONFIG, type QuizId } from "./quiz-config";
import { useTheme } from "./use-theme";
import { orderBoard, type BoardTileProgress } from "./board";
import { readStreakSummary, type StreakSummary } from "./streak";
import { emptyQuizProgress, readQuizProgress } from "./quiz-progress";

type LibraryQuizId = QuizId | "flashcards";

type BoardItem = BoardTileProgress & {
  id: LibraryQuizId;
  kind: "quiz" | "deck";
  glyph: string;
  title: string;
  noun: string;
  href: string;
};

const QUIZ_IDS = Object.keys(QUIZ_CONFIG) as QuizId[];
const EMPTY_STREAK: StreakSummary = {
  streak: 0,
  completedToday: false,
  week: [
    { letter: "L", status: "future" }, { letter: "M", status: "future" }, { letter: "X", status: "future" },
    { letter: "J", status: "future" }, { letter: "V", status: "future" }, { letter: "S", status: "future" },
    { letter: "D", status: "future" },
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
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [items, setItems] = useState<BoardItem[]>(() => [
    ...QUIZ_IDS.map((id) => ({ id: id as LibraryQuizId, kind: "quiz" as const, glyph: "?", title: QUIZ_CONFIG[id].title.replace(" Quiz", ""), noun: "question", href: detailPath(id), ...emptyQuizProgress(QUIZ_CONFIG[id].questions.length) })),
    { id: "flashcards" as LibraryQuizId, kind: "deck" as const, glyph: "▤", title: "Spanish Verb Flashcards", noun: "card", href: "/?quiz=flashcards&play=1", ...emptyQuizProgress(FLASHCARD_TOTAL) },
  ]);
  const [streak, setStreak] = useState<StreakSummary>(EMPTY_STREAK);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextItems: BoardItem[] = [
      ...QUIZ_IDS.map((id) => ({
        id,
        kind: "quiz" as const,
        glyph: "?",
        title: QUIZ_CONFIG[id].title.replace(" Quiz", ""),
        noun: "question",
        href: detailPath(id),
        ...readQuizProgress(id),
      })),
      {
        id: "flashcards",
        kind: "deck",
        glyph: "▤",
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
    setOpen(!params.has("quiz") && params.get("play") !== "1");
    setReady(true);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("quiz-library-open", ready && open);
    return () => document.body.classList.remove("quiz-library-open");
  }, [open, ready]);

  const board = useMemo(() => orderBoard(items), [items]);

  if (!ready || !open) return null;

  return (
    <main className="quiz-library board-home" aria-labelledby="quiz-library-title">
      <header className="library-header">
        <div>
          <p className="library-kicker">Spanish Quiz Studio</p>
          <h1 id="quiz-library-title">Choose what to practise</h1>
          <p className="library-intro">Short, focused rounds for the grammar points you want to improve.</p>
        </div>
        <div className="library-header-actions">
          <button
            type="button"
            className="mode-switch"
            aria-pressed={theme === "dark"}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggleTheme}
          >
            <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
            <span className="sr-only">{theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}</span>
          </button>
        </div>
      </header>

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
                <span className="board-icon board-icon-pinned" aria-hidden="true">{item.glyph}</span>
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
                  <span className="board-icon" aria-hidden="true">{item.glyph}</span>
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
                <span className="board-icon board-icon-quiet" aria-hidden="true">{item.glyph}</span>
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
