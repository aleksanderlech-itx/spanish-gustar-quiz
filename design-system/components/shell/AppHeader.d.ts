import * as React from "react";

/** Compact top bar for library and card views: Fraunces title, optional back arrow, optional streak badge. */
export interface AppHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: React.ReactNode;
  /** brand mark before the title, e.g. <img src="assets/brand/mark.svg" width={24} /> */
  mark?: React.ReactNode;
  /** streak count shown in the sun-washed circle */
  badge?: React.ReactNode;
  onBack?: () => void;
}
export function AppHeader(props: AppHeaderProps): JSX.Element;
