import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { BASELINE_PATH, TOPICS, lintQuestion } from "../scripts/explanation-lint.mjs";

// Rules: docs/explanation-quality.md. Items that still fail are listed in the
// baseline; the list may only shrink, and it must be empty before merge.
const baseline = JSON.parse(readFileSync(BASELINE_PATH, "utf8"));

for (const topic of TOPICS) {
  test(`${topic.key} explanations meet the quality spec`, () => {
    const known = new Set(baseline[topic.key] ?? []);
    const newFailures = [];
    const nowPassing = [];
    for (const question of topic.questions) {
      const problems = lintQuestion(question, topic);
      if (problems.length && !known.has(question.id)) newFailures.push(`#${question.id}: ${problems.join("; ")}`);
      if (!problems.length && known.has(question.id)) nowPassing.push(question.id);
    }
    assert.deepEqual(newFailures, [], "explanations that break the spec");
    assert.deepEqual(nowPassing, [], "fixed items still listed in tests/explanation-quality-baseline.json; rerun scripts/explanation-lint.mjs --write-baseline");
  });
}

test("lintQuestion flags the generic patterns from before the rewrite", () => {
  const base = { answer: "preparaba", before: "Cuando llegaban los clientes, Nuria", after: "café.", cue: "Cuando llegaban" };
  const options = { needsCue: true };
  assert.deepEqual(lintQuestion({ ...base, explanation: "" }, options), ["empty"]);
  assert.ok(lintQuestion({ ...base, explanation: "Use “preparaba”, the imperfect form of “preparar”, in this past-tense context." }, options)
    .includes("opens by restating the answer"));
  assert.ok(lintQuestion({ ...base, cue: undefined, explanation: "Repeated background in the past uses the imperfect." }, options).includes("no cue"));
  assert.ok(lintQuestion({ ...base, explanation: "Repeated background in the past uses the imperfect." }, options)
    .some((problem) => problem.startsWith("explanation does not name the cue")));
  assert.ok(lintQuestion({ ...base, explanation: "Cuando llegaban sets a scene \u2014 so imperfect." }, options).includes("contains an em or en dash"));
  assert.ok(!lintQuestion({ ...base, explanation: "Cuando llegaban answers ¿Qué pasaba? with a repeated scene. So imperfect." }, options)
    .includes("more than 2 sentences"), "a quoted ¿...? question is not a sentence");
  assert.ok(lintQuestion({ ...base, explanation: "Cuando llegaban is the cue. It sets a scene. So imperfect." }, options)
    .includes("more than 2 sentences"));
  assert.deepEqual(lintQuestion({
    ...base,
    explanation: "Cuando llegaban sets a repeated background scene in the past, so imperfect preparaba. The preterite would make it one finished event.",
  }, options), []);
});
