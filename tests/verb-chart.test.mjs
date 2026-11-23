import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { PRETERITE_IMPERFECT_CONJUGATIONS, PRETERITE_IMPERFECT_REGULARITY } from "../app/preterite-imperfect-data.ts";
import { SABER_CONOCER_CONJUGATIONS } from "../app/saber-conocer-data.ts";
import { POR_PARA_CHART } from "../app/por-para-data.ts";
import { REFLEXIVE_CHART } from "../app/reflexive-verbs-data.ts";
import { PRESENT_PERFECT_CHART } from "../app/present-perfect-data.ts";
import { PRESENT_CONTINUOUS_CHART } from "../app/present-continuous-data.ts";
import { QUIZ_CONFIG } from "../app/quiz-config.ts";

test("verb chart never fabricates a six-pronoun paradigm where the data doesn't have one", () => {
  // Preterite/imperfect verbs get the real paradigm from PRETERITE_IMPERFECT_CONJUGATIONS.
  const verb = Object.keys(PRETERITE_IMPERFECT_CONJUGATIONS)[0];
  const pi = QUIZ_CONFIG["preterite-imperfect"];
  const [preterite, imperfect] = pi.chart.blocks(verb, pi.forms);
  assert.deepEqual(preterite.rows.map((row) => row.form), PRETERITE_IMPERFECT_CONJUGATIONS[verb].map((c) => c.preterite));
  assert.deepEqual(imperfect.rows.map((row) => row.form), PRETERITE_IMPERFECT_CONJUGATIONS[verb].map((c) => c.imperfect));
  // Gustar-pattern verbs are impersonal: a simple singular/plural block, not a fake "yo, tú..." table.
  const gustar = QUIZ_CONFIG.gustar;
  const [gustarBlock] = gustar.chart.blocks(Object.keys(gustar.forms)[0], gustar.forms);
  assert.deepEqual(gustarBlock.rows.map((row) => row.pronoun), ["one thing / to do something", "several things"]);
  // Ser/estar compares two different verbs, not one conjugated across pronouns.
  const serEstar = QUIZ_CONFIG["ser-estar"];
  const [serEstarBlock] = serEstar.chart.blocks(Object.keys(serEstar.forms)[0], serEstar.forms);
  assert.deepEqual(serEstarBlock.rows.map((row) => row.pronoun), ["ser", "estar"]);
});

