import { SITE_CONFIG } from "./site-config";
import ConsentSettingsButton from "./consent-settings-button";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <a href="/about">About</a>
      <span aria-hidden="true"> · </span>
      <a href="/notes">Notes</a>
      <span aria-hidden="true"> · </span>
      <a href="/about#content-sources">Content sources</a>
      <span aria-hidden="true"> · </span>
      <a href={SITE_CONFIG.kofiUrl} target="_blank" rel="noopener noreferrer">
        Help build more quizzes
      </a>
      <span aria-hidden="true"> · </span>
      <a href="/privacy">Privacy</a>
      <span aria-hidden="true"> · </span>
      <ConsentSettingsButton />
    </footer>
  );
}
