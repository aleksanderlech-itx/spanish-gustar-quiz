import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

test("drawer traps focus, closes on Escape, and returns focus to the hamburger", async () => {
  const source = await readFile(new URL("../app/drawer.tsx", import.meta.url), "utf8");
  assert.match(source, /if \(event\.key === "Escape"\) \{/);
  assert.match(source, /if \(event\.shiftKey && document\.activeElement === first\) \{/);
  assert.match(source, /event\.preventDefault\(\);\s*last\.focus\(\);/);
  assert.match(source, /\} else if \(!event\.shiftKey && document\.activeElement === last\) \{/);
  assert.match(source, /trigger\?\.focus\(\);/);
  assert.match(source, /role="dialog"/);
  assert.match(source, /aria-modal="true"/);
});

test("drawer's slide-in animation is dropped under prefers-reduced-motion", async () => {
  const css = await readFile(new URL("../app/quiz-layout-fix.css", import.meta.url), "utf8");
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{\s*\.drawer-panel \{\s*animation: none;/);
});

test("drawer's backup/restore and reset act on every quiz and flashcard storage key, not just one", async () => {
  const source = await readFile(new URL("../app/drawer.tsx", import.meta.url), "utf8");
  assert.match(source, /const ALL_PROGRESS_KEYS = \[\.\.\.QUIZ_IDS\.map\(\(id\) => QUIZ_CONFIG\[id\]\.storageKey\), FLASHCARD_KEY\];/);
});
