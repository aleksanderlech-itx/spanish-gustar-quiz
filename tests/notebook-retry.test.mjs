import assert from "node:assert/strict";
import test from "node:test";
import { QUIZ_CONFIG } from "../app/quiz-config.ts";
import { buildRetrySession, retryExplanation } from "../app/notebook-retry.ts";
import { groupByActivity, ruleLabelFor } from "../app/notebook.ts";

const identity = (items) => [...items];
const gustar = QUIZ_CONFIG.gustar.questions;
const saber = QUIZ_CONFIG["saber-conocer"].questions;

const questionEntry = (quizId, question, extra = {}) => ({
  id: `q:${quizId}:${question.id}`, kind: "question", quizId, rule: ruleLabelFor(question, quizId), questionId: question.id,
  wrongAnswer: "x", missCount: 1, lastMissedAt: "2026-10-16T08:00:00.000Z", retryCount: 0, retryCorrectCount: 0, ...extra,
});
const ruleEntry = (quizId, rule, lastMissedAt = "2026-10-01T08:00:00.000Z") => ({
  id: `rule:${rule}`, kind: "rule", quizId, rule, missCount: 1, lastMissedAt, retryCount: 0, retryCorrectCount: 0,
});

test("groups entries by activity, most recent miss first, each listing its subtopics once", () => {
  const groups = groupByActivity([
    ruleEntry("gustar", "Gustar pattern: doler", "2026-10-01T08:00:00.000Z"),
    questionEntry("saber-conocer", saber[0], { lastMissedAt: "2026-10-10T08:00:00.000Z" }),
    questionEntry("gustar", gustar[0], { lastMissedAt: "2026-10-12T08:00:00.000Z" }),
    questionEntry("gustar", gustar[1], { lastMissedAt: "2026-10-11T08:00:00.000Z" }),
  ]);
  assert.deepEqual(groups.map((group) => group.quizId), ["gustar", "saber-conocer"]);
  assert.equal(groups[0].entries.length, 3);
  assert.deepEqual(groups[0].rules, ["Gustar pattern: gustar", "Gustar pattern: doler"]);
});

test("a session retries the exact missed sentences, capped at the round length", () => {
  const entries = gustar.slice(0, 7).map((question) => questionEntry("gustar", question));
  const session = buildRetrySession("gustar", entries, gustar, 5, null, identity);
  assert.equal(session.length, 5);
  session.forEach((item) => assert.equal(item.entryId, `q:gustar:${item.question.id}`));
});

test("only the chosen activity's entries are used", () => {
  const entries = [questionEntry("gustar", gustar[0]), questionEntry("saber-conocer", saber[0])];
  const session = buildRetrySession("gustar", entries, gustar, 10, null, identity);
  assert.deepEqual(session.map((item) => item.question.id), [gustar[0].id]);
});

test("a subtopic chip narrows the session to that subtopic", () => {
  const doler = gustar.find((question) => question.infinitive === "doler");
  const entries = [questionEntry("gustar", gustar[0]), questionEntry("gustar", doler)];
  const session = buildRetrySession("gustar", entries, gustar, 10, "Gustar pattern: doler", identity);
  assert.deepEqual(session.map((item) => item.question.id), [doler.id]);
});

test("a legacy rule entry fills the session from its subtopic, credited to that entry, without repeats", () => {
  const session = buildRetrySession("gustar", [ruleEntry("gustar", "Gustar pattern: doler")], gustar, 5, null, identity);
  assert.equal(session.length, 5);
  assert.equal(new Set(session.map((item) => item.question.id)).size, 5);
  session.forEach((item) => {
    assert.equal(item.question.infinitive, "doler");
    assert.equal(item.entryId, "rule:Gustar pattern: doler");
  });
});

test("missed sentences come before legacy rule fill, and are never repeated by it", () => {
  const doler = gustar.filter((question) => question.infinitive === "doler");
  const entries = [ruleEntry("gustar", "Gustar pattern: doler"), questionEntry("gustar", doler[0])];
  const session = buildRetrySession("gustar", entries, gustar, 5, null, identity);
  assert.equal(session[0].entryId, `q:gustar:${doler[0].id}`);
  assert.equal(session.filter((item) => item.question.id === doler[0].id).length, 1);
});

test("an entry whose sentence no longer exists is skipped", () => {
  const session = buildRetrySession("gustar", [questionEntry("gustar", { ...gustar[0], id: 999999 })], gustar, 5, null, identity);
  assert.deepEqual(session, []);
});

test("a wrong retry explains with the answer given, the subtopic rule and the sentence's own explanation", () => {
  const question = { ...saber.find((q) => q.infinitive === "places"), cue: "Barcelona", explanation: "Ir a Barcelona once is enough to say conozco." };
  const explanation = retryExplanation("saber-conocer", question, "sé");
  assert.equal(explanation.given, "You answered “sé”.");
  assert.equal(explanation.rule, "Barcelona is a place, and being familiar with a place uses conocer.");
  assert.equal(explanation.sentence, question.explanation);
});

test("when one explanation contains the other, only the longer one is shown", () => {
  const base = gustar[0];
  const rule = retryExplanation("gustar", { ...base, explanation: "" }, "x").rule;
  const longer = retryExplanation("gustar", { ...base, explanation: `${rule} Me is the pronoun for I.` }, "x");
  assert.equal(longer.rule, null);
  assert.equal(longer.sentence, `${rule} Me is the pronoun for I.`);
  const same = retryExplanation("gustar", { ...base, explanation: rule }, "x");
  assert.equal(same.rule, null);
  assert.equal(same.sentence, rule);
});

test("with no sentence explanation and a skipped answer, only the rule is shown", () => {
  const explanation = retryExplanation("gustar", { ...gustar[0], explanation: "" }, "");
  assert.equal(explanation.given, null);
  assert.ok(explanation.rule);
  assert.equal(explanation.sentence, null);
});
