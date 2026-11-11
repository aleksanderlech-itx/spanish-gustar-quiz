import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { QUIZ_CONFIG, QUIZ_IDS } from "../app/quiz-config.ts";
import { SNAPSHOT_URL, currentSentences } from "../scripts/update-question-snapshot.mjs";

// Stored progress, the mistake notebook, explanations and sourced pairs all point
// at question ids. These tests keep an id attached to its sentence for good.
const UPDATE = "If the change is deliberate, run: node --experimental-strip-types scripts/update-question-snapshot.mjs";

const snapshot = JSON.parse(await readFile(SNAPSHOT_URL, "utf8"));

test("every question id is unique across all activities", () => {
  const seen = new Map();
  for (const quizId of QUIZ_IDS) {
    for (const question of QUIZ_CONFIG[quizId].questions) {
      assert.ok(Number.isInteger(question.id) && question.id > 0, `${quizId} has an invalid id: ${question.id}`);
      assert.equal(seen.has(question.id), false, `id ${question.id} is used by ${seen.get(question.id)} and ${quizId}`);
      seen.set(question.id, quizId);
    }
  }
});

test("every question id still has the sentence, answer and seed fields in the snapshot", () => {
  const sentences = currentSentences();
  for (const [id, sentence] of Object.entries(sentences)) {
    assert.ok(id in snapshot.sentences, `id ${id} is not in the snapshot. A new sentence needs a new id. ${UPDATE}`);
    assert.equal(
      sentence,
      snapshot.sentences[id],
      `id ${id} no longer matches its sentence, answer or seed fields. An existing id must never move to another sentence. ${UPDATE}`,
    );
  }
});

test("no question id disappears without being retired, and no retired id is reused", () => {
  const sentences = currentSentences();
  for (const id of Object.keys(snapshot.sentences)) {
    assert.ok(id in sentences, `id ${id} is in the snapshot but no longer in a bank. ${UPDATE}`);
  }
  for (const id of snapshot.retired) {
    assert.equal(id in sentences, false, `retired id ${id} is in use again. Give the new sentence a new id.`);
  }
});
