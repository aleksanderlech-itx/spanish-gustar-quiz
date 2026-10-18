import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../site-header";
import { SITE_CONFIG } from "../../site-config";
import styles from "../../prose-page.module.css";

const TITLE = "4 Mistakes Learners Make with Object Pronouns";
const DESCRIPTION = "Four object pronoun mistakes that keep coming back, direct vs indirect, gender and number, placement and le turning into se.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/notes/object-pronouns-mistakes",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "4 mistakes learners make with object pronouns",
  description: DESCRIPTION,
  url: `${SITE_CONFIG.url}/notes/object-pronouns-mistakes`,
  inLanguage: "en",
  isPartOf: { "@type": "WebSite", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
};

export default function ObjectPronounsMistakesPost() {
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SiteHeader />

      <section className={styles.intro}>
        <p className={styles.eyebrow}>Notes</p>
        <h1>4 mistakes learners make with object pronouns</h1>
        <p className={styles.lead}>
          Object pronouns save you from repeating nouns, but they come with small rules that are easy to forget
          mid-sentence. Here are four mistakes that come up again and again.
        </p>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>01</p>
        <div className={styles.sectionBody}>
          <h2>Mixing up direct and indirect</h2>
          <p>
            Direct pronouns (me, te, lo, la, nos, los, las) replace what receives the action. Indirect pronouns (me,
            te, le, nos, les) replace who receives or benefits from it. Veo a Ana becomes La veo, because Ana is what
            I see. Le doy el libro a Ana becomes Le doy el libro, because Ana is who gets the book. Ask what the verb
            is doing and to whom.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>02</p>
        <div className={styles.sectionBody}>
          <h2>Ignoring gender and number</h2>
          <p>
            A direct pronoun agrees with the noun it replaces, not with the speaker. Compro las manzanas becomes Las
            compro, not Lo compro. One masculine noun gives lo, one feminine noun gives la, and more than one gives
            los or las. Many learners default to lo for everything.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>03</p>
        <div className={styles.sectionBody}>
          <h2>Putting the pronoun in the wrong place</h2>
          <p>
            Before a conjugated verb, the pronoun goes in front: Lo quiero comprar. With an infinitive or a gerund
            you can also attach it: Quiero comprarlo, Estoy comprándolo. Never put it between the two verbs as a
            separate word. Note that attaching it to a gerund needs a written accent.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>04</p>
        <div className={styles.sectionBody}>
          <h2>Writing le lo instead of se lo</h2>
          <p>
            When two pronouns meet, the indirect one goes first. If it would be le or les, it becomes se. So Le lo
            doy is wrong. Say Se lo doy. Les doy las llaves becomes Se las doy. Because se can stand for many people,
            context or a phrase such as a Ana tells you who it means.
          </p>
          <p>
            None of these are hard once you slow down and ask what the verb is doing. Practising with full sentences
            usually makes the choice automatic.
          </p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Ready to practise?</p>
        <Link href="/object-pronouns">Try the object pronouns quiz</Link>
      </footer>
    </main>
  );
}
