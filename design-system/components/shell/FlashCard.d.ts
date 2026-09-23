import * as React from "react";

/**
 * The verb flashcard (repo: .flashcard in app/flashcards.tsx). Front: clay eyebrow, the term in large teal Fraunces,
 * a speak button, the box pill. Revealed: an ink rule, the English meaning, the Spanish example and its English gloss.
 * No flip animation — the faces swap in place.
 */
export interface FlashCardProps extends React.HTMLAttributes<HTMLDivElement> {
  term: React.ReactNode;
  meaning?: React.ReactNode;
  example?: React.ReactNode;
  exampleEnglish?: React.ReactNode;
  /** box pill, e.g. "Box 1 · due now" */
  meta?: React.ReactNode;
  revealed?: boolean;
  onReveal?: () => void;
  onSpeak?: () => void;
}
export function FlashCard(props: FlashCardProps): JSX.Element;
