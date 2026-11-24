import type { Metadata } from "next";
import { SITE_CONFIG } from "../site-config";
import SentenceBuilderPage from "../sentence-builder-page";
import { SENTENCE_BUILDER_CONTENT } from "../sentence-builder-content";

const TITLE = "Spanish Sentence Builder - Word Order Practice";
const DESCRIPTION =
  "Build Spanish sentences from shuffled words: questions, negatives, prepositions, object pronouns, ser and estar, tenses and connectors, with an explanation for every sentence.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/sentence-builder" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_CONFIG.url}/sentence-builder` },
  twitter: { title: TITLE, description: DESCRIPTION },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["Quiz", "LearningResource"],
  name: "Spanish Sentence Builder",
  description: DESCRIPTION,
  url: `${SITE_CONFIG.url}/sentence-builder`,
  learningResourceType: "Quiz",
  educationalLevel: "Beginner to intermediate",
  inLanguage: "es",
  isPartOf: { "@type": "WebSite", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
  about: { "@type": "Thing", name: "Spanish word order" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: SENTENCE_BUILDER_CONTENT.faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function SentenceBuilderRoute() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <SentenceBuilderPage />
    </>
  );
}
