"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useTheme } from "./use-theme";
import { readStreakSummary } from "./streak";
import { readNotebookEntries } from "./notebook";
import { QUIZ_CONFIG, type QuizId } from "./quiz-config";
import type { QuizResult } from "./quiz-logic";
import { SITE_CONFIG } from "./site-config";
import { computeRecentRounds, computeWeakAreas, type RecentRound, type WeakArea } from "./history";

const QUIZ_IDS = Object.keys(QUIZ_CONFIG) as QuizId[];
const FLASHCARD_KEY = "spanish-flashcards-leitner-v2";
const ALL_PROGRESS_KEYS = [...QUIZ_IDS.map((id) => QUIZ_CONFIG[id].storageKey), FLASHCARD_KEY];
const WEEK_MS = 7 * 86_400_000;

type GlobalStats = {
  totalRounds: number;
  averageAccuracy: number;
  weekRounds: number;
  weekAccuracy: number;
  flashcardsStudied: number;
};

const emptyStats: GlobalStats = { totalRounds: 0, averageAccuracy: 0, weekRounds: 0, weekAccuracy: 0, flashcardsStudied: 0 };

type QuizHistoryEntry = { quizId: QuizId; title: string; questions: (typeof QUIZ_CONFIG)[QuizId]["questions"]; history: QuizResult[] };

/** Reads every quiz's stored history once, so stats/recent-rounds/weak-areas don't each re-read storage. */
const readAllQuizHistories = (): QuizHistoryEntry[] => QUIZ_IDS.map((id) => {
  const quiz = QUIZ_CONFIG[id];
  try {
    const raw = window.localStorage.getItem(quiz.storageKey);
    const history = raw ? (JSON.parse(raw) as QuizResult[]) : [];
    return { quizId: id, title: quiz.title.replace(" Quiz", ""), questions: quiz.questions, history };
  } catch {
    // Corrupt or unavailable history for this quiz; treat it as empty rather than block the drawer.
    return { quizId: id, title: quiz.title.replace(" Quiz", ""), questions: quiz.questions, history: [] };
  }
});

const readGlobalStats = (byQuiz: QuizHistoryEntry[]): GlobalStats => {
  const now = Date.now();
  let totalRounds = 0;
  let totalPercentSum = 0;
  let weekRounds = 0;
  let weekPercentSum = 0;

  byQuiz.forEach(({ history }) => {
    history.forEach((item) => {
      totalRounds += 1;
      totalPercentSum += item.percent;
      if (now - Date.parse(item.date) <= WEEK_MS) {
        weekRounds += 1;
        weekPercentSum += item.percent;
      }
    });
  });

  let flashcardsStudied = 0;
  try {
    const raw = window.localStorage.getItem(FLASHCARD_KEY);
    flashcardsStudied = raw ? Object.keys(JSON.parse(raw) as Record<string, unknown>).length : 0;
  } catch {
    // Ignore; flashcardsStudied stays 0.
  }

  return {
    totalRounds,
    averageAccuracy: totalRounds ? Math.round(totalPercentSum / totalRounds) : 0,
    weekRounds,
    weekAccuracy: weekRounds ? Math.round(weekPercentSum / weekRounds) : 0,
    flashcardsStudied,
  };
};

const exportAllProgress = () => {
  const payload: Record<string, unknown> = { version: 1, exportedAt: new Date().toISOString() };
  ALL_PROGRESS_KEYS.forEach((key) => {
    const raw = window.localStorage.getItem(key);
    if (raw) {
      try {
        payload[key] = JSON.parse(raw);
      } catch {
        // Skip a corrupt entry rather than fail the whole export.
      }
    }
  });
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "spanish-quiz-studio-backup.json";
  link.click();
  URL.revokeObjectURL(url);
};

const importAllProgress = async (file: File) => {
  try {
    const data = JSON.parse(await file.text()) as Record<string, unknown>;
    let restored = 0;
    ALL_PROGRESS_KEYS.forEach((key) => {
      if (data[key] !== undefined) {
        window.localStorage.setItem(key, JSON.stringify(data[key]));
        restored += 1;
      }
    });
    if (restored === 0) throw new Error("no recognised keys");
    window.location.reload();
  } catch {
    window.alert("This is not a valid Spanish Quiz Studio backup file.");
  }
};

const resetAllProgress = () => {
  if (!window.confirm("Delete all quiz and flashcard progress on this device? This cannot be undone.")) return;
  ALL_PROGRESS_KEYS.forEach((key) => window.localStorage.removeItem(key));
  window.location.reload();
};

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

type DrawerRow = "history" | "recap" | "notebook" | "backup" | "settings";

