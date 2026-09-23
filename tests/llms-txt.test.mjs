import assert from "node:assert/strict";
import test from "node:test";
import { QUIZ_CONFIG, QUIZ_IDS, quizPath } from "../app/quiz-config.ts";
import { NOTES_POSTS } from "../app/notes-posts.ts";

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

async function fetchText(path, host = "spanish-quizz.es") {
  const worker = await loadWorker();
  const response = await worker.fetch(new Request(`http://${host}${path}`, { headers: { host } }), noAssets, noopCtx);
  return { response, body: await response.text() };
}

test("llms.txt follows the llmstxt.org shape: H1, blockquote summary, then link sections", async () => {
  const { response, body } = await fetchText("/llms.txt");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/plain/);
  assert.match(body, /^# Spanish Quizzes\n\n> \S/);
  assert.match(body, /^## Quizzes$/m);
});

test("llms.txt links every quiz and every note by its production URL", async () => {
  const { body } = await fetchText("/llms.txt");
  QUIZ_IDS.forEach((id) => {
    assert.ok(body.includes(`(https://spanish-quizz.es${quizPath(id)})`), `missing ${id}`);
  });
  NOTES_POSTS.forEach((post) => {
    assert.ok(body.includes(`(https://spanish-quizz.es${post.href})`), `missing ${post.href}`);
  });
  assert.ok(body.includes("(https://spanish-quizz.es/flashcards)"));
});

test("llms.txt is served on a preview host too, still linking production", async () => {
  const { response, body } = await fetchText("/llms.txt", "spanish-gustar-quiz-pr-1.example.workers.dev");
  assert.equal(response.status, 200);
  assert.ok(body.includes("https://spanish-quizz.es/gustar"));
  assert.doesNotMatch(body, /workers\.dev/);
});

test("llms-full.txt carries each quiz's rule and sample answers", async () => {
  const { response, body } = await fetchText("/llms-full.txt");
  assert.equal(response.status, 200);
  QUIZ_IDS.forEach((id) => {
    const quiz = QUIZ_CONFIG[id];
    assert.ok(body.includes(`## ${quiz.title}`), `missing section for ${id}`);
    assert.ok(body.includes(quiz.rule.title), `missing rule for ${id}`);
    assert.ok(body.includes(`**${quiz.questions[0].answer}**`), `missing sample answer for ${id}`);
  });
});
