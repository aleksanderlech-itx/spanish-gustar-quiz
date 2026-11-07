import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../site-header";
import { SITE_CONFIG } from "../../site-config";
import styles from "../../prose-page.module.css";

const TITLE = "4 Mistakes Learners Make with the Present Continuous";
const DESCRIPTION = "Four present continuous mistakes that keep coming back: using ser instead of estar, regularising irregular gerunds, putting the pronoun in the wrong place and translating every -ing with a gerund.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/notes/present-continuous-mistakes",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "4 mistakes learners make with the present continuous",
  description: DESCRIPTION,
  url: `${SITE_CONFIG.url}/notes/present-continuous-mistakes`,
  inLanguage: "en",
  isPartOf: { "@type": "WebSite", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
};

export default function PresentContinuousMistakesPost() {
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SiteHeader />

      <section className={styles.intro}>
        <p className={styles.eyebrow}>Notes</p>
        <h1>4 mistakes learners make with the present continuous</h1>
        <p className={styles.lead}>
          Estoy leyendo looks just like I am reading, and most of the time it works the same way. The mistakes come
          from the few places where Spanish and English part company. Here are the four that come up again and again.
        </p>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>01</p>
        <div className={styles.sectionBody}>
          <h2>Using ser for am, is and are</h2>
          <p>
            English has one verb to be, so soy leyendo can feel natural. The continuous is always estar plus the
            gerund: estoy leyendo, estás comiendo, está lloviendo, estamos trabajando, estáis jugando, están durmiendo.
            Ser never forms it, in any region.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>02</p>
        <div className={styles.sectionBody}>
          <h2>Regularising irregular gerunds</h2>
          <p>
            Most gerunds are regular: hablando, comiendo, viviendo. Many -ir verbs change their stem, e to i or o to u:
            pidiendo, diciendo, siguiendo, durmiendo, muriendo. When the stem ends in a vowel, the i of -iendo becomes
            y: leyendo, oyendo, cayendo, construyendo. Ir gives yendo. Pediendo, dormiendo and leiendo do not exist.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>03</p>
        <div className={styles.sectionBody}>
          <h2>Putting the pronoun in the wrong place</h2>
          <p>
            A pronoun has two homes: before estar (lo estoy leyendo, me estoy duchando) or attached to the end of the
            gerund (estoy leyéndolo, estoy duchándome). Both are correct. It never goes between the two words, so estoy
            lo leyendo is wrong, and it never appears twice. Once attached, the gerund needs a written accent to keep
            its stress: leyéndolo, not leyendolo.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>04</p>
        <div className={styles.sectionBody}>
          <h2>Translating every -ing with a gerund</h2>
          <p>
            English uses -ing for activities as nouns and after prepositions: swimming is fun, before eating, I love
            reading. Spanish uses the infinitive in all of these: nadar es divertido, antes de comer, me encanta leer.
            The gerund only goes after estar and a few verbs like seguir.
          </p>
          <p>
            One more note: the simple present can also describe what is happening now, so ahora leo is correct too.
            The continuous just stresses that the action is in progress.
          </p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Ready to practise?</p>
        <Link href="/present-continuous">Try the present continuous quiz</Link>
      </footer>
    </main>
  );
}
