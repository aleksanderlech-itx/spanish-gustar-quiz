import type { Metadata } from "next";
import SiteHeader from "../site-header";
import styles from "../prose-page.module.css";
import { NOTES_POSTS as POSTS } from "../notes-posts";

const TITLE = "Notes on Spanish Grammar";
const DESCRIPTION = "Short posts on the Spanish grammar mistakes and patterns that come up again and again, gustar, ser vs estar, por vs para, the past tenses and more.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/notes",
  },
};

export default function NotesPage() {
  return (
    <main className={styles.page}>
      <SiteHeader />

      <section className={styles.intro}>
        <p className={styles.eyebrow}>Notes</p>
        <h1>Notes on Spanish grammar</h1>
        <p className={styles.lead}>
          Short posts on the mistakes and patterns that come up again and again, separate from the quizzes themselves.
        </p>
      </section>

      <section className={styles.contents} aria-label="Posts">
        {POSTS.map((post) => (
          <a key={post.href} href={post.href}>{post.title}</a>
        ))}
      </section>

      {POSTS.map((post, index) => (
        <section className={styles.section} key={post.href}>
          <p className={styles.sectionNumber}>{String(index + 1).padStart(2, "0")}</p>
          <div className={styles.sectionBody}>
            <h2><a href={post.href}>{post.title}</a></h2>
            <p>{post.excerpt}</p>
          </div>
        </section>
      ))}
    </main>
  );
}
