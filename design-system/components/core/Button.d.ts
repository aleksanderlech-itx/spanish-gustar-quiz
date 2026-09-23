import * as React from "react";

/**
 * Primary action control. Fraunces label, 2px ink border, 4px solid offset that
 * flattens on press. Disabled keeps its footprint but loses the offset.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = teal fill, secondary = paper fill, ghost = underlined clay text */
  variant?: "primary" | "secondary" | "ghost";
  /** sm 44px, md 48px, lg 52px — never below 44px */
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
}
export function Button(props: ButtonProps): JSX.Element;
