import * as React from "react";

/** The gap in a fill-in-the-blank sentence: a sun-gold 3px underline that inherits the prompt's size. */
export interface InlineBlankProps extends React.HTMLAttributes<HTMLSpanElement> {
  value?: React.ReactNode;
  filled?: boolean;
  width?: string;
}
export function InlineBlank(props: InlineBlankProps): JSX.Element;
