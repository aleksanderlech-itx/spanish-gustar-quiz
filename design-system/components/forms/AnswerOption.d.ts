import * as React from "react";

/**
 * A Choose-mode answer (repo: .round-option). After a pick, the right answer turns sage with ✓, a wrong pick turns red with ✕,
 * and the rest go quiet. The written verdict lives in the explanation panel below the options.
 */
export interface AnswerOptionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  state?: "idle" | "correct" | "wrong" | "other";
  children?: React.ReactNode;
}
export function AnswerOption(props: AnswerOptionProps): JSX.Element;
