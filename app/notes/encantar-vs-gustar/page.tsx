import type { Metadata } from "next";
import Link from "next/link";
import Logo from "../../logo";
import { SITE_CONFIG } from "../../site-config";
import styles from "../../prose-page.module.css";

const TITLE = "Encantar vs Gustar: What Is the Difference";
const DESCRIPTION = "Encantar and gustar share the same grammar. The real difference is strength, not structure, here is how to pick between them.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/notes/encantar-vs-gustar",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Encantar vs gustar: what is the difference",
  description: DESCRIPTION,
  url: `${SITE_CONFIG.url}/notes/encantar-vs-gustar`,
  inLanguage: "en",
  isPartOf: { "@type": "WebSite", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
};

export default function EncantarVsGustarPost() {
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className={styles.header}>
        <Link className={styles.back} href="/notes" aria-label="Back to notes">
          <span aria-hidden="true">←</span>
          <span>Back to notes</span>
        </Link>
        <div className={styles.brand}>
          <Logo size={26} />
          <span>Spanish Quizzes</span>
        </div>
      </header>

      <section className={styles.intro}>
        <p className={styles.eyebrow}>Notes</p>
        <h1>Encantar vs gustar: what is the difference</h1>
        <p className={styles.lead}>
          Encantar and gustar follow the exact same grammatical pattern, so once you have gustar down, encantar is
          mostly a vocabulary question rather than a grammar one.
        </p>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>01</p>
        <div className={styles.sectionBody}>
          <h2>Same structure, different strength</h2>
          <p>
            Both verbs put the thing being liked in the subject position and the person doing the liking as an
            indirect object. Me gusta el café and me encanta el café are built exactly the same way, gusta becomes
            gustan and encanta becomes encantan depending on whether the subject is singular or plural, same as
            always.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>02</p>
        <div className={styles.sectionBody}>
          <h2>Gustar is closer to like</h2>
          <p>
            Me gusta el café translates naturally as I like coffee. It is a normal, everyday statement of preference
            and it covers most situations without sounding too strong or too weak.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>03</p>
        <div className={styles.sectionBody}>
          <h2>Encantar is closer to love</h2>
          <p>
            Me encanta el café is stronger, closer to I love coffee or coffee is my favourite. English speakers
            sometimes reach for gustar everywhere because it is the first verb they learn. Native speakers use
            encantar constantly for anything they genuinely enjoy, not just things they merely like.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>04</p>
        <div className={styles.sectionBody}>
          <h2>A quick way to choose</h2>
          <p>
            If you would say I really love this in English, reach for encantar. If it is more of a mild preference,
            gustar does the job. Either way the sentence structure does not change, so once you can build one you can
            build the other.
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
