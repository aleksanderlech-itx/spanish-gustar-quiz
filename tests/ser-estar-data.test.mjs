import assert from "node:assert/strict";
import test from "node:test";
import { SER_ESTAR_QUESTIONS } from "../app/ser-estar-data.ts";

test("Ser vs Estar quiz uses original, complete question records", () => {
  assert.equal(SER_ESTAR_QUESTIONS.length, 150);
  assert.equal(new Set(SER_ESTAR_QUESTIONS.map((question) => question.id)).size, SER_ESTAR_QUESTIONS.length);
  for (const question of SER_ESTAR_QUESTIONS) {
    assert.doesNotMatch(question.answer, /^(ser|estar)$/);
    assert.ok(question.distractors[0]);
    assert.notEqual(question.answer, question.distractors[0]);
    assert.ok(question.translation);
    assert.ok(question.explanation);
  }
});
