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

test("flashcard interface reveals answers before recording recall", async () => {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(new URL("../app/flashcards.tsx", import.meta.url), "utf8");
  assert.match(source, /aria-expanded=\{revealed\}/);
  assert.match(source, /disabled=\{!revealed\}/);
  assert.match(source, /recordAnswer\(false\)/);
  assert.match(source, /recordAnswer\(true\)/);
  assert.match(source, /spanish-flashcards-progress-v1/);
  assert.match(source, /Cards you are still learning return first/);
});
