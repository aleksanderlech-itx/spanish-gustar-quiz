import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../site-header";
import { SITE_CONFIG } from "../../site-config";
import styles from "../../prose-page.module.css";

const TITLE = "3 Mistakes Learners Make with Gustar";
const DESCRIPTION = "Three gustar mistakes that keep coming back, matching the verb to the person, pluralising infinitives and dropping the pronoun after a name.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/notes/gustar-mistakes",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "3 mistakes learners make with gustar",
  description: DESCRIPTION,
  url: `${SITE_CONFIG.url}/notes/gustar-mistakes`,
  inLanguage: "en",
  isPartOf: { "@type": "WebSite", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
};

export default function GustarMistakesPost() {
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SiteHeader />

      <section className={styles.intro}>
        <p className={styles.eyebrow}>Notes</p>
        <h1>3 mistakes learners make with gustar</h1>
        <p className={styles.lead}>
          Gustar works backwards compared to English, so even learners who know the pattern slip back into English
          habits when they write their own sentences. These three are the ones the gustar quiz is built around.
        </p>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>01</p>
        <div className={styles.sectionBody}>
          <h2>Matching the verb to the person instead of the thing</h2>
          <p>
            In English the person likes, so it is tempting to conjugate gustar for the person too. But in Spanish the
            thing being liked is the subject, and the verb agrees with it. Me gusta el café, one coffee, so gusta. Me
            gustan los conciertos, several concerts, so gustan. The person only shows up in the pronoun, me, te, le,
            nos, os or les, and never changes the verb ending.
          </p>
          <p>
            A quick check: cover the pronoun and look at what comes after the verb. If it is plural, the verb is
            gustan. If it is singular, it is gusta.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>02</p>
        <div className={styles.sectionBody}>
          <h2>Pluralising the verb for a list of activities</h2>
          <p>
            When the thing you like is an activity, an infinitive like bailar or viajar, the verb stays singular. That
            holds even when you list several of them: Me gusta bailar y cantar, not me gustan bailar y cantar. Only
            nouns make the verb plural, so me gustan los viajes but me gusta viajar.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>03</p>
        <div className={styles.sectionBody}>
          <h2>Dropping the pronoun after a name</h2>
          <p>
            When you name the person, a Marta or a mis padres, it feels like the pronoun has become redundant. Spanish
            keeps it anyway: A Marta le gusta el café, not a Marta gusta el café. And the pronoun has to match the
            number of people, so a mis padres les gustan las ciudades pequeñas, with les rather than le.
          </p>
          <p>
            The a phrase is optional, the pronoun is not. You can say le gusta el café on its own, but you cannot say a
            Marta gusta el café.
          </p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Ready to practise?</p>
        <Link href="/gustar">Try the gustar quiz</Link>
      </footer>
    </main>
  );
}
