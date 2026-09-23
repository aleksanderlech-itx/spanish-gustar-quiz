import * as React from "react";

export interface StreakDay {
  letter: string;
  status: "done" | "today" | "future";
  doneCount?: number;
  total?: number;
}

/**
 * The board's streak panel (repo: .streak-panel). Count, "días seguidos", the daily goal, and a Monday-first week strip
 * with two-letter Spanish day names. Today fills left-to-right with sun as activities are done. In dark theme the panel
 * drops the sun wash and uses a sun border and numeral instead.
 */
export interface StreakStripProps extends React.HTMLAttributes<HTMLElement> {
  days?: number;
  todayDone?: number;
  todayTotal?: number;
  week?: StreakDay[];
}
export function StreakStrip(props: StreakStripProps): JSX.Element;