export default function Drawer({ open, onClose, returnFocusRef }: { open: boolean; onClose: () => void; returnFocusRef: RefObject<HTMLButtonElement | null> }) {
  const { theme, toggleTheme } = useTheme();
  const [expanded, setExpanded] = useState<DrawerRow | null>(null);
  const [stats, setStats] = useState<GlobalStats>(emptyStats);
  const [recentRounds, setRecentRounds] = useState<RecentRound[]>([]);
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>([]);
  const [streakDays, setStreakDays] = useState(0);
  const [notebookCount, setNotebookCount] = useState(0);
  const [notebookRules, setNotebookRules] = useState<string[]>([]);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const importRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const byQuiz = readAllQuizHistories();
    // Browser storage is unavailable during the server render; this only runs once the drawer opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStats(readGlobalStats(byQuiz));
    setRecentRounds(computeRecentRounds(byQuiz));
    setWeakAreas(computeWeakAreas(byQuiz));
    setStreakDays(readStreakSummary().streak);
    const entries = readNotebookEntries();
    setNotebookCount(entries.length);
    setNotebookRules(entries.map((entry) => entry.rule));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const focusables = panel ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) : [];
    focusables[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const trigger = returnFocusRef.current;
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const toggleRow = (row: DrawerRow) => setExpanded((current) => (current === row ? null : row));

  return (
    <div className="drawer-scrim" role="presentation" onClick={onClose}>
      <div
        className="drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        ref={panelRef}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="drawer-top">
          <p className="drawer-title">Spanish Quiz Studio</p>
          <button type="button" className="drawer-close" aria-label="Close menu" onClick={onClose}>✕</button>
        </div>

        <div className="drawer-summary-card">
          <span>{streakDays}-day streak</span>
          <span>{stats.weekAccuracy}% accuracy this week</span>
        </div>

        <div className="drawer-row-group">
          <button type="button" className="drawer-row" aria-expanded={expanded === "history"} onClick={() => toggleRow("history")}>
            <span>Progress &amp; history</span>
            <span aria-hidden="true">{expanded === "history" ? "︿" : "→"}</span>
          </button>
          {expanded === "history" && (
            <div className="drawer-row-panel">
              <p>{stats.totalRounds} round{stats.totalRounds === 1 ? "" : "s"} played · {stats.averageAccuracy}% average accuracy</p>
              <p>{stats.flashcardsStudied} of 500 flashcards studied</p>

              {weakAreas.length > 0 && (
                <>
                  <p className="drawer-subhead">Weak areas</p>
                  <ul className="drawer-weak-areas">
                    {weakAreas.map(([area, value]) => (
                      <li key={area}>
                        <span>{area}</span>
                        <span>{Math.round((value.misses / value.attempts) * 100)}% missed ({value.misses}/{value.attempts})</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {recentRounds.length > 0 && (
                <>
                  <p className="drawer-subhead">Recent rounds</p>
                  <ul className="drawer-history-list">
                    {recentRounds.map((round, index) => (
                      <li key={`${round.quizTitle}-${round.date}-${index}`}>
                        <span>{round.quizTitle}{round.mode === "review" ? " (review)" : ""}</span>
                        <span>{round.percent}% · {new Date(round.date).toLocaleDateString()}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}

          <button type="button" className="drawer-row" aria-expanded={expanded === "recap"} onClick={() => toggleRow("recap")}>
            <span>Weekly recap</span>
            <span className="drawer-pill">New</span>
          </button>
          {expanded === "recap" && (
            <div className="drawer-row-panel">
              <p>{stats.weekRounds} round{stats.weekRounds === 1 ? "" : "s"} this week · {stats.weekAccuracy}% accuracy</p>
            </div>
          )}

          <button type="button" className="drawer-row" aria-expanded={expanded === "notebook"} onClick={() => toggleRow("notebook")}>
            <span>Mistake notebook</span>
            <span className="drawer-count">{notebookCount}</span>
          </button>
          {expanded === "notebook" && (
            <div className="drawer-row-panel">
              {notebookRules.length ? (
                <div className="results-chip-row">
                  {notebookRules.map((rule) => <span className="results-chip" key={rule}>{rule}</span>)}
                </div>
              ) : <p>No missed rules yet.</p>}
            </div>
          )}

          <button type="button" className="drawer-row" aria-expanded={expanded === "backup"} onClick={() => toggleRow("backup")}>
            <span>Backup &amp; restore</span>
            <span aria-hidden="true">{expanded === "backup" ? "︿" : "→"}</span>
          </button>
          {expanded === "backup" && (
            <div className="drawer-row-panel drawer-row-panel-actions">
              <button type="button" className="drawer-action-button" onClick={exportAllProgress}>Download backup</button>
              <button type="button" className="drawer-action-button" onClick={() => importRef.current?.click()}>Import backup</button>
              <input
                ref={importRef}
                className="sr-only"
                type="file"
                accept="application/json"
                onChange={(event) => { const file = event.target.files?.[0]; if (file) void importAllProgress(file); }}
              />
            </div>
          )}

          <button type="button" className="drawer-row" aria-expanded={expanded === "settings"} onClick={() => toggleRow("settings")}>
            <span>Settings</span>
            <span aria-hidden="true">{expanded === "settings" ? "︿" : "→"}</span>
          </button>
          {expanded === "settings" && (
            <div className="drawer-row-panel drawer-row-panel-actions">
              <button type="button" className="drawer-action-button drawer-danger" onClick={resetAllProgress}>Reset all progress</button>
            </div>
          )}
        </div>

        <a className="drawer-kofi" href={SITE_CONFIG.kofiUrl} target="_blank" rel="noreferrer">
          <span className="drawer-kofi-badge" aria-hidden="true">☕</span>
          <span>Help build more quizzes</span>
        </a>

        <button type="button" className="drawer-theme-row" onClick={toggleTheme}>
          <span>{theme === "dark" ? "Dark theme" : "Light theme"}</span>
          <span className="drawer-theme-dot" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
