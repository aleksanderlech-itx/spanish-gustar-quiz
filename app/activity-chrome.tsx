export type ChipTone = "primary" | "neutral" | "sage";
export type Chip = { label: string; tone: ChipTone };

/** First focusable element on activity pages, so the masthead/breadcrumb chrome
 * doesn't force a dozen extra tab stops before the exercise itself. */
export function SkipLink({ targetId, label }: { targetId: string; label: string }) {
  return (
    <a className="activity-skip-link" href={`#${targetId}`}>
      {label}
    </a>
  );
}

export function ActivityChips({ chips }: { chips: Chip[] }) {
  return (
    <div className="activity-chip-row">
      {chips.map((chip) => (
        <span className={`activity-chip activity-chip-${chip.tone}`} key={chip.label}>{chip.label}</span>
      ))}
    </div>
  );
}
