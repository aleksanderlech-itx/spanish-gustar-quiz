import type { Metadata } from "next";
import { SITE_CONFIG } from "../site-config";
import { QUIZ_CONTENT } from "../quiz-content";
import QuizPage from "../quiz-page";

const TITLE = "Conditionals Quiz - Free Spanish Practice";
const DESCRIPTION =
  "Practise Spanish conditional sentences through about 150 sentences covering si with the present, the imperfect subjunctive and hubiera, the conditional and its irregular stems, and polite requests, with instant explanations for every answer.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/conditionals",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/conditionals`,
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["Quiz", "LearningResource"],
  name: "Conditionals Quiz",
  description: DESCRIPTION,
  url: `${SITE_CONFIG.url}/conditionals`,
  learningResourceType: "Quiz",
  educationalLevel: "Intermediate",
  inLanguage: "es",
  isPartOf: { "@type": "WebSite", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
  about: { "@type": "Thing", name: "Spanish conditional sentences with si, the imperfect subjunctive and the conditional" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: QUIZ_CONTENT["conditionals"].faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function ConditionalsQuizPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <QuizPage quizId="conditionals" />
    </>
  );
}
