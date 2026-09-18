import assert from "node:assert/strict";
import test from "node:test";
import { POR_PARA_QUESTIONS } from "../app/por-para-data.ts";

test("Por vs Para quiz uses original, complete question records", () => {
  assert.equal(POR_PARA_QUESTIONS.length, 150);
  assert.equal(new Set(POR_PARA_QUESTIONS.map((question) => question.id)).size, POR_PARA_QUESTIONS.length);
  for (const question of POR_PARA_QUESTIONS) {
    assert.match(question.answer, /^(por|para)$/);
    assert.ok(question.objectPronoun);
    assert.notEqual(question.answer, question.objectPronoun);
    assert.ok(question.translations.en);
    assert.ok(question.explanation);
  }
});
