import * as React from "react";

/** Two-way toggle (repo: .mode-segmented) — the Choose / Type answer-mode switch. Active is primary-soft in light, full primary in dark. */
export interface SegmentedControlProps extends React.HTMLAttributes<HTMLDivElement> {
  options: Array<string | { value: string; label: string }>;
  value: string;
  onChange?: (value: string) => void;
}
export function SegmentedControl(props: SegmentedControlProps): JSX.Element;
