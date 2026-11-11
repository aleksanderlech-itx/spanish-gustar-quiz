import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

// app/sourced-quiz-content.ts, app/sourced-flashcard-content.ts and both copies of
// content-attribution.csv are generated. This runs the generator in check mode, without the
// Tatoeba corpus file, so a hand edit or a forgotten run fails here.
test("generated content files match their sources, with no corpus file needed", () => {
  const result = spawnSync(
    process.execPath,
    ["--experimental-strip-types", "--no-warnings", "scripts/build-sourced-content.mjs", "--check"],
    { cwd: fileURLToPath(new URL("..", import.meta.url)), encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
