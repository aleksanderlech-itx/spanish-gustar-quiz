import * as React from "react";

/** In-round header (repo: .round-header): 40px back square, step strip — past in primary, current in sun — and a muted counter. */
export interface QuizHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  current?: number;
  total?: number;
  /** number of strip segments; defaults to total */
  steps?: number;
  onBack?: () => void;
}
export function QuizHeader(props: QuizHeaderProps): JSX.Element;
