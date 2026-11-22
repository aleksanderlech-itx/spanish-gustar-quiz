import assert from "node:assert/strict";
import test from "node:test";

const makeStore = (initial = {}) => {
  const map = new Map(Object.entries(initial));
  return {
    map,
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    key: (index) => [...map.keys()][index] ?? null,
    get length() {
      return map.size;
    },
  };
};
const install = (local = {}) => {
  const localStorage = makeStore(local);
  globalThis.window = { location: { search: "" }, localStorage, sessionStorage: makeStore() };
  return localStorage;
};

install();
const {
  BOARD_KEY, FIRST_VISIT_KEY, STARTER_BOARD, addToBoard, createStarterBoard, isFirstVisitSession, answerSuggestion, boardActivityIds, chooseBoard, hasChosenBoard, moveFinishedToShelf,
  newActivities, rankSuggestions, readBoardState, removeFromBoard, shelfEntries,
} = await import("../app/board-state.ts");
const { ACTIVITY_REGISTRY } = await import("../app/activity-registry.ts");
const ALL = ACTIVITY_REGISTRY.map((entry) => entry.id);
const COMPLETIONS_KEY = "spanish-quiz-completions-v1";
const board = (onBoard, extra = {}) => JSON.stringify({ onBoard, known: ALL, suggestion: null, ...extra });
const round = (mode, ids) => ({ date: "2026-11-01T10:00:00.000Z", questionIds: ids, missedIds: [], mode });

test("before the first Selection, the Board is the Activities the user has played", () => {
  install({ "gustar-quiz-progress-v1": JSON.stringify([round("regular", [1])]) });
  assert.equal(hasChosenBoard(), false);
  assert.deepEqual(boardActivityIds(), ["gustar"]);
});

test("a Selection puts exactly those Activities on the Board and marks every Activity as offered", () => {
  const store = install();
  chooseBoard(["ser-estar", "flashcards"]);
  assert.deepEqual(boardActivityIds(), ALL.filter((id) => id === "ser-estar" || id === "flashcards"));
  assert.deepEqual(JSON.parse(store.getItem(BOARD_KEY)).known, ALL);
  chooseBoard([]);
  assert.deepEqual(boardActivityIds().length, 2, "an empty Selection is refused");
});

test("the last Activity can't be moved to the Shelf", () => {
  install({ [BOARD_KEY]: board(["gustar", "flashcards"]) });
  assert.equal(removeFromBoard("gustar"), true);
  assert.equal(removeFromBoard("flashcards"), false);
  assert.deepEqual(boardActivityIds(), ["flashcards"]);
});

test("moving to the Shelf keeps progress", () => {
  const history = JSON.stringify([round("regular", [1, 2])]);
  const store = install({ [BOARD_KEY]: board(["gustar", "flashcards"]), "gustar-quiz-progress-v1": history });
  removeFromBoard("gustar");
  assert.equal(store.getItem("gustar-quiz-progress-v1"), history);
});

test("a Finished Activity moves to the Shelf and queues a Suggestion", () => {
  install({ [BOARD_KEY]: board(["gustar", "flashcards"]) });
  moveFinishedToShelf("gustar");
  assert.deepEqual(readBoardState().onBoard, ["flashcards"]);
  assert.deepEqual(readBoardState().suggestion, { finished: "gustar" });
  answerSuggestion([]);
  assert.equal(readBoardState().suggestion, null);
});

test("finishing the only Activity leaves an empty Board until the Suggestion is answered", () => {
  install({ [BOARD_KEY]: board(["gustar"]) });
  moveFinishedToShelf("gustar");
  assert.deepEqual(boardActivityIds(), []);
});

test("adding a Finished quiz back starts its sentences over and keeps its misses", () => {
  const store = install({
    [BOARD_KEY]: board(["flashcards"]),
    "gustar-quiz-progress-v1": JSON.stringify([round("regular", [1]), round("review", [1])]),
    [COMPLETIONS_KEY]: JSON.stringify({ gustar: "2026-11-01T10:00:00.000Z" }),
  });
  addToBoard(["gustar"]);
  assert.deepEqual(JSON.parse(store.getItem("gustar-quiz-progress-v1")).map((item) => item.mode), ["review"]);
  assert.equal(JSON.parse(store.getItem(COMPLETIONS_KEY)).gustar, undefined);
  assert.equal(boardActivityIds().includes("gustar"), true);
});

