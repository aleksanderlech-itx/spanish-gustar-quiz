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
  assert.match(css, /\.translation-switch[^}]*min-height:44px/);
});

test("quiz presents one question at a time and hides the infinitive until reveal", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(page, /hidden=\{index !== activeQuestion\}/);
  assert.match(page, /Question"\} \{activeQuestion \+ 1\} of \{round\.length\}/);
  assert.match(page, /\(checked \|\| shownTranslations\.has\(question\.id\)\) && <span className="verb-chip">/);
  assert.match(page, /className="listen-button"/);
});
