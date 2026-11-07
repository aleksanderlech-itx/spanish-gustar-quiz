import assert from "node:assert/strict";
import test from "node:test";
import { ESTAR_PRESENT, PRESENT_CONTINUOUS_CHART, PRESENT_CONTINUOUS_FORMS, PRESENT_CONTINUOUS_GROUPS, PRESENT_CONTINUOUS_QUESTIONS } from "../app/present-continuous-data.ts";
import { PRESENT_CONTINUOUS_EXPLANATIONS } from "../app/explanations-present-continuous.ts";
import { SOURCED_QUIZ_PAIRS } from "../app/sourced-quiz-content.ts";

const fold = (value) => value.normalize("NFC").toLocaleLowerCase("es");
const letters = (value) => fold(value).replace(/[^\p{L}\p{N} ]/gu, "").replace(/\s+/g, " ").trim();
const sentence = (question) => `${question.before} ${question.answer} ${question.after}`;
const words = (value) => fold(value).split(/[^\p{L}]+/u).filter(Boolean);
const stripAccents = (value) => value.normalize("NFD").replace(/\p{M}/gu, "").normalize("NFC");

const SER = ["soy", "eres", "es", "somos", "sois", "son"];
// Gerunds that do not follow -ando / -iendo / vowel + -yendo.
const IRREGULAR = {
  decir: "diciendo", pedir: "pidiendo", servir: "sirviendo", repetir: "repitiendo", seguir: "siguiendo",
  conseguir: "consiguiendo", sentir: "sintiendo", mentir: "mintiendo", competir: "compitiendo", elegir: "eligiendo",
  corregir: "corrigiendo", hervir: "hirviendo", medir: "midiendo", despedir: "despidiendo", vestir: "vistiendo",
  divertir: "divirtiendo", venir: "viniendo", dormir: "durmiendo", morir: "muriendo",
  reír: "riendo", sonreír: "sonriendo", freír: "friendo", ir: "yendo",
};
const VOWELS = new Set(["a", "e", "i", "o", "u"]);

/** The gerund estar needs for an infinitive (pronominal infinitives drop their -se). */
const gerundFor = (blankHint) => {
  const infinitive = blankHint.replace(/se$/u, "");
  if (IRREGULAR[infinitive]) return IRREGULAR[infinitive];
  if (infinitive.endsWith("ar")) return `${infinitive.slice(0, -2)}ando`;
  const stem = stripAccents(infinitive.slice(0, -2));
  return VOWELS.has(stem.at(-1)) ? `${stem}yendo` : `${stem}iendo`;
};
const isRegular = (blankHint) => {
  const infinitive = blankHint.replace(/se$/u, "");
  return !IRREGULAR[infinitive] && !VOWELS.has(stripAccents(infinitive.slice(0, -2)).at(-1));
};

const PRONOUNS = ["me", "te", "se", "lo", "la", "nos", "os", "los", "las", "le", "les"];
/** True when value is one or two object pronouns written together (lo, me, selo, mela...). */
const isPronounCluster = (value) => {
  if (PRONOUNS.includes(value)) return true;
  return PRONOUNS.some((first) => value.startsWith(first) && PRONOUNS.includes(value.slice(first.length)));
};

const SUBJECT_ESTAR = [
  [["yo"], "estoy"],
  [["tú"], "estás"],
  [["usted", "él", "ella"], "está"],
  [["nosotros", "nosotras"], "estamos"],
  [["vosotros", "vosotras"], "estáis"],
  [["ustedes", "ellos", "ellas"], "están"],
];

const estarIn = (value) => words(value).find((word) => ESTAR_PRESENT.includes(word));
const byGroup = (group) => PRESENT_CONTINUOUS_QUESTIONS.filter((question) => question.infinitive === group);

test("present continuous bank has 150 questions with stable ids 9001 to 9150", () => {
  assert.equal(PRESENT_CONTINUOUS_QUESTIONS.length, 150);
  assert.deepEqual(PRESENT_CONTINUOUS_QUESTIONS.map((question) => question.id), Array.from({ length: 150 }, (_, index) => 9001 + index));
  assert.deepEqual(Object.keys(PRESENT_CONTINUOUS_EXPLANATIONS).map(Number), PRESENT_CONTINUOUS_QUESTIONS.map((question) => question.id));
});

