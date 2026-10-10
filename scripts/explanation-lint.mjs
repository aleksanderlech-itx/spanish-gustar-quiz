#!/usr/bin/env node
// Checks every quiz explanation against docs/explanation-quality.md.
// Run directly for a per-topic summary, or with --write-baseline to refresh
// tests/explanation-quality-baseline.json after fixing items.

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { ALL_QUESTIONS } from "../app/quiz-data.ts";
import { SER_ESTAR_QUESTIONS } from "../app/ser-estar-data.ts";
import { PRETERITE_IMPERFECT_QUESTIONS } from "../app/preterite-imperfect-data.ts";
import { POR_PARA_QUESTIONS } from "../app/por-para-data.ts";
import { OBJECT_PRONOUN_QUESTIONS } from "../app/object-pronouns-data.ts";
import { SABER_CONOCER_QUESTIONS } from "../app/saber-conocer-data.ts";

export const BASELINE_PATH = fileURLToPath(new URL("../tests/explanation-quality-baseline.json", import.meta.url));

export const TOPICS = [
  { key: "gustar", questions: ALL_QUESTIONS, needsCue: true },
  { key: "ser-estar", questions: SER_ESTAR_QUESTIONS, needsCue: true },
  { key: "preterite-imperfect", questions: PRETERITE_IMPERFECT_QUESTIONS, needsCue: true },
  // Por vs Para keeps its per-sentence explanations from #109.
  { key: "por-para", questions: POR_PARA_QUESTIONS, needsCue: false },
  { key: "object-pronouns", questions: OBJECT_PRONOUN_QUESTIONS, needsCue: true },
  { key: "saber-conocer", questions: SABER_CONOCER_QUESTIONS, needsCue: true },
];

export const MIN_LENGTH = 15;
export const MAX_LENGTH = 200;
export const MAX_SENTENCES = 2;

const fold = (value) => value.normalize("NFC").toLocaleLowerCase("es");
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const sentenceCount = (value) => value.split(/[.!?](?:\s+|$)/).filter((part) => part.trim()).length;

/** Returns the list of rule violations for one question; empty means it passes. */
export function lintQuestion(question, { needsCue }) {
  const explanation = question.explanation?.trim() ?? "";
  if (!explanation) return ["empty"];
  const problems = [];
  if (explanation.length < MIN_LENGTH) problems.push(`shorter than ${MIN_LENGTH} characters`);
  if (explanation.length > MAX_LENGTH) problems.push(`longer than ${MAX_LENGTH} characters (${explanation.length})`);
  if (sentenceCount(explanation) > MAX_SENTENCES) problems.push(`more than ${MAX_SENTENCES} sentences`);
  if (/[\u2013\u2014]/.test(explanation)) problems.push("contains an em or en dash");
  if (new RegExp(`^Use\\s+["“'‘]${escapeRegex(question.answer)}["”'’]`, "iu").test(explanation)) {
    problems.push("opens by restating the answer");
  }
  if (needsCue) {
    const cue = question.cue?.trim();
    if (!cue) {
      problems.push("no cue");
    } else {
      const cueRegex = new RegExp(`(?<!\\p{L})${escapeRegex(fold(cue))}(?!\\p{L})`, "u");
      if (!cueRegex.test(fold(`${question.before} … ${question.after}`))) problems.push(`cue "${cue}" is not in the sentence`);
      if (!cueRegex.test(fold(explanation))) problems.push(`explanation does not name the cue "${cue}"`);
    }
  }
  return problems;
}

/** Failing question ids per topic, sorted. */
export function collectFailures() {
  const failures = {};
  for (const topic of TOPICS) {
    failures[topic.key] = topic.questions
      .filter((question) => lintQuestion(question, topic).length > 0)
      .map((question) => question.id)
      .sort((a, b) => a - b);
  }
  return failures;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const failures = collectFailures();
  let total = 0;
  for (const topic of TOPICS) {
    const count = failures[topic.key].length;
    total += count;
    console.log(`${topic.key.padEnd(20)} ${String(count).padStart(3)} / ${topic.questions.length} failing`);
  }
  console.log(`${"total".padEnd(20)} ${String(total).padStart(3)}`);
  if (process.argv.includes("--write-baseline")) {
    await writeFile(BASELINE_PATH, `${JSON.stringify(failures)}\n`);
    console.log(`Wrote ${BASELINE_PATH}`);
  }
}
