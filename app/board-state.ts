import { ACTIVITY_REGISTRY, type ActivityId } from "./activity-registry.ts";
import { QUIZ_CONFIG, isQuizId } from "./quiz-config.ts";
import { clearQuizCompletion, isRepeatDue, readAllCompletions } from "./quiz-completion.ts";
import { appStorage } from "./storage.ts";

/**
 * Which Activities are on the user's Board and which are on the Shelf (terms in `CONTEXT.md`,
 * rules in decision 0008). Ids are stored as plain strings and never filtered on write
 * (decision 0009): an id this build doesn't know is kept, and only ignored when read.
 */

export const BOARD_KEY = "spanish-quiz-board-v1";
const FLASHCARD_PROGRESS_KEY = "spanish-flashcards-leitner-v2";

export type BoardState = {
  /** The user's chosen Board. Empty only between finishing the last Activity and answering the Suggestion. */
  onBoard: string[];
  /** Activities the user has been offered. A registered Activity missing here gets a one-time New Suggestion. */
  known: string[];
  /** Set when an Activity on the Board is Finished; cleared when the Suggestion is answered. */
  suggestion: { finished: string } | null;
};

export type ShelfStatus = "repeat-due" | "not-started" | "started" | "finished";
export type ShelfEntry = { id: ActivityId; status: ShelfStatus };

const REGISTRY_IDS: readonly ActivityId[] = ACTIVITY_REGISTRY.map((entry) => entry.id);
const isKnownId = (id: string): id is ActivityId => (REGISTRY_IDS as readonly string[]).includes(id);
const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every((item) => typeof item === "string");
const isObject = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);

/** Shape check, shared with the backup's checks in `app/stored-data.ts`. */
export const isBoardStateShape = (value: unknown): value is BoardState => isObject(value)
  && isStringArray(value.onBoard)
  && isStringArray(value.known)
  && (value.suggestion === null || (isObject(value.suggestion) && typeof value.suggestion.finished === "string"));

const unique = <T,>(items: T[]) => [...new Set(items)];

// --- Pure rules ---

/** Activities in the registry the user hasn't been offered yet, in registry order. */
export const newActivities = (state: BoardState): ActivityId[] =>
  REGISTRY_IDS.filter((id) => !state.known.includes(id) && !state.onBoard.includes(id));

const RANK: Record<ShelfStatus, number> = { "repeat-due": 0, "not-started": 1, started: 2, finished: 3 };

/**
 * Up to `limit` Shelf Activities to suggest: Repeat due, never started, started, Finished, each in
 * registry order. The Activity just Finished goes last, and only appears when fewer than `limit` others exist.
 */
export const rankSuggestions = (shelf: ShelfEntry[], justFinished: string | null, limit = 3): ActivityId[] => {
  const order = (entry: ShelfEntry) => RANK[entry.status] * 1000 + REGISTRY_IDS.indexOf(entry.id);
  const others = shelf.filter((entry) => entry.id !== justFinished).sort((a, b) => order(a) - order(b)).map((entry) => entry.id);
  const finished = shelf.find((entry) => entry.id === justFinished);
  return [...others, ...(finished ? [finished.id] : [])].slice(0, limit);
};

/**
 * Schema 1 to 2: an existing user's Board is what their board showed that day: every Activity
 * except Finished quizzes that were neither Repeat due nor shown again from Settings. A device
 * with no progress at all has no Board yet, so its user gets the Selection screen.
 */
export const boardFromSchema1 = (snapshot: Record<string, unknown>, now: Date): BoardState | null => {
  const completions = isObject(snapshot["spanish-quiz-completions-v1"]) ? snapshot["spanish-quiz-completions-v1"] : {};
  const reinstated = isObject(snapshot["spanish-quiz-reinstated-v1"]) ? snapshot["spanish-quiz-reinstated-v1"] : {};
  const hasProgress = REGISTRY_IDS.some((id) => {
    const value = snapshot[isQuizId(id) ? QUIZ_CONFIG[id].storageKey : FLASHCARD_PROGRESS_KEY];
    return Array.isArray(value) ? value.length > 0 : isObject(value) && Object.keys(value).length > 0;
  }) || (isObject(snapshot["spanish-quiz-streak-v2"]) && Object.keys(snapshot["spanish-quiz-streak-v2"]).length > 0);
  if (!hasProgress) return null;
  const onBoard = REGISTRY_IDS.filter((id) => {
    const completedAt = completions[id];
    if (typeof completedAt !== "string") return true;
    return isRepeatDue(completedAt, now) || reinstated[id] === true;
  });
  return { onBoard: [...onBoard], known: [...REGISTRY_IDS], suggestion: null };
};