test("verb chart highlights only the row currently speaking and clears it on end", async () => {
  const source = await readFile(new URL("../app/verb-chart.tsx", import.meta.url), "utf8");
  assert.match(source, /const \[speakingKey, setSpeakingKey\] = useState<string \| null>\(null\);/);
  assert.match(source, /setSpeakingKey\(key\);/);
  assert.match(source, /onEnd: \(\) => setSpeakingKey\(\(current\) => \(current === key \? null : current\)\)/);
  // Play all queues the whole paradigm in order via speakQueue, not one-off calls.
  assert.match(source, /speakQueue\(/);
  assert.match(source, /onDone: \(\) => setSpeakingKey\(null\),/);
});

test("every preterite/imperfect verb has a regularity classification, and vice versa", () => {
  const conjugatedVerbs = Object.keys(PRETERITE_IMPERFECT_CONJUGATIONS).sort();
  const classifiedVerbs = Object.keys(PRETERITE_IMPERFECT_REGULARITY).sort();
  assert.deepEqual(classifiedVerbs, conjugatedVerbs);
  const allowed = new Set(["regular", "irregular", "spelling change"]);
  for (const value of Object.values(PRETERITE_IMPERFECT_REGULARITY)) assert.ok(allowed.has(value), `unexpected classification: ${value}`);
});

test("the regularity badge only renders for preterite/imperfect, never guessed for gustar or ser/estar", async () => {
  for (const [id, quiz] of Object.entries(QUIZ_CONFIG)) {
    if (id === "preterite-imperfect") assert.equal(quiz.chart.regularity, PRETERITE_IMPERFECT_REGULARITY);
    else assert.equal(quiz.chart.regularity, undefined, id);
  }
  const source = await readFile(new URL("../app/verb-chart.tsx", import.meta.url), "utf8");
  assert.match(source, /const regularityFor = \(group: string\) => quiz\.chart\.regularity\?\.\[group\];/);
});

test("saber/conocer chart has a full six-pronoun paradigm for both verbs in every tense it shows", () => {
  assert.deepEqual(SABER_CONOCER_CONJUGATIONS.map((row) => row.subject), ["yo", "tú", "él / ella / usted", "nosotros", "vosotros", "ellos / ellas / ustedes"]);
  for (const row of SABER_CONOCER_CONJUGATIONS) {
    for (const verb of ["saber", "conocer"]) {
      for (const tense of ["present", "preterite", "imperfect"]) assert.ok(row[verb][tense], `${verb} ${tense} ${row.subject}`);
    }
  }
});

test("saber/conocer chart scopes to the question's tense: past-meaning gets preterite/imperfect, other usages present", () => {
  const quiz = QUIZ_CONFIG["saber-conocer"];
  const tenses = (group) => [...new Set(quiz.chart.blocks(group, quiz.forms).map((block) => block.tenseLabel.split(" · ")[1]))];
  assert.deepEqual(tenses("past meaning"), ["preterite", "imperfect"]);
  assert.deepEqual(tenses("facts"), ["present"]);
  assert.deepEqual(tenses(""), ["present", "preterite", "imperfect"]);
  assert.equal(quiz.chart.sections, "group-or-shared");
});

test("reflexive verbs chart is one shared section with the pronouns, a full paradigm and placement", () => {
  const quiz = QUIZ_CONFIG["reflexive-verbs"];
  assert.equal(quiz.chart.sections, "shared");
  assert.deepEqual(quiz.chart.blocks("", quiz.forms).map((block) => block.tenseLabel), REFLEXIVE_CHART.map((table) => table.title));
});

test("present perfect chart is one shared section with haber, regular and irregular participles and word order", () => {
  const quiz = QUIZ_CONFIG["present-perfect"];
  assert.equal(quiz.chart.sections, "shared");
  assert.deepEqual(quiz.chart.blocks("", quiz.forms).map((block) => block.tenseLabel), PRESENT_PERFECT_CHART.map((table) => table.title));
});

test("por vs para shows usage examples, one sentence per usage, instead of a conjugation table", () => {
  const quiz = QUIZ_CONFIG["por-para"];
  assert.equal(quiz.chart.sections, "shared");
  assert.equal(quiz.chart.link, "explainer");
  assert.deepEqual(quiz.chart.blocks("", quiz.forms).map((block) => block.tenseLabel), POR_PARA_CHART.map((table) => table.title));
  assert.equal(QUIZ_CONFIG["por-para"].chartLabel, "Usage examples");
  assert.deepEqual(POR_PARA_CHART.map((table) => table.title), ["Por looks back", "Para looks ahead"]);
  for (const [index, word] of [[0, "por"], [1, "para"]]) {
    for (const row of POR_PARA_CHART[index].rows) {
      assert.match(row.form, new RegExp(`\\b${word}\\b`), `${row.label} example must use ${word}`);
      assert.doesNotMatch(row.form, new RegExp(`\\b${word === "por" ? "para" : "por"}\\b`), `${row.label} example must not use the other word`);
    }
  }
});

test("present continuous chart is one shared section with estar, regular and irregular gerunds and pronouns", () => {
  const quiz = QUIZ_CONFIG["present-continuous"];
  assert.equal(quiz.chart.sections, "shared");
  assert.deepEqual(quiz.chart.blocks("", quiz.forms).map((block) => block.tenseLabel), PRESENT_CONTINUOUS_CHART.map((table) => table.title));
});
