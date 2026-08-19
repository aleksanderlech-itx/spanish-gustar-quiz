import assert from "node:assert/strict";
import test from "node:test";
import { PRETERITE_IMPERFECT_FORMS, PRETERITE_IMPERFECT_QUESTIONS } from "../app/preterite-imperfect-data.ts";

test("Preterite vs Imperfect quiz is generated from complete templates", () => {
  assert.equal(PRETERITE_IMPERFECT_QUESTIONS.length, 16);
  assert.deepEqual(PRETERITE_IMPERFECT_FORMS["preterite / imperfect"], ["preterite", "imperfect"]);
  assert.equal(new Set(PRETERITE_IMPERFECT_QUESTIONS.map((question) => question.id)).size, PRETERITE_IMPERFECT_QUESTIONS.length);
  assert.ok(PRETERITE_IMPERFECT_QUESTIONS.some((question) => question.tense === "preterite"));
  assert.ok(PRETERITE_IMPERFECT_QUESTIONS.some((question) => question.tense === "imperfect"));

  for (const question of PRETERITE_IMPERFECT_QUESTIONS) {
    assert.equal(question.infinitive, "preterite / imperfect");
    assert.ok(question.answer);
    assert.ok(question.objectPronoun);
    assert.notEqual(question.answer, question.objectPronoun);
    assert.doesNotMatch(question.answer, /^(preterite|imperfect)$/);
    assert.ok(question.translations.en);
    assert.ok(question.explanation);
  }
});