test("every question has its answer in the sentence, a translation, an explanation and a different distractor", () => {
  for (const question of PRESENT_CONTINUOUS_QUESTIONS) {
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

test("every estar answer is a present form of estar followed directly by the right gerund", () => {
  for (const question of PRESENT_CONTINUOUS_QUESTIONS.filter((item) => estarIn(item.answer))) {
    const tokens = fold(question.answer).split(" ");
    assert.equal(tokens.length, 2, `#${question.id}: ${question.answer} should be estar plus the gerund only`);
    assert.ok(ESTAR_PRESENT.includes(tokens[0]), `#${question.id}: ${question.answer} should start with estar`);
    assert.equal(tokens[1], gerundFor(question.blankHint), `#${question.id}: wrong gerund for ${question.blankHint}`);
  }
});

test("ser never forms the continuous in an answer, and the simple present is never a wrong option", () => {
  for (const question of PRESENT_CONTINUOUS_QUESTIONS) {
    assert.ok(!words(question.answer).some((word) => SER.includes(word)), `#${question.id}: ser in the answer`);
    const distractor = words(question.objectPronoun);
    if (estarIn(question.answer)) {
      // A one-word wrong option could be a valid simple present; every estar item's wrong option keeps an auxiliary.
      assert.equal(distractor.length, 2, `#${question.id}: wrong option should keep an auxiliary`);
      assert.ok(ESTAR_PRESENT.includes(distractor[0]) || SER.includes(distractor[0]), `#${question.id}: wrong option should start with estar or ser`);
    }
  }
});

test("the estar form matches an explicit subject pronoun", () => {
  for (const question of PRESENT_CONTINUOUS_QUESTIONS) {
    const estar = estarIn(question.answer);
    if (!estar) continue;
    const context = words(`${question.before} ${question.after}`);
    // "Mi familia y yo" is nosotros.
    if (/\by yo\b/u.test(fold(question.before))) {
      assert.equal(estar, "estamos", `#${question.id}: a subject with y yo needs estamos`);
      continue;
    }
    const matches = SUBJECT_ESTAR.filter(([subjects]) => subjects.some((subject) => context.includes(subject)));
    if (matches.length !== 1) continue;
    assert.equal(estar, matches[0][1], `#${question.id}: ${matches[0][0].join("/")} needs ${matches[0][1]}`);
  }
});

test("coverage: every person of estar, every group and level, singular and plural", () => {
  for (const form of ESTAR_PRESENT) {
    const count = PRESENT_CONTINUOUS_QUESTIONS.filter((question) => estarIn(question.answer) === form).length;
    assert.ok(count >= 12, `only ${count} answers use ${form}`);
  }
  for (const question of PRESENT_CONTINUOUS_QUESTIONS.filter((item) => estarIn(item.answer))) {
    const plural = ["estamos", "estáis", "están"].includes(estarIn(question.answer));
    assert.equal(question.subjectNumber, plural ? "plural" : "singular", `#${question.id}: subjectNumber does not match`);
  }
  assert.deepEqual(Object.keys(PRESENT_CONTINUOUS_FORMS), [...PRESENT_CONTINUOUS_GROUPS]);
  for (const group of PRESENT_CONTINUOUS_GROUPS) assert.equal(byGroup(group).length, 30, `${group} should have 30 questions`);
  for (const level of ["basic", "intermediate", "advanced"]) {
    assert.ok(PRESENT_CONTINUOUS_QUESTIONS.filter((question) => question.level === level).length >= 20, `too few ${level} questions`);
  }
});

test("regular groups use only regular -ando or -iendo gerunds, and the irregular group only irregular ones", () => {
  for (const question of byGroup("regular -ando")) {
    assert.match(question.blankHint, /ar$/u, `#${question.id}: ${question.blankHint} is not an -ar verb`);
  }
  for (const question of byGroup("regular -iendo")) {
    assert.match(question.blankHint, /[ei]r$/u, `#${question.id}: ${question.blankHint} is not an -er or -ir verb`);
    assert.ok(isRegular(question.blankHint), `#${question.id}: ${question.blankHint} has an irregular gerund`);
  }
  const irregular = byGroup("irregular gerund");
  for (const question of irregular) {
    assert.ok(!isRegular(question.blankHint), `#${question.id}: ${question.blankHint} has a regular gerund`);
  }
  const gerunds = new Set(irregular.map((question) => gerundFor(question.blankHint)));
  assert.ok(gerunds.size >= 20, `only ${gerunds.size} different irregular gerunds`);
  for (const common of ["leyendo", "diciendo", "durmiendo", "pidiendo", "oyendo", "yendo", "siguiendo", "construyendo"]) {
    assert.ok(gerunds.has(common), `irregular gerund ${common} is missing`);
  }
});

test("pronoun placement: an attached pronoun takes an accent, a pronoun before estar is never repeated", () => {
  const items = byGroup("pronoun placement");
  const attached = items.filter((question) => !estarIn(question.answer));
  const before = items.filter((question) => estarIn(question.answer));
  assert.ok(attached.length >= 12 && before.length >= 12, "both placements should be well represented");
  for (const question of attached) {
    const gerund = gerundFor(question.blankHint);
    const plain = stripAccents(question.answer);
    assert.ok(plain.startsWith(gerund), `#${question.id}: ${question.answer} should start with ${gerund}`);
    assert.ok(isPronounCluster(plain.slice(gerund.length)), `#${question.id}: ${question.answer} should end in object pronouns`);
    assert.notEqual(plain, question.answer, `#${question.id}: an attached pronoun needs a written accent`);
    assert.ok(estarIn(question.before), `#${question.id}: estar should be in the sentence before the blank`);
    const distractor = fold(question.objectPronoun);
    const unaccented = distractor === plain;
    const pronounFirst = distractor.includes(" ") && isPronounCluster(distractor.split(" ")[0]);
    const wrongStem = !stripAccents(distractor).startsWith(gerund);
    assert.ok(unaccented || pronounFirst || wrongStem, `#${question.id}: wrong option ${distractor} should drop the accent, misplace the pronoun or misspell the gerund`);
  }
  for (const question of before) {
    const lastWord = words(question.before).at(-1);
    assert.ok(isPronounCluster(lastWord), `#${question.id}: a pronoun should come right before the blank`);
    const [, distractorGerund] = fold(question.objectPronoun).split(" ");
    const plain = stripAccents(distractorGerund);
    const gerund = gerundFor(question.blankHint);
    assert.ok(plain.startsWith(gerund) && isPronounCluster(plain.slice(gerund.length)), `#${question.id}: wrong option should repeat the pronoun on the gerund`);
  }
});

test("gerund or infinitive: the infinitive answers take the gerund as the wrong option, and vice versa", () => {
  const items = byGroup("gerund or infinitive");
  const infinitives = items.filter((question) => !estarIn(question.answer));
  assert.ok(infinitives.length >= 12, `only ${infinitives.length} infinitive answers`);
  assert.ok(items.length - infinitives.length >= 12, "too few estar answers to contrast with");
  for (const question of infinitives) {
    assert.equal(question.answer, question.blankHint, `#${question.id}: the answer should be the infinitive`);
    assert.equal(stripAccents(fold(question.objectPronoun)), stripAccents(`${gerundFor(question.blankHint)}${question.blankHint.endsWith("se") ? "se" : ""}`), `#${question.id}: the wrong option should be the gerund`);
  }
  for (const question of items.filter((item) => estarIn(item.answer))) {
    const [, wrong] = fold(question.objectPronoun).split(" ");
    assert.equal(wrong, question.blankHint, `#${question.id}: the wrong option should be estar plus the infinitive`);
  }
});

test("present continuous chart lists all six estar forms and correct gerunds", () => {
  const [estar, regular, irregular] = PRESENT_CONTINUOUS_CHART;
  assert.deepEqual(estar.rows.map((row) => row.form.split(" ")[0]), [...ESTAR_PRESENT]);
  for (const row of [...regular.rows, ...irregular.rows]) {
    const infinitive = row.label.split(": ").at(-1);
    assert.equal(row.form, gerundFor(infinitive), `chart: ${row.label}`);
  }
  for (const table of PRESENT_CONTINUOUS_CHART) {
    for (const row of table.rows) assert.doesNotMatch(row.form, /→|\bnot\b/u, `${table.title}: ${row.form} would be spoken as a wrong form`);
  }
});
