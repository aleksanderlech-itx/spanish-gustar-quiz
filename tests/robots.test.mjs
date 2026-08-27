import assert from "node:assert/strict";
import test from "node:test";

const noAssets = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
};
const noopCtx = {
  waitUntil() {},
  passThroughOnException() {},
};

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker;
}

test("robots.txt disallows everything on any non-production host", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://staging.spanish-quizz.es/robots.txt", { headers: { host: "staging.spanish-quizz.es" } }),
    noAssets,
    noopCtx,
  );
  const body = await response.text();
  assert.match(body, /Disallow:\s*\/\s*$/m);
  assert.doesNotMatch(body, /Allow:/);
});

test("robots.txt allows crawling on the production host", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://spanish-quizz.es/robots.txt", { headers: { host: "spanish-quizz.es" } }),
    noAssets,
    noopCtx,
  );
  const body = await response.text();
  assert.match(body, /Allow:\s*\/\s*$/m);
  assert.doesNotMatch(body, /Disallow:/);
});

test("robots.txt disallows an unrecognized host, such as a *.workers.dev preview URL", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://spanish-gustar-quiz-staging.example.workers.dev/robots.txt", {
      headers: { host: "spanish-gustar-quiz-staging.example.workers.dev" },
    }),
    noAssets,
    noopCtx,
  );
  const body = await response.text();
  assert.match(body, /Disallow:\s*\/\s*$/m);
});

test("staging responses carry a noindex X-Robots-Tag header", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://staging.spanish-quizz.es/", {
      headers: { accept: "text/html", host: "staging.spanish-quizz.es" },
    }),
    noAssets,
    noopCtx,
  );
  assert.match(response.headers.get("x-robots-tag") ?? "", /noindex/i);
});

test("production responses carry no X-Robots-Tag header", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://spanish-quizz.es/", {
      headers: { accept: "text/html", host: "spanish-quizz.es" },
    }),
    noAssets,
    noopCtx,
  );
  assert.equal(response.headers.get("x-robots-tag"), null);
});
