import * as React from "react";

/** Device shell used to present app screens in specs and kits: 26px radius, ink border, 6px offset. */
export interface PhoneFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number | string;
  height?: number | string;
  children?: React.ReactNode;
}
export function PhoneFrame(props: PhoneFrameProps): JSX.Element;
