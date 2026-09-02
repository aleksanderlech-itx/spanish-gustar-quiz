import Link from "next/link";

export type ChipTone = "primary" | "neutral" | "sage";
export type Chip = { label: string; tone: ChipTone };
export type FooterLink = { label: string; href: string; external?: boolean };
export type FooterColumn = { heading: string; links: FooterLink[] };

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

export function ActivityFooter({ columns, bottomNote }: { columns: FooterColumn[]; bottomNote: React.ReactNode }) {
  return (
    <footer className="activity-footer">
      <div className="activity-footer-inner">
        <div className="activity-footer-columns">
          {columns.map((column) => (
            <div className="activity-footer-column" key={column.heading}>
              <p className="activity-footer-heading">{column.heading}</p>
              <ul>
                {column.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
                    ) : (
                      <Link href={link.href}>{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="activity-footer-bottom">{bottomNote}</p>
      </div>
    </footer>
  );
}
