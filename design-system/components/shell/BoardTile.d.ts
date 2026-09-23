import * as React from "react";

/**
 * An activity tile on the board home (repo: .board-tile in app/quiz-selector.tsx).
 * pinned = the in-progress activity (elevated, daily ring); due = something to review (elevated, mastery bar);
 * quiet = nothing due (flat, hairline border).
 */
export interface BoardTileProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "pinned" | "due" | "quiet";
  /** check icon for grammar quizzes, fanned cards for the flashcard deck */
  kind?: "quiz" | "deck";
  title: React.ReactNode;
  todayCorrect?: number;
  todayTotal?: number;
  todayDone?: boolean;
  due?: number;
  mastered?: number;
  completed?: number;
  total?: number;
  /** quiet: overall completion % */
  percent?: number;
  /** pinned: today's ring % */
  dailyPercent?: number;
}
export function BoardTile(props: BoardTileProps): JSX.Element;
