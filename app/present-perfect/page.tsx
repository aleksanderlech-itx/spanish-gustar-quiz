import type { Metadata } from "next";
import { SITE_CONFIG } from "../site-config";
import { QUIZ_CONTENT } from "../quiz-content";
import QuizPage from "../quiz-page";

const TITLE = "Present Perfect Quiz - Free Spanish Practice";
const DESCRIPTION =
  "Practise the Spanish present perfect through about 150 sentences covering haber in every person, regular and irregular participles, why tener never forms the perfect, and word order with pronouns and negatives, with instant explanations for every answer.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/present-perfect",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/present-perfect`,
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["Quiz", "LearningResource"],
  name: "Present Perfect Quiz",
  description: DESCRIPTION,
  url: `${SITE_CONFIG.url}/present-perfect`,
  learningResourceType: "Quiz",
  educationalLevel: "Elementary to intermediate",
  inLanguage: "es",
  isPartOf: { "@type": "WebSite", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
  about: { "@type": "Thing", name: "Spanish present perfect with haber and the past participle" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: QUIZ_CONTENT["present-perfect"].faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function PresentPerfectQuizPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <QuizPage quizId="present-perfect" />
    </>
  );
}
