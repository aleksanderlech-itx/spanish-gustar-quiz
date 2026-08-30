import type { Metadata } from "next";
import { SITE_CONFIG } from "../site-config";
import QuizPage from "../quiz-page";

const TITLE = "Ser vs Estar Quiz — 150 Practice Sentences";
const DESCRIPTION =
  "Choose ser or estar through 150 sentences covering identity, description, location, events and changing states, with instant explanations for every answer.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/ser-vs-estar",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/ser-vs-estar`,
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: "Ser vs Estar Quiz",
  description: DESCRIPTION,
  url: `${SITE_CONFIG.url}/ser-vs-estar`,
  learningResourceType: "Quiz",
  educationalLevel: "Beginner to intermediate",
  inLanguage: "es",
  isPartOf: { "@type": "WebSite", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
  about: { "@type": "Thing", name: "Spanish ser and estar" },
};

export default function SerEstarQuizPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <QuizPage quizId="ser-estar" />
    </>
  );
}
