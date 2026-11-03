import assert from "node:assert/strict";
import test from "node:test";
import { TOPICS, lintQuestion } from "../scripts/explanation-lint.mjs";

// Rules: docs/explanation-quality.md.
for (const topic of TOPICS) {
  test(`${topic.key} explanations meet the quality spec`, () => {
    const failures = topic.questions
      .map((question) => [question.id, lintQuestion(question, topic)])
      .filter(([, problems]) => problems.length)
      .map(([id, problems]) => `#${id}: ${problems.join("; ")}`);
    assert.deepEqual(failures, []);
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
