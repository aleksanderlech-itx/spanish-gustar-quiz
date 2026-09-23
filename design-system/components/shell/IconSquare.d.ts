import * as React from "react";

/** 44px bordered header square (repo: .mode-switch / .topic-back / .round-back): menu, back, close, or the sun/moon theme toggle. Always pass `label`. */
export interface IconSquareProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: "menu" | "back" | "close" | "sun" | "moon";
  /** px; 44 in headers, 40 in the round header and drawer */
  size?: number;
  radius?: number;
  /** accessible label, e.g. "Open menu" */
  label: string;
  children?: React.ReactNode;
}
export function IconSquare(props: IconSquareProps): JSX.Element;
