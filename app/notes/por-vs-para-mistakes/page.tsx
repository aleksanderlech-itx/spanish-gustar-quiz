import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../site-header";
import { SITE_CONFIG } from "../../site-config";
import styles from "../../prose-page.module.css";

const TITLE = "4 Mistakes Learners Make with Por vs Para";
const DESCRIPTION = "Four por vs para mistakes English speakers make because both translate as for, duration, thanks, prices and movement through a place.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/notes/por-vs-para-mistakes",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "4 mistakes learners make with por vs para",
  description: DESCRIPTION,
  url: `${SITE_CONFIG.url}/notes/por-vs-para-mistakes`,
  inLanguage: "en",
  isPartOf: { "@type": "WebSite", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
};

export default function PorParaMistakesPost() {
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SiteHeader />

      <section className={styles.intro}>
        <p className={styles.eyebrow}>Notes</p>
        <h1>4 mistakes learners make with por vs para</h1>
        <p className={styles.lead}>
          Most of the trouble with por and para comes from English, where both are usually translated as for. These
          four uses of for are where learners pick the wrong one most often.
        </p>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>01</p>
        <div className={styles.sectionBody}>
          <h2>Using para for a length of time</h2>
          <p>
            I studied for two hours sounds like a job for para, but a length of time takes por: Estudié por dos horas.
            In everyday speech the por is often dropped altogether, estudié dos horas, which is a good sign that para
            was never the right choice. Para with time means a deadline instead: La tarea es para el lunes, the homework
            is due Monday.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>02</p>
        <div className={styles.sectionBody}>
          <h2>Saying gracias para</h2>
          <p>
            Thanking someone for something is about the reason behind the thanks, and reasons take por. Gracias por tu
            ayuda, te doy las gracias por todo. The same goes for apologising and worrying: se disculpó por su error,
            está preocupada por los exámenes.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>03</p>
        <div className={styles.sectionBody}>
          <h2>Using para for a price</h2>
          <p>
            I paid ten euros for the taxi is an exchange, money given in return for something, and exchanges take por:
            Pagué diez euros por el taxi. The same pattern covers trades, cambié mi coche viejo por uno nuevo. Para
            only appears when you mean who or what the thing is for: Compré flores para mi madre.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>04</p>
        <div className={styles.sectionBody}>
          <h2>Mixing up through and towards</h2>
          <p>
            Caminamos por el parque means you walked through or around the park. Caminamos para el parque means you
            walked towards it, with the park as your destination. Both are correct Spanish, they just describe
            different walks, so the choice depends on whether you are moving inside a place or heading for it.
          </p>
          <p>
            A rough rule that covers all four: para points forward, to a goal, a destination, a deadline or a
            recipient. Por looks back at a cause, or describes an exchange, a duration or a route.
          </p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Ready to practise?</p>
        <Link href="/por-vs-para">Try the por vs para quiz</Link>
      </footer>
    </main>
  );
}
