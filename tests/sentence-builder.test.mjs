import assert from "node:assert/strict";
import test from "node:test";

const { SENTENCE_BUILDER_ITEMS, SENTENCE_BUILDER_GROUPS } = await import("../app/sentence-builder-data.ts");
const logic = await import("../app/sentence-builder-logic.ts");

const byId = (id) => SENTENCE_BUILDER_ITEMS.find((item) => item.id === id);
const sameMultiset = (a, b) => [...a].sort().join("|") === [...b].sort().join("|");

// --- Content (decision 0013) ---

test("about 100 Items, every group represented, ids permanent and unique", () => {
  assert.ok(SENTENCE_BUILDER_ITEMS.length >= 90 && SENTENCE_BUILDER_ITEMS.length <= 110);
  const ids = SENTENCE_BUILDER_ITEMS.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id > 10000 && id < 11000), "Sentence Builder ids live in the 10001 block");
  for (const group of SENTENCE_BUILDER_GROUPS) assert.ok(SENTENCE_BUILDER_ITEMS.some((item) => item.group === group), group);
});

test("every Item's canonical Tokens rebuild its corpus sentence exactly", () => {
  for (const item of SENTENCE_BUILDER_ITEMS) assert.equal(logic.sentenceFor(item, item.tokens), item.spanish, `#${item.id}`);
});

test("every other accepted order uses exactly the Item's Tokens, and no order is listed twice", () => {
  for (const item of SENTENCE_BUILDER_ITEMS) {
    const orders = logic.acceptedOrders(item);
    for (const order of orders) assert.ok(sameMultiset(order, item.tokens), `#${item.id}: ${order.join(" ")}`);
    assert.equal(new Set(orders.map((order) => order.join(" "))).size, orders.length, `#${item.id} repeats an order`);
  }
});

test("Tokens are never punctuation, and every Item has at least three", () => {
  for (const item of SENTENCE_BUILDER_ITEMS) {
    assert.ok(item.tokens.length >= 3, `#${item.id}`);
    for (const token of item.tokens) assert.doesNotMatch(token, /[¿?¡!.,;:]/, `#${item.id}: ${token}`);
  }
});

test("explanations follow the quality rules and name a cue from the sentence", () => {
  const fold = (value) => value.normalize("NFC").toLocaleLowerCase("es");
  for (const item of SENTENCE_BUILDER_ITEMS) {
    const { explanation, cue } = item;
    assert.ok(explanation.length >= 15 && explanation.length <= 200, `#${item.id} length`);
    assert.ok((explanation.match(/[.!?](\s|$)/g) ?? []).length <= 2, `#${item.id} sentences`);
    assert.doesNotMatch(explanation, /[\u2013\u2014]/, `#${item.id} dash`);
    assert.doesNotMatch(explanation, /\balso (correct|works|possible)\b/i, `#${item.id} says another answer is correct`);
    const cueRegex = new RegExp(`(?<!\\p{L})${fold(cue).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?!\\p{L})`, "u");
    assert.match(fold(item.spanish), cueRegex, `#${item.id} cue not in sentence`);
    assert.match(fold(explanation), cueRegex, `#${item.id} explanation does not name the cue`);
  }
});

test("every Item carries its corpus attribution", () => {
  for (const item of SENTENCE_BUILDER_ITEMS) assert.match(item.attribution, /^CC-BY 2\.0 \(France\) Attribution: tatoeba\.org #\d+/, `#${item.id}`);
});

// --- Checking ---

test("the canonical order and each listed alternative are right; any other order is wrong", () => {
  const item = byId(SENTENCE_BUILDER_ITEMS.find((candidate) => candidate.alsoAccepted?.length).id);
  for (const order of logic.acceptedOrders(item)) assert.equal(logic.isAccepted(item, order), true);
  const wrong = [...item.tokens].reverse();
  assert.equal(logic.isAccepted(item, wrong), false);
  assert.equal(logic.isAccepted(item, item.tokens.slice(1)), false, "an incomplete line is never right");
});

test("capitals are ignored when checking", () => {
  const item = SENTENCE_BUILDER_ITEMS.find((candidate) => candidate.tokens.includes("Tom"));
  assert.equal(logic.isAccepted(item, item.tokens.map((token) => token.toLowerCase())), true);
});

test("identical Tokens are interchangeable", () => {
  const item = SENTENCE_BUILDER_ITEMS.find((candidate) => candidate.tokens.filter((token) => token === "es").length === 2);
  assert.ok(item, "expected an Item with es twice");
  const indexes = item.tokens.map((_, index) => index);
  const [first, second] = indexes.filter((index) => item.tokens[index] === "es");
  const swapped = indexes.map((index) => (index === first ? second : index === second ? first : index));
  assert.equal(logic.isAccepted(item, logic.tokensOf(item, swapped)), true);
});

// --- Building: place, return, undo, reset ---

test("placing, returning, undoing and resetting the answer line", () => {
  const item = byId(10001);
  let placed = logic.reset();
  placed = logic.place(placed, 2);
  placed = logic.place(placed, 0);
  placed = logic.place(placed, 0);
  assert.deepEqual(placed, [2, 0], "placing a placed Token again changes nothing");
  placed = logic.unplace(placed, 2);
  assert.deepEqual(placed, [0], "tapping a placed Token returns it to the pool");
  placed = logic.place(placed, 1);
  placed = logic.undo(placed);
  assert.deepEqual(placed, [0], "undo removes the last Token placed");
  placed = logic.place(logic.place(placed, 1), 2);
  assert.equal(logic.isComplete(item, placed), true);
  assert.equal(logic.isAccepted(item, logic.tokensOf(item, placed)), true);
  assert.deepEqual(logic.reset(), []);
});

test("the pool never starts in an accepted order", () => {
  for (const item of SENTENCE_BUILDER_ITEMS) {
    let seed = item.id;
    const random = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    const pool = logic.shuffledPool(item, random);
    assert.ok(sameMultiset(pool, item.tokens.map((_, index) => index)), `#${item.id} pool is a permutation`);
    assert.equal(logic.isAccepted(item, pool.map((index) => item.tokens[index])), false, `#${item.id} starts solved`);
  }
});

test("a wrong answer marks the positions that differ from the closest accepted order", () => {
  const item = byId(10001); // dónde están los tenedores
  assert.deepEqual(logic.misplacedPositions(item, ["dónde", "los tenedores", "están"]), [1, 2]);
  assert.deepEqual(logic.misplacedPositions(item, item.tokens), []);
});

test("the test mode hint follows an accepted order and stops when the line has gone wrong", () => {
  for (const item of SENTENCE_BUILDER_ITEMS) {
    let placed = [];
    for (let step = 0; step < item.tokens.length; step += 1) {
      const next = logic.nextHintIndex(item, placed);
      assert.notEqual(next, null, `#${item.id} step ${step}`);
      placed = logic.place(placed, next);
    }
    assert.equal(logic.isAccepted(item, logic.tokensOf(item, placed)), true, `#${item.id} hints lead to a right answer`);
    assert.equal(logic.nextHintIndex(item, placed), null);
  }
  const item = byId(10001);
  assert.equal(logic.nextHintIndex(item, [2]), null, "no hint once the line matches no accepted order");
});
