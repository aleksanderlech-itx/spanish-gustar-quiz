import * as React from "react";

/** The four Leitner boxes under the flashcard deck (repo: .leitner-stats + .leitner-note): count and review interval per box. */
export interface LeitnerBoxesProps extends React.HTMLAttributes<HTMLDivElement> {
  /** cards per box, Box 1 → Box 4 */
  counts?: number[];
  /** show the "How it works" note */
  note?: boolean;
}
export function LeitnerBoxes(props: LeitnerBoxesProps): JSX.Element;
