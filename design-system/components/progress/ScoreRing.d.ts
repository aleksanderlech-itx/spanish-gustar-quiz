import * as React from "react";

/** Percent ring (repo: .board-ring). 56px on board tiles, 84px on the topic summary card. */
export interface ScoreRingProps extends React.HTMLAttributes<HTMLDivElement> {
  percent?: number;
  /** px; 56 or 84 */
  size?: number;
}
export function ScoreRing(props: ScoreRingProps): JSX.Element;
