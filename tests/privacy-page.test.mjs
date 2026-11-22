import assert from "node:assert/strict";
import test from "node:test";

const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };
const get = async (url) => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  const worker = (await import(workerUrl.href)).default;
  return worker.fetch(new Request(url, { headers: { accept: "text/html", host: new URL(url).host } }), env, ctx);
};

test("/privacy names the controller and is in the sitemap and llms.txt", async () => {
  const page = await get("http://spanish-quizz.es/privacy");
  assert.equal(page.status, 200);
  const html = await page.text();
  assert.match(html, /Aleksander Lech/);
  assert.match(html, /spanish-quizzes@proton\.me/);
  assert.match(html, /Microsoft Clarity/);
  assert.match(html, /aepd\.es/);
  assert.match(await (await get("http://spanish-quizz.es/sitemap.xml")).text(), /\/privacy</);
  assert.match(await (await get("http://spanish-quizz.es/llms.txt")).text(), /\/privacy\)/);
});
