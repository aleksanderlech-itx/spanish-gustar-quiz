import Link from "next/link";
import { SITE_CONFIG } from "./site-config";
import { ACTIVITY_REGISTRY } from "./activity-registry";
import ConsentSettingsButton from "./consent-settings-button";

type FooterLink = { label: string; href: string; external?: boolean };

/** Site links beside the activity list. Activities come from the registry, so a new one appears here by itself. */
const SITE_LINKS: FooterLink[] = [
  { label: "How to use", href: "/how-to-use" },
  { label: "Notes on Spanish grammar", href: "/notes" },
  { label: "About", href: "/about" },
  { label: "Content sources", href: "/about#content-sources" },
  { label: "Help build more quizzes", href: SITE_CONFIG.kofiUrl, external: true },
];

const FooterAnchor = ({ link }: { link: FooterLink }) =>
  link.external
    ? <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
    : <Link href={link.href}>{link.label}</Link>;

/** The one footer on every page (decision 0014): rendered once by the layout, never by a page. */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <nav className="site-footer-columns" aria-label="Footer">
          <div className="site-footer-column site-footer-activities">
            <p className="site-footer-heading">Activities</p>
            <ul>
              {ACTIVITY_REGISTRY.map((activity) => (
                <li key={activity.id}><Link href={activity.path}>{activity.title}</Link></li>
              ))}
            </ul>
          </div>
          <div className="site-footer-column">
            <p className="site-footer-heading">{SITE_CONFIG.name}</p>
            <ul>
              {SITE_LINKS.map((link) => <li key={link.href}><FooterAnchor link={link} /></li>)}
            </ul>
          </div>
        </nav>
        <div className="site-footer-bottom">
          <p><strong>{SITE_CONFIG.name}</strong>: free Spanish grammar practice. Nothing to install, no account needed.</p>
          <p className="site-footer-legal">
            <a href="/privacy">Privacy</a>
            <span aria-hidden="true"> · </span>
            <ConsentSettingsButton />
          </p>
        </div>
      </div>
    </footer>
  );
}
