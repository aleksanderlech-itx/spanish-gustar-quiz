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
  const issueCss = await readFile(new URL("../app/issue-5-design.css", import.meta.url), "utf8");
  assert.match(css, /\.sentence-wrap input[^}]*max-width:\s*100%/s);
  assert.doesNotMatch(css, /@media \(max-width:\s*760px\)/);
  assert.match(css, /\.sentence-wrap \{[^}]*display:\s*flex/s);
  assert.match(css, /\.sentence-wrap \{[^}]*gap:\s*8px 6px[^}]*padding-right:\s*30px/s);
  assert.match(css, /\.sentence-wrap \{[^}]*font-size:\s*clamp\(24px,\s*5\.8vw,\s*34px\)/s);
  assert.match(css, /\.sentence-wrap \{[^}]*line-height:\s*1\.35/s);
  assert.match(css, /\.sentence-wrap input[^}]*min-height:\s*52px/);
  assert.match(css, /\.sentence-wrap input[^}]*min-width:\s*min\(250px,\s*100%\)/s);
  assert.match(css, /\.sentence-wrap input[^}]*padding:\s*8px 12px/);
  assert.match(css, /\.sentence-wrap input[^}]*border-bottom:\s*2px solid var\(--primary\)/s);
  assert.match(css, /\.sentence-wrap input[^}]*background:\s*color-mix/);
  assert.match(css, /\.sentence-wrap input:focus[^}]*box-shadow:\s*0 0 0 3px/s);
  assert.match(css, /\.answer-slot[^}]*min-height:\s*48px/);
  assert.match(css, /\.answer-slot[^}]*padding:\s*7px 11px/);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*\.question-card\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*\.sentence-wrap \{[^}]*display:\s*block/);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*\.sentence-wrap input[^}]*display:\s*inline-block/);
  assert.doesNotMatch(css, /\.sentence-wrap input,\s*\.answer-slot\s*\{[^}]*flex:\s*1 0 100%/s);
  assert.doesNotMatch(issueCss, /^\.sentence-wrap\b/m);
  assert.doesNotMatch(issueCss, /\.sentence-wrap input/);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*\.action-bar[^}]*position:\s*fixed/);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*\.action-bar[^}]*bottom:\s*var\(--keyboard-inset\)/);
  assert.match(css, /\.translation-switch[^}]*min-height:\s*44px/);
  assert.match(css, /html\s*\{[^}]*overflow-x:\s*hidden/s);
  assert.match(css, /body\s*\{[^}]*overflow-x:\s*hidden/s);
  assert.doesNotMatch(css, /\.listen-icon/);
  assert.doesNotMatch(css, /clip-path:\s*polygon/);
});

test("editorial design owns typography, solid surfaces, and hard depth", async () => {
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
  const designCss = await readFile(new URL("../app/quiz-layout-fix.css", import.meta.url), "utf8");
  const baseCss = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(layout, /Fraunces/);
  assert.match(layout, /Karla/);
  assert.match(designCss, /--paper:\s*#F5EFE4/);
  assert.match(designCss, /--hard-shadow:\s*4px 4px 0 var\(--shadow-col\)/);
  assert.match(designCss, /border:\s*2px solid var\(--ink\)/);
  assert.match(designCss, /box-shadow:\s*var\(--hard-shadow\)/);
  assert.match(designCss, /\.flashcard-face > strong\s*\{[\s\S]*font-size:\s*clamp\(46px,\s*10vw,\s*76px\)/);
  assert.match(baseCss, /\.conjugation-modal-backdrop\s*\{[\s\S]*background:\s*var\(--paper\)/);
  assert.doesNotMatch(designCss, /\.flashcard-face > strong[\s\S]*box-shadow:\s*0/);
  assert.doesNotMatch(designCss, /background(?:-image)?:\s*linear-gradient/);
});

test("page.tsx is a thin shell dispatching to topic detail, round, and flashcards", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(page, /if \(params\.get\("quiz"\) === "flashcards"\) return <Flashcards \/>;/);
  assert.match(page, /if \(params\.get\("play"\) === "1"\) return <Round quizId=\{quizId\} \/>;/);
  assert.match(page, /return <TopicDetail quizId=\{quizId\} \/>;/);
  // Reads via the router-connected useSearchParams, not a one-shot window.location.search
  // parse — the latter left page.tsx (and QuizSelector) stuck on stale screens after any
  // client-side Link navigation (back button, verb chart, "back to board" all broke).
  assert.match(page, /import \{ useSearchParams \} from "next\/navigation";/);
  assert.doesNotMatch(page, /window\.location\.search/);
  assert.doesNotMatch(page, /const QUESTION_BANKS|const COMPLEX_QUESTIONS|TRANSLATIONS/);
});

test("QuizSelector re-derives its open state from the router on every render, not just at mount", async () => {
  const quizSelector = await readFile(new URL("../app/quiz-selector.tsx", import.meta.url), "utf8");
  assert.match(quizSelector, /import \{ useSearchParams \} from "next\/navigation";/);
  assert.match(quizSelector, /const params = useSearchParams\(\);/);
  assert.match(quizSelector, /const open = !params\.has\("quiz"\) && params\.get\("play"\) !== "1";/);
  assert.doesNotMatch(quizSelector, /window\.location\.search/);
  // The board's progress numbers re-read from storage whenever it becomes visible
  // again (dependent on `open`), not only once at first mount.
  assert.match(quizSelector, /\}, \[open\]\);/);
});

