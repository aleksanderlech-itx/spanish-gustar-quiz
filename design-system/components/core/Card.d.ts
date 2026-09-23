import * as React from "react";

/**
 * The system's container. Rotating organic radii so neighbouring cards never match,
 * 2px ink border, and at most one elevated card per screen.
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 1–4 cycle the organic radius sets; "square" uses the plain 8px radius */
  shape?: 1 | 2 | 3 | 4 | "square";
  tone?: "surface" | "panel" | "primary" | "sun" | "sage" | "clay" | "danger";
  /** adds the 4px solid ink offset — one elevated surface per screen */
  elevated?: boolean;
  children?: React.ReactNode;
}
export function Card(props: CardProps): JSX.Element;
