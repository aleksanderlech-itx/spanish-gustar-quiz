import assert from "node:assert/strict";
import test from "node:test";
import { CONDITIONALS_CHART, CONDITIONALS_FORMS, CONDITIONALS_GROUPS, CONDITIONALS_QUESTIONS, IRREGULAR_CONDITIONAL_STEMS } from "../app/conditionals-data.ts";
import { CONDITIONALS_EXPLANATIONS } from "../app/explanations-conditionals.ts";
import { SOURCED_QUIZ_PAIRS } from "../app/sourced-quiz-content.ts";

const fold = (value) => value.normalize("NFC").toLocaleLowerCase("es");
const letters = (value) => fold(value).replace(/[^\p{L}\p{N} ]/gu, "").replace(/\s+/g, " ").trim();
const words = (value) => fold(value).split(/[^\p{L}]+/u).filter(Boolean);
const sentence = (question) => `${question.before} ${question.answer} ${question.after}`;
const byGroup = (group) => CONDITIONALS_QUESTIONS.filter((question) => question.infinitive === group);

const PRONOUNS = new Set(["me", "te", "se", "nos", "le", "les", "lo", "la", "los", "las"]);
/** The conjugated verb of a form: the first word that is not a pronoun (habría in "se habría mudado"). */
const verbOf = (form) => words(form).find((word) => !PRONOUNS.has(word));
/** The last word of a form: the participle of a compound form, or the verb itself. */
const lastOf = (form) => words(form).at(-1);
const infinitiveOf = (question) => question.blankHint.replace(/se$/u, "");

// Both are built on an r stem: the infinitive (hablaría, hablaré) or a shortened one (podría, tendré).
const CONDITIONAL = /r(ía|ías|íamos|ían)$/u;
const FUTURE = /r(é|ás|á|emos|án)$/u;
const RA_SUBJUNCTIVE = /(ara|aras|áramos|aran|era|eras|éramos|eran)$/u;
const SE_SUBJUNCTIVE = /(ase|ases|ásemos|asen|iese|ieses|iésemos|iesen|yese|yesen)$/u;
const CONDITIONAL_ENDINGS = ["ía", "ías", "íamos", "ían"];
const FUTURE_ENDINGS = ["é", "ás", "á", "emos", "án"];

/** True when the blank sits inside a si clause: the last si before it is not closed by a comma or full stop. */
const blankInSiClause = (question) => {
  const before = fold(question.before);
  const match = [...before.matchAll(/(?<!\p{L})si(?!\p{L})/gu)].at(-1);
  return !!match && !/[,.]/u.test(before.slice(match.index));
};
const hasSi = (question) => words(sentence(question)).includes("si");
const siClauseSecond = (question) => hasSi(question) && !fold(question.before).startsWith("si ") && fold(question.before) !== "si";

test("conditionals bank has 150 questions with stable ids 11001 to 11150 and one explanation each", () => {
  assert.equal(CONDITIONALS_QUESTIONS.length, 150);
  assert.deepEqual(CONDITIONALS_QUESTIONS.map((question) => question.id), Array.from({ length: 150 }, (_, index) => 11001 + index));
  assert.deepEqual(Object.keys(CONDITIONALS_EXPLANATIONS).map(Number), CONDITIONALS_QUESTIONS.map((question) => question.id));
});

test("the six subtopics keep their permanent names and the agreed sizes", () => {
  assert.deepEqual([...CONDITIONALS_GROUPS], ["real condition", "imperfect subjunctive", "regular conditional", "irregular conditional", "past unreal", "polite conditional"]);
  assert.deepEqual(Object.keys(CONDITIONALS_FORMS), [...CONDITIONALS_GROUPS]);
  const sizes = Object.fromEntries(CONDITIONALS_GROUPS.map((group) => [group, byGroup(group).length]));
  assert.deepEqual(sizes, { "real condition": 25, "imperfect subjunctive": 30, "regular conditional": 20, "irregular conditional": 25, "past unreal": 30, "polite conditional": 20 });
});

test("every question has its answer in the sentence, a translation, a cue, a blank hint and a different wrong option", () => {
  for (const question of CONDITIONALS_QUESTIONS) {
    assert.equal(question.answer, fold(question.answer), `#${question.id}: answers are stored lower case`);
    assert.ok(question.translations.en.trim(), `#${question.id}: missing translation`);
    assert.ok(question.explanation.trim(), `#${question.id}: missing explanation`);
    assert.ok(question.cue, `#${question.id}: missing cue`);
    assert.ok(question.blankHint, `#${question.id}: missing blank hint`);
    assert.notEqual(fold(question.objectPronoun), fold(question.answer), `#${question.id}: wrong option equals answer`);
    assert.equal(letters(SOURCED_QUIZ_PAIRS[question.id].spanish), letters(sentence(question)), `#${question.id}: shown sentence drifted from its pair`);
  }
});

