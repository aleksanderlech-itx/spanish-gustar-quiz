import assert from "node:assert/strict";
import test from "node:test";
import { SER_ESTAR_QUESTIONS } from "../app/ser-estar-data.ts";

test("Ser vs Estar quiz uses original, complete question records", () => {
  assert.equal(SER_ESTAR_QUESTIONS.length, 150);
  assert.equal(new Set(SER_ESTAR_QUESTIONS.map((question) => question.id)).size, SER_ESTAR_QUESTIONS.length);
  for (const question of SER_ESTAR_QUESTIONS) {
    assert.doesNotMatch(question.answer, /^(ser|estar)$/);
    assert.ok(question.objectPronoun);
    assert.notEqual(question.answer, question.objectPronoun);
    assert.ok(question.translations.en);
    assert.ok(question.explanation);
  }
});

test("Ser vs Estar explanations are unique to each sentence, not a shared template", () => {
  const explanations = new Set(SER_ESTAR_QUESTIONS.map((question) => question.explanation));
  assert.equal(explanations.size, SER_ESTAR_QUESTIONS.length, "explanations repeat across questions");
  for (const question of SER_ESTAR_QUESTIONS) {
    assert.doesNotMatch(question.explanation, /would change the meaning or be ungrammatical/, `generic explanation for #${question.id}`);
    assert.match(question.explanation, /\b(ser|estar)\b/i, `explanation for #${question.id} does not name the verb`);
  }
});

test("Ser vs Estar sentences are the hand-written items, so each tests one clear rule", () => {
  for (const question of SER_ESTAR_QUESTIONS) {
    assert.doesNotMatch(`${question.before} ${question.after}`, /\bTom\b/, `corpus sentence in #${question.id}`);
  }
});
