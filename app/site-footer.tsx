import { SITE_CONFIG } from "./site-config";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <a href="/about">About</a>
      <span aria-hidden="true"> · </span>
      <a href="/notes">Notes</a>
      <span aria-hidden="true"> · </span>
      <a href={SITE_CONFIG.kofiUrl} target="_blank" rel="noopener noreferrer">
        Help build more quizzes
      </a>
    </footer>
  );
}
