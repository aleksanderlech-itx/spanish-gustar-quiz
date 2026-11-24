"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { readStreakSummary } from "./streak";
import { isTestMode } from "./storage";
import { readNotebookGroups, type NotebookGroup } from "./notebook";
import { mistakesPath, mistakesTitle } from "./notebook-retry";
import { QUIZ_CONFIG, QUIZ_IDS, type QuizId } from "./quiz-config";
import type { QuizResult } from "./quiz-logic";
import { computeRecentRounds, computeWeakAreas, type RecentRound, type WeakArea } from "./history";
import { readAllCompletions, repeatDueDate } from "./quiz-completion";
import { findActivity, type ActivityId } from "./activity-registry";
import { addToBoard, hasChosenBoard, shelfEntries, type ShelfStatus } from "./board-state";
import Logo from "./logo";
import KofiButton from "./kofi-button";
import { appStorage } from "./storage";
import { SENTENCE_BUILDER_STORAGE_KEY, SENTENCE_BUILDER_TITLE } from "./sentence-builder-config";
import { applyBackup, buildBackup, FLASHCARD_PROGRESS_KEY, parseBackup, resetStoredData } from "./stored-data";

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
    const raw = appStorage.getItem(quiz.storageKey);
    const history = raw ? (JSON.parse(raw) as QuizResult[]) : [];
    return { quizId: id, title: quiz.title.replace(" Quiz", ""), questions: quiz.questions, history };
  } catch {
    // Corrupt or unavailable history for this quiz; treat it as empty rather than block the drawer.
    return { quizId: id, title: quiz.title.replace(" Quiz", ""), questions: quiz.questions, history: [] };
  }
});

