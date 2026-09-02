import type { Metadata } from "next";
import SiteHeader from "../site-header";
import styles from "../prose-page.module.css";

const TITLE = "Notes on Spanish Grammar";
const DESCRIPTION = "Short posts on the Spanish grammar mistakes and patterns that come up again and again, gustar, ser vs estar and more.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/notes",
  },
};

const POSTS = [
  {
    href: "/notes/ser-vs-estar-mistakes",
    title: "3 mistakes learners make with ser vs estar",
    excerpt: "The rule sounds easy until you write your own sentences. Here are the three slips that keep coming back.",
  },
  {
    href: "/notes/encantar-vs-gustar",
    title: "Encantar vs gustar: what is the difference",
    excerpt: "Same grammar, different strength. Once you have gustar down, encantar is mostly a vocabulary question.",
  },
];

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
