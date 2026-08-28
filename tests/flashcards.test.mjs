import assert from "node:assert/strict";
import test from "node:test";
import { FLASHCARD_VERBS } from "../app/flashcards-data.ts";

test("flashcard corpus contains 500 unique ranked verbs", () => {
  assert.equal(FLASHCARD_VERBS.length, 500);
  assert.equal(new Set(FLASHCARD_VERBS.map((card) => card.spanish)).size, 500);
  FLASHCARD_VERBS.forEach((card, index) => {
    assert.equal(card.rank, index + 1);
    assert.ok(card.spanish.trim());
    assert.ok(card.english.trim());
    assert.ok(card.example.includes(card.spanish.replace(/se$/, "")) || card.example.length > 10);
  });
});

test("every flashcard has a real, project-authored example with an English translation", () => {
  // The old buildExample() fallback produced exactly these three shapes for a verb it
  // didn't have a hand-written sentence for. None should remain now that every verb has
  // a real, authored example (Stage 3 of docs/issue-24-implementation-plan.md).
  const genericShapes = (spanish) => [`Voy a ${spanish} hoy.`, `Voy a ${spanish} eso hoy.`, `Voy a ${spanish} temprano.`];

  const seenExamples = new Map();
  for (const card of FLASHCARD_VERBS) {
    assert.ok(card.example.trim(), `${card.spanish} is missing a Spanish example`);
    assert.ok(card.exampleEnglish.trim(), `${card.spanish} is missing an English example translation`);
    assert.notEqual(card.example, card.exampleEnglish);
    assert.ok(!genericShapes(card.spanish).includes(card.example), `${card.spanish} still uses a generic placeholder example`);

    const key = card.example.trim().toLocaleLowerCase("es");
    const prior = seenExamples.get(key);
    assert.ok(!prior, prior && `${card.spanish} and ${prior} share the identical example sentence`);
    seenExamples.set(key, card.spanish);
  }
});

test("flashcard interface reveals answers before recording Leitner progress", async () => {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(new URL("../app/flashcards.tsx", import.meta.url), "utf8");
  assert.match(source, /aria-expanded=\{revealed\}/);
  assert.match(source, /disabled=\{!revealed\}/);
  assert.match(source, /recordAnswer\(false\)/);
  assert.match(source, /recordAnswer\(true\)/);
  assert.match(source, /spanish-flashcards-leitner-v2/);
  assert.match(source, /REVIEW_INTERVAL_DAYS.*1: 0.*2: 1.*3: 3.*4: 7.*5: 14/s);
  assert.match(source, /Math\.min\(5, \(previous\?\.box \?\? 1\) \+ 1\)/);
  // Both a symbol and a visible text label, per UX-CONTRACT.md.
  assert.match(source, /<span aria-hidden="true">↺<\/span> Again/);
  assert.match(source, /<span aria-hidden="true">✓<\/span> Knew it/);
});

test("flashcard reveal button and box dots stay accurate before assessment", async () => {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(new URL("../app/flashcards.tsx", import.meta.url), "utf8");
  // The speak button stops propagation so it doesn't flip the card.
  assert.match(source, /event\.stopPropagation\(\);/);
  // 5 Leitner box indicators, keyed off the box the card on screen currently sits in.
  assert.match(source, /const boxState = \(box: LeitnerBox, currentBox: LeitnerBox\)/);
  assert.match(source, /if \(box === currentBox\) return "current";/);
});
