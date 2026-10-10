#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve } from "node:path";

import { ALL_QUESTIONS } from "../app/quiz-data.ts";
import { SER_ESTAR_QUESTIONS } from "../app/ser-estar-data.ts";
import { PRETERITE_IMPERFECT_QUESTIONS } from "../app/preterite-imperfect-data.ts";
import { POR_PARA_QUESTIONS } from "../app/por-para-data.ts";
import { OBJECT_PRONOUN_QUESTIONS } from "../app/object-pronouns-data.ts";
import { SABER_CONOCER_QUESTIONS } from "../app/saber-conocer-data.ts";
import { FLASHCARD_VERBS } from "../app/flashcards-data.ts";
import { CURATED_FLASHCARD_OVERRIDES } from "./curated-flashcard-overrides.mjs";
import { CURATED_FLAGGED_QUIZ_OVERRIDES } from "./curated-flagged-quiz-overrides.mjs";
import { CURATED_OBJECT_PRONOUN_PAIRS } from "./curated-object-pronoun-all.mjs";
import { CURATED_QUIZ_OVERRIDES } from "./curated-quiz-overrides.mjs";
import { CURATED_POR_PARA_PAIRS } from "./curated-por-para-all.mjs";
import { CURATED_SABER_CONOCER_PAIRS } from "./curated-saber-conocer-all.mjs";
import { PINNED_CORPUS_PAIRS } from "./pinned-corpus-pairs.mjs";
import { RESTORED_GUSTAR_PAIRS } from "./restored-gustar-pairs.mjs";
import { RESTORED_SER_ESTAR_PAIRS } from "./restored-ser-estar-pairs.mjs";
import { RESTORED_PRETERITE_IMPERFECT_PAIRS } from "./restored-preterite-imperfect-pairs.mjs";
import { RESTORED_OBJECT_PRONOUN_PAIRS } from "./restored-object-pronouns-pairs.mjs";
import { RESTORED_SABER_CONOCER_PAIRS } from "./restored-saber-conocer-pairs.mjs";

const corpusPath = process.argv[2];
if (!corpusPath) {
  throw new Error("Usage: node --experimental-strip-types scripts/build-sourced-content.mjs <spa.txt>");
}

const corpusText = await readFile(resolve(corpusPath), "utf8");
const corpusHash = createHash("sha256").update(corpusText).digest("hex");
const expectedCorpusHash = "eb9502b1ce4c6f2342795343c1f119f167f48c58af3e45d98a6ae0f16f0984f1";
if (corpusHash !== expectedCorpusHash) {
  throw new Error(`Unexpected corpus SHA-256: ${corpusHash}`);
}

const corpusRows = corpusText
  .split("\n")
  .filter(Boolean)
  .map((line, index) => {
    const [english, spanish, attribution] = line.split("\t");
    if (!english || !spanish || !attribution) throw new Error(`Malformed corpus row ${index + 1}`);
    return { english, spanish, attribution };
  })
  .filter((row) => ![
    "#26047",
    "#56790",
    "#267218",
    "#407685",
    "#727306",
    "#953469",
    "#1094391",
    "#1109922",
    "#1334559",
    "#1712909",
    "#2852719",
    "#4487200",
    "#12291569",
  ].some((id) => row.attribution.includes(id)));

const groups = [
  ["gustar", ALL_QUESTIONS],
  ["ser-estar", SER_ESTAR_QUESTIONS],
  ["preterite-imperfect", PRETERITE_IMPERFECT_QUESTIONS],
  ["por-para", POR_PARA_QUESTIONS],
  ["object-pronouns", OBJECT_PRONOUN_QUESTIONS],
  ["saber-conocer", SABER_CONOCER_QUESTIONS],
];

const fold = (value) => value.normalize("NFC").toLocaleLowerCase("es");
const tokens = (value) => fold(value).match(/\p{L}+/gu) ?? [];
const phraseKey = (value) => tokens(value).join(" ");
const requiredPhrases = new Set([
  ...groups.flatMap(([, questions]) => questions.map((question) => phraseKey(question.answer))),
  ...FLASHCARD_VERBS.map((card) => phraseKey(card.spanish)),
]);
const phraseLengths = [...new Set([...requiredPhrases].map((phrase) => phrase.split(" ").length))];
const candidatesByPhrase = new Map([...requiredPhrases].map((phrase) => [phrase, []]));