// --- Storage ---

export const readBoardState = (): BoardState | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = appStorage.getItem(BOARD_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    return isBoardStateShape(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const writeBoardState = (state: BoardState) => {
  try {
    appStorage.setItem(BOARD_KEY, JSON.stringify(state));
  } catch {
    // Storage blocked or full; the choice lasts until the page is left.
  }
};

/** Whether the user has made a Selection. Without one, the home page shows the Selection screen. */
export const hasChosenBoard = (): boolean => readBoardState() !== null;

const readHistory = (id: ActivityId): unknown[] => {
  if (!isQuizId(id)) return [];
  try {
    const parsed = JSON.parse(appStorage.getItem(QUIZ_CONFIG[id].storageKey) ?? "[]") as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const hasFlashcardProgress = (): boolean => {
  try {
    const parsed = JSON.parse(appStorage.getItem(FLASHCARD_PROGRESS_KEY) ?? "{}") as unknown;
    return isObject(parsed) && Object.keys(parsed).length > 0;
  } catch {
    return false;
  }
};

/** Whether the user has any stored progress in an Activity. */
export const hasPlayed = (id: ActivityId): boolean => (id === "flashcards" ? hasFlashcardProgress() : readHistory(id).length > 0);

/**
 * The Activities on the Board, in registry order. Before the first Selection, the Board is
 * the set of Activities the user has played, so a first-day round already counts.
 */
export const boardActivityIds = (): ActivityId[] => {
  const state = readBoardState();
  if (!state) return REGISTRY_IDS.filter(hasPlayed);
  return REGISTRY_IDS.filter((id) => state.onBoard.includes(id));
};

export const isOnBoard = (id: ActivityId): boolean => boardActivityIds().includes(id);

/** Every Activity off the Board, with what kind of suggestion it is. */
export const shelfEntries = (now = new Date()): ShelfEntry[] => {
  const onBoard = boardActivityIds();
  const completions = readAllCompletions();
  return REGISTRY_IDS.filter((id) => !onBoard.includes(id)).map((id) => {
    const completedAt = completions[id];
    if (completedAt) return { id, status: isRepeatDue(completedAt, now) ? "repeat-due" : "finished" };
    return { id, status: hasPlayed(id) ? "started" : "not-started" };
  });
};

/** A Finished quiz added back starts its sentences over: regular rounds and the completion go, misses stay. */
const restartIfFinished = (id: ActivityId) => {
  if (!isQuizId(id) || !readAllCompletions()[id]) return;
  try {
    const kept = readHistory(id).filter((item) => isObject(item) && item.mode === "review");
    appStorage.setItem(QUIZ_CONFIG[id].storageKey, JSON.stringify(kept));
  } catch {
    // Storage blocked; the quiz opens on its finished screen, where "Redo the whole set" does the same.
  }
  clearQuizCompletion(id);
};

/** Saves a Selection: exactly these Activities on the Board. Every registered Activity counts as offered. */
export const chooseBoard = (ids: ActivityId[]) => {
  if (!ids.length) return;
  const state = readBoardState();
  const previous = state ? state.onBoard : [];
  ids.filter((id) => !previous.includes(id)).forEach(restartIfFinished);
  // Ids this build doesn't know stay where they were (decision 0009).
  const unknown = previous.filter((id) => !isKnownId(id));
  writeBoardState({
    onBoard: unique([...ids, ...unknown]),
    known: unique([...(state?.known ?? []), ...REGISTRY_IDS]),
    suggestion: state?.suggestion ?? null,
  });
};

/** Moves Activities from the Shelf to the Board. */
export const addToBoard = (ids: ActivityId[]) => {
  const current = boardActivityIds();
  chooseBoard(unique([...current, ...ids]));
};

/** Moves one Activity to the Shelf. Refused for the last one. */
export const removeFromBoard = (id: ActivityId): boolean => {
  const current = boardActivityIds();
  if (current.length <= 1 || !current.includes(id)) return false;
  chooseBoard(current.filter((item) => item !== id));
  return true;
};

/** A quiz on the Board was just Finished: it moves to the Shelf and the Board offers a Suggestion. */
export const moveFinishedToShelf = (id: ActivityId) => {
  const state = readBoardState();
  if (!state || !state.onBoard.includes(id)) return;
  writeBoardState({ ...state, onBoard: state.onBoard.filter((item) => item !== id), suggestion: { finished: id } });
};

/** The Suggestion was answered (added or "Not now"), and any New Activities in it count as offered. */
export const answerSuggestion = (offered: ActivityId[]) => {
  const state = readBoardState();
  if (!state) return;
  writeBoardState({ ...state, known: unique([...state.known, ...offered]), suggestion: null });
};
