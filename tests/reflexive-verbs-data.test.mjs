import assert from "node:assert/strict";
import test from "node:test";
import { REFLEXIVE_CHART, REFLEXIVE_FORMS, REFLEXIVE_USAGES, REFLEXIVE_VERB_QUESTIONS } from "../app/reflexive-verbs-data.ts";
import { REFLEXIVE_VERB_EXPLANATIONS } from "../app/explanations-reflexive-verbs.ts";
import { SOURCED_QUIZ_PAIRS } from "../app/sourced-quiz-content.ts";

const PRONOUNS = ["me", "te", "se", "nos", "os"];
const fold = (value) => value.normalize("NFC").toLocaleLowerCase("es");
const letters = (value) => fold(value).replace(/[^\p{L} ]/gu, "").replace(/\s+/g, " ").trim();
const sentence = (question) => `${question.before} ${question.answer} ${question.after}`;
// A reflexive pronoun as its own word ("me levanto") or attached to an infinitive or gerund ("levantarme", "lavándose").
const hasReflexivePronoun = (answer) =>
  PRONOUNS.some((pronoun) => fold(answer).split(" ").includes(pronoun)) || /(?:r|ndo)(?:me|te|se|nos|os)$/u.test(fold(answer).normalize("NFD").replace(/\p{M}/gu, ""));

test("reflexive verbs bank has 150 questions with stable ids 7001 to 7150", () => {
  assert.equal(REFLEXIVE_VERB_QUESTIONS.length, 150);
  assert.deepEqual(REFLEXIVE_VERB_QUESTIONS.map((question) => question.id), Array.from({ length: 150 }, (_, index) => 7001 + index));
  assert.deepEqual(Object.keys(REFLEXIVE_VERB_EXPLANATIONS).map(Number), REFLEXIVE_VERB_QUESTIONS.map((question) => question.id));
});

test("every question has an answer in its sentence, a translation, an explanation and a different distractor", () => {
  for (const question of REFLEXIVE_VERB_QUESTIONS) {
    assert.ok(question.answer.trim(), `#${question.id}: missing answer`);
    assert.equal(question.answer, fold(question.answer), `#${question.id}: answers are stored lower case`);
    assert.ok(question.translations.en.trim(), `#${question.id}: missing translation`);
    assert.ok(question.explanation.trim(), `#${question.id}: missing explanation`);
    assert.ok(question.cue, `#${question.id}: missing cue`);
    assert.ok(question.blankHint, `#${question.id}: missing blank hint`);
    assert.notEqual(fold(question.objectPronoun), fold(question.answer), `#${question.id}: distractor equals answer`);
    assert.equal(letters(SOURCED_QUIZ_PAIRS[question.id].spanish), letters(sentence(question)), `#${question.id}: shown sentence drifted from its pair`);
  }
});

test("usage groups are all filterable and balanced across levels", () => {
  assert.deepEqual(Object.keys(REFLEXIVE_FORMS), [...REFLEXIVE_USAGES]);
  for (const usage of REFLEXIVE_USAGES) {
    const items = REFLEXIVE_VERB_QUESTIONS.filter((question) => question.infinitive === usage);
    assert.ok(items.length >= 20, `${usage} has only ${items.length} questions`);
  }
  for (const level of ["basic", "intermediate", "advanced"]) {
    assert.ok(REFLEXIVE_VERB_QUESTIONS.filter((question) => question.level === level).length >= 20, `too few ${level} questions`);
  }
});

test("outside the meaning-change group every answer carries a reflexive pronoun, unless one already sits before the helper verb", () => {
  for (const question of REFLEXIVE_VERB_QUESTIONS) {
    if (question.infinitive === "meaning change") continue;
    const pronounBeforeHelper = PRONOUNS.some((pronoun) => fold(question.before).split(/\s+/).includes(pronoun) || fold(question.before).startsWith(`¿${pronoun} `));
    if (pronounBeforeHelper) {
      assert.ok(!hasReflexivePronoun(question.answer), `#${question.id}: pronoun doubled`);
      assert.ok(hasReflexivePronoun(question.objectPronoun), `#${question.id}: distractor should be the doubled form`);
    } else {
      assert.ok(hasReflexivePronoun(question.answer), `#${question.id}: ${question.answer} has no reflexive pronoun`);
    }
  }
});

test("meaning-change items show both verbs in the blank and include plain (non-reflexive) answers", () => {
  const items = REFLEXIVE_VERB_QUESTIONS.filter((question) => question.infinitive === "meaning change");
  for (const question of items) {
    assert.match(question.blankHint, /^\p{L}+ \/ \p{L}+se$/u, `#${question.id}: blank should read "plain / reflexive"`);
    assert.notEqual(hasReflexivePronoun(question.answer), hasReflexivePronoun(question.objectPronoun), `#${question.id}: one option must be reflexive, the other plain`);
  }
  assert.ok(items.filter((question) => !hasReflexivePronoun(question.answer)).length >= 10, "too few plain-verb answers");
});

test("pronouns match the subject: usted and ustedes take se, vosotros takes os", () => {
  for (const question of REFLEXIVE_VERB_QUESTIONS) {
    const text = fold(`${question.before} ${question.after}`);
    const words = text.split(/[^\p{L}]+/u);
    if (words.includes("vosotros") && hasReflexivePronoun(question.answer)) assert.match(fold(question.answer), /(^os |os$)/u, `#${question.id}: vosotros needs os`);
    if ((words.includes("usted") || words.includes("ustedes")) && hasReflexivePronoun(question.answer)) assert.match(fold(question.answer), /(^se |se$)/u, `#${question.id}: usted/ustedes need se`);
  }
});

test("placement items cover infinitives, gerunds and pronouns before a conjugated verb", () => {
  const answers = REFLEXIVE_VERB_QUESTIONS.filter((question) => question.infinitive === "placement").map((question) => fold(question.answer));
  assert.ok(answers.some((answer) => /r(me|te|se|nos|os)$/u.test(answer)), "no infinitive attachment");
  assert.ok(answers.some((answer) => /ndo(me|te|se|nos|os)$/u.test(answer.normalize("NFD").replace(/\p{M}/gu, ""))), "no gerund attachment");
  assert.ok(answers.some((answer) => PRONOUNS.includes(answer.split(" ")[0])), "no pronoun before a conjugated verb");
});

test("reflexive chart lists all six persons with vosotros and ustedes", () => {
  const [pronouns, paradigm] = REFLEXIVE_CHART;
  assert.deepEqual(pronouns.rows.map((row) => row.form), ["me", "te", "se", "nos", "os", "se"]);
  assert.equal(paradigm.rows.length, 6);
  assert.ok(pronouns.rows.some((row) => row.label.includes("ustedes")));
});