for (const row of corpusRows) {
  const rowTokens = tokens(row.spanish);
  const found = new Set();
  for (const length of phraseLengths) {
    for (let index = 0; index <= rowTokens.length - length; index += 1) {
      const phrase = rowTokens.slice(index, index + length).join(" ");
      if (requiredPhrases.has(phrase)) found.add(phrase);
    }
  }
  for (const phrase of found) candidatesByPhrase.get(phrase).push(row);
}

const wordCount = (value) => tokens(value).length;
const qualityScore = (row) => {
  const spanishWords = wordCount(row.spanish);
  const englishWords = wordCount(row.english);
  let score = Math.abs(spanishWords - 9) + Math.abs(englishWords - 9) * 0.5;
  if (spanishWords < 4 || spanishWords > 18) score += 100;
  if (englishWords < 4 || englishWords > 22) score += 100;
  if (row.spanish.length > 140 || row.english.length > 160) score += 100;
  if (!/[.!?]$/.test(row.spanish) || !/[.!?]$/.test(row.english)) score += 5;
  if (/\.\.\.|[_<>]/.test(row.spanish) || /\.\.\.|[_<>]/.test(row.english)) score += 50;
  return score;
};

for (const candidates of candidatesByPhrase.values()) {
  candidates.sort((a, b) => qualityScore(a) - qualityScore(b) || a.spanish.localeCompare(b.spanish, "es"));
}

const exactPhraseRegex = (phrase) => {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<!\\p{L})${escaped}(?!\\p{L})`, "iu");
};

const usedSpanish = new Set();
// Reserve every pinned row up front so no unpinned item can take it first.
const pinnedRows = new Map();
for (const [pinKey, attribution] of Object.entries(PINNED_CORPUS_PAIRS)) {
  const row = corpusRows.find((candidate) => candidate.attribution === attribution);
  if (!row) throw new Error(`Pinned corpus pair for ${pinKey} is not in the corpus: ${attribution}`);
  pinnedRows.set(pinKey, row);
  usedSpanish.add(fold(row.spanish));
}
const usedExercisePrompts = new Set();
const exercisePromptKey = (sentence, phrase) => {
  const match = exactPhraseRegex(phrase).exec(sentence);
  if (!match) return "";
  return fold(`${sentence.slice(0, match.index)} ___ ${sentence.slice(match.index + match[0].length)}`)
    .replace(/[¿?¡!.,]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};
const selectCorpusPair = (key, pinKey, phrase, alternate = "", requireLeadingText = false) => {
  const regex = exactPhraseRegex(phrase);
  const pinned = pinnedRows.get(pinKey);
  if (pinned) {
    if (!regex.test(pinned.spanish)) throw new Error(`Pinned corpus pair for ${key} does not contain ${phrase}`);
    return { ...pinned, license: "CC BY 2.0 France", modified: false };
  }
  const answerTokens = tokens(phrase);
  const alternateTokens = tokens(alternate);
  const alternateIsPartOfAnswer = alternateTokens.length > 0 && answerTokens.join(" ").includes(alternateTokens.join(" "));
  const alternateRegex = alternate && !alternateIsPartOfAnswer ? exactPhraseRegex(alternate) : null;
  const selected = (candidatesByPhrase.get(phraseKey(phrase)) ?? []).find((row) => {
    const match = regex.exec(row.spanish);
    if (!match || alternateRegex?.test(row.spanish) || usedSpanish.has(fold(row.spanish))) return false;
    if (usedExercisePrompts.has(exercisePromptKey(row.spanish, phrase))) return false;
    if (!requireLeadingText) return true;
    const before = row.spanish.slice(0, match.index).trim();
    return Boolean(before) && !/[.?!¿¡]$/.test(before);
  });
  if (!selected) throw new Error(`No corpus pair for ${key}: ${phrase}`);
  usedSpanish.add(fold(selected.spanish));
  return { ...selected, license: "CC BY 2.0 France", modified: false };
};

const curatedPair = (pair) => ({
  attribution: "Spanish Editorial Learning; original project content; https://creativecommons.org/licenses/by/4.0/",
  license: "CC BY 4.0",
  modified: true,
  ...pair,
});

// Pre-#108 originals take precedence over every other source.
const RESTORED_PAIRS = {
  gustar: RESTORED_GUSTAR_PAIRS,
  "ser-estar": RESTORED_SER_ESTAR_PAIRS,
  "preterite-imperfect": RESTORED_PRETERITE_IMPERFECT_PAIRS,
  "object-pronouns": RESTORED_OBJECT_PRONOUN_PAIRS,
  "saber-conocer": RESTORED_SABER_CONOCER_PAIRS,
};

const quizPairs = {};
const provenance = [];
for (const [group, questions] of groups) {
  for (const question of questions) {
    const override = RESTORED_PAIRS[group]?.[question.id]
      ?? CURATED_FLAGGED_QUIZ_OVERRIDES[question.id]
      ?? (group === "gustar"
        ? CURATED_QUIZ_OVERRIDES.gustar[question.id]
        : group === "preterite-imperfect"
          ? CURATED_QUIZ_OVERRIDES.preteriteImperfect[question.id]
          : group === "por-para"
            ? CURATED_POR_PARA_PAIRS[question.id]
            : group === "object-pronouns"
              ? CURATED_OBJECT_PRONOUN_PAIRS[question.id]
              : group === "saber-conocer"
                ? CURATED_SABER_CONOCER_PAIRS[question.id]
                : undefined);
    if (RESTORED_PAIRS[group]?.[question.id] && (
      CURATED_FLAGGED_QUIZ_OVERRIDES[question.id]
      ?? CURATED_QUIZ_OVERRIDES[group === "gustar" ? "gustar" : group === "preterite-imperfect" ? "preteriteImperfect" : ""]?.[question.id]
      ?? (group === "object-pronouns" ? CURATED_OBJECT_PRONOUN_PAIRS : group === "saber-conocer" ? CURATED_SABER_CONOCER_PAIRS : {})[question.id]
    )) {
      throw new Error(`${group} #${question.id} is restored but still has a superseded override; remove it`);
    }
    if (override && PINNED_CORPUS_PAIRS[`quiz-${group}:${question.id}`]) {
      throw new Error(`${group} #${question.id} uses a curated pair but is still pinned; remove its pin`);
    }
    const pair = override
      ? curatedPair(override)
      : selectCorpusPair(`${group} #${question.id}`, `quiz-${group}:${question.id}`, question.answer, question.objectPronoun, group === "object-pronouns");
    if (!exactPhraseRegex(question.answer).test(pair.spanish)) {
      throw new Error(`${group} #${question.id} does not contain answer ${question.answer}`);
    }
    const promptKey = exercisePromptKey(pair.spanish, question.answer);
    if (usedExercisePrompts.has(promptKey)) throw new Error(`Duplicate exercise prompt for ${group} #${question.id}`);
    usedExercisePrompts.add(promptKey);
    quizPairs[question.id] = { spanish: pair.spanish, english: pair.english };
    provenance.push({ type: `quiz-${group}`, key: question.id, ...pair });
  }
}

