import assert from "node:assert/strict";
import test from "node:test";
import { TOPICS, lintQuestion } from "../scripts/explanation-lint.mjs";
import { explanationFor, subtopicExplanation } from "../app/subtopic-explanations.ts";

test("every item's subtopic fallback meets the explanation quality spec", () => {
  for (const topic of TOPICS) {
    for (const question of topic.questions) {
      const explanation = subtopicExplanation(topic.key, question);
      assert.deepEqual(lintQuestion({ ...question, explanation }, topic), [], `${topic.key} #${question.id}: ${explanation}`);
    }
  }
});

test("explanationFor shows the item's own explanation first, the subtopic rule otherwise", () => {
  for (const topic of TOPICS) {
    for (const question of topic.questions) {
      assert.equal(explanationFor(topic.key, question), question.explanation, `${topic.key} #${question.id}`);
      assert.equal(explanationFor(topic.key, { ...question, explanation: "" }), subtopicExplanation(topic.key, question));
    }
  }
});
