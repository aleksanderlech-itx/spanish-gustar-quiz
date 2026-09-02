import Link from "next/link";
import Logo from "./logo";
import { SITE_CONFIG } from "./site-config";

export type ChipTone = "primary" | "neutral" | "sage";
export type Chip = { label: string; tone: ChipTone };
export type Crumb = { label: string; href?: string };
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

/** Sticky identity bar shared by every standalone activity page (grammar quiz setup,
 * flashcard deck). Suppressed once a round/session takes over the screen. */
export function ActivityMasthead() {
  return (
    <header className="activity-masthead">
      <div className="activity-masthead-inner">
        <Link className="activity-masthead-brand" href="/">
          <Logo size={26} />
          <span className="activity-masthead-brand-text">
            <span className="activity-masthead-name">{SITE_CONFIG.name}</span>
            <span className="activity-masthead-sub">Grammar practice</span>
          </span>
        </Link>
        <nav className="activity-masthead-nav" aria-label="Main">
          <Link href="/">Quizzes</Link>
          <Link href="/flashcards">Flashcards</Link>
          <Link href="/how-to-use">How to use</Link>
        </nav>
      </div>
    </header>
  );
}

export function ActivityBreadcrumb({ trail }: { trail: Crumb[] }) {
  return (
    <nav className="activity-breadcrumb" aria-label="Breadcrumb">
      <ol className="activity-breadcrumb-inner">
        {trail.map((crumb, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={crumb.label}>
              {crumb.href && !isLast ? (
                <Link href={crumb.href}>{crumb.label}</Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined}>{crumb.label}</span>
              )}
              {!isLast && <span className="activity-breadcrumb-sep" aria-hidden="true">›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
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
