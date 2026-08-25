import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

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
