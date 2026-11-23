import assert from "node:assert/strict";
import test from "node:test";
import { QUIZ_CONFIG, QUIZ_IDS, QUIZ_SLUGS, isQuizId, resolveQuizId } from "../app/quiz-config.ts";
import { ACTIVITY_REGISTRY, findActivity } from "../app/activity-registry.ts";

test("every quiz in QUIZ_CONFIG has a matching activity registry entry", () => {
  QUIZ_IDS.forEach((id) => {
    const entry = findActivity(id);
    assert.ok(entry, `missing registry entry for ${id}`);
    assert.equal(entry.activityType, "fill-in-blank");
    assert.equal(entry.slug, QUIZ_SLUGS[id]);
    assert.equal(entry.storageKey, QUIZ_CONFIG[id].storageKey);
    assert.equal(entry.title, QUIZ_CONFIG[id].title.replace(" Quiz", ""));
  });
});

test("the registry also carries the flashcards activity, which isn't a QUIZ_CONFIG entry", () => {
  const entry = findActivity("flashcards");
  assert.ok(entry);
  assert.equal(entry.activityType, "flashcards");
  assert.equal(entry.path, "/flashcards");
});

test("every registry entry has a unique id, slug and path", () => {
  const ids = ACTIVITY_REGISTRY.map((entry) => entry.id);
  const slugs = ACTIVITY_REGISTRY.map((entry) => entry.slug);
  const paths = ACTIVITY_REGISTRY.map((entry) => entry.path);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(slugs).size, slugs.length);
  assert.equal(new Set(paths).size, paths.length);
});

test("isQuizId accepts every registered quiz id and rejects unknown values", () => {
  QUIZ_IDS.forEach((id) => assert.equal(isQuizId(id), true));
  assert.equal(isQuizId("flashcards"), false);
  assert.equal(isQuizId("not-a-real-quiz"), false);
  assert.equal(isQuizId(null), false);
  assert.equal(isQuizId(undefined), false);
});

test("resolveQuizId drives the ?quiz= route param, falling back to gustar", () => {
  QUIZ_IDS.forEach((id) => assert.equal(resolveQuizId(id), id));
  assert.equal(resolveQuizId(null), "gustar");
  assert.equal(resolveQuizId("bogus"), "gustar");
  assert.equal(resolveQuizId("flashcards"), "gustar");
});

// --- Issue #151: each quiz declares its own behaviour in its config entry ---

const registry = await import("../app/quiz-config.ts");
const notebook = await import("../app/notebook.ts");

test("every quiz declares choices, a rule label it owns, a chart and an icon", () => {
  for (const id of registry.QUIZ_IDS) {
    const quiz = registry.QUIZ_CONFIG[id];
    assert.ok(quiz.choices === "pair" || quiz.choices === "pronoun-verb", `${id}: choices`);
    assert.equal(typeof quiz.ruleLabel, "function", `${id}: ruleLabel`);
    assert.equal(typeof quiz.ownsRule, "function", `${id}: ownsRule`);
    assert.equal(typeof quiz.chart?.blocks, "function", `${id}: chart.blocks`);
    assert.ok(["shared", "group", "group-or-shared"].includes(quiz.chart.sections), `${id}: chart.sections`);
    assert.ok(["chart", "explainer"].includes(quiz.chart.link), `${id}: chart.link`);
    assert.match(quiz.iconPath, /^[Mm]/, `${id}: iconPath`);
  }
});

test("every question's rule label maps back to its own quiz, and no other quiz claims it", () => {
  for (const id of registry.QUIZ_IDS) {
    for (const question of registry.QUIZ_CONFIG[id].questions) {
      const label = notebook.ruleLabelFor(question, id);
      assert.equal(notebook.quizIdForRule(label), id, `${id} #${question.id}: ${label}`);
      const claimants = registry.QUIZ_IDS.filter((other) => registry.QUIZ_CONFIG[other].ownsRule(label));
      assert.deepEqual(claimants, [id], `${label} claimed by ${claimants.join(", ")}`);
    }
  }
});

test("every quiz's chart renders at least one row for the topic and for each group", () => {
  for (const id of registry.QUIZ_IDS) {
    const { chart, forms } = registry.QUIZ_CONFIG[id];
    const groups = chart.sections === "shared" ? [""] : chart.sections === "group-or-shared" ? ["", ...Object.keys(forms)] : Object.keys(forms);
    for (const group of groups) {
      const blocks = chart.blocks(group, forms);
      assert.ok(blocks.length > 0 && blocks.some((block) => block.rows.length > 0), `${id} chart for "${group}"`);
    }
  }
});
