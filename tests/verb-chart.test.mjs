import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { PRETERITE_IMPERFECT_CONJUGATIONS, PRETERITE_IMPERFECT_REGULARITY } from "../app/preterite-imperfect-data.ts";
import { SABER_CONOCER_CONJUGATIONS } from "../app/saber-conocer-data.ts";

test("verb chart never fabricates a six-pronoun paradigm where the data doesn't have one", async () => {
  const source = await readFile(new URL("../app/verb-chart.tsx", import.meta.url), "utf8");
  // Preterite/imperfect verbs get the real paradigm from PRETERITE_IMPERFECT_CONJUGATIONS.
  assert.match(source, /const conjugations = PRETERITE_IMPERFECT_CONJUGATIONS\[infinitive\] \?\? \[\];/);
  // Gustar-pattern verbs are impersonal — a simple singular/plural block, not a fake "yo, tú..." table.
  assert.match(source, /one thing \/ to do something/);
  // Ser/estar compares two different verbs, not one conjugated across pronouns.
  assert.match(source, /pronoun: "ser", form: ser/);
  assert.match(source, /pronoun: "estar", form: estar/);
});

test("verb chart highlights only the row currently speaking and clears it on end", async () => {
  const source = await readFile(new URL("../app/verb-chart.tsx", import.meta.url), "utf8");
  assert.match(source, /const \[speakingKey, setSpeakingKey\] = useState<string \| null>\(null\);/);
  assert.match(source, /setSpeakingKey\(key\);/);
  assert.match(source, /onEnd: \(\) => setSpeakingKey\(\(current\) => \(current === key \? null : current\)\)/);
  // Play all queues the whole paradigm in order via speakQueue, not one-off calls.
  assert.match(source, /speakQueue\(/);
  assert.match(source, /onDone: \(\) => setSpeakingKey\(null\),/);
});

test("every preterite/imperfect verb has a regularity classification, and vice versa", () => {
  const conjugatedVerbs = Object.keys(PRETERITE_IMPERFECT_CONJUGATIONS).sort();
  const classifiedVerbs = Object.keys(PRETERITE_IMPERFECT_REGULARITY).sort();
  assert.deepEqual(classifiedVerbs, conjugatedVerbs);
  const allowed = new Set(["regular", "irregular", "spelling change"]);
  for (const value of Object.values(PRETERITE_IMPERFECT_REGULARITY)) assert.ok(allowed.has(value), `unexpected classification: ${value}`);
});

test("the regularity badge only renders for preterite/imperfect, never guessed for gustar or ser/estar", async () => {
  const source = await readFile(new URL("../app/verb-chart.tsx", import.meta.url), "utf8");
  assert.match(source, /const regularityFor = \(quizId: QuizId, infinitive: string\) =>\s*quizId === "preterite-imperfect" \? PRETERITE_IMPERFECT_REGULARITY\[infinitive\] : undefined;/);
});

test("saber/conocer chart has a full six-pronoun paradigm for both verbs in every tense it shows", () => {
  assert.deepEqual(SABER_CONOCER_CONJUGATIONS.map((row) => row.subject), ["yo", "tú", "él / ella / usted", "nosotros", "vosotros", "ellos / ellas / ustedes"]);
  for (const row of SABER_CONOCER_CONJUGATIONS) {
    for (const verb of ["saber", "conocer"]) {
      for (const tense of ["present", "preterite", "imperfect"]) assert.ok(row[verb][tense], `${verb} ${tense} ${row.subject}`);
    }
  }
});

test("saber/conocer chart scopes to the question's tense: past-meaning gets preterite/imperfect, other usages present", async () => {
  const source = await readFile(new URL("../app/verb-chart.tsx", import.meta.url), "utf8");
  assert.match(source, /infinitive === "past meaning" \? \(\["preterite", "imperfect"\] as const\)/);
  assert.match(source, /: infinitive \? \(\["present"\] as const\)/);
});
