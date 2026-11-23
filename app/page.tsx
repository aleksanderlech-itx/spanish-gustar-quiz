import { ACTIVITY_REGISTRY } from "./activity-registry";
import { SITE_CONFIG } from "./site-config";

/**
 * The home page as served before JavaScript runs (issue #144). Each visitor's Board lives in their browser,
 * so the server can't render it: it sends the site's one h1 and a link to every activity, visually hidden but
 * readable by search engines and screen readers, plus an empty board frame. Once the Board (QuizSelector in
 * the layout) is ready it adds `quiz-library-open` to the body, which removes this content so the page keeps
 * a single h1. Old `/?quiz=` links are redirected in `proxy.ts`.
 */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      description: SITE_CONFIG.description,
      inLanguage: "en",
    },
    {
      "@type": "ItemList",
      name: "Spanish grammar quizzes and verb flashcards",
      itemListElement: ACTIVITY_REGISTRY.map((entry, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: entry.title,
        url: `${SITE_CONFIG.url}${entry.path}`,
      })),
    },
  ],
};

export default function Home() {
  return (
    <div className="home-static">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="sr-only">
        <h1>{SITE_CONFIG.name}</h1>
        <p>{SITE_CONFIG.description}</p>
        <h2>Activities</h2>
        <ul>
          {ACTIVITY_REGISTRY.map((entry) => (
            <li key={entry.id}>
              <a href={entry.path}>{entry.title}</a>: {entry.shortDescription}
            </li>
          ))}
        </ul>
      </div>
      <div className="home-board-frame" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
