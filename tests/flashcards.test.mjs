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
  assert.match(source, /Back to Box 1/);
});
