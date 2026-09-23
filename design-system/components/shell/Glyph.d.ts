import * as React from "react";

/** The only icon primitive in the system: a unicode mark set in Karla. Pair with a text label whenever it carries meaning. */
export interface GlyphProps extends React.HTMLAttributes<HTMLSpanElement> {
  name?: "correct" | "wrong" | "again" | "back" | "forward" | "up" | "down" | "flip" | "more" | "close" | "star" | (string & {});
  size?: string;
  color?: string;
}
export function Glyph(props: GlyphProps): JSX.Element;
export const GLYPHS: Record<string, string>;
