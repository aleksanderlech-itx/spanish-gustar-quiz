import assert from "node:assert/strict";
import test from "node:test";
import { ruleLabelFor } from "../app/notebook.ts";

const baseQuestion = {
  id: 1,
  before: "",
  after: "",
  infinitive: "gustar",
  answer: "",
  verbAnswer: "",
  objectPronoun: "",
  explanation: "",
  translations: { en: "", pl: "" },
  subjectNumber: "singular",
  isActivity: false,
  indirectObject: "",
  tense: "present",
  level: "basic",
};

test("ruleLabelFor names the actual grammar point per quiz", () => {
  assert.equal(ruleLabelFor({ ...baseQuestion, infinitive: "doler" }, "gustar"), "Gustar pattern: doler");
  assert.equal(ruleLabelFor(baseQuestion, "ser-estar"), "Ser vs estar");
  assert.equal(ruleLabelFor({ ...baseQuestion, tense: "preterite" }, "preterite-imperfect"), "Preterite");
  assert.equal(ruleLabelFor({ ...baseQuestion, tense: "imperfect" }, "preterite-imperfect"), "Imperfect");
  assert.equal(ruleLabelFor({ ...baseQuestion, infinitive: "people" }, "saber-conocer"), "Saber vs conocer: people");
  assert.equal(ruleLabelFor({ ...baseQuestion, infinitive: "placement" }, "reflexive-verbs"), "Reflexive verbs: placement");
});

// A browser stand-in so the notebook's storage reads and writes run unchanged.
const installStorage = (initial = {}) => {
  const map = new Map(Object.entries(initial));
  const localStorage = {
    map,
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
  };
  globalThis.window = { location: { search: "" }, localStorage, sessionStorage: localStorage };
  return localStorage;
};

const { parseNotebook, readNotebookEntries, recordMistakes, quizIdForRule, NOTEBOOK_KEY, NOTEBOOK_VERSION } = await import("../app/notebook.ts");

const V1 = {
  "Gustar pattern: doler": { rule: "Gustar pattern: doler", count: 3, lastMissedAt: "2026-10-01T08:00:00.000Z" },
  "Saber vs conocer: places": { rule: "Saber vs conocer: places", count: 1, lastMissedAt: "2026-10-02T08:00:00.000Z" },
  Preterite: { rule: "Preterite", count: 2, lastMissedAt: "2026-10-03T08:00:00.000Z" },
};

test("v1 entries migrate to rule entries without losing any or their miss counts", () => {
  const entries = Object.values(parseNotebook(JSON.stringify(V1)));
  assert.equal(entries.length, 3);
  const doler = entries.find((entry) => entry.rule === "Gustar pattern: doler");
  assert.deepEqual(doler, {
    id: "rule:Gustar pattern: doler", kind: "rule", quizId: "gustar", rule: "Gustar pattern: doler",
    missCount: 3, lastMissedAt: "2026-10-01T08:00:00.000Z", retryCount: 0, retryCorrectCount: 0,
  });
  assert.equal(entries.find((entry) => entry.rule === "Preterite").quizId, "preterite-imperfect");
});

test("quizIdForRule inverts ruleLabelFor for every activity", () => {
  assert.equal(quizIdForRule("Ser vs estar"), "ser-estar");
  assert.equal(quizIdForRule("Por vs para"), "por-para");
  assert.equal(quizIdForRule("Object pronouns: double pronouns"), "object-pronouns");
  assert.equal(quizIdForRule("Saber vs conocer: skills"), "saber-conocer");
  assert.equal(quizIdForRule("Reflexive verbs: placement"), "reflexive-verbs");
  assert.equal(quizIdForRule("Imperfect"), "preterite-imperfect");
  assert.equal(quizIdForRule("Gustar pattern: interesar"), "gustar");
});

test("the first write after migration stores schema v2 under the same key", () => {
  const storage = installStorage({ [NOTEBOOK_KEY]: JSON.stringify(V1) });
  recordMistakes(["Por vs para"]);
  const stored = JSON.parse(storage.map.get(NOTEBOOK_KEY));
  assert.equal(stored.version, NOTEBOOK_VERSION);
  assert.equal(Object.keys(stored.entries).length, 4);
  assert.equal(readNotebookEntries()[0].rule, "Por vs para");
});

test("corrupt or blocked storage never throws out of the notebook", () => {
  installStorage({ [NOTEBOOK_KEY]: "{not json" });
  assert.deepEqual(readNotebookEntries(), []);
  globalThis.window = { location: { search: "" }, localStorage: { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); }, removeItem: () => {} }, sessionStorage: {} };
  assert.deepEqual(readNotebookEntries(), []);
  assert.doesNotThrow(() => recordMistakes(["Ser vs estar"]));
});
