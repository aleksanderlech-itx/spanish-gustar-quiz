import assert from "node:assert/strict";
import test from "node:test";
import { PRETERITE_IMPERFECT_CONJUGATIONS, PRETERITE_IMPERFECT_FORMS, PRETERITE_IMPERFECT_QUESTIONS } from "../app/preterite-imperfect-data.ts";

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

test("Preterite vs Imperfect conjugation chart covers quiz verbs", () => {
  const expectedVerbs = new Set(["ir", "preparar", "salir", "llegar", "vivir", "explicar", "ponerse", "empezar"]);
  assert.ok(PRETERITE_IMPERFECT_CONJUGATIONS.length >= expectedVerbs.size);

  for (const verb of expectedVerbs) {
    assert.ok(PRETERITE_IMPERFECT_CONJUGATIONS.some((row) => row.infinitive === verb), `${verb} missing`);
  }

  for (const row of PRETERITE_IMPERFECT_CONJUGATIONS) {
    assert.ok(row.subject);
    assert.ok(row.preterite);
    assert.ok(row.imperfect);
    assert.notEqual(row.preterite, row.imperfect);
  }
});
