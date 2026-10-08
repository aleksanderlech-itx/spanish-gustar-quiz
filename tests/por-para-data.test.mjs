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

test("Por vs Para explanations name the rule for each sentence, not one shared template", () => {
  const explanations = new Set(POR_PARA_QUESTIONS.map((question) => question.explanation));
  assert.ok(explanations.size >= 20, `only ${explanations.size} distinct explanations`);
  for (const question of POR_PARA_QUESTIONS) {
    assert.doesNotMatch(question.explanation, /relationship expressed in this sentence/, `generic explanation for #${question.id}`);
    assert.match(question.explanation, new RegExp(`\\b${question.answer}\\b`), `explanation for #${question.id} does not name ${question.answer}`);
  }
});

test("Por vs Para avoids set-phrase items that do not test the por/para rules", () => {
  for (const question of POR_PARA_QUESTIONS) {
    const sentence = `${question.before} ${question.answer} ${question.after}`;
    assert.doesNotMatch(sentence, /\bpor (qué|favor)\b/i, `set phrase in #${question.id}: ${sentence}`);
  }
});
