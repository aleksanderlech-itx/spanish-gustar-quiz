import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../site-header";
import { SITE_CONFIG } from "../../site-config";
import styles from "../../prose-page.module.css";

const TITLE = "Spanish Word Order: Questions, Negatives and Pronouns";
const DESCRIPTION = "Where no, object pronouns and question words go in a Spanish sentence, and the few places where the order is free.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/notes/spanish-word-order",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Spanish word order: questions, negatives and pronouns",
  description: DESCRIPTION,
  url: `${SITE_CONFIG.url}/notes/spanish-word-order`,
  inLanguage: "en",
  isPartOf: { "@type": "WebSite", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
};

export default function SpanishWordOrderPost() {
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SiteHeader />

      <section className={styles.intro}>
        <p className={styles.eyebrow}>Notes</p>
        <h1>Spanish word order: questions, negatives and pronouns</h1>
        <p className={styles.lead}>
          Spanish word order is freer than English in some places and stricter in others. Most mistakes come from
          four small words that have a fixed spot: no, the object pronouns, the question word and haber.
        </p>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>01</p>
        <div className={styles.sectionBody}>
          <h2>No goes right before the verb</h2>
          <p>
            English puts not after a helper verb: I do not see. Spanish has no helper, so no sits straight before the
            conjugated verb: No veo ninguna diferencia. Spanish also keeps no when another negative word follows, so
            no veo nada is right and veo nada is not. If the negative word comes first, it replaces no: Nadie comió el
            pastel, Nunca he salido de Boston.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>02</p>
        <div className={styles.sectionBody}>
          <h2>Object pronouns go before the conjugated verb</h2>
          <p>
            Me, te, lo, la, le, nos and their plurals come right before a conjugated verb: Te eché de menos, Lo guardo
            en el ático. With two pronouns the indirect one comes first, and le or les turns into se before lo or la:
            Se lo explicaré a ella. In a negative command they stay in front too: No se lo digas. With an infinitive
            they can also attach to the end of it, as in decirte, but never sit between two verbs as a separate word.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>03</p>
        <div className={styles.sectionBody}>
          <h2>Questions start with the question word, then the verb</h2>
          <p>
            Spanish has no do or did in questions. The question word comes first and the verb follows it at once,
            usually before the subject: ¿Dónde están los tenedores?, ¿Cómo se llama tu hermana? Quién, qué, dónde,
            cuándo and por qué all work the same way.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>04</p>
        <div className={styles.sectionBody}>
          <h2>Haber and its participle stay together</h2>
          <p>
            In he comido or ha sido nothing goes between the two words. English says I have always been, but Spanish
            puts the adverb before or after the pair: Mi hijo siempre ha sido muy independiente, or ha sido siempre.
            The same goes for a pronoun, which comes before haber: Te he visto.
          </p>
          <p>
            Time words such as ayer, todavía and siempre are where Spanish is free: Ayer estuve en Boston and Estuve
            en Boston ayer are both right. Practising with real sentences is the quickest way to feel which words are
            fixed and which can move.
          </p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Ready to practise?</p>
        <Link href="/sentence-builder">Try Sentence Builder</Link>
      </footer>
    </main>
  );
}
