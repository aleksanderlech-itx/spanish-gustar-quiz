import * as React from "react";

/** Native select (repo: .topic-filter-field): 44px, 10px radius, muted 12px label above. Used for difficulty and verb filters. */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: React.ReactNode;
  options?: Array<string | { value: string; label: string }>;
}
export function Select(props: SelectProps): JSX.Element;