/** Sentence Builder's stored rounds; empty if missing or unreadable. */
const readSentenceBuilderHistory = (): QuizResult[] => {
  try {
    const raw = appStorage.getItem(SENTENCE_BUILDER_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? (parsed as QuizResult[]) : [];
  } catch {
    return [];
  }
};

const readGlobalStats = (byQuiz: Array<{ history: QuizResult[] }>): GlobalStats => {
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
    const raw = appStorage.getItem(FLASHCARD_PROGRESS_KEY);
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
  const payload = buildBackup();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = isTestMode() ? "spanish-quiz-studio-test-backup.json" : "spanish-quiz-studio-backup.json";
  link.click();
  URL.revokeObjectURL(url);
};

const IMPORT_MESSAGES = {
  confirm: "This replaces the progress on this device.",
  confirmTest: "This replaces the test progress in this tab. Your real progress is not affected.",
  newer: "This file is from a newer version of Spanish Quizzes. Reload the page to update, then try again.",
  invalid: "This backup file is damaged or not a Spanish Quizzes backup. Nothing was changed.",
};

/** Checks the whole file first; storage changes only after it passes and the user confirms. */
const importAllProgress = async (file: File) => {
  let text: string;
  try {
    text = await file.text();
  } catch {
    window.alert(IMPORT_MESSAGES.invalid);
    return;
  }
  const parsed = parseBackup(text);
  if (!parsed.ok) {
    window.alert(parsed.reason === "newer" ? IMPORT_MESSAGES.newer : IMPORT_MESSAGES.invalid);
    return;
  }
  if (!window.confirm(isTestMode() ? IMPORT_MESSAGES.confirmTest : IMPORT_MESSAGES.confirm)) return;
  try {
    applyBackup(parsed.data);
  } catch {
    window.alert("Progress could not be saved on this device.");
    return;
  }
  window.location.reload();
};

const resetAllProgress = () => {
  const message = isTestMode()
    ? "Delete all test progress? Your real progress is not affected. This cannot be undone."
    : "Delete all progress and settings on this device? This cannot be undone.";
  if (!window.confirm(message)) return;
  resetStoredData();
  window.location.reload();
};

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

type DrawerRow = "shelf" | "history" | "recap" | "notebook" | "backup" | "settings";

type ShelfItem = { id: ActivityId; title: string; status: ShelfStatus; completedAt: string | null };

/** Every Activity on the Shelf (decision 0008), for the drawer's Settings. Empty before the first Selection. */
const readShelfItems = (): ShelfItem[] => {
  if (!hasChosenBoard()) return [];
  const completions = readAllCompletions();
  return shelfEntries().map((entry) => ({
    id: entry.id,
    title: findActivity(entry.id)?.title ?? entry.id,
    status: entry.status,
    completedAt: completions[entry.id] ?? null,
  }));
};

const SHELF_META: Record<ShelfStatus, string> = {
  "repeat-due": "Repeat due",
  "not-started": "Not started",
  started: "In progress",
  finished: "Finished",
};

export default function Drawer({ open, onClose, returnFocusRef }: { open: boolean; onClose: () => void; returnFocusRef: RefObject<HTMLButtonElement | null> }) {
  const [expanded, setExpanded] = useState<DrawerRow | null>(null);
  const [stats, setStats] = useState<GlobalStats>(emptyStats);
  const [recentRounds, setRecentRounds] = useState<RecentRound[]>([]);
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>([]);
  const [streakDays, setStreakDays] = useState(0);
  const [notebookCount, setNotebookCount] = useState(0);
  const [notebookGroups, setNotebookGroups] = useState<NotebookGroup[]>([]);
  const [shelfItems, setShelfItems] = useState<ShelfItem[]>([]);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const importRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const byQuiz = readAllQuizHistories();
    // Stats and recent rounds count every activity with rounds; weak areas read quiz-only fields.
    const allRounds = [...byQuiz, { title: SENTENCE_BUILDER_TITLE, history: readSentenceBuilderHistory() }];
    // Browser storage is unavailable during the server render; this only runs once the drawer opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStats(readGlobalStats(allRounds));
    setRecentRounds(computeRecentRounds(allRounds));
    setWeakAreas(computeWeakAreas(byQuiz));
    setStreakDays(readStreakSummary().streak);
    const groups = readNotebookGroups();
    setNotebookCount(groups.reduce((sum, group) => sum + group.entries.length, 0));
    setNotebookGroups(groups);
    setShelfItems(readShelfItems());
  }, [open]);

  const addShelfItem = (id: ActivityId) => {
    addToBoard([id]);
    setShelfItems(readShelfItems());
  };

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
          <p className="drawer-title"><Logo size={24} /><span>Spanish Quizzes</span></p>
          <button type="button" className="drawer-close" aria-label="Close menu" onClick={onClose}>✕</button>
        </div>

        <div className="drawer-summary-card">
          <span>{streakDays}-day streak</span>
          <span>{stats.weekAccuracy}% accuracy this week</span>
        </div>

        <div className="drawer-row-group">
          <button type="button" className="drawer-row" aria-expanded={expanded === "shelf"} onClick={() => toggleRow("shelf")}>
            <span>On your shelf{shelfItems.length ? ` (${shelfItems.length})` : ""}</span>
            <span aria-hidden="true">{expanded === "shelf" ? "︿" : "→"}</span>
          </button>
          {expanded === "shelf" && (
            <div className="drawer-row-panel drawer-row-panel-actions">
              <p>Activities not on your board. They are not part of your daily goal.</p>
              {shelfItems.length ? (
                <ul className="drawer-finished-list">
                  {shelfItems.map((item) => (
                    <li key={item.id} className="drawer-finished-item">
                      <div className="drawer-finished-item-info">
                        <span>{item.title}</span>
                        <span className="drawer-finished-item-meta">
                          {item.status === "finished" && item.completedAt
                            ? `Done ${new Date(item.completedAt).toLocaleDateString()} · repeat from ${repeatDueDate(item.completedAt).toLocaleDateString()}`
                            : SHELF_META[item.status]}
                        </span>
                      </div>
                      <button type="button" className="drawer-finished-toggle" onClick={() => addShelfItem(item.id)}>
                        Add to board
                      </button>
                    </li>
                  ))}
                </ul>
              ) : <p>Every activity is on your board.</p>}
              <a className="drawer-action-button" href="/activities" onClick={onClose}>Edit your activities</a>
            </div>
          )}

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
              {notebookGroups.length ? (
                <div className="drawer-mistake-groups">
                  {notebookGroups.map((group) => (
                    <div className="drawer-mistake-group" key={group.quizId}>
                      <div className="drawer-mistake-group-head">
                        <span>{mistakesTitle(group.quizId)} ({group.entries.length})</span>
                        <a className="drawer-mistake-retry" href={mistakesPath(group.quizId)} onClick={onClose}>Retry</a>
                      </div>
                      <div className="mistakes-chip-row">
                        {group.rules.map((rule) => (
                          <a className="mistakes-chip" key={rule} href={mistakesPath(group.quizId, rule)} onClick={onClose}>{rule}</a>
                        ))}
                      </div>
                    </div>
                  ))}
                  <p>Retries are practice only and do not count toward today&apos;s goal.</p>
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
                onChange={(event) => {
                  const input = event.currentTarget;
                  const file = input.files?.[0];
                  // Cleared every time, so choosing the same file again still fires a change.
                  input.value = "";
                  if (file) void importAllProgress(file);
                }}
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

          <a className="drawer-row drawer-help-link" href="/how-to-use" onClick={onClose}>
            <span>How to use</span>
            <span aria-hidden="true">→</span>
          </a>

          <a className="drawer-row drawer-help-link" href="/notes" onClick={onClose}>
            <span>Notes</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <KofiButton className="drawer-kofi" />
      </div>
    </div>
  );
}