test("no vosotros and no -se subjunctive anywhere in the bank", () => {
  for (const question of CONDITIONALS_QUESTIONS) {
    const text = words(`${sentence(question)} ${question.objectPronoun}`);
    assert.ok(!text.some((word) => word === "vosotros" || word === "vosotras" || word === "os"), `#${question.id}: vosotros`);
    for (const form of [question.answer, question.objectPronoun]) {
      const verb = verbOf(form);
      assert.ok(!/(áis|éis|íais|rais|seis)$/u.test(verb), `#${question.id}: ${form} is a vosotros form`);
      assert.ok(!SE_SUBJUNCTIVE.test(verb), `#${question.id}: ${form} is a -se form`);
    }
  }
});

test("after si, never the conditional or the future: si clause answers are present, -ra or hubiera, and their wrong option is the conditional or the future", () => {
  const items = CONDITIONALS_QUESTIONS.filter(blankInSiClause);
  assert.ok(items.length >= 50, `only ${items.length} blanks in a si clause`);
  for (const question of items) {
    const verb = verbOf(question.answer);
    assert.ok(!CONDITIONAL.test(verb) && !FUTURE.test(verb), `#${question.id}: ${question.answer} after si`);
    const wrong = verbOf(question.objectPronoun);
    assert.ok(CONDITIONAL.test(wrong) || FUTURE.test(wrong), `#${question.id}: wrong option ${question.objectPronoun} should be the conditional or the future`);
  }
});

test("about half the si clause items put the blank in the si clause, and about one in three put the si clause second", () => {
  const withSi = CONDITIONALS_QUESTIONS.filter(hasSi);
  const inSi = withSi.filter(blankInSiClause).length;
  assert.ok(inSi / withSi.length >= 0.4 && inSi / withSi.length <= 0.6, `${inSi} of ${withSi.length} blanks in the si clause`);
  const second = withSi.filter(siClauseSecond).length;
  assert.ok(second / withSi.length >= 0.25, `only ${second} of ${withSi.length} put the si clause second`);
});

test("real condition: si plus the present, and a result that is never the subjunctive", () => {
  for (const question of byGroup("real condition")) {
    assert.ok(hasSi(question), `#${question.id}: needs a si clause`);
    const verb = verbOf(question.answer);
    assert.ok(!RA_SUBJUNCTIVE.test(verb) && !CONDITIONAL.test(verb), `#${question.id}: ${question.answer} is not real`);
    if (!blankInSiClause(question)) {
      assert.ok(!["poder", "querer", "deber"].includes(infinitiveOf(question)), `#${question.id}: a modal can take a softening conditional`);
    }
  }
});

test("imperfect subjunctive: every answer is an -ra form in the si clause, next to a conditional result", () => {
  for (const question of byGroup("imperfect subjunctive")) {
    assert.ok(blankInSiClause(question), `#${question.id}: the blank should be in the si clause`);
    assert.match(lastOf(question.answer), RA_SUBJUNCTIVE, `#${question.id}: ${question.answer} is not an -ra form`);
    assert.ok(words(`${question.before} ${question.after}`).some((word) => CONDITIONAL.test(word)), `#${question.id}: no conditional result in the sentence`);
  }
});

test("regular conditional: whole infinitive plus -ía, and the future as the wrong option", () => {
  for (const question of byGroup("regular conditional")) {
    assert.ok(!blankInSiClause(question), `#${question.id}: the blank should be the result`);
    const infinitive = infinitiveOf(question);
    assert.ok(!IRREGULAR_CONDITIONAL_STEMS[infinitive], `#${question.id}: ${infinitive} is irregular`);
    const verb = verbOf(question.answer);
    assert.ok(CONDITIONAL_ENDINGS.some((ending) => verb === `${infinitive}${ending}`), `#${question.id}: ${verb} is not ${infinitive} + -ía`);
    const wrong = verbOf(question.objectPronoun);
    assert.ok(FUTURE_ENDINGS.some((ending) => wrong === `${infinitive}${ending}`), `#${question.id}: wrong option ${wrong} should be the future`);
    assert.ok(words(question.before + " " + question.after).some((word) => RA_SUBJUNCTIVE.test(word)), `#${question.id}: no imagined si clause`);
  }
});

