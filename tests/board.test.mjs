import assert from "node:assert/strict";
import test from "node:test";
import { orderBoard } from "../app/board.ts";

const tile = (overrides) => ({
  id: "id",
  completed: 0,
  total: 10,
  percent: 0,
  due: 0,
  mastered: 0,
  lastActivity: null,
  ...overrides,
});

test("orderBoard pins the in-progress topic full-width first", () => {
  const items = [
    tile({ id: "a", completed: 3, total: 10, percent: 30, due: 1, lastActivity: "2026-08-20" }),
    tile({ id: "b", completed: 0, total: 10, percent: 0, due: 5 }),
  ];
  const ordered = orderBoard(items);
  assert.equal(ordered[0].id, "a");
  assert.equal(ordered[0].pinned, true);
  assert.equal(ordered[1].id, "b");
  assert.equal(ordered[1].pinned, false);
});

test("orderBoard sorts the rest by descending due count, zero-due last", () => {
  const items = [
    tile({ id: "low-due", due: 1 }),
    tile({ id: "zero-due", due: 0 }),
    tile({ id: "high-due", due: 9 }),
  ];
  const ordered = orderBoard(items).map((item) => item.id);
  assert.deepEqual(ordered, ["high-due", "low-due", "zero-due"]);
});

test("orderBoard picks the most recently active topic when several are in progress", () => {
  const items = [
    tile({ id: "older", completed: 2, total: 10, percent: 20, lastActivity: "2026-08-01" }),
    tile({ id: "newer", completed: 2, total: 10, percent: 20, lastActivity: "2026-08-24" }),
  ];
  const ordered = orderBoard(items);
  assert.equal(ordered[0].id, "newer");
  assert.equal(ordered[0].pinned, true);
});

test("orderBoard never pins a fully-completed or untouched topic", () => {
  const items = [
    tile({ id: "complete", completed: 10, total: 10, percent: 100, lastActivity: "2026-08-24" }),
    tile({ id: "untouched", completed: 0, total: 10, percent: 0, due: 2 }),
  ];
  const ordered = orderBoard(items);
  assert.ok(ordered.every((item) => !item.pinned));
});

test("orderBoard is stable across repeated calls with unchanged input", () => {
  const items = [
    tile({ id: "a", due: 3 }),
    tile({ id: "b", due: 3 }),
    tile({ id: "c", due: 1 }),
  ];
  const first = orderBoard(items).map((item) => item.id);
  const second = orderBoard(items).map((item) => item.id);
  assert.deepEqual(first, second);
  assert.deepEqual(first, ["a", "b", "c"]);
});

test("orderBoard moves topics whose daily round is done to the end, keeping the due sort within each group", () => {
  const items = [
    tile({ id: "done-high", due: 9, daily: { done: true } }),
    tile({ id: "open-low", due: 1, daily: { done: false } }),
    tile({ id: "done-low", due: 2, daily: { done: true } }),
    tile({ id: "open-high", due: 5, daily: { done: false } }),
    tile({ id: "no-daily", due: 3 }),
  ];
  const ordered = orderBoard(items).map((item) => item.id);
  assert.deepEqual(ordered, ["open-high", "no-daily", "open-low", "done-high", "done-low"]);
});

test("orderBoard keeps the in-progress topic pinned even when its daily round is done", () => {
  const items = [
    tile({ id: "active", completed: 3, total: 10, percent: 30, lastActivity: "2026-08-24", daily: { done: true } }),
    tile({ id: "other", due: 4, daily: { done: false } }),
  ];
  const ordered = orderBoard(items);
  assert.equal(ordered[0].id, "active");
  assert.equal(ordered[0].pinned, true);
});
