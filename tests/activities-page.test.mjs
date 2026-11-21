import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };
const loadWorker = async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  return (await import(workerUrl.href)).default;
};
const get = async (url) => (await loadWorker()).fetch(new Request(url, { headers: { accept: "text/html", host: new URL(url).host } }), env, ctx);

test("/activities renders and asks search engines not to index it (decision 0008)", async () => {
  const response = await get("http://spanish-quizz.es/activities");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<meta[^>]*name="robots"[^>]*content="noindex, nofollow"/i);
});

test("/activities is in neither the sitemap nor llms.txt", async () => {
  const sitemap = await (await get("http://spanish-quizz.es/sitemap.xml")).text();
  assert.match(sitemap, /<urlset/);
  assert.doesNotMatch(sitemap, /\/activities</);
  const llms = await (await get("http://spanish-quizz.es/llms.txt")).text();
  assert.doesNotMatch(llms, /\/activities\b/);
});

test("the home page shows the Selection screen until the user has a Board", async () => {
  const source = await readFile(new URL("../app/quiz-selector.tsx", import.meta.url), "utf8");
  assert.match(source, /setNeedsSelection\(!hasChosenBoard\(\)\)/);
  assert.match(source, /<ActivitySelection mode="first"/);
  const selection = await readFile(new URL("../app/activity-selection.tsx", import.meta.url), "utf8");
  // The first visit shows only the Selection screen: the tutorial waits for the next visit.
  assert.match(selection, /appSessionStorage\.setItem\(TUTORIAL_OFFERED_KEY, "1"\)/);
  assert.match(selection, /disabled=\{!checked\.size\}/);
});
