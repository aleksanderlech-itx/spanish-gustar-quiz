import assert from "node:assert/strict";
import test from "node:test";
import { SER_ESTAR_QUESTIONS } from "../app/ser-estar-data.ts";

test("Ser vs Estar quiz uses original, complete question records", () => {
  assert.equal(SER_ESTAR_QUESTIONS.length, 30);
  assert.equal(new Set(SER_ESTAR_QUESTIONS.map((question) => question.id)).size, SER_ESTAR_QUESTIONS.length);
  for (const question of SER_ESTAR_QUESTIONS) {
    assert.match(question.answer, /^(ser|estar)$/);
    assert.ok(question.translations.en);
    assert.ok(question.explanation);
  }
});
