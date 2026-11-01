import assert from "node:assert/strict";
import test from "node:test";
import { HABER_PRESENT, PRESENT_PERFECT_CHART, PRESENT_PERFECT_FORMS, PRESENT_PERFECT_GROUPS, PRESENT_PERFECT_QUESTIONS } from "../app/present-perfect-data.ts";
import { PRESENT_PERFECT_EXPLANATIONS } from "../app/explanations-present-perfect.ts";
import { SOURCED_QUIZ_PAIRS } from "../app/sourced-quiz-content.ts";

const fold = (value) => value.normalize("NFC").toLocaleLowerCase("es");
const letters = (value) => fold(value).replace(/[^\p{L}\p{N} ]/gu, "").replace(/\s+/g, " ").trim();
const sentence = (question) => `${question.before} ${question.answer} ${question.after}`;
const words = (value) => fold(value).split(/[^\p{L}]+/u).filter(Boolean);

const TENER = ["tengo", "tienes", "tiene", "tenemos", "tenéis", "tienen"];
const IRREGULAR = {
  abrir: "abierto", cubrir: "cubierto", descubrir: "descubierto", decir: "dicho", escribir: "escrito",
  hacer: "hecho", deshacer: "deshecho", rehacer: "rehecho", satisfacer: "satisfecho", morir: "muerto",
  poner: "puesto", componer: "compuesto", proponer: "propuesto", resolver: "resuelto", romper: "roto",
  ver: "visto", volver: "vuelto", devolver: "devuelto", envolver: "envuelto",
};
// -er and -ir verbs whose stem ends in a vowel take a written accent on the í.
const ACCENTED = { leer: "leído", oír: "oído", traer: "traído", creer: "creído" };

/** The participle haber needs for an infinitive (pronominal infinitives drop their -se). */
const participleFor = (blankHint) => {
  const infinitive = blankHint.replace(/se$/u, "");
  if (IRREGULAR[infinitive]) return IRREGULAR[infinitive];
  if (ACCENTED[infinitive]) return ACCENTED[infinitive];
  if (infinitive.endsWith("ar")) return `${infinitive.slice(0, -2)}ado`;
  return `${infinitive.slice(0, -2)}ido`;
};

// The haber form each explicit subject needs. Usted and ustedes take the third person.
const SUBJECT_HABER = [
  [["yo"], "he"],
  [["tú"], "has"],
  [["usted", "él", "ella"], "ha"],
  [["nosotros", "nosotras"], "hemos"],
  [["vosotros", "vosotras"], "habéis"],
  [["ustedes", "ellos", "ellas"], "han"],
];

const haberIn = (answer) => fold(answer).split(" ").find((word) => HABER_PRESENT.includes(word));

test("present perfect bank has 150 questions with stable ids 8001 to 8150", () => {
  assert.equal(PRESENT_PERFECT_QUESTIONS.length, 150);
  assert.deepEqual(PRESENT_PERFECT_QUESTIONS.map((question) => question.id), Array.from({ length: 150 }, (_, index) => 8001 + index));
  assert.deepEqual(Object.keys(PRESENT_PERFECT_EXPLANATIONS).map(Number), PRESENT_PERFECT_QUESTIONS.map((question) => question.id));
});

