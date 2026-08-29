import { SITE_CONFIG } from "./site-config";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <a href={SITE_CONFIG.kofiUrl} target="_blank" rel="noopener noreferrer">
        Help build more quizzes
      </a>
    </footer>
  );
}
