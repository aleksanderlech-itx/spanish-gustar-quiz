import assert from "node:assert/strict";
import test from "node:test";

// A minimal localStorage stand-in for Node, since stored-progress.ts is a plain browser module.
const store = new Map();
globalThis.window = {
  localStorage: {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, value),
  },
};

const { updateStoredProgress } = await import("../app/stored-progress.ts");

const KEY = "gustar-quiz-progress-v1";
const read = () => JSON.parse(window.localStorage.getItem(KEY) ?? "[]");

test("two tabs of the same activity each keep their saved round", () => {
  store.clear();
  // Both tabs opened while storage was empty; each finishes a round later.
  updateStoredProgress(KEY, read, (stored) => [...stored, { date: "tab-a" }]);
  const next = updateStoredProgress(KEY, read, (stored) => [...stored, { date: "tab-b" }]);
  assert.deepEqual(next.map((r) => r.date), ["tab-a", "tab-b"]);
  assert.deepEqual(read().map((r) => r.date), ["tab-a", "tab-b"]);
});

test("updating one activity leaves every other activity's key untouched", () => {
  store.clear();
  store.set("ser-estar-quiz-progress-v1", JSON.stringify([{ date: "other" }]));
  updateStoredProgress(KEY, read, (stored) => [...stored, { date: "mine" }]);
  assert.equal(store.get("ser-estar-quiz-progress-v1"), JSON.stringify([{ date: "other" }]));
});
