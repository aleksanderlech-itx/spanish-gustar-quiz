import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";

// House style: no em or en dashes anywhere in the repo (copy, comments, data).
// Binary archives and the npm lockfile are not ours to edit.
const SKIP = /\.(zip|png|jpe?g|gif|webp|ico|mp4|mp3|woff2?|ttf|otf|pdf)$|^package-lock\.json$/;

test("no tracked text file contains an em or en dash", () => {
  const files = execFileSync("git", ["ls-files"], { encoding: "utf8" }).split("\n").filter((file) => file && !SKIP.test(file));
  const offenders = [];
  for (const file of files) {
    readFileSync(file, "utf8").split("\n").forEach((line, index) => {
      if (/[–—]/.test(line)) offenders.push(`${file}:${index + 1}`);
    });
  }
  assert.deepEqual(offenders, [], "replace with a colon, comma, hyphen or new sentence");
});
