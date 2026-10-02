import assert from "node:assert/strict";
import test from "node:test";
import { SABER_CONOCER_CONJUGATIONS, SABER_CONOCER_FORMS, SABER_CONOCER_QUESTIONS, SABER_CONOCER_USAGES } from "../app/saber-conocer-data.ts";

// Every form of saber/conocer, keyed to its counterpart in the same person and tense.
const counterpart = new Map([["saber", "conocer"], ["conocer", "saber"]]);
const tenseOf = new Map([["saber", "present"], ["conocer", "present"]]);
for (const row of SABER_CONOCER_CONJUGATIONS) {
  for (const tense of ["present", "preterite", "imperfect"]) {
    counterpart.set(row.saber[tense], row.conocer[tense]);
    counterpart.set(row.conocer[tense], row.saber[tense]);
    tenseOf.set(row.saber[tense], tense);
    tenseOf.set(row.conocer[tense], tense);
  }
}

test("Saber vs Conocer quiz uses original, complete question records", () => {
  assert.equal(SABER_CONOCER_QUESTIONS.length, 150);
  assert.equal(new Set(SABER_CONOCER_QUESTIONS.map((question) => question.id)).size, SABER_CONOCER_QUESTIONS.length);
  for (const question of SABER_CONOCER_QUESTIONS) {
    assert.ok(question.translations.en);
    assert.ok(question.explanation);
    assert.equal(question.blankHint, "saber / conocer", `#${question.id} must not reveal its usage in the blank`);
  }
});

test("each distractor is the other verb in the same person and tense", () => {
  for (const question of SABER_CONOCER_QUESTIONS) {
    assert.ok(counterpart.has(question.answer), `#${question.id}: ${question.answer} is not a saber/conocer form`);
    assert.equal(question.objectPronoun, counterpart.get(question.answer), `#${question.id}: wrong distractor`);
    assert.equal(question.tense, tenseOf.get(question.answer), `#${question.id}: tense doesn't match ${question.answer}`);
  }
});

test("usage categories are all filterable and the past group is the only one outside the present", () => {
  assert.deepEqual(Object.keys(SABER_CONOCER_FORMS), [...SABER_CONOCER_USAGES]);
  for (const usage of SABER_CONOCER_USAGES) {
    assert.ok(SABER_CONOCER_QUESTIONS.some((question) => question.infinitive === usage), `no questions for ${usage}`);
  }
  for (const question of SABER_CONOCER_QUESTIONS) {
    assert.equal(question.tense !== "present", question.infinitive === "past meaning", `#${question.id}: tense/usage mismatch`);
  }
});

test("skills always use saber and people, places and familiarity always use conocer", () => {
  const saberForms = new Set(["saber", ...SABER_CONOCER_CONJUGATIONS.flatMap((row) => Object.values(row.saber))]);
  for (const question of SABER_CONOCER_QUESTIONS) {
    if (question.infinitive === "facts" || question.infinitive === "skills") assert.ok(saberForms.has(question.answer), `#${question.id}`);
    if (["people", "places", "familiarity"].includes(question.infinitive)) assert.ok(!saberForms.has(question.answer), `#${question.id}`);
  }
});
