import assert from "node:assert/strict";
import test from "node:test";
import { PRETERITE_IMPERFECT_CONJUGATIONS, PRETERITE_IMPERFECT_FORMS, PRETERITE_IMPERFECT_QUESTIONS } from "../app/preterite-imperfect-data.ts";

test("Preterite vs Imperfect quiz is generated from complete templates", () => {
  assert.equal(PRETERITE_IMPERFECT_QUESTIONS.length, 16);
  for (const forms of Object.values(PRETERITE_IMPERFECT_FORMS)) assert.deepEqual(forms, ["preterite", "imperfect"]);
  assert.equal(new Set(PRETERITE_IMPERFECT_QUESTIONS.map((question) => question.id)).size, PRETERITE_IMPERFECT_QUESTIONS.length);
  assert.ok(PRETERITE_IMPERFECT_QUESTIONS.some((question) => question.tense === "preterite"));
  assert.ok(PRETERITE_IMPERFECT_QUESTIONS.some((question) => question.tense === "imperfect"));

  for (const question of PRETERITE_IMPERFECT_QUESTIONS) {
    assert.ok(PRETERITE_IMPERFECT_CONJUGATIONS[question.infinitive], `${question.infinitive} chart missing`);
    assert.ok(question.answer);
    assert.ok(question.objectPronoun);
    assert.notEqual(question.answer, question.objectPronoun);
    assert.doesNotMatch(question.answer, /^(preterite|imperfect)$/);
    assert.ok(question.translations.en);
    assert.ok(question.explanation);
  }
});

test("Preterite vs Imperfect conjugation charts cover only quiz verbs in all forms", () => {
  const expectedVerbs = new Set(["ir", "preparar", "salir", "llegar", "vivir", "explicar", "ponerse", "empezar"]);
  assert.deepEqual(new Set(Object.keys(PRETERITE_IMPERFECT_CONJUGATIONS)), expectedVerbs);

  for (const verb of expectedVerbs) {
    const forms = PRETERITE_IMPERFECT_CONJUGATIONS[verb];
    assert.equal(forms.length, 6, `${verb} should have six subject forms`);
    for (const row of forms) {
      assert.ok(row.subject);
      assert.ok(row.preterite);
      assert.ok(row.imperfect);
      assert.notEqual(row.preterite, row.imperfect);
    }
  }
});
