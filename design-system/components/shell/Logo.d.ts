import * as React from "react";

/** The Spanish Quizzes mark (repo: app/logo.tsx). Token-coloured, so it follows the theme. */
export interface LogoProps extends React.SVGProps<SVGSVGElement> {
  /** px; the header uses 24 */
  size?: number;
}
export function Logo(props: LogoProps): JSX.Element;