test("round screen commits one answer at a time, recolors options, and gates Next until answered", async () => {
  const round = await readFile(new URL("../app/round.tsx", import.meta.url), "utf8");
  const data = await readFile(new URL("../app/quiz-data.ts", import.meta.url), "utf8");

  // One tap commits; further taps on an already-answered question are ignored.
  assert.match(round, /const commit = \(choice: string\) => \{\s*if \(isSubmitted\) return;/);
  // Four-state option color table, driven off a single state string.
  assert.match(round, /round-option-\$\{state\}/);
  assert.match(round, /if \(choice === question\.answer\) return "correct";/);
  assert.match(round, /if \(choice === picked\) return "wrong";/);
  // Skip advances without scoring: the answer stays null and is excluded when the round is scored.
  assert.match(round, /const skip = \(\) => \{/);
  assert.match(round, /entry\.a !== null/);
  // Footer Next/Check is disabled until the current question is answered (Choose) or typed (Type).
  assert.match(round, /const primaryDisabled = mode === "type" \? \(!isSubmitted && !typed\.trim\(\)\) : !isSubmitted;/);
  assert.match(round, /"Pick an answer"\s*: isLast \? "See results" : "Next question";/);
  // Score increments once per question, at commit time — not on render.
  assert.match(round, /recordActivityToday\(\);/);
  // Answer comparison for Choose mode reuses the existing verb-form/pronoun data, not a parallel bank.
  assert.match(data, /answer: `\$\{objectPronoun\} \$\{verbAnswer\}`/);
});

test("round screen, Type mode: real input, caret-aware accents, Check is a no-op on whitespace, comparison via normalizeAnswer", async () => {
  const round = await readFile(new URL("../app/round.tsx", import.meta.url), "utf8");

  assert.match(round, /autoCapitalize="none"/);
  assert.match(round, /autoCorrect="off"/);
  assert.match(round, /spellCheck=\{false\}/);
  assert.match(round, /lang="es"/);
  assert.match(round, /const ACCENTS = \["á", "é", "í", "ó", "ú", "ñ"\];/);
  // Check is a no-op on empty/whitespace input.
  assert.match(round, /const commitTyped = \(\) => \{\s*if \(isSubmitted \|\| !typed\.trim\(\)\) return;/);
  // Accents insert at the caret via selectionStart/selectionEnd, not appended to the end.
  assert.match(round, /const start = el\?\.selectionStart \?\? typed\.length;/);
  assert.match(round, /const end = el\?\.selectionEnd \?\? typed\.length;/);
  assert.match(round, /el\?\.setSelectionRange\(caret, caret\);/);
  // Answer comparison goes through normalizeAnswer, not raw string equality.
  assert.match(round, /const isCorrect = picked !== null && normalizeAnswer\(picked\) === normalizeAnswer\(question\.answer\);/);
});

test("topic detail persists round length and answer mode per topic", async () => {
  const topicDetail = await readFile(new URL("../app/topic-detail.tsx", import.meta.url), "utf8");
  assert.match(topicDetail, /const ROUND_LENGTHS: RoundLength\[\] = \[5, 10, 20\];/);
  assert.match(topicDetail, /writeTopicSettings\(quizId, merged\)/);
  assert.match(topicDetail, /Start round of \{roundLength\}/);
});

test("round shell's dvh fallback is ordered correctly (vh first, dvh second, so dvh actually wins where supported)", async () => {
  const css = await readFile(new URL("../app/quiz-layout-fix.css", import.meta.url), "utf8");
  assert.match(css, /\.round-shell \{[\s\S]*?height: 100vh;[\s\S]*?height: 100dvh;[\s\S]*?\}/);
  assert.doesNotMatch(css, /\.round-shell \{[\s\S]*?height: 100dvh;[\s\S]*?height: 100vh;[\s\S]*?\}/);
});

test("round screen falls back to a JS-measured keyboard inset for iOS Safari, where dvh doesn't always react", async () => {
  const round = await readFile(new URL("../app/round.tsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../app/quiz-layout-fix.css", import.meta.url), "utf8");
  assert.match(round, /const viewport = window\.visualViewport;/);
  assert.match(round, /document\.documentElement\.style\.setProperty\("--keyboard-inset", `\$\{inset\}px`\);/);
  assert.match(round, /viewport\.addEventListener\("resize", updateKeyboardInset\);/);
  assert.match(round, /document\.documentElement\.style\.removeProperty\("--keyboard-inset"\);/);
  assert.match(css, /\.round-footer \{[\s\S]*?var\(--keyboard-inset, 0px\)[\s\S]*?\}/);
});
