import type { Metadata } from "next";
import { SITE_CONFIG } from "../site-config";
import QuizPage from "../quiz-page";

const TITLE = "Preterite vs Imperfect Quiz — Practice Online";
const DESCRIPTION =
  "Practise preterite vs imperfect with 150 sentences covering completed actions, past habits, background scenes and interruptions, with an explanation for every answer.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/preterite-vs-imperfect",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/preterite-vs-imperfect`,
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: "Preterite vs Imperfect Quiz",
  description: DESCRIPTION,
  url: `${SITE_CONFIG.url}/preterite-vs-imperfect`,
  learningResourceType: "Quiz",
  educationalLevel: "Intermediate",
  inLanguage: "es",
  isPartOf: { "@type": "WebSite", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
  about: { "@type": "Thing", name: "Spanish preterite and imperfect tenses" },
};

export default function PreteriteImperfectQuizPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <QuizPage quizId="preterite-imperfect" />
    </>
  );
}
