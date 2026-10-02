import type { Metadata } from "next";
import { SITE_CONFIG } from "../site-config";
import { QUIZ_CONTENT } from "../quiz-content";
import QuizPage from "../quiz-page";

const TITLE = "Saber vs Conocer Quiz — 150 Practice Sentences";
const DESCRIPTION =
  "Choose saber or conocer through 150 sentences covering facts, skills, people, places, familiarity and the past-tense meanings found out and met, with instant explanations for every answer.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/saber-vs-conocer",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/saber-vs-conocer`,
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["Quiz", "LearningResource"],
  name: "Saber vs Conocer Quiz",
  description: DESCRIPTION,
  url: `${SITE_CONFIG.url}/saber-vs-conocer`,
  learningResourceType: "Quiz",
  educationalLevel: "Beginner to intermediate",
  inLanguage: "es",
  isPartOf: { "@type": "WebSite", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
  about: { "@type": "Thing", name: "Spanish saber and conocer" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: QUIZ_CONTENT["saber-conocer"].faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function SaberConocerQuizPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <QuizPage quizId="saber-conocer" />
    </>
  );
}
