import assert from "node:assert/strict";
import test from "node:test";
import { QUIZ_CONFIG, QUIZ_IDS, QUIZ_SLUGS, isQuizId, resolveQuizId } from "../app/quiz-config.ts";
import { ACTIVITY_REGISTRY, findActivity } from "../app/activity-registry.ts";

test("every quiz in QUIZ_CONFIG has a matching activity registry entry", () => {
  QUIZ_IDS.forEach((id) => {
    const entry = findActivity(id);
    assert.ok(entry, `missing registry entry for ${id}`);
    assert.equal(entry.activityType, "fill-in-blank");
    assert.equal(entry.slug, QUIZ_SLUGS[id]);
    assert.equal(entry.storageKey, QUIZ_CONFIG[id].storageKey);
    assert.equal(entry.title, QUIZ_CONFIG[id].title.replace(" Quiz", ""));
  });
});

test("the registry also carries the flashcards activity, which isn't a QUIZ_CONFIG entry", () => {
  const entry = findActivity("flashcards");
  assert.ok(entry);
  assert.equal(entry.activityType, "flashcards");
  assert.equal(entry.path, "/flashcards");
});

test("every registry entry has a unique id, slug and path", () => {
  const ids = ACTIVITY_REGISTRY.map((entry) => entry.id);
  const slugs = ACTIVITY_REGISTRY.map((entry) => entry.slug);
  const paths = ACTIVITY_REGISTRY.map((entry) => entry.path);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(slugs).size, slugs.length);
  assert.equal(new Set(paths).size, paths.length);
});

test("isQuizId accepts every registered quiz id and rejects unknown values", () => {
  QUIZ_IDS.forEach((id) => assert.equal(isQuizId(id), true));
  assert.equal(isQuizId("flashcards"), false);
  assert.equal(isQuizId("not-a-real-quiz"), false);
  assert.equal(isQuizId(null), false);
  assert.equal(isQuizId(undefined), false);
});

test("resolveQuizId drives the ?quiz= route param, falling back to gustar", () => {
  QUIZ_IDS.forEach((id) => assert.equal(resolveQuizId(id), id));
  assert.equal(resolveQuizId(null), "gustar");
  assert.equal(resolveQuizId("bogus"), "gustar");
  assert.equal(resolveQuizId("flashcards"), "gustar");
});
