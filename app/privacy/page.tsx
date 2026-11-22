import type { Metadata } from "next";
import SiteHeader from "../site-header";
import ConsentSettingsButton from "../consent-settings-button";
import styles from "../prose-page.module.css";

const TITLE = "Privacy";
const DESCRIPTION =
  "What Spanish Quizzes stores in your browser, which outside services are involved, how analytics work only with your consent, and how to delete your data.";
const CONTACT = "spanish-quizzes@proton.me";
const UPDATED = "22 November 2026";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <SiteHeader />

      <section className={styles.intro}>
        <p className={styles.eyebrow}>Privacy</p>
        <h1>Your data and Spanish Quizzes</h1>
        <p className={styles.lead}>
          No account, no sign-up. Your progress stays in your browser. Analytics run only if you say yes.
        </p>
        <p>Last updated: {UPDATED}.</p>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>01</p>
        <div className={styles.sectionBody}>
          <h2>Who runs this site</h2>
          <p>
            Spanish Quizzes (spanish-quizz.es) is run by Aleksander Lech, who is responsible for the personal data
            described on this page. Contact: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>02</p>
        <div className={styles.sectionBody}>
          <h2>What stays in your browser</h2>
          <p>
            Your quiz history, flashcard boxes, streak, mistake notebook, the activities on your board and your
            settings are saved in your browser&apos;s local storage on this device. They are never sent to us. They
            are needed for the app to remember your practice, so they don&apos;t require consent.
          </p>
          <ul>
            <li>Your light or dark theme is also kept in a cookie (<code>spanish-quiz-theme</code>) so the page opens in the right colours. It holds only &quot;light&quot; or &quot;dark&quot; and lasts one year.</li>
            <li>Your analytics choice is kept in local storage for 12 months, after which we ask again.</li>
            <li>A backup file you download contains your progress and stays wherever you save it.</li>
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>03</p>
        <div className={styles.sectionBody}>
          <h2>Analytics, only with your consent</h2>
          <p>
            If you choose <strong>Accept</strong>, we load Google Analytics (Google Ireland Limited) and Microsoft
            Clarity (Microsoft Ireland Operations Limited) to understand which pages and activities are used and where
            the app is hard to use. They set cookies, and Clarity records how you move through pages: clicks, scrolls
            and taps. They receive your IP address, device and browser details, and the pages you visit. Both
            companies may process this data in the United States under the EU-US Data Privacy Framework.
          </p>
          <p>
            If you choose <strong>Reject</strong>, or make no choice, neither tool is loaded and nothing is sent to
            them. The legal basis is your consent. You can change your mind at any time with{" "}
            <ConsentSettingsButton className="consent-settings-link" />; withdrawing deletes their cookies on this
            site and stops them from loading. The data is kept for the periods set in each tool, and you can read more
            in Google&apos;s and Microsoft&apos;s own privacy statements.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>04</p>
        <div className={styles.sectionBody}>
          <h2>Other outside services</h2>
          <ul>
            <li>The site is hosted on Cloudflare, which handles every request, including your IP address, to deliver the pages and protect the site.</li>
            <li>The Ko-fi &quot;Buy me a coffee&quot; button image is loaded from Ko-fi&apos;s servers, so Ko-fi receives your IP address and browser details when a page shows it. Anything you do on Ko-fi itself is covered by Ko-fi&apos;s privacy policy.</li>
            <li>Links to sources (for example Instituto Cervantes) only take you to those sites when you click them.</li>
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>05</p>
        <div className={styles.sectionBody}>
          <h2>Deleting your data</h2>
          <ul>
            <li>Menu &gt; Settings &gt; <strong>Reset all progress</strong> removes your progress and settings from this device.</li>
            <li>Clearing this site&apos;s data in your browser removes everything, including the theme cookie and your analytics choice.</li>
            <li>To remove analytics cookies, choose Reject under <ConsentSettingsButton className="consent-settings-link" />.</li>
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>06</p>
        <div className={styles.sectionBody}>
          <h2>Your rights</h2>
          <p>
            You can ask for access to, correction or deletion of your personal data, restrict or object to its use,
            ask for a copy, and withdraw consent at any time. Write to <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
            Because we hold no account or profile, analytics data can only be matched to you through the tools
            themselves. You can also complain to the Spanish data protection authority, the Agencia Española de
            Protección de Datos (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">aepd.es</a>).
          </p>
        </div>
      </section>
    </main>
  );
}
