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
  assert.match(css, /\.sentence-wrap input[^}]*max-width:\s*100%/s);
  assert.match(css, /@media \(max-width:\s*760px\)[\s\S]*\.sentence-wrap input[^}]*width:\s*100%/);
  assert.match(css, /@media \(max-width:\s*760px\)[\s\S]*\.action-bar[^}]*position:\s*fixed/);
  assert.match(css, /@media \(max-width:\s*760px\)[\s\S]*\.action-bar[^}]*bottom:\s*var\(--keyboard-inset\)/);
  assert.match(css, /\.translation-switch[^}]*min-height:\s*44px/);
  assert.match(css, /html\s*\{[^}]*overflow-x:\s*hidden/s);
  assert.match(css, /body\s*\{[^}]*overflow-x:\s*hidden/s);
  assert.doesNotMatch(css, /\.listen-icon/);
  assert.doesNotMatch(css, /clip-path:\s*polygon/);
});

test("quiz presents one question at a time and always shows the infinitive above translation", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const data = await readFile(new URL("../app/quiz-data.ts", import.meta.url), "utf8");
  assert.match(page, /hidden=\{index !== activeQuestion\}/);
  assert.match(page, /Question"\} \{activeQuestion \+ 1\} of \{round\.length\}/);
  assert.match(page, /<div className="verb-row">\s*<span className="verb-chip">\{question\.infinitive\}<\/span>\s*<\/div>[\s\S]*<div className="translation-control">/);
  assert.match(page, /const \[answerMode, setAnswerMode\]/);
  assert.match(page, /className="choice-grid"/);
  assert.match(page, /className=\{`listen-button \$\{isSpeaking \? "playing" : ""\}`\}/);
  assert.match(page, /<svg className="header-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none">/);
  assert.match(page, /<circle cx="12" cy="12" r="4\.5" \/>/);
  assert.match(page, /M4 9\.25h4\.1L13\.5 5v14l-5\.4-4\.25H4Z/);
  assert.doesNotMatch(page, />Dark\s*</);
  assert.doesNotMatch(page, />\{isSpeaking \? "Playing" : "Listen"\}<\/button>/);
  assert.match(page, /const \[quizId, setQuizId\]/);
  assert.match(page, /className="quiz-icon"/);
  assert.match(page, /onClick=\{\(\) => switchQuiz\("gustar"\)\}/);
  assert.match(page, /onClick=\{\(\) => switchQuiz\("preterite-imperfect"\)\}/);
  assert.match(page, /Preterite vs Imperfect/);
  assert.match(page, /value === "ser-estar" \|\| value === "preterite-imperfect"/);
  assert.match(page, /const \[showConjugations, setShowConjugations\]/);
  assert.match(page, /Show verb chart/);
  assert.match(page, /role="dialog"/);
  assert.match(page, /PRETERITE_IMPERFECT_CONJUGATIONS\.map/);
  assert.doesNotMatch(page, /<summary[^>]*>⌄<\/summary>/);
  assert.match(page, /enter the missing object pronoun and verb/);
  assert.match(page, /Show explanation/);
  assert.match(data, /answer: `\$\{objectPronoun\} \$\{verbAnswer\}`/);
  assert.doesNotMatch(page, /const QUESTION_BANKS|const COMPLEX_QUESTIONS|TRANSLATIONS/);
});
