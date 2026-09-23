import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../site-header";
import { SITE_CONFIG } from "../../site-config";
import styles from "../../prose-page.module.css";

const TITLE = "Preterite vs Imperfect: the Words That Give It Away";
const DESCRIPTION = "The time words that point to the preterite or the imperfect, ayer, de repente, cada, mientras, and when not to trust them.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/notes/preterite-vs-imperfect-signal-words",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Preterite vs imperfect: the words that give it away",
  description: DESCRIPTION,
  url: `${SITE_CONFIG.url}/notes/preterite-vs-imperfect-signal-words`,
  inLanguage: "en",
  isPartOf: { "@type": "WebSite", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
};

export default function PreteriteImperfectSignalWordsPost() {
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SiteHeader />

      <section className={styles.intro}>
        <p className={styles.eyebrow}>Notes</p>
        <h1>Preterite vs imperfect: the words that give it away</h1>
        <p className={styles.lead}>
          Most sentences in the preterite vs imperfect quiz carry a small time word that tells you which tense to use.
          Learning to spot those words is the fastest way to stop guessing.
        </p>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>01</p>
        <div className={styles.sectionBody}>
          <h2>Words that point to one finished event</h2>
          <p>
            Ayer, anoche, el sábado, una vez, de repente. These pin an action to a specific moment and treat it as done,
            which is the preterite&apos;s job. Ayer fui al mercado. De repente, el tren llegó a la estación. Sequences
            work the same way: primero, luego, después and finalmente line up a chain of completed actions, each one in
            the preterite.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>02</p>
        <div className={styles.sectionBody}>
          <h2>Words that point to a habit</h2>
          <p>
            Cada tarde, todos los días, siempre, normalmente, de niño. These describe something that happened over and
            over without a clear start or end, which calls for the imperfect. De niño, iba al parque cada tarde.
            Normalmente salíamos temprano para la escuela. If you could say used to in English, the imperfect is
            almost always right.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>03</p>
        <div className={styles.sectionBody}>
          <h2>Mientras sets the scene</h2>
          <p>
            Mientras introduces an action that was already in progress, so the verb after it goes in the imperfect.
            When something interrupts that action, the interruption goes in the preterite: Mientras Marta preparaba la
            cena, sonó el teléfono. The imperfect is the background, the preterite is the event that breaks into it.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>04</p>
        <div className={styles.sectionBody}>
          <h2>When the clue word misleads you</h2>
          <p>
            Signal words are hints, not rules. Ayer hacía frío uses the imperfect even though ayer usually points to
            the preterite, because the sentence describes the weather as a background condition rather than reporting
            an event. Descriptions of age, appearance, weather and feelings lean towards the imperfect whatever time
            word comes with them.
          </p>
          <p>
            So spot the word first, then ask one more question: is this sentence telling you what happened, or
            describing what things were like? The first is the preterite, the second is the imperfect.
          </p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Ready to practise?</p>
        <Link href="/preterite-vs-imperfect">Try the preterite vs imperfect quiz</Link>
      </footer>
    </main>
  );
}
