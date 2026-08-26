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
});
