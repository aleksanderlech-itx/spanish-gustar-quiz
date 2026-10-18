import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../site-header";
import { SITE_CONFIG } from "../../site-config";
import styles from "../../prose-page.module.css";

const TITLE = "3 Mistakes Learners Make with Reflexive Verbs";
const DESCRIPTION = "Three reflexive verb mistakes that keep coming back, dropping the pronoun, matching it to the subject and verbs that change meaning with se.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/notes/reflexive-verbs-mistakes",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "3 mistakes learners make with reflexive verbs",
  description: DESCRIPTION,
  url: `${SITE_CONFIG.url}/notes/reflexive-verbs-mistakes`,
  inLanguage: "en",
  isPartOf: { "@type": "WebSite", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
};

export default function ReflexiveVerbsMistakesPost() {
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SiteHeader />

      <section className={styles.intro}>
        <p className={styles.eyebrow}>Notes</p>
        <h1>3 mistakes learners make with reflexive verbs</h1>
        <p className={styles.lead}>
          A reflexive verb turns the action back on the subject. The idea is simple, but in practice the pronoun gets
          forgotten, mismatched or misplaced. Here are three mistakes that come up again and again.
        </p>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>01</p>
        <div className={styles.sectionBody}>
          <h2>Dropping the pronoun</h2>
          <p>
            Yo levanto a las siete sounds fine if you think in English, where I get up has no extra word. In Spanish
            the pronoun is required: Yo me levanto a las siete. This covers daily routines such as levantarse,
            ducharse and vestirse. With body parts, use the article, not a possessive: Me lavo las manos, not Me lavo
            mis manos.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>02</p>
        <div className={styles.sectionBody}>
          <h2>Not matching the pronoun to the subject</h2>
          <p>
            The pronoun mirrors the person doing the action: me, te, se, nos, os, se. Nosotros me levantamos is
            wrong. Say Nos levantamos. With an infinitive you can put the pronoun before the first verb or attach it
            to the infinitive, and it still has to match the subject: Me voy a levantar or Voy a levantarme. Voy a
            levantarte changes who is getting up.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>03</p>
        <div className={styles.sectionBody}>
          <h2>Missing verbs that change meaning with se</h2>
          <p>
            Some verbs mean something different when they are reflexive. Ir means to go, irse means to leave: Voy a la
            fiesta, but Me voy de la fiesta. Dormir means to sleep, dormirse means to fall asleep: Mi hermano durmió
            ocho horas, but Mi hermano se durmió en el sofá. Acordar means to agree, acordarse de means to remember:
            Me acuerdo de ti. These need to be learned one at a time.
          </p>
          <p>
            Most of these mistakes are English habits. Short, regular practice with real sentences is what makes the
            pronoun feel natural.
          </p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Ready to practise?</p>
        <Link href="/reflexive-verbs">Try the reflexive verbs quiz</Link>
      </footer>
    </main>
  );
}
