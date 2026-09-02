import type { Metadata } from "next";
import { SITE_CONFIG } from "../site-config";
import Flashcards, { FLASHCARDS_DESCRIPTION } from "../flashcards";

const TITLE = "Spanish Verb Flashcards — Leitner Spaced Repetition";
const DESCRIPTION = FLASHCARDS_DESCRIPTION;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/flashcards",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/flashcards`,
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: "Spanish Verb Flashcards",
  description: DESCRIPTION,
  url: `${SITE_CONFIG.url}/flashcards`,
  learningResourceType: "Flashcards",
  educationalLevel: "Beginner to intermediate",
  inLanguage: "es",
  isPartOf: { "@type": "WebSite", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
  about: { "@type": "Thing", name: "Spanish verb vocabulary" },
};

export default function FlashcardsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Flashcards standalone />
    </>
  );
}
