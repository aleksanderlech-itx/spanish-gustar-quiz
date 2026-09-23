import * as React from "react";

/** Type-mode answer field (repo: .round-type-input): 52px, paper fill, 19px semibold. Graded states turn sage or red. */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  state?: "correct" | "wrong";
  /** shorthand for state="wrong" */
  invalid?: boolean;
}
export function Input(props: InputProps): JSX.Element;
