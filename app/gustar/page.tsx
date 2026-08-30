import type { Metadata } from "next";
import { SITE_CONFIG } from "../site-config";
import QuizPage from "../quiz-page";

const TITLE = "Gustar Quiz — Spanish Sentence Structure Practice";
const DESCRIPTION =
  "Practise gustar and gustar-pattern verbs (encantar, interesar, molestar, doler and more) with 150 original Spanish sentences, instant explanations and audio.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/gustar",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/gustar`,
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: "Gustar Quiz",
  description: DESCRIPTION,
  url: `${SITE_CONFIG.url}/gustar`,
  learningResourceType: "Quiz",
  educationalLevel: "Beginner to intermediate",
  inLanguage: "es",
  isPartOf: { "@type": "WebSite", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
  about: { "@type": "Thing", name: "Spanish gustar-pattern verbs" },
};

export default function GustarQuizPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <QuizPage quizId="gustar" />
    </>
  );
}