test("every question has its answer in the sentence, a translation, an explanation and a different distractor", () => {
  for (const question of PRESENT_PERFECT_QUESTIONS) {
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

test("every answer is a present form of haber followed directly by the right participle", () => {
  for (const question of PRESENT_PERFECT_QUESTIONS) {
    const tokens = fold(question.answer).split(" ");
    const index = tokens.findIndex((word) => HABER_PRESENT.includes(word));
    assert.ok(index >= 0, `#${question.id}: ${question.answer} has no haber form`);
    assert.equal(index, tokens.length - 2, `#${question.id}: haber must be followed directly by the participle, with nothing after it`);
    assert.equal(tokens[index + 1], participleFor(question.blankHint), `#${question.id}: wrong participle for ${question.blankHint}`);
  }
});

test("tener is never the auxiliary in an answer, and the haber not tener group offers it as the wrong option", () => {
  for (const question of PRESENT_PERFECT_QUESTIONS) {
    assert.ok(!words(question.answer).some((word) => TENER.includes(word)), `#${question.id}: tener in the answer`);
  }
  const contrast = PRESENT_PERFECT_QUESTIONS.filter((question) => question.infinitive === "haber not tener");
  for (const question of contrast) {
    const [tener, participle] = fold(question.objectPronoun).split(" ");
    assert.ok(TENER.includes(tener), `#${question.id}: distractor should use tener`);
    assert.equal(participle, participleFor(question.blankHint), `#${question.id}: tener distractor should keep the right participle`);
    assert.equal(TENER.indexOf(tener), HABER_PRESENT.indexOf(haberIn(question.answer)), `#${question.id}: tener distractor should be the same person`);
  }
});

test("the haber form matches an explicit subject pronoun", () => {
  for (const question of PRESENT_PERFECT_QUESTIONS) {
    const context = words(`${question.before} ${question.after}`);
    const matches = SUBJECT_HABER.filter(([subjects]) => subjects.some((subject) => context.includes(subject)));
    if (matches.length !== 1) continue;
    assert.equal(haberIn(question.answer), matches[0][1], `#${question.id}: ${matches[0][0].join("/")} needs ${matches[0][1]}`);
  }
});

test("coverage: every person of haber, singular and plural subjects, every group and level", () => {
  for (const form of HABER_PRESENT) {
    const count = PRESENT_PERFECT_QUESTIONS.filter((question) => haberIn(question.answer) === form).length;
    assert.ok(count >= 12, `only ${count} answers use ${form}`);
  }
  for (const number of ["singular", "plural"]) {
    assert.ok(PRESENT_PERFECT_QUESTIONS.filter((question) => question.subjectNumber === number).length >= 50, `too few ${number} subjects`);
  }
  for (const question of PRESENT_PERFECT_QUESTIONS) {
    const plural = ["hemos", "habéis", "han"].includes(haberIn(question.answer));
    assert.equal(question.subjectNumber, plural ? "plural" : "singular", `#${question.id}: subjectNumber does not match ${haberIn(question.answer)}`);
  }
  assert.deepEqual(Object.keys(PRESENT_PERFECT_FORMS), [...PRESENT_PERFECT_GROUPS]);
  for (const group of PRESENT_PERFECT_GROUPS) {
    const count = PRESENT_PERFECT_QUESTIONS.filter((question) => question.infinitive === group).length;
    assert.ok(count >= 20, `${group} has only ${count} questions`);
  }
  for (const level of ["basic", "intermediate", "advanced"]) {
    assert.ok(PRESENT_PERFECT_QUESTIONS.filter((question) => question.level === level).length >= 20, `too few ${level} questions`);
  }
});

test("regular participles in -ado and -ido are balanced with common irregular participles", () => {
  const participles = PRESENT_PERFECT_QUESTIONS.map((question) => participleFor(question.blankHint));
  const irregular = PRESENT_PERFECT_QUESTIONS.filter((question) => IRREGULAR[question.blankHint.replace(/se$/u, "")]);
  assert.ok(participles.filter((participle) => participle.endsWith("ado")).length >= 40, "too few -ado participles");
  assert.ok(participles.filter((participle) => /[ií]do$/u.test(participle)).length >= 40, "too few -ido participles");
  assert.ok(irregular.length >= 40, `only ${irregular.length} irregular participles`);
  for (const common of ["abierto", "dicho", "escrito", "hecho", "muerto", "puesto", "roto", "visto", "vuelto"]) {
    assert.ok(participles.includes(common), `irregular participle ${common} is missing`);
  }
  for (const question of PRESENT_PERFECT_QUESTIONS.filter((item) => item.infinitive === "irregular participle")) {
    assert.ok(IRREGULAR[question.blankHint], `#${question.id}: ${question.blankHint} is not irregular`);
  }
});

test("negatives and questions keep pronouns, no and adverbs before haber, and the distractor splits the verb", () => {
  const items = PRESENT_PERFECT_QUESTIONS.filter((question) => question.infinitive === "negatives and questions");
  for (const question of items) {
    const tokens = fold(question.answer).split(" ");
    assert.ok(tokens.length >= 3, `#${question.id}: something should come before haber`);
    const distractor = fold(question.objectPronoun).split(" ");
    const haber = distractor.findIndex((word) => HABER_PRESENT.includes(word));
    assert.ok(haber >= 0 && haber < distractor.length - 2, `#${question.id}: distractor should put a word between haber and the participle`);
  }
});

test("present perfect chart lists all six haber forms and the common irregular participles", () => {
  const [haber, , irregular] = PRESENT_PERFECT_CHART;
  assert.deepEqual(haber.rows.map((row) => row.form.split(" ")[0]), [...HABER_PRESENT]);
  assert.ok(haber.rows.some((row) => row.label.includes("ustedes")));
  for (const row of irregular.rows) assert.equal(IRREGULAR[row.label], row.form, `chart: ${row.label}`);
});
