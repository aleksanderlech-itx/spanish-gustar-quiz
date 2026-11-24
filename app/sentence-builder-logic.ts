import type { SentenceBuilderItem } from "./sentence-builder-data.ts";

/**
 * Pure rules for Sentence Builder (decision 0013). A learner's answer is an order of the Item's Tokens.
 * Tokens are tracked by their index in `item.tokens`, so two identical words ("es" twice) stay distinct
 * while building, and are compared by text when checking.
 */

/** Every order that counts as right: the canonical one first, then the listed alternatives. */
export const acceptedOrders = (item: SentenceBuilderItem): string[][] => [item.tokens, ...(item.alsoAccepted ?? [])];

const fold = (token: string) => token.normalize("NFC").toLocaleLowerCase("es");
const key = (order: string[]) => order.map(fold).join(" ");

/** Right or wrong as a whole: capitals are ignored, punctuation is never part of the answer. */
export const isAccepted = (item: SentenceBuilderItem, order: string[]): boolean =>
  order.length === item.tokens.length && acceptedOrders(item).some((accepted) => key(accepted) === key(order));

/** The sentence for an order of Tokens: first letter capitalised, opening and closing marks from the Item. */
export const sentenceFor = (item: SentenceBuilderItem, order: string[]): string => {
  const body = order.join(" ");
  if (!body) return "";
  const opening = /^[¿¡]/.test(item.spanish) ? item.spanish[0] : "";
  const closing = /[.?!]$/.test(item.spanish) ? item.spanish[item.spanish.length - 1] : "";
  return `${opening}${body.charAt(0).toLocaleUpperCase("es")}${body.slice(1)}${closing}`;
};

/**
 * The pool's order on screen: a shuffle of the Token indexes that is never already an accepted order,
 * so no Item starts solved. `random` is injectable for tests.
 */
export const shuffledPool = (item: SentenceBuilderItem, random: () => number = Math.random): number[] => {
  const indexes = item.tokens.map((_, index) => index);
  if (indexes.length < 2) return indexes;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const order = [...indexes];
    for (let i = order.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    if (!isAccepted(item, order.map((index) => item.tokens[index]))) return order;
  }
  // Every shuffle came out solved (only possible with very few Tokens): reverse the canonical order instead.
  return [...indexes].reverse();
};

/** The answer line, as Token indexes in the order they were placed. */
export type Placement = number[];

export const place = (placed: Placement, index: number): Placement => (placed.includes(index) ? placed : [...placed, index]);
/** Tapping a placed Token sends it back to the pool. */
export const unplace = (placed: Placement, index: number): Placement => placed.filter((item) => item !== index);
export const undo = (placed: Placement): Placement => placed.slice(0, -1);
export const reset = (): Placement => [];
export const isComplete = (item: SentenceBuilderItem, placed: Placement) => placed.length === item.tokens.length;
export const tokensOf = (item: SentenceBuilderItem, placed: Placement) => placed.map((index) => item.tokens[index]);

/**
 * After a wrong answer, which positions of the learner's order are out of place: compared with the accepted
 * order it shares the most positions with.
 */
export const misplacedPositions = (item: SentenceBuilderItem, order: string[]): number[] => {
  const closest = acceptedOrders(item)
    .map((accepted) => ({ accepted, same: accepted.filter((token, position) => fold(token) === fold(order[position] ?? "")).length }))
    .sort((a, b) => b.same - a.same)[0].accepted;
  return order.map((token, position) => (fold(token) === fold(closest[position] ?? "") ? -1 : position)).filter((position) => position >= 0);
};

/**
 * Test mode hint: the index of the next Token to place, following an accepted order that matches what is
 * already placed. Null when what is placed matches no accepted order (the tester should Undo).
 */
export const nextHintIndex = (item: SentenceBuilderItem, placed: Placement): number | null => {
  const sofar = tokensOf(item, placed).map(fold);
  const order = acceptedOrders(item).find((accepted) => sofar.every((token, position) => fold(accepted[position]) === token));
  if (!order || sofar.length >= order.length) return null;
  const wanted = fold(order[sofar.length]);
  const index = item.tokens.findIndex((token, i) => fold(token) === wanted && !placed.includes(i));
  return index >= 0 ? index : null;
};
