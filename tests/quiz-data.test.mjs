import assert from "node:assert/strict";
import test from "node:test";
import { ALL_QUESTIONS, QUESTION_BANKS, VERB_FORMS } from "../app/quiz-data.ts";

test("quiz content is complete and independent from interface code", () => {
  assert.ok(ALL_QUESTIONS.length > 100);
  assert.deepEqual(Object.keys(QUESTION_BANKS), Object.keys(VERB_FORMS));
  assert.equal(new Set(ALL_QUESTIONS.map((question) => question.id)).size, ALL_QUESTIONS.length);
});

test("every question supplies the data required by the reusable interface", () => {
  for (const question of ALL_QUESTIONS) {
    assert.ok(question.before.length || question.after.length);
    assert.ok(question.answer.trim());
    assert.ok(question.infinitive.trim());
    assert.ok(question.translations.en.trim());
    assert.ok(question.explanation.trim());
    assert.match(question.answer, /^(me|te|le|nos|les)\s+\S+/);
  }
});
