import * as React from "react";

/** A single number with a caption, on an organic-radius card. Used for at-a-glance facts and summaries. */
export interface StatTileProps extends React.HTMLAttributes<HTMLDivElement> {
  value: React.ReactNode;
  label: React.ReactNode;
  shape?: 1 | 2 | 3 | 4 | "square";
  tone?: "surface" | "panel" | "primary" | "sun" | "sage" | "clay" | "danger";
  elevated?: boolean;
}
export function StatTile(props: StatTileProps): JSX.Element;
