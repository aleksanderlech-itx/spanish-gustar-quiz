#!/usr/bin/env node
// Issue #24, Stage 1: repeatable content export + audit.
//
// Reads the live content modules (not a manual copy-paste) and writes review
// CSVs under exports/, plus prints an audit summary of counts, generic
// flashcard fallbacks, and duplicate/near-duplicate quiz sentences.
//
// Usage: node --experimental-strip-types scripts/export-content.mjs

import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const exportsDir = path.join(rootDir, "exports");

const { ALL_QUESTIONS } = await import("../app/quiz-data.ts");
const { SER_ESTAR_QUESTIONS } = await import("../app/ser-estar-data.ts");
const { PRETERITE_IMPERFECT_QUESTIONS } = await import("../app/preterite-imperfect-data.ts");
const { FLASHCARD_VERBS } = await import("../app/flashcards-data.ts");

const QUIZ_TARGET = 150;

// Matches the old generic buildExample() fallback patterns that used to cover
// flashcards without a hand-written sentence ("Voy a <verb> hoy.", "Voy a
// <verb> eso hoy.", "Voy a <verb> temprano."). buildExample() itself was
// removed in Stage 3 once every verb got a real example, so this pattern is
// now a regression check: it should always match zero rows.
const GENERIC_EXAMPLE_PATTERN = /^Voy a .+ (hoy|eso hoy|temprano)\.$/;

function csvField(value) {
  const s = value === undefined || value === null ? "" : String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv(header, rows) {
  return [header, ...rows].map((row) => row.map(csvField).join(",")).join("\n") + "\n";
}

function normalizeForDuplicateCheck(sentence) {
  return sentence.trim().toLocaleLowerCase("es").replace(/\s+/g, " ").replace(/[¿?¡!.,]/g, "");
}

function flagDuplicates(rows, keyFn) {
  const seen = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    seen.set(key, (seen.get(key) ?? 0) + 1);
  }
  return rows.map((row) => {
    const key = keyFn(row);
    return seen.get(key) > 1 ? "duplicate" : "ok";
  });
}

// ---- Quiz rows -------------------------------------------------------

// example_english is blank for quiz rows: quiz questions only have one
// English translation (translations.en), not a separate example sentence
// and its translation like flashcards do.
const HEADER = ["type", "topic", "spanish", "english", "answer_or_form", "explanation_or_example", "status", "example_english"];

function quizRows(questions, type) {
  const sentences = questions.map((q) => `${q.before} ___ ${q.after}`.trim());
  const dupStatus = flagDuplicates(
    questions.map((q, i) => ({ i, key: normalizeForDuplicateCheck(sentences[i]) })),
    (r) => r.key,
  );
  return questions.map((q, i) => {
    const spanish = sentences[i];
    const missing = !q.answer?.trim() || !q.translations?.en?.trim() || !q.explanation?.trim();
    const status = missing ? "incomplete" : dupStatus[i];
    return [type, q.infinitive, spanish, q.translations.en, q.answer, q.explanation, status, ""];
  });
}

const gustarRows = quizRows(ALL_QUESTIONS, "quiz-gustar");
const serEstarRows = quizRows(SER_ESTAR_QUESTIONS, "quiz-ser-estar");
const preteriteRows = quizRows(PRETERITE_IMPERFECT_QUESTIONS, "quiz-preterite-imperfect");

// ---- Flashcard rows ----------------------------------------------------

const flashcardDupStatus = flagDuplicates(
  FLASHCARD_VERBS.map((c) => ({ key: normalizeForDuplicateCheck(`${c.spanish}|${c.example}`) })),
  (r) => r.key,
);

const flashcardRows = FLASHCARD_VERBS.map((card, i) => {
  const isGeneric = GENERIC_EXAMPLE_PATTERN.test(card.example.trim());
  const missingEnglish = !card.exampleEnglish?.trim();
  const status = isGeneric ? "generic-fallback" : missingEnglish ? "incomplete" : flashcardDupStatus[i];
  return ["flashcard", `rank ${card.rank}`, card.spanish, card.english, "", card.example, status, card.exampleEnglish ?? ""];
});

// ---- Write CSVs ---------------------------------------------------------

await mkdir(exportsDir, { recursive: true });

await writeFile(path.join(exportsDir, "quiz-gustar.csv"), toCsv(HEADER, gustarRows));
await writeFile(path.join(exportsDir, "quiz-ser-estar.csv"), toCsv(HEADER, serEstarRows));
await writeFile(path.join(exportsDir, "quiz-preterite-imperfect.csv"), toCsv(HEADER, preteriteRows));
await writeFile(path.join(exportsDir, "flashcards.csv"), toCsv(HEADER, flashcardRows));
await writeFile(
  path.join(exportsDir, "all-content.csv"),
  toCsv(HEADER, [...gustarRows, ...serEstarRows, ...preteriteRows, ...flashcardRows]),
);

// ---- Audit summary --------------------------------------------------------

function countStatus(rows, status) {
  return rows.filter((row) => row[row.length - 2] === status).length;
}

function report(label, rows, target) {
  const dupes = countStatus(rows, "duplicate");
  const incomplete = countStatus(rows, "incomplete");
  const gap = target !== undefined ? target - rows.length : undefined;
  console.log(
    `${label}: ${rows.length}${target !== undefined ? ` / ${target} target (${gap > 0 ? `${gap} short` : gap < 0 ? `${-gap} over` : "on target"})` : ""}` +
      `${dupes ? `, ${dupes} duplicate` : ""}${incomplete ? `, ${incomplete} incomplete` : ""}`,
  );
}

console.log("Content export written to exports/*.csv\n");
console.log("=== Quiz datasets (target: 150 each, 450 total) ===");
report("quiz-gustar", gustarRows, QUIZ_TARGET);
report("quiz-ser-estar", serEstarRows, QUIZ_TARGET);
report("quiz-preterite-imperfect", preteriteRows, QUIZ_TARGET);

console.log("\n=== Flashcards (target: 500, all with real examples) ===");
const generic = countStatus(flashcardRows, "generic-fallback");
const flashDupes = countStatus(flashcardRows, "duplicate");
const missingEnglish = flashcardRows.filter((row) => !row[7]?.trim()).length;
console.log(`flashcards: ${flashcardRows.length} / 500`);
console.log(`  generic buildExample() fallback ("Voy a ... hoy."): ${generic}`);
console.log(`  manually-authored examples: ${flashcardRows.length - generic}`);
console.log(`  duplicate spanish+example pairs: ${flashDupes}`);
console.log(`  missing English example translation (exampleEnglish): ${missingEnglish}`);
console.log(`  with English example translation: ${flashcardRows.length - missingEnglish}`);
