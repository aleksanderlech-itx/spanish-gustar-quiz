export type BoardTileProgress = {
  id: string;
  completed: number;
  total: number;
  percent: number;
  due: number;
  mastered: number;
  lastActivity: string | null;
};

export type OrderedBoardTile<T extends BoardTileProgress> = T & { pinned: boolean };

/**
 * Board ordering: the in-progress topic (if any) pins full-width first,
 * then the rest sort by descending due count — zero-due topics fall out
 * last as a consequence, not a separate rule. Ties break on id so the
 * order stays stable within a day.
 */
export const orderBoard = <T extends BoardTileProgress>(items: T[]): OrderedBoardTile<T>[] => {
  const inProgress = items.filter((item) => item.completed > 0 && item.percent < 100);
  const pinned = inProgress.length
    ? inProgress.reduce((latest, item) => ((item.lastActivity ?? "") > (latest.lastActivity ?? "") ? item : latest))
    : null;

  const rest = items
    .filter((item) => item !== pinned)
    .sort((a, b) => (b.due - a.due) || a.id.localeCompare(b.id));

  return [
    ...(pinned ? [{ ...pinned, pinned: true }] : []),
    ...rest.map((item) => ({ ...item, pinned: false })),
  ];
};
