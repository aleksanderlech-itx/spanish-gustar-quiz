import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("each activity screen renders a help button for its own topic", async () => {
  assert.match(await read("app/topic-detail.tsx"), /<HelpButton topic="topic-detail" \/>/);
  assert.match(await read("app/round.tsx"), /<HelpButton topic="round" \/>/);
  assert.match(await read("app/flashcards.tsx"), /<HelpButton topic="flashcards" \/>/);
});

test("help modal is a native modal dialog that ends with a GitHub issues support link", async () => {
  const source = await read("app/help-modal.tsx");
  assert.match(source, /<dialog/);
  assert.match(source, /\.showModal\(\)/);
  assert.match(source, /aria-labelledby=\{titleId\}/);
  assert.match(source, /href=\{SITE_CONFIG\.supportUrl\}/);
  // The guide opens in a new tab so an in-progress round (kept only in memory) survives.
  assert.match(source, /href=\{content\.guideHref\} target="_blank"/);
  const config = await read("app/site-config.ts");
  assert.match(config, /supportUrl: "https:\/\/github\.com\/aleksanderlech-itx\/spanish-gustar-quiz\/issues"/);
});

test("help modal's entrance animation is dropped under prefers-reduced-motion", async () => {
  const css = await read("app/quiz-layout-fix.css");
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{\s*\.help-dialog \{\s*animation: none;/);
});
