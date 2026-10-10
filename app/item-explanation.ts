/** A hand-written explanation for one quiz item and the sentence cue it names
 * (docs/explanation-quality.md). */
export type ItemExplanation = { cue: string; explanation: string };

/** Applies an item's own explanation and cue when one exists. */
export const withItemExplanation =
  (entries: Record<number, ItemExplanation>) =>
  <T extends { id: number; explanation: string; cue?: string }>(question: T): T => {
    const entry = entries[question.id];
    return entry ? { ...question, cue: entry.cue, explanation: entry.explanation } : question;
  };
