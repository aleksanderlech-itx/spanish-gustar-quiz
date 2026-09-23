import * as React from "react";

/** Solid-fill bar with flat caps and a 2px ink frame. Deck completion and round progress. */
export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  label?: React.ReactNode;
  valueLabel?: React.ReactNode;
  /** any colour token — sage for a finished round, primary otherwise */
  fill?: string;
  height?: string;
}
export function ProgressBar(props: ProgressBarProps): JSX.Element;
