import { QUIZ_CONTENT } from "./quiz-content";
import type { QuizId } from "./quiz-config";
import styles from "./topic-explainer.module.css";

export default function TopicExplainer({ quizId }: { quizId: QuizId }) {
  const content = QUIZ_CONTENT[quizId];

  return (
    <section className={styles.wrap} aria-labelledby={`${quizId}-explainer-heading`}>
      <h2 className={styles.heading} id={`${quizId}-explainer-heading`}>How this works</h2>
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
