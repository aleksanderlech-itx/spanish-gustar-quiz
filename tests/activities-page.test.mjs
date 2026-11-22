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

test("a new user gets the starter Board, the Shelf on the Board only in the first session, and no tutorial", async () => {
  const source = await readFile(new URL("../app/quiz-selector.tsx", import.meta.url), "utf8");
  assert.match(source, /if \(!hasChosenBoard\(\)\) \{\s*createdStarter = createStarterBoard\(\);/);
  assert.match(source, /appSessionStorage\.setItem\(TUTORIAL_OFFERED_KEY, "1"\)/);
  assert.match(source, /\{firstVisit && shelf\.length > 0 && \(\s*<details className="board-shelf" open>/);
  assert.doesNotMatch(source, /<ActivitySelection/);
});

test("the Shelf is the first row of the drawer, not part of Settings", async () => {
  const drawer = await readFile(new URL("../app/drawer.tsx", import.meta.url), "utf8");
  const rows = [...drawer.matchAll(/toggleRow\("(\w+)"\)/g)].map((match) => match[1]);
  assert.equal(rows[0], "shelf");
  const settings = drawer.slice(drawer.indexOf('expanded === "settings" &&'));
  assert.doesNotMatch(settings.slice(0, settings.indexOf("</div>")), /shelfItems/);
});

test("/activities saves with at least one ticked", async () => {
  const selection = await readFile(new URL("../app/activity-selection.tsx", import.meta.url), "utf8");
  assert.match(selection, /disabled=\{!checked\.size\}/);
});

test("the welcome dialog shows only on the load that creates the starter Board, then highlights the shelf", async () => {
  const source = await readFile(new URL("../app/quiz-selector.tsx", import.meta.url), "utf8");
  assert.match(source, /createdStarter = createStarterBoard\(\);/);
  assert.match(source, /if \(createdStarter\) setWelcoming\(true\);/);
  assert.match(source, /<WelcomeDialog open=\{welcoming\}/);
  const dialog = await readFile(new URL("../app/welcome-dialog.tsx", import.meta.url), "utf8");
  assert.match(dialog, /Welcome! We picked some activities to start/);
  assert.match(dialog, />\s*Got it\s*</);
  assert.match(dialog, /classList\.add\("board-shelf-highlight"\)/);
  const css = await readFile(new URL("../app/activity-selection.css", import.meta.url), "utf8");
  assert.match(css, /\.board-shelf-highlight::before \{[^}]*animation: board-shelf-travel/s);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{[^@]*\.board-shelf-highlight::before \{\s*content: none;\s*animation: none;/s);
});
