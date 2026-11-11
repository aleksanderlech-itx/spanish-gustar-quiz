#!/usr/bin/env node
// Rewrites tests/question-id-snapshot.json from the current question banks.
//
// The snapshot records which sentence, answer and seed fields each question id belongs to. Stored
// progress, the mistake notebook, explanations and sourced pairs all point at
// question ids, so an id must keep its sentence for good.
// tests/question-ids.test.mjs fails when the banks and the snapshot disagree.
//
// Run this only after a deliberate content change, and read the diff:
// - a corrected sentence keeps its id and shows up as one changed line;
// - a new sentence gets a new id that was never used before;
// - a removed sentence moves its id to "retired", which keeps it from being reused.
//
// Usage: node --experimental-strip-types scripts/update-question-snapshot.mjs

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { QUIZ_CONFIG, QUIZ_IDS } from "../app/quiz-config.ts";

export const SNAPSHOT_URL = new URL("../tests/question-id-snapshot.json", import.meta.url);

/**
 * One line per question: the sentence as the learner sees it with the answer marked, then the
 * fields that come from the seed row (wrong option or pronoun, group, tense, level). The sentence
 * comes from the generated pair and the rest from the seed, and both are joined by id, so the line
 * changes when either side moves to another id.
 */
export const sentenceOf = (question) => [
  `${question.before.trim()} [${question.answer}] ${question.after.trim()}`.trim(),
  question.objectPronoun,
  question.infinitive,
  question.tense,
  question.level,
].join(" | ");

/** Every current question as { id: sentence }, in id order. */
export const currentSentences = () => Object.fromEntries(
  QUIZ_IDS.flatMap((quizId) => QUIZ_CONFIG[quizId].questions.map((question) => [question.id, sentenceOf(question)]))
    .sort((a, b) => a[0] - b[0]),
);

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  let previous = { retired: [], sentences: {} };
  try {
    previous = JSON.parse(await readFile(SNAPSHOT_URL, "utf8"));
  } catch {
    // First run: there is no snapshot yet.
  }
  const sentences = currentSentences();
  const removed = Object.keys(previous.sentences).map(Number).filter((id) => !(id in sentences));
  const retired = [...new Set([...previous.retired, ...removed])].sort((a, b) => a - b);
  const reused = retired.filter((id) => id in sentences);
  if (reused.length) throw new Error(`Retired question ids are in use again: ${reused.join(", ")}. Give the new sentences new ids.`);
  await writeFile(SNAPSHOT_URL, `${JSON.stringify({ retired, sentences }, null, 2)}\n`);
  console.log(`Wrote ${Object.keys(sentences).length} question ids, ${retired.length} retired.`);
}
