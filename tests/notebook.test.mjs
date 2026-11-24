import assert from "node:assert/strict";
import test from "node:test";
import { ruleKeyFor, ruleLabel } from "../app/notebook.ts";

const baseQuestion = {
  id: 1,
  before: "",
  after: "",
  group: "gustar",
  answer: "",
  distractors: [],
  explanation: "",
  translation: "",
  level: "basic",
};

const labelFor = (question, quizId) => ruleLabel(quizId, ruleKeyFor(question, quizId));

test("a rule key names the grammar point per quiz, and its label is the text shown", () => {
  assert.equal(ruleKeyFor({ ...baseQuestion, group: "doler" }, "gustar"), "doler");
  assert.equal(labelFor({ ...baseQuestion, group: "doler" }, "gustar"), "Gustar pattern: doler");
  assert.equal(ruleKeyFor(baseQuestion, "ser-estar"), "ser-estar");
  assert.equal(labelFor(baseQuestion, "ser-estar"), "Ser vs estar");
  assert.equal(ruleKeyFor({ ...baseQuestion, tense: "preterite" }, "preterite-imperfect"), "preterite");
  assert.equal(labelFor({ ...baseQuestion, tense: "preterite" }, "preterite-imperfect"), "Preterite");
  assert.equal(labelFor({ ...baseQuestion, tense: "imperfect" }, "preterite-imperfect"), "Imperfect");
  assert.equal(labelFor({ ...baseQuestion, group: "people" }, "saber-conocer"), "Saber vs conocer: people");
  assert.equal(labelFor({ ...baseQuestion, group: "past-meaning" }, "saber-conocer"), "Saber vs conocer: past meaning");
  assert.equal(labelFor({ ...baseQuestion, group: "placement" }, "reflexive-verbs"), "Reflexive verbs: placement");
  assert.equal(labelFor({ ...baseQuestion, group: "irregular-participle" }, "present-perfect"), "Present perfect: irregular participle");
  assert.equal(labelFor({ ...baseQuestion, group: "irregular-gerund" }, "present-continuous"), "Present continuous: irregular gerund");
  assert.equal(ruleLabel("sentence-builder", "ser-and-estar"), "Sentence Builder: ser and estar");
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

const { parseNotebook, readNotebookEntries, recordMistakes, upgradeNotebookToRuleKeys, NOTEBOOK_KEY, NOTEBOOK_VERSION } = await import("../app/notebook.ts");
const { ruleFromSchema2Label } = await import("../app/schema-2-labels.ts");

const V1 = {
  "Gustar pattern: doler": { rule: "Gustar pattern: doler", count: 3, lastMissedAt: "2026-10-01T08:00:00.000Z" },
  "Saber vs conocer: places": { rule: "Saber vs conocer: places", count: 1, lastMissedAt: "2026-10-02T08:00:00.000Z" },
  Preterite: { rule: "Preterite", count: 2, lastMissedAt: "2026-10-03T08:00:00.000Z" },
};

test("v1 entries migrate to rule entries with rule keys, without losing any or their miss counts", () => {
  const entries = Object.values(parseNotebook(JSON.stringify(V1)));
  assert.equal(entries.length, 3);
  const doler = entries.find((entry) => entry.id === "rule:Gustar pattern: doler");
  assert.deepEqual(doler, {
    id: "rule:Gustar pattern: doler", kind: "rule", quizId: "gustar", rule: "doler",
    missCount: 3, lastMissedAt: "2026-10-01T08:00:00.000Z", retryCount: 0, retryCorrectCount: 0,
  });
  assert.deepEqual(entries.find((entry) => entry.id === "rule:Preterite").rule, "preterite");
  assert.equal(entries.find((entry) => entry.id === "rule:Preterite").quizId, "preterite-imperfect");
});

test("every schema 2 rule label maps to its activity and rule key (decision 0015)", () => {
  const cases = {
    "Ser vs estar": ["ser-estar", "ser-estar"],
    "Por vs para": ["por-para", "por-para"],
    "Object pronouns: double pronouns": ["object-pronouns", "double-pronouns"],
    "Saber vs conocer: skills": ["saber-conocer", "skills"],
    "Saber vs conocer: past meaning": ["saber-conocer", "past-meaning"],
    "Reflexive verbs: placement": ["reflexive-verbs", "placement"],
    "Present perfect: haber not tener": ["present-perfect", "haber-not-tener"],
    "Present continuous: pronoun placement": ["present-continuous", "pronoun-placement"],
    Imperfect: ["preterite-imperfect", "imperfect"],
    "Gustar pattern: interesar": ["gustar", "interesar"],
    "Sentence Builder: present and past": ["sentence-builder", "present-and-past"],
  };
  for (const [label, [activityId, key]] of Object.entries(cases)) assert.deepEqual(ruleFromSchema2Label(label), { activityId, key }, label);
  assert.equal(ruleFromSchema2Label("doler"), null, "a key is not a label");
});

test("a notebook entry written before the rename keeps its place: the upgrade turns its label into a key", () => {
  const stored = { version: 2, entries: {
    "q:present-perfect:8111": { id: "q:present-perfect:8111", kind: "question", quizId: "present-perfect", rule: "Present perfect: haber not tener", questionId: 8111, wrongAnswer: "tengo dormido", missCount: 1, lastMissedAt: "2026-11-20T08:00:00.000Z", retryCount: 0, retryCorrectCount: 0 },
    "q:gustar:12": { id: "q:gustar:12", kind: "question", quizId: "gustar", rule: "Gustar pattern: doler", questionId: 12, missCount: 1, lastMissedAt: "2026-11-20T08:00:00.000Z", retryCount: 0, retryCorrectCount: 0 },
  } };
  const upgraded = upgradeNotebookToRuleKeys(stored);
  assert.equal(upgraded.version, NOTEBOOK_VERSION);
  assert.equal(upgraded.entries["q:present-perfect:8111"].rule, "haber-not-tener");
  assert.equal(upgraded.entries["q:gustar:12"].rule, "doler");
  assert.equal(ruleLabel("present-perfect", upgraded.entries["q:present-perfect:8111"].rule), "Present perfect: haber not tener");
  assert.deepEqual(upgradeNotebookToRuleKeys(upgraded), upgraded, "running it twice changes nothing");
});

test("the first write after migration stores schema v2 under the same key", () => {
  const storage = installStorage({ [NOTEBOOK_KEY]: JSON.stringify(V1) });
  recordMistakes("por-para", [{ question: { ...baseQuestion, id: 4001 }, answer: "para" }]);
  const stored = JSON.parse(storage.map.get(NOTEBOOK_KEY));
  assert.equal(stored.version, NOTEBOOK_VERSION);
  assert.equal(Object.keys(stored.entries).length, 4);
  assert.equal(readNotebookEntries()[0].rule, "por-para");
});

test("corrupt or blocked storage never throws out of the notebook", () => {
  installStorage({ [NOTEBOOK_KEY]: "{not json" });
  assert.deepEqual(readNotebookEntries(), []);
  globalThis.window = { location: { search: "" }, localStorage: { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); }, removeItem: () => {} }, sessionStorage: {} };
  assert.deepEqual(readNotebookEntries(), []);
  assert.doesNotThrow(() => recordMistakes("ser-estar", [{ question: { ...baseQuestion, id: 2001 }, answer: "es" }]));
});

