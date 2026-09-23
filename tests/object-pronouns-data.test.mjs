import assert from "node:assert/strict";
import test from "node:test";
import { OBJECT_PRONOUN_FORMS, OBJECT_PRONOUN_QUESTIONS, OBJECT_PRONOUN_TYPES } from "../app/object-pronouns-data.ts";

const stripAccents = (value) => value.normalize("NFD").replace(/\p{Diacritic}/gu, "");
const byType = (type) => OBJECT_PRONOUN_QUESTIONS.filter((question) => question.infinitive === type);

// A standalone pronoun cluster, or pronouns attached to the end of a gerund/infinitive.
const PATTERNS = {
  "direct object": { standalone: /^(me|te|lo|la|nos|los|las)$/, attached: /(me|te|lo|la|nos|los|las)$/ },
  "indirect object": { standalone: /^(me|te|le|nos|les)$/, attached: /(me|te|le|nos|les)$/ },
  "double pronouns": { standalone: /^(me|te|se|nos) (lo|la|los|las)$/, attached: /(me|te|se|nos)(lo|la|los|las)$/ },
};

test("Object pronouns quiz has 150 questions with stable, unique IDs", () => {
  assert.equal(OBJECT_PRONOUN_QUESTIONS.length, 150);
  assert.equal(new Set(OBJECT_PRONOUN_QUESTIONS.map((question) => question.id)).size, 150);
  OBJECT_PRONOUN_QUESTIONS.forEach((question, index) => assert.equal(question.id, 5001 + index));
});

test("every question has a translation, an explanation and a distinct distractor", () => {
  for (const question of OBJECT_PRONOUN_QUESTIONS) {
    assert.ok(question.translations.en.trim(), `#${question.id}: missing translation`);
    assert.ok(question.explanation.trim(), `#${question.id}: missing explanation`);
    assert.ok(question.objectPronoun.trim(), `#${question.id}: missing distractor`);
    assert.notEqual(question.answer, question.objectPronoun, `#${question.id}: distractor equals answer`);
  }
});

test("accepted answers are already normalized: trimmed, lowercase, single-spaced", () => {
  for (const question of OBJECT_PRONOUN_QUESTIONS) {
    const normalized = question.answer.trim().toLocaleLowerCase("es").replace(/\s+/g, " ");
    assert.equal(question.answer, normalized, `#${question.id}: answer "${question.answer}" is not normalized`);
  }
});

test("each question is a direct, indirect or double-pronoun item, and all three are well represented", () => {
  assert.deepEqual(Object.keys(OBJECT_PRONOUN_FORMS), [...OBJECT_PRONOUN_TYPES]);
  for (const question of OBJECT_PRONOUN_QUESTIONS) {
    assert.ok(OBJECT_PRONOUN_TYPES.includes(question.infinitive), `#${question.id}: unknown type ${question.infinitive}`);
  }
  for (const type of OBJECT_PRONOUN_TYPES) {
    assert.ok(byType(type).length >= 40, `${type} has only ${byType(type).length} questions`);
  }
});

test("answers match the expected pronoun pattern for their type", () => {
  for (const question of OBJECT_PRONOUN_QUESTIONS) {
    const pattern = PATTERNS[question.infinitive];
    if (question.blankHint) {
      assert.ok(
        stripAccents(question.answer).startsWith(stripAccents(question.blankHint)),
        `#${question.id}: "${question.answer}" doesn't extend the hint "${question.blankHint}"`,
      );
      const pronouns = stripAccents(question.answer).slice(question.blankHint.length);
      assert.match(pronouns, new RegExp(`^${pattern.attached.source}`), `#${question.id}: attached pronouns "${pronouns}"`);
    } else {
      assert.match(question.answer, pattern.standalone, `#${question.id}: "${question.answer}"`);
    }
  }
});

test("pronoun attachment is practised with gerunds and infinitives, with the accent where it is required", () => {
  const attached = OBJECT_PRONOUN_QUESTIONS.filter((question) => question.blankHint);
  assert.ok(attached.some((question) => question.blankHint.endsWith("ndo")), "no gerund attachment items");
  assert.ok(attached.some((question) => question.blankHint.endsWith("r")), "no infinitive attachment items");
  for (const question of attached) {
    const pronounCount = question.infinitive === "double pronouns" ? 2 : 1;
    // A gerund always gains a written accent; an infinitive only does with two pronouns.
    const needsAccent = question.blankHint.endsWith("ndo") || pronounCount === 2;
    assert.equal(/[áéíóú]/.test(question.answer), needsAccent, `#${question.id}: accent on "${question.answer}"`);
  }
});

test("double pronouns explicitly practise le/les becoming se, and never accept le lo / les la", () => {
  const doubles = byType("double pronouns");
  const seItems = doubles.filter((question) => /^se |se(lo|la|los|las)$/.test(stripAccents(question.answer)));
  assert.ok(seItems.length >= 25, `only ${seItems.length} se-replacement items`);
  for (const question of OBJECT_PRONOUN_QUESTIONS) {
    assert.doesNotMatch(question.answer, /\bles? l(o|a|os|as)\b/, `#${question.id}: "${question.answer}"`);
  }
  // The le lo / les la mistake is offered as the tempting wrong option.
  assert.ok(doubles.some((question) => /^les? l/.test(question.objectPronoun)));
});

test("the blank never opens a sentence, so the lowercase answer always reads naturally", () => {
  for (const question of OBJECT_PRONOUN_QUESTIONS) {
    assert.ok(question.before.trim(), `#${question.id}: blank starts the sentence`);
    assert.doesNotMatch(question.before.trim(), /[.?!¿¡]$/, `#${question.id}: blank starts a new sentence`);
  }
});

test("clarification with a + person appears alongside the pronoun", () => {
  const clarified = OBJECT_PRONOUN_QUESTIONS.filter((question) => /(?<!\p{L})a (mí|ti|él|ella|usted|ustedes|nosotros|nosotras)(?!\p{L})/u.test(`${question.before} ${question.after}`));
  assert.ok(clarified.length >= 8, `only ${clarified.length} a + person items`);
});
