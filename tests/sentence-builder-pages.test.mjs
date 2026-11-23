import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };
const get = async (url) => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  const worker = (await import(workerUrl.href)).default;
  return worker.fetch(new Request(url, { headers: { accept: "text/html", host: new URL(url).host } }), env, ctx);
};

test("/sentence-builder renders, and is in the sitemap and llms.txt", async () => {
  const page = await get("http://spanish-quizz.es/sentence-builder");
  assert.equal(page.status, 200);
  assert.match(await page.text(), /Spanish Sentence Builder/);
  assert.match(await (await get("http://spanish-quizz.es/sitemap.xml")).text(), /\/sentence-builder</);
  assert.match(await (await get("http://spanish-quizz.es/llms.txt")).text(), /\/sentence-builder\)/);
});

test("Sentence Builder ships with its Notes article, listed on /notes and in the sitemap (Project rule 7)", async () => {
  const article = await get("http://spanish-quizz.es/notes/spanish-word-order");
  assert.equal(article.status, 200);
  assert.match(await article.text(), /href="\/sentence-builder"/);
  assert.match(await (await get("http://spanish-quizz.es/notes")).text(), /\/notes\/spanish-word-order/);
  assert.match(await (await get("http://spanish-quizz.es/sitemap.xml")).text(), /\/notes\/spanish-word-order</);
});

test("Sentence Builder has a help modal and is registered as an activity with rounds", async () => {
  const { HELP_CONTENT } = await import("../app/help-modal.tsx").catch(() => ({ HELP_CONTENT: null }));
  const help = await readFile(new URL("../app/help-modal.tsx", import.meta.url), "utf8");
  assert.match(help, /"sentence-builder": \{\s*title: "Building a sentence"/);
  if (HELP_CONTENT) assert.ok(HELP_CONTENT["sentence-builder"].points.length >= 4);
  const { ACTIVITY_REGISTRY, PROGRESS_ACTIVITY_IDS } = await import("../app/activity-registry.ts");
  const entry = ACTIVITY_REGISTRY.find((item) => item.id === "sentence-builder");
  assert.equal(entry.activityType, "sentence-builder");
  assert.equal(entry.path, "/sentence-builder");
  assert.ok(PROGRESS_ACTIVITY_IDS.includes("sentence-builder"));
});

test("a new user's starter Board does not include Sentence Builder (decision 0011)", async () => {
  const { STARTER_BOARD } = await import("../app/board-state.ts");
  assert.equal(STARTER_BOARD.includes("sentence-builder"), false);
});
