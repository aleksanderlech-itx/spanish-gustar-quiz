import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../site-header";
import { SITE_CONFIG } from "../../site-config";
import styles from "../../prose-page.module.css";

const TITLE = "4 Mistakes Learners Make with Saber vs Conocer";
const DESCRIPTION = "Four saber vs conocer mistakes English speakers make because both translate as to know, facts, skills, people and the past-tense meanings found out and met.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/notes/saber-vs-conocer-mistakes",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "4 mistakes learners make with saber vs conocer",
  description: DESCRIPTION,
  url: `${SITE_CONFIG.url}/notes/saber-vs-conocer-mistakes`,
  inLanguage: "en",
  isPartOf: { "@type": "WebSite", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
};

export default function SaberConocerMistakesPost() {
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SiteHeader />

      <section className={styles.intro}>
        <p className={styles.eyebrow}>Notes</p>
        <h1>4 mistakes learners make with saber vs conocer</h1>
        <p className={styles.lead}>
          English has one verb for knowing, Spanish has two. Saber is for facts and skills, conocer is for people,
          places and things you are familiar with. These are the four places where that split trips learners up most.
        </p>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>01</p>
        <div className={styles.sectionBody}>
          <h2>Using conocer for a fact</h2>
          <p>
            I know where she lives is a piece of information, and information takes saber: Sé dónde vive. The same goes
            for anything introduced by que, si or a question word, sé que tienes razón, no sé si viene, ¿sabes qué hora
            es? Conocer never comes before que or a question word, so if the next word is que, dónde, cuándo or cómo,
            the answer is saber.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>02</p>
        <div className={styles.sectionBody}>
          <h2>Adding cómo to a skill</h2>
          <p>
            I know how to swim is just Sé nadar. Saber followed directly by an infinitive already means knowing how to
            do something, so there is no need for cómo. Learners translating word for word often say sé cómo nadar,
            which sounds like you know the technique in theory rather than that you can swim. And conocer is never
            followed by an infinitive in this sense, so conozco nadar is always wrong.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>03</p>
        <div className={styles.sectionBody}>
          <h2>Dropping the a before a person</h2>
          <p>
            Knowing a person takes conocer, and a person as the direct object takes the personal a: Conozco a Ana,
            ¿conoces al profesor? Saying conozco Ana leaves out the a, and sé a Ana uses the wrong verb altogether, you
            can know facts about Ana, sé dónde vive Ana, but the person herself is always conocer. Places don&apos;t take
            the a: Conozco Madrid.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>04</p>
        <div className={styles.sectionBody}>
          <h2>Missing the past-tense shift to met and found out</h2>
          <p>
            In the preterite, both verbs describe a moment rather than a state. Conocí a tu hermana ayer means I met your
            sister yesterday, and supe la noticia ayer means I found out the news yesterday. Learners often reach for
            the imperfect here, conocía, sabía, but those keep the ordinary meaning of knew: Ya conocía a tu hermana, I
            already knew your sister. So to say met or found out, use the preterite, and to say already knew, use the
            imperfect.
          </p>
          <p>
            A quick test that covers all four: if you could replace know with know that, know how to or know the answer,
            it&apos;s saber. If you could replace it with be acquainted with, have been to or be familiar with, it&apos;s
            conocer.
          </p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Ready to practise?</p>
        <Link href="/saber-vs-conocer">Try the saber vs conocer quiz</Link>
      </footer>
    </main>
  );
}
