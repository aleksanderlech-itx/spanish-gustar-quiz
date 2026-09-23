import * as React from "react";

/** Small pill for metadata: CEF level, card counts, topic names, weak areas. Hairline border, no offset. */
export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "neutral" | "primary" | "sun" | "sage" | "clay" | "danger";
  size?: "sm" | "md";
  children?: React.ReactNode;
}
export function Chip(props: ChipProps): JSX.Element;