const flashcardPairs = {};
for (const card of FLASHCARD_VERBS) {
  const override = CURATED_FLASHCARD_OVERRIDES[card.spanish];
  const pair = override
    ? curatedPair(override)
    : selectCorpusPair(`flashcard ${card.spanish}`, `flashcard:${card.spanish}`, card.spanish);
  flashcardPairs[card.spanish] = { example: pair.spanish, exampleEnglish: pair.english };
  provenance.push({ type: "flashcard", key: card.spanish, ...pair });
}

const quizTs = `// Generated by scripts/build-sourced-content.mjs. Do not edit by hand.\n` +
`// Source and licensing details: docs/content-sources.md and docs/content-attribution.csv.\n\n` +
`type SourcedPair = { spanish: string; english: string };\n` +
`type SourceableQuestion = { id: number; answer: string; before: string; after: string; infinitive: string; objectPronoun: string; explanation: string; tense: string; translations: { en: string; pl: string } };\n\n` +
`export const SOURCED_QUIZ_PAIRS: Record<number, SourcedPair> = ${JSON.stringify(quizPairs, null, 2)};\n\n` +
`function sourcedExplanation(question: SourceableQuestion): string {\n` +
`  if (question.id < 2000) {\n` +
`    const [pronoun, verb] = question.answer.split(" ");\n` +
`    return \`Use “\${question.answer}”. “\${pronoun}” marks who is affected, and “\${verb}” agrees with the grammatical subject.\`;\n` +
`  }\n` +
`  if (question.id < 3000) return \`Use “\${question.answer}” here; “\${question.objectPronoun}” would change the meaning or be ungrammatical.\`;\n` +
`  if (question.id < 4000) return \`Use “\${question.answer}”, the \${question.tense} form of “\${question.infinitive}”, in this past-tense context.\`;\n` +
`  if (question.id < 6000) {\n` +
`    if (question.infinitive === "direct object") return \`Use “\${question.answer}” as the direct-object pronoun replacing the person or thing acted upon.\`;\n` +
`    if (question.infinitive === "indirect object") return \`Use “\${question.answer}” as the indirect-object pronoun marking the recipient or affected person.\`;\n` +
`    return \`Use “\${question.answer}” in this indirect-plus-direct object-pronoun combination.\`;\n` +
`  }\n` +
`  const guidance: Record<string, string> = {\n` +
`    facts: "Use saber for facts and information.",\n` +
`    skills: "Use saber followed by an infinitive for a learned ability.",\n` +
`    people: "Use conocer with the personal a for being acquainted with a person.",\n` +
`    places: "Use conocer for firsthand familiarity with a place.",\n` +
`    familiarity: "Use conocer for familiarity with a work, subject, or thing.",\n` +
`    "past meaning": "In the past, saber can mark finding something out and conocer can mark meeting or first encountering someone or somewhere.",\n` +
`  };\n` +
`  return \`Use “\${question.answer}”. \${guidance[question.infinitive]}\`;\n` +
`}\n\n` +
`// An item's own explanation describes its own sentence, so it is kept only when\n` +
`// that sentence is the one shown; otherwise the generic fallback is used.\n` +
`function sentenceKey(sentence: string): string {\n` +
`  return sentence.normalize("NFC").toLocaleLowerCase("es").replace(/[^\\p{L}\\p{N}]+/gu, " ").trim();\n` +
`}\n\n` +
`export function applySourcedQuestionPair<T extends SourceableQuestion>(question: T): T {\n` +
`  const pair = SOURCED_QUIZ_PAIRS[question.id];\n` +
`  if (!pair) throw new Error(\`Missing sourced sentence pair for question \${question.id}\`);\n` +
`  // The item's own sentence: keep its blank position and explanation. Searching\n` +
`  // for the answer would match an earlier, unrelated "La" in "¿La sopa? ... la come".\n` +
`  if (sentenceKey(\`\${question.before} \${question.answer} \${question.after}\`) === sentenceKey(pair.spanish)) {\n` +
`    return { ...question, before: question.before.trimEnd(), after: question.after.trimStart(), translations: { ...question.translations, en: pair.english } };\n` +
`  }\n` +
`  const escaped = question.answer.replace(/[.*+?^\${}()|[\\]\\\\]/g, "\\\\$&");\n` +
`  const match = new RegExp(\`(?<!\\\\p{L})\${escaped}(?!\\\\p{L})\`, "iu").exec(pair.spanish);\n` +
`  if (!match) throw new Error(\`Sourced sentence for question \${question.id} lacks answer \${question.answer}\`);\n` +
`  return {\n` +
`    ...question,\n` +
`    before: pair.spanish.slice(0, match.index).trimEnd(),\n` +
`    after: pair.spanish.slice(match.index + match[0].length).trimStart(),\n` +
`    explanation: sourcedExplanation(question),\n` +
`    translations: { ...question.translations, en: pair.english },\n` +
`  };\n` +
`}\n`;

const flashcardTs = `// Generated by scripts/build-sourced-content.mjs. Do not edit by hand.\n` +
`// Source and licensing details: docs/content-sources.md and docs/content-attribution.csv.\n\n` +
`export const SOURCED_FLASHCARD_PAIRS: Record<string, { example: string; exampleEnglish: string }> = ${JSON.stringify(flashcardPairs, null, 2)};\n`;

const csvField = (value) => {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};
const csv = [
  ["type", "key", "spanish", "english", "license", "attribution", "modified"],
  ...provenance.map((item) => [item.type, item.key, item.spanish, item.english, item.license, item.attribution, item.modified]),
].map((row) => row.map(csvField).join(",")).join("\n") + "\n";

await writeFile(resolve("app/sourced-quiz-content.ts"), quizTs);
await writeFile(resolve("app/sourced-flashcard-content.ts"), flashcardTs);
await writeFile(resolve("docs/content-attribution.csv"), csv);
await writeFile(resolve("public/content-attribution.csv"), csv);
console.log(`Wrote ${Object.keys(quizPairs).length} quiz pairs and ${Object.keys(flashcardPairs).length} flashcard pairs.`);