test("a missed sentence becomes one question entry with its subtopic and wrong answer", () => {
  installStorage();
  recordMistakes("gustar", [{ question: { ...baseQuestion, id: 12, group: "doler" }, answer: "me duelen" }], new Date("2026-10-16T08:00:00.000Z"));
  assert.deepEqual(readNotebookEntries(), [{
    id: "q:gustar:12", kind: "question", quizId: "gustar", rule: "doler", questionId: 12,
    wrongAnswer: "me duelen", missCount: 1, lastMissedAt: "2026-10-16T08:00:00.000Z", retryCount: 0, retryCorrectCount: 0,
  }]);
});

test("missing the same sentence again updates its entry instead of adding a duplicate", () => {
  installStorage();
  const question = { ...baseQuestion, id: 12, group: "doler" };
  recordMistakes("gustar", [{ question, answer: "me duelen" }], new Date("2026-10-16T08:00:00.000Z"));
  recordMistakes("gustar", [{ question, answer: "te duele" }], new Date("2026-10-17T08:00:00.000Z"));
  const entries = readNotebookEntries();
  assert.equal(entries.length, 1);
  assert.equal(entries[0].missCount, 2);
  assert.equal(entries[0].wrongAnswer, "te duele");
  assert.equal(entries[0].lastMissedAt, "2026-10-17T08:00:00.000Z");
});

test("the same question id in two activities stays two entries", () => {
  installStorage();
  recordMistakes("gustar", [{ question: { ...baseQuestion, id: 1 }, answer: "x" }]);
  recordMistakes("ser-estar", [{ question: { ...baseQuestion, id: 1 }, answer: "x" }]);
  assert.equal(readNotebookEntries().length, 2);
});

test("the notebook keeps only the 500 most recent misses", () => {
  installStorage();
  const misses = Array.from({ length: 505 }, (_, i) => ({ question: { ...baseQuestion, id: i + 1 }, answer: "x" }));
  misses.forEach((miss, i) => recordMistakes("gustar", [miss], new Date(Date.UTC(2026, 0, 1, 0, i))));
  const entries = readNotebookEntries();
  assert.equal(entries.length, 500);
  assert.ok(!entries.some((entry) => entry.questionId <= 5), "the five oldest were dropped");
});

const { recordRetry, dismissEntry } = await import("../app/notebook.ts");

test("a retry counts on its entry, and a correct retry keeps the entry", () => {
  installStorage();
  recordMistakes("gustar", [{ question: { ...baseQuestion, id: 12 }, answer: "x" }]);
  recordRetry("q:gustar:12", false, new Date("2026-10-16T09:00:00.000Z"));
  recordRetry("q:gustar:12", true, new Date("2026-10-16T09:01:00.000Z"));
  const [entry] = readNotebookEntries();
  assert.equal(entry.retryCount, 2);
  assert.equal(entry.retryCorrectCount, 1);
  assert.equal(entry.missCount, 1, "a wrong retry is not a new miss");
  assert.equal(entry.lastRetriedAt, "2026-10-16T09:01:00.000Z");
});

test("a retry for an unknown entry changes nothing, and dismiss removes only its entry", () => {
  installStorage();
  recordMistakes("gustar", [{ question: { ...baseQuestion, id: 1 }, answer: "x" }, { question: { ...baseQuestion, id: 2 }, answer: "x" }]);
  recordRetry("q:gustar:999", true);
  assert.ok(readNotebookEntries().every((entry) => entry.retryCount === 0));
  dismissEntry("q:gustar:1");
  assert.deepEqual(readNotebookEntries().map((entry) => entry.id), ["q:gustar:2"]);
});
