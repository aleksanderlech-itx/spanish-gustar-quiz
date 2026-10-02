import assert from "node:assert/strict";
import test from "node:test";
import { readFile, access } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const { TUTORIALS, TUTORIAL_DISMISSED_KEY, TUTORIAL_OFFERED_KEY, shouldOfferTutorial } = await import("../app/tutorials.ts");

const storage = (entries = {}) => ({ getItem: (key) => entries[key] ?? null });

test("four tutorials cover features, using the app, reviewing and Ko-fi support, each with an existing poster", async () => {
  assert.deepEqual(TUTORIALS.map((t) => t.id), ["features", "how-to-use", "activities-review", "support"]);
  assert.match(TUTORIALS.find((t) => t.id === "support").steps.join(" "), /Ko-fi/);
  for (const tutorial of TUTORIALS) {
    assert.ok(tutorial.steps.length > 0, `${tutorial.id} has written steps`);
    await access(new URL(`../public${tutorial.poster}`, import.meta.url));
  }
});

test("welcome modal is offered at every app open until the learner opts out", () => {
  assert.equal(shouldOfferTutorial(storage(), storage()), true);
  // Already offered in this browser session: returning to the board doesn't repeat it.
  assert.equal(shouldOfferTutorial(storage(), storage({ [TUTORIAL_OFFERED_KEY]: "1" })), false);
  // "Don't show this again" wins in every later session.
  assert.equal(shouldOfferTutorial(storage({ [TUTORIAL_DISMISSED_KEY]: "1" }), storage()), false);
  const blocked = { getItem: () => { throw new Error("blocked"); } };
  assert.equal(shouldOfferTutorial(blocked, storage()), false);
});

test("welcome modal is a native dialog on the home board with an opt-out saved as soon as it's ticked", async () => {
  const source = await read("app/tutorial-modal.tsx");
  assert.match(source, /<dialog/);
  assert.match(source, /\.showModal\(\)/);
  assert.match(source, /aria-labelledby="tutorial-dialog-title"/);
  assert.match(source, /Don&apos;t show this again/);
  assert.match(source, /onChange=\{\(event\) => onOptOutChange\(event\.target\.checked\)\}/);
  assert.match(source, /localStorage\.setItem\(TUTORIAL_DISMISSED_KEY, "1"\)/);
  assert.match(await read("app/quiz-selector.tsx"), /<TutorialModal \/>/);
});

test("How to Use page lists the video tutorials and the modal links to them", async () => {
  const page = await read("app/how-to-use/page.tsx");
  assert.match(page, /id="tutorials"/);
  assert.match(page, /<a href="#tutorials">Video tutorials<\/a>/);
  assert.match(page, /TUTORIALS\.map/);
  assert.match(await read("app/tutorials.ts"), /TUTORIALS_HREF = "\/how-to-use#tutorials"/);
});

test("the tutorial opt-out is a preference, so backup, restore and reset leave it alone", async () => {
  assert.doesNotMatch(await read("app/drawer.tsx"), /TUTORIAL_DISMISSED_KEY/);
});
