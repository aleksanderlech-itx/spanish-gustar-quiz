import type { Metadata } from "next";
import { SITE_CONFIG } from "../site-config";
import { QUIZ_CONTENT } from "../quiz-content";
import QuizPage from "../quiz-page";

const TITLE = "Spanish Object Pronouns Quiz — 150 Practice Sentences";
const DESCRIPTION =
  "Practise Spanish direct, indirect and double object pronouns (lo, la, le, se lo) through 150 sentences covering placement, attachment to gerunds and infinitives, and le turning into se, with instant explanations for every answer.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/object-pronouns",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/object-pronouns`,
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["Quiz", "LearningResource"],
  name: "Spanish Object Pronouns Quiz",
  description: DESCRIPTION,
  url: `${SITE_CONFIG.url}/object-pronouns`,
  learningResourceType: "Quiz",
  educationalLevel: "Beginner to intermediate",
  inLanguage: "es",
  isPartOf: { "@type": "WebSite", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
  about: { "@type": "Thing", name: "Spanish object pronouns" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: QUIZ_CONTENT["object-pronouns"].faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function ObjectPronounsQuizPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <QuizPage quizId="object-pronouns" />
    </>
  );
}
