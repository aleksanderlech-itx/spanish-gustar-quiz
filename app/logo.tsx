/** The board-tile mark: a pinned bar over two tiles, echoing the board home's own
 * masonry layout. Uses the app's own design tokens (not fixed hex values) so it
 * re-colors automatically with the dark theme, same as every other icon. */
export default function Logo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" aria-hidden="true" style={{ flex: "none" }}>
      <rect x="2" y="2" width="30" height="12" fill="var(--primary)" stroke="var(--ink)" strokeWidth="2.5" />
      <rect x="2" y="18" width="13" height="14" fill="var(--clay)" stroke="var(--ink)" strokeWidth="2.5" />
      <rect x="19" y="18" width="13" height="14" fill="var(--sun)" stroke="var(--ink)" strokeWidth="2.5" />
    </svg>
  );
}
