import assert from "node:assert/strict";
import test from "node:test";
import { readFile, readdir } from "node:fs/promises";

const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };
const get = async (url) => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  const worker = (await import(workerUrl.href)).default;
  return worker.fetch(new Request(url, { headers: { accept: "text/html", host: new URL(url).host } }), env, ctx);
};

const PAGES = ["/", "/gustar", "/flashcards", "/sentence-builder", "/notes", "/notes/spanish-word-order", "/about", "/how-to-use", "/privacy"];

test("every page has the one shared footer, listing every activity (decision 0014)", async () => {
  const { ACTIVITY_REGISTRY } = await import("../app/activity-registry.ts");
  for (const path of PAGES) {
    const html = await (await get(`http://spanish-quizz.es${path}`)).text();
    assert.equal((html.match(/<footer class="site-footer"/g) ?? []).length, 1, `${path}: one site footer`);
    const footer = html.slice(html.indexOf('<footer class="site-footer"'));
    for (const activity of ACTIVITY_REGISTRY) assert.match(footer, new RegExp(`href="${activity.path}"`), `${path}: ${activity.id}`);
    for (const href of ["/how-to-use", "/notes", "/about", "/privacy"]) assert.match(footer, new RegExp(`href="${href}"`), `${path}: ${href}`);
    assert.match(footer, /Cookie settings/, `${path}: Cookie settings`);
  }
});

test("pages never render a footer of their own: the layout renders the only one", async () => {
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
  assert.equal((layout.match(/<SiteFooter \/>/g) ?? []).length, 1);
  const files = (await readdir(new URL("../app/", import.meta.url), { recursive: true })).filter((file) => file.endsWith(".tsx"));
  for (const file of files) {
    if (file === "site-footer.tsx" || file === "layout.tsx") continue;
    const source = await readFile(new URL(`../app/${file}`, import.meta.url), "utf8");
    assert.doesNotMatch(source, /<SiteFooter|ActivityFooter|className="activity-footer/, file);
  }
});
