import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../site-header";
import { SITE_CONFIG } from "../../site-config";
import styles from "../../prose-page.module.css";

const TITLE = "4 Mistakes Learners Make with the Present Perfect";
const DESCRIPTION = "Four present perfect mistakes that keep coming back: using tener instead of haber, regularising irregular participles, making the participle agree and splitting haber from it.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/notes/present-perfect-mistakes",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "4 mistakes learners make with the present perfect",
  description: DESCRIPTION,
  url: `${SITE_CONFIG.url}/notes/present-perfect-mistakes`,
  inLanguage: "en",
  isPartOf: { "@type": "WebSite", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
};

export default function PresentPerfectMistakesPost() {
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SiteHeader />

      <section className={styles.intro}>
        <p className={styles.eyebrow}>Notes</p>
        <h1>4 mistakes learners make with the present perfect</h1>
        <p className={styles.lead}>
          The Spanish present perfect looks just like the English one: an auxiliary plus a participle. That similarity
          is exactly where most mistakes come from. Here are the four that come up again and again.
        </p>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>01</p>
        <div className={styles.sectionBody}>
          <h2>Using tener for have</h2>
          <p>
            English uses have for both owning and the perfect, so tengo comido feels natural. In Spanish only haber
            forms the perfect: he comido, has visto, ha llegado, hemos terminado, habéis salido, han vuelto. Tener
            means to own (tengo un coche) or to have to (tengo que salir), and never forms a tense.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>02</p>
        <div className={styles.sectionBody}>
          <h2>Regularising irregular participles</h2>
          <p>
            Most participles are regular: hablado, comido, vivido. A small group is not, and they are some of the most
            common verbs: abierto, dicho, escrito, hecho, muerto, puesto, roto, visto and vuelto. Abrido, decido and
            hacido do not exist. Verbs built on these follow them: descubierto, devuelto, propuesto, deshecho.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>03</p>
        <div className={styles.sectionBody}>
          <h2>Making the participle agree</h2>
          <p>
            After haber the participle never changes: ella ha llegado, nosotras hemos terminado, las hemos invitado.
            Learners who know that participles agree as adjectives (la puerta está abierta) often carry that over and
            write ella ha llegada. With haber, the participle always ends in -o.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>04</p>
        <div className={styles.sectionBody}>
          <h2>Splitting haber from the participle</h2>
          <p>
            In English you can say I have already eaten or I have never seen it. In Spanish nothing goes between haber
            and the participle. Pronouns, no, ya and nunca all go before haber: ya he comido, nunca lo he visto, no me
            he duchado. He ya comido and he lo visto are wrong.
          </p>
          <p>
            One more note: much of Latin America uses the preterite where Spain uses the present perfect, so hoy comí
            paella is correct there. Both are standard Spanish.
          </p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Ready to practise?</p>
        <Link href="/present-perfect">Try the present perfect quiz</Link>
      </footer>
    </main>
  );
}
