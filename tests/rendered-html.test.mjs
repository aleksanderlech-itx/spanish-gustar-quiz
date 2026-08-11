import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

test("renders development preview metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assert.match(await response.text(), developmentPreviewMeta);
});

test("mobile quiz design keeps the answer field and actions inside the viewport", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.sentence-wrap input[^}]*max-width:100%/s);
  assert.match(css, /@media \(max-width:760px\)[\s\S]*\.sentence-wrap input[^}]*width:100%/);
  assert.match(css, /@media \(max-width:760px\)[\s\S]*\.action-bar[^}]*position:fixed/);
  assert.match(css, /@media \(max-width:760px\)[\s\S]*\.action-bar[^}]*bottom:var\(--keyboard-inset\)/);
  assert.match(css, /\.translation-switch[^}]*min-height:44px/);
});

test("quiz presents one question at a time and always shows the infinitive above translation", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const data = await readFile(new URL("../app/quiz-data.ts", import.meta.url), "utf8");
  assert.match(page, /hidden=\{index !== activeQuestion\}/);
  assert.match(page, /Question"\} \{activeQuestion \+ 1\} of \{round\.length\}/);
  assert.match(page, /<div className="verb-row">\s*<span className="verb-chip">\{question\.infinitive\}<\/span>\s*<\/div>\s*<div className="translation-control">/);
  assert.match(page, /className="listen-button"/);
  assert.match(page, /enter the missing object pronoun and verb/);
  assert.match(page, /Show explanation/);
  assert.match(data, /answer: `\$\{objectPronoun\} \$\{verbAnswer\}`/);
  assert.doesNotMatch(page, /const QUESTION_BANKS|const COMPLEX_QUESTIONS|TRANSLATIONS/);
});
