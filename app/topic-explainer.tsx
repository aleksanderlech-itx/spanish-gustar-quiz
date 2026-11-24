import type { QuizContent } from "./quiz-content";
import styles from "./topic-explainer.module.css";

/** The "How this works" section of an Activity's page. `id` names the heading so a link can jump to it. */
export default function TopicExplainer({ id, content }: { id: string; content: QuizContent }) {
  return (
    <section className={styles.wrap} aria-labelledby={`${id}-explainer-heading`}>
      <h2 className={styles.heading} id={`${id}-explainer-heading`}>How this works</h2>
      {content.paragraphs.map((paragraph, index) => (
        <p className={styles.paragraph} key={index}>{paragraph}</p>
      ))}

      <h3 className={styles.examplesHeading}>Example sentences</h3>
      <ul className={styles.examples}>
        {content.examples.map((example) => (
          <li key={example.es}>
            <span className={styles.exampleEs} lang="es">{example.es}</span>
            <span className={styles.exampleEn} lang="en">{example.en}</span>
          </li>
        ))}
      </ul>

      <h3 className={styles.faqHeading}>Questions people ask</h3>
      {content.faq.map((item) => (
        <details className={styles.faqItem} key={item.question}>
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </section>
  );
}
