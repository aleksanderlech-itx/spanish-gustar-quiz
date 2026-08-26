import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

test("How to Use page covers the core learning workflows", async () => {
  const source = await readFile(new URL("../app/how-to-use/page.tsx", import.meta.url), "utf8");
  assert.match(source, /How to use Spanish Quizzes/);
  assert.match(source, /How to use grammar quizzes/);
  assert.match(source, /How to use Spanish Verb Flashcards/);
  assert.match(source, /Backup and restore/);
  assert.match(source, /Mistake notebook/);
  assert.match(source, /Useful practice tips/);
  assert.match(source, /browser storage/);
});

test("drawer links to How to Use and keeps it keyboard-focusable", async () => {
  const source = await readFile(new URL("../app/drawer.tsx", import.meta.url), "utf8");
  assert.match(source, /href="\/how-to-use"/);
  assert.match(source, />How to use</);
  assert.match(source, /const FOCUSABLE_SELECTOR = 'a\[href\]/);
});

test("home board is scoped to the root path so content routes render on their own", async () => {
  const source = await readFile(new URL("../app/quiz-selector.tsx", import.meta.url), "utf8");
  assert.match(source, /usePathname/);
  assert.match(source, /const open = pathname === "\/"/);
});