test("irregular conditional: the shortened stem, with the regularised stem or the future as the wrong option", () => {
  const stems = new Set();
  for (const question of byGroup("irregular conditional")) {
    assert.ok(!blankInSiClause(question), `#${question.id}: the blank should be the result`);
    const infinitive = infinitiveOf(question);
    const stem = IRREGULAR_CONDITIONAL_STEMS[infinitive];
    assert.ok(stem, `#${question.id}: ${infinitive} has no irregular stem`);
    stems.add(stem);
    const ending = CONDITIONAL_ENDINGS.find((candidate) => verbOf(question.answer) === `${stem}${candidate}`);
    assert.ok(ending, `#${question.id}: ${question.answer} should be ${stem}- + -ía`);
    const wrong = verbOf(question.objectPronoun);
    assert.ok(wrong === `${infinitive}${ending}` || FUTURE.test(wrong), `#${question.id}: wrong option ${wrong} should be ${infinitive}${ending} or the future`);
    assert.ok(!/^(pudiera|quisiera|debiera)/u.test(wrong), `#${question.id}: an accepted -ra form is never a wrong option`);
  }
  assert.equal(stems.size, 12, "every irregular stem appears");
});

test("past unreal: hubiera in the si clause, habría in the result, never hubiera or the simple conditional as a wrong result", () => {
  const items = byGroup("past unreal");
  const inSi = items.filter(blankInSiClause);
  assert.ok(inSi.length >= 12 && items.length - inSi.length >= 12, "both halves are well represented");
  for (const question of items) {
    const [aux] = words(question.answer).filter((word) => !PRONOUNS.has(word));
    const wrongAux = verbOf(question.objectPronoun);
    assert.equal(words(question.answer).filter((word) => !PRONOUNS.has(word)).length, 2, `#${question.id}: auxiliary plus participle`);
    if (blankInSiClause(question)) {
      assert.match(aux, /^hubi[eé]r/u, `#${question.id}: si clause takes hubiera`);
      assert.match(wrongAux, /^habría/u, `#${question.id}: the wrong option should be habría after si`);
    } else {
      assert.match(aux, /^habría/u, `#${question.id}: result takes habría`);
      assert.doesNotMatch(wrongAux, /^hubi[eé]r/u, `#${question.id}: hubiera is accepted in the result`);
      assert.equal(words(question.objectPronoun).filter((word) => !PRONOUNS.has(word)).length, 2, `#${question.id}: a simple conditional would read as a mixed conditional`);
      assert.ok(words(question.before + " " + question.after).some((word) => /^hubi[eé]r/u.test(word)), `#${question.id}: no hubiera si clause`);
    }
  }
});

test("polite conditional: no si, a conditional answer, never an accepted polite form as the wrong option", () => {
  const ACCEPTED = /^(puedes|puede|pueden|pudieras|pudiera|pudieran|quisiera|quisiéramos|quería|queríamos)$/u;
  for (const question of byGroup("polite conditional")) {
    assert.ok(!hasSi(question), `#${question.id}: polite items have no si clause`);
    assert.match(verbOf(question.answer), CONDITIONAL, `#${question.id}: ${question.answer} is not conditional`);
    assert.doesNotMatch(verbOf(question.objectPronoun), ACCEPTED, `#${question.id}: ${question.objectPronoun} is polite and correct`);
  }
});

test("a wrong option in a result clause is never an -ra form", () => {
  for (const question of CONDITIONALS_QUESTIONS.filter((item) => !blankInSiClause(item))) {
    assert.doesNotMatch(verbOf(question.objectPronoun), RA_SUBJUNCTIVE, `#${question.id}: -ra is accepted in a result in some regions`);
  }
});

test("coverage: singular and plural, every level", () => {
  assert.ok(CONDITIONALS_QUESTIONS.filter((question) => question.subjectNumber === "plural").length >= 40, "too few plural answers");
  for (const level of ["basic", "intermediate", "advanced"]) {
    assert.ok(CONDITIONALS_QUESTIONS.filter((question) => question.level === level).length >= 15, `too few ${level} questions`);
  }
});

test("the chart lists the twelve irregular stems with their conditional forms", () => {
  const stems = CONDITIONALS_CHART.find((table) => table.title === "Irregular conditional stems");
  assert.equal(stems.rows.length, 12);
  for (const row of stems.rows) {
    const [infinitive] = row.label.split(":");
    assert.equal(row.form, `${IRREGULAR_CONDITIONAL_STEMS[infinitive]}ía`, row.label);
  }
});
