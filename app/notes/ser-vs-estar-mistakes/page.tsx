import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../site-header";
import { SITE_CONFIG } from "../../site-config";
import styles from "../../prose-page.module.css";

const TITLE = "3 Mistakes Learners Make with Ser vs Estar";
const DESCRIPTION = "Three ser vs estar mistakes that keep coming back even after you know the rule, professions, location and adjectives that change meaning.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/notes/ser-vs-estar-mistakes",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "3 mistakes learners make with ser vs estar",
  description: DESCRIPTION,
  url: `${SITE_CONFIG.url}/notes/ser-vs-estar-mistakes`,
  inLanguage: "en",
  isPartOf: { "@type": "WebSite", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
};

export default function SerEstarMistakesPost() {
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SiteHeader />

      <section className={styles.intro}>
        <p className={styles.eyebrow}>Notes</p>
        <h1>3 mistakes learners make with ser vs estar</h1>
        <p className={styles.lead}>
          Ser and estar look simple once someone explains the rule to you, then you start writing your own sentences
          and the mistakes creep back in anyway. Here are three that come up again and again.
        </p>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>01</p>
        <div className={styles.sectionBody}>
          <h2>Using estar for professions</h2>
          <p>
            A common one. Ella está doctora feels intuitive if you are thinking in English, since a job can change
            over time. But Spanish treats professions as identity rather than state, so it takes ser: Ella es
            doctora. The same goes for nationality, religion and relationships, ser covers all of them even though
            none of these things are permanently fixed.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>02</p>
        <div className={styles.sectionBody}>
          <h2>Forgetting that location always takes estar</h2>
          <p>
            Even confident learners sometimes reach for ser when describing where something is, especially for
            buildings and places that feel permanent. El museo es cerca de la estación looks fine on paper, it is
            wrong. Location, whether temporary or permanent, always takes estar: El museo está cerca de la estación.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>03</p>
        <div className={styles.sectionBody}>
          <h2>Missing the adjectives that change meaning</h2>
          <p>
            A small group of adjectives mean something different depending on which verb carries them. Ser lista
            means someone is clever, estar lista means someone is ready. Ser aburrido describes a boring person or
            thing, estar aburrido describes someone who is bored right now. These do not really follow a rule, they
            need to be learned one at a time.
          </p>
          <p>
            None of these mistakes are really about grammar rules. They are habits from English that take a while to
            unlearn, and practising with real sentences instead of memorising a list is usually what finally makes it
            stick.
          </p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Ready to practise?</p>
        <Link href="/ser-vs-estar">Try the ser vs estar quiz</Link>
      </footer>
    </main>
  );
}
