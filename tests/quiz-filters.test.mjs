import assert from "node:assert/strict";
import test from "node:test";

// A minimal localStorage stand-in for Node, since quiz-filters.ts is a plain
// browser module (no DOM test runner here).
const store = new Map();
globalThis.window = {
  localStorage: {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, value),
  },
};

const { readQuizFilters, writeQuizFilters, DEFAULT_FILTERS } = await import("../app/quiz-filters.ts");

test("readQuizFilters falls back to {all, all} when nothing is stored", () => {
  assert.deepEqual(readQuizFilters("nonexistent-key", ["doler"]), DEFAULT_FILTERS);
});

test("writeQuizFilters/readQuizFilters round-trip under the given key, and only that key", () => {
  writeQuizFilters("gustar-quiz-filters-v1", { level: "advanced", verb: "doler" });
  assert.deepEqual(readQuizFilters("gustar-quiz-filters-v1", ["gustar", "doler"]), { level: "advanced", verb: "doler" });
  assert.deepEqual(readQuizFilters("ser-estar-quiz-filters-v1", ["ser-estar"]), DEFAULT_FILTERS);
});

test("readQuizFilters recovers from corrupt stored JSON", () => {
  store.set("corrupt-key", "{not json");
  assert.deepEqual(readQuizFilters("corrupt-key", []), DEFAULT_FILTERS);
});

test("a stored filter naming a group that no longer exists reads as all (decision 0015)", () => {
  writeQuizFilters("present-perfect-quiz-filters-v1", { level: "basic", verb: "haber not tener" });
  assert.deepEqual(readQuizFilters("present-perfect-quiz-filters-v1", ["haber-not-tener"]), { level: "basic", verb: "all" });
});
