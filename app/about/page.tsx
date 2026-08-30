import type { Metadata } from "next";
import Link from "next/link";
import Logo from "../logo";
import { SITE_CONFIG } from "../site-config";
import styles from "../prose-page.module.css";

const TITLE = "About";
const DESCRIPTION =
  "What Spanish Quizzes is, who it is for, and how your progress is stored. A small practice app for gustar, ser vs estar and preterite vs imperfect.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.back} href="/" aria-label="Back to board">
          <span aria-hidden="true">←</span>
          <span>Back to board</span>
        </Link>
        <div className={styles.brand}>
          <Logo size={26} />
          <span>Spanish Quizzes</span>
        </div>
      </header>

      <section className={styles.intro}>
        <p className={styles.eyebrow}>About</p>
        <h1>What Spanish Quizzes actually is</h1>
        <p className={styles.lead}>
          A small practice app for a handful of Spanish grammar patterns that give English speakers the most trouble.
        </p>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>01</p>
        <div className={styles.sectionBody}>
          <h2>Why this exists</h2>
          <p>
            Most Spanish courses cover gustar, ser versus estar and the preterite versus imperfect split somewhere in the
            first year, then move on. The problem is that a single lesson is rarely enough, these patterns need
            repetition spread out over weeks, not one chapter you read once and forget.
          </p>
          <p>
            Spanish Quizzes is built around that idea. Instead of a full course it offers 150 original sentences per
            topic, an explanation for every answer, and a set of Spanish verb flashcards that use the Leitner system to
            bring back words you miss sooner and let the ones you already know fade into longer reviews.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>02</p>
        <div className={styles.sectionBody}>
          <h2>What it is not</h2>
          <p>
            This is not a full Spanish course and it does not try to cover grammar you already know. If you are just
            starting out with the language, you will probably want a broader resource first. This app works best once
            you already understand the basics and want focused, repeatable practice on the patterns that keep tripping
            you up.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>03</p>
        <div className={styles.sectionBody}>
          <h2>How your progress works</h2>
          <p>
            Everything runs in your browser. Your progress, filters and settings are saved locally on your device,
            there is no account to create and no data leaves your browser unless you choose to back it up. You can
            download a backup from the menu at any time, and load it again later or on another device.
          </p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Questions or found a mistake?</p>
        <a href={SITE_CONFIG.kofiUrl} target="_blank" rel="noopener noreferrer">
          Reach out on Ko-fi
        </a>
      </footer>
    </main>
  );
}
