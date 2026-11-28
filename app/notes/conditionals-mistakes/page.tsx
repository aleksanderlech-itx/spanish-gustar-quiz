import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../site-header";
import { SITE_CONFIG } from "../../site-config";
import styles from "../../prose-page.module.css";

const TITLE = "Spanish Conditionals: Si Clauses and 4 Common Mistakes";
const DESCRIPTION = "The three kinds of Spanish si clause in one table, the polite conditional, the twelve irregular stems, and the four mistakes that keep coming back, starting with the conditional after si.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/notes/conditionals-mistakes",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Spanish conditionals: si clauses and 4 common mistakes",
  description: DESCRIPTION,
  url: `${SITE_CONFIG.url}/notes/conditionals-mistakes`,
  inLanguage: "en",
  isPartOf: { "@type": "WebSite", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
};

const TYPES = [
  { type: "Real", meaning: "It can easily happen", si: "si + present", result: "future, present or an order", example: "Si tengo tiempo, iré." },
  { type: "Imagined", meaning: "Unlikely now, or not true", si: "si + imperfect subjunctive", result: "conditional", example: "Si tuviera tiempo, iría." },
  { type: "Past unreal", meaning: "It did not happen", si: "si + hubiera + participle", result: "habría + participle", example: "Si hubiera tenido tiempo, habría ido." },
];

const STEMS = [
  ["poder", "podría"], ["tener", "tendría"], ["hacer", "haría"], ["decir", "diría"], ["querer", "querría"], ["saber", "sabría"],
  ["salir", "saldría"], ["venir", "vendría"], ["poner", "pondría"], ["haber", "habría"], ["caber", "cabría"], ["valer", "valdría"],
];

export default function ConditionalsMistakesPost() {
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SiteHeader />

      <section className={styles.intro}>
        <p className={styles.eyebrow}>Notes</p>
        <h1>Spanish conditionals: si clauses and 4 common mistakes</h1>
        <p className={styles.lead}>
          A conditional sentence has two halves: the si clause sets the condition, and the result follows from it. The
          tense after si tells the listener how likely the condition is. Learn the three patterns below, then the four
          mistakes that trip learners up.
        </p>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>01</p>
        <div className={styles.sectionBody}>
          <h2>The three types</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr><th scope="col">Type</th><th scope="col">Si clause</th><th scope="col">Result</th><th scope="col">Example</th></tr>
              </thead>
              <tbody>
                {TYPES.map((row) => (
                  <tr key={row.type}>
                    <th scope="row">{row.type}<br />{row.meaning}</th>
                    <td>{row.si}</td>
                    <td>{row.result}</td>
                    <td lang="es">{row.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Either half can come first: iré si tengo tiempo means the same as si tengo tiempo, iré. Only the order
            changes, never the tenses. When the si clause comes first, a comma separates the halves.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>02</p>
        <div className={styles.sectionBody}>
          <h2>The polite conditional</h2>
          <p>
            The conditional also works on its own, with no si at all, to soften a request or a wish: ¿podrías ayudarme?,
            me gustaría un café, querría reservar una mesa, ¿le importaría esperar un momento? It sounds more polite
            than the present, the way could you and I would like do in English.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>03</p>
        <div className={styles.sectionBody}>
          <h2>The twelve irregular stems</h2>
          <p>
            The conditional is the whole infinitive plus -ía, -ías, -ía, -íamos, -ían: hablaría, comerías, viviríamos.
            Twelve common verbs shorten the stem first, the same stem as in the future. The endings never change.
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr><th scope="col">Infinitive</th><th scope="col">Conditional</th><th scope="col">Infinitive</th><th scope="col">Conditional</th></tr>
              </thead>
              <tbody>
                {STEMS.slice(0, 6).map(([infinitive, form], index) => (
                  <tr key={infinitive}>
                    <td lang="es">{infinitive}</td><td lang="es">{form}</td>
                    <td lang="es">{STEMS[index + 6][0]}</td><td lang="es">{STEMS[index + 6][1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>04</p>
        <div className={styles.sectionBody}>
          <h2>Mistake 1: the conditional or the future after si</h2>
          <p>
            English says if I would have and Spanish learners carry it over: si tendría dinero. After si, Spanish never
            uses the conditional or the future. The conditional belongs in the other half: si tuviera dinero, viajaría.
            The same goes for the past: si hubiera sabido, never si habría sabido.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>05</p>
        <div className={styles.sectionBody}>
          <h2>Mistake 2: the present subjunctive after si</h2>
          <p>
            Si never takes the present subjunctive: si tenga tiempo is wrong. A real condition uses the plain present
            (si tengo tiempo), an imagined one the imperfect subjunctive (si tuviera tiempo).
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>06</p>
        <div className={styles.sectionBody}>
          <h2>Mistake 3: mixing the types</h2>
          <p>
            Each si tense has its own partner. Si tengo tiempo goes with iré, not iría. Si tuviera tiempo goes with
            iría, not iré. If you can picture the condition happening, use the real type; if you are imagining it,
            the imagined one. Si yo fuera tú and si tuviera alas can never be real, so they always take the
            imperfect subjunctive.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionNumber}>07</p>
        <div className={styles.sectionBody}>
          <h2>Mistake 4: regularising the stem</h2>
          <p>
            Podería, tenería, hacería and querería do not exist. Check the infinitive against the list of twelve: if it
            is there, shorten the stem (podría, tendría, haría, querría); if not, add -ía to the whole infinitive.
          </p>
          <p>
            One more note: in a past unreal sentence, hubiera is also used in the result: si hubiera sabido, hubiera
            venido is as correct as habría venido. The quiz asks for habría there so that the two halves stay easy to
            tell apart.
          </p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Ready to practise?</p>
        <Link href="/conditionals">Try the conditionals quiz</Link>
      </footer>
    </main>
  );
}