test("adding an unfinished quiz back keeps its progress", () => {
  const history = JSON.stringify([round("regular", [1])]);
  const store = install({ [BOARD_KEY]: board(["flashcards"]), "gustar-quiz-progress-v1": history });
  addToBoard(["gustar"]);
  assert.equal(store.getItem("gustar-quiz-progress-v1"), history);
});

test("Shelf entries are Repeat due, not started, started or Finished", () => {
  const now = new Date("2026-11-21T10:00:00");
  install({
    [BOARD_KEY]: board(["flashcards"]),
    "gustar-quiz-progress-v1": JSON.stringify([round("regular", [1])]),
    "ser-estar-quiz-progress-v1": JSON.stringify([round("regular", [1])]),
    "por-para-quiz-progress-v1": JSON.stringify([round("regular", [1])]),
    [COMPLETIONS_KEY]: JSON.stringify({ "ser-estar": "2026-10-01T10:00:00.000Z", "por-para": "2026-11-15T10:00:00.000Z" }),
  });
  const status = Object.fromEntries(shelfEntries(now).map((entry) => [entry.id, entry.status]));
  assert.equal(status["ser-estar"], "repeat-due");
  assert.equal(status["por-para"], "finished");
  assert.equal(status.gustar, "started");
  assert.equal(status["object-pronouns"], "not-started");
  assert.equal(status.flashcards, undefined);
});

test("suggestions rank Repeat due, not started, started, Finished; the one just Finished goes last", () => {
  const shelf = [
    { id: "gustar", status: "finished" },
    { id: "ser-estar", status: "started" },
    { id: "por-para", status: "not-started" },
    { id: "object-pronouns", status: "repeat-due" },
    { id: "saber-conocer", status: "finished" },
  ];
  assert.deepEqual(rankSuggestions(shelf, "saber-conocer"), ["object-pronouns", "por-para", "ser-estar"]);
  assert.deepEqual(rankSuggestions(shelf.slice(0, 2), "gustar"), ["ser-estar", "gustar"]);
  assert.deepEqual(rankSuggestions([{ id: "gustar", status: "finished" }], "gustar"), ["gustar"]);
});

test("an Activity the user hasn't been offered is New until the Suggestion is answered", () => {
  install({ [BOARD_KEY]: JSON.stringify({ onBoard: ["gustar"], known: ["gustar", "ser-estar"], suggestion: null }) });
  const fresh = newActivities(readBoardState());
  assert.equal(fresh.includes("ser-estar"), false);
  assert.equal(fresh.includes("flashcards"), true);
  answerSuggestion(fresh);
  assert.deepEqual(newActivities(readBoardState()), []);
  assert.deepEqual(readBoardState().onBoard, ["gustar"], "answering New adds nothing by itself");
});

test("ids this build doesn't know stay in the stored Board but are not shown (decision 0009)", () => {
  const store = install({ [BOARD_KEY]: board(["retired-activity", "gustar", "flashcards"]) });
  assert.deepEqual(boardActivityIds(), ["gustar", "flashcards"]);
  removeFromBoard("gustar");
  assert.ok(JSON.parse(store.getItem(BOARD_KEY)).onBoard.includes("retired-activity"));
});

test("a new user's starter Board is Gustar, Por vs Para, Preterite vs Imperfect and Saber vs Conocer", () => {
  install();
  assert.deepEqual([...STARTER_BOARD].sort(), ["gustar", "por-para", "preterite-imperfect", "saber-conocer"]);
  assert.equal(createStarterBoard(), true, "the load that creates it shows the welcome dialog");
  assert.equal(createStarterBoard(), false, "no later load does");
  assert.deepEqual([...boardActivityIds()].sort(), [...STARTER_BOARD].sort());
  assert.equal(isFirstVisitSession(), true);
  assert.deepEqual(readBoardState().known, ALL, "nothing is offered as New to a new user");
});

test("an Activity played through a link before the first Board joins the starter Board", () => {
  install({ "present-perfect-quiz-progress-v1": JSON.stringify([round("regular", [8001])]) });
  createStarterBoard();
  assert.equal(boardActivityIds().includes("present-perfect"), true);
  assert.equal(boardActivityIds().length, STARTER_BOARD.length + 1);
});

test("the starter Board is created once; a later session is not a first visit", () => {
  install({ [BOARD_KEY]: board(["flashcards"]) });
  createStarterBoard();
  assert.deepEqual(boardActivityIds(), ["flashcards"]);
  assert.equal(isFirstVisitSession(), false);
  assert.equal(window.sessionStorage.getItem(FIRST_VISIT_KEY), null);
});
