import type { Metadata } from "next";
import Link from "next/link";
import Logo from "../logo";
import styles from "./how-to-use.module.css";

export const metadata: Metadata = {
  title: "How to use",
  description: "How to use Spanish Quizzes, grammar rounds, flashcards, progress, backups, and the mistake notebook.",
  alternates: {
    canonical: "/how-to-use",
  },
};

const UiLabel = ({ children }: { children: React.ReactNode }) => <span className={styles.uiLabel}>{children}</span>;

export default function HowToUsePage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.back} href="/" aria-label="Back to board">
          <span aria-hidden="true">←</span>
          <span>Back to board</span>
        </Link>
        <div className={styles.brand}>
          <Logo size={26} />
          <span>Spanish Quizzes</span>
        </div>
      </header>

      <section className={styles.intro}>
        <p className={styles.eyebrow}>Guide</p>
        <h1>How to use Spanish Quizzes</h1>
        <p className={styles.lead}>
          Use short grammar rounds and spaced-repetition flashcards to practise what you need today, then use your history and mistakes to decide what to review next.
        </p>
      </section>

      <nav className={styles.contents} aria-label="On this page">
        <a href="#about">What this app is about</a>
        <a href="#quizzes">Grammar quizzes</a>
        <a href="#flashcards">Flashcards</a>
        <a href="#interface">Interface guide</a>
        <a href="#backup">Backup &amp; restore</a>
        <a href="#mistakes">Mistake notebook</a>
        <a href="#tips">Practice tips</a>
      </nav>

      <section className={styles.practiceLoop} aria-labelledby="practice-loop-title">
        <p className={styles.eyebrow}>A useful routine</p>
        <h2 id="practice-loop-title">Choose. Practise. Review.</h2>
        <div className={styles.loopSteps}>
          <div><strong>1</strong><span>Pick what is due or choose a topic</span></div>
          <div><strong>2</strong><span>Complete a short round or card session</span></div>
          <div><strong>3</strong><span>Review mistakes and return when cards are due</span></div>
        </div>
      </section>

      <section className={styles.section} id="about">
        <p className={styles.sectionNumber}>01</p>
        <div className={styles.sectionBody}>
          <h2>What Spanish Quizzes is about</h2>
          <p>
            Spanish Quizzes is a focused practice app for Spanish grammar and vocabulary. You can work on grammar topics such as Gustar, Preterite vs Imperfect, and Ser vs Estar, or practise common verbs with Spanish Verb Flashcards.
          </p>
          <p>
            The home board shows what is due, what you have studied, and your progress. Each activity keeps its own history, filters, scoring, audio practice, and review state so you can leave and come back without losing where you were.
          </p>
          <div className={styles.note}>
            <strong>Start or continue?</strong>
            <p><UiLabel>Start</UiLabel> begins a new activity. <UiLabel>Continue</UiLabel> appears when there is saved progress to return to.</p>
          </div>
        </div>
      </section>

      <section className={styles.section} id="quizzes">
        <p className={styles.sectionNumber}>02</p>
        <div className={styles.sectionBody}>
          <h2>How to use grammar quizzes</h2>
          <p>Open a grammar topic from the home board. Before starting, choose the length and difficulty of the round.</p>
          <h3>Set up the round</h3>
          <ul>
            <li><UiLabel>Round length</UiLabel> lets you choose 5, 10, or 20 questions.</li>
            <li><UiLabel>Choose</UiLabel> gives you answer options. It is useful when you are learning a topic or want a faster round.</li>
            <li><UiLabel>Type</UiLabel> makes you enter the missing form yourself. It is harder and gives you stronger recall practice.</li>
            <li><UiLabel>Filters</UiLabel> narrow the practice set by difficulty and, where available, verb.</li>
            <li><UiLabel>Verb conjugation chart</UiLabel> opens useful verb forms for the selected topic.</li>
          </ul>
          <h3>During the round</h3>
          <p>Read the English meaning, then complete the Spanish sentence. In Type mode, use the accented-letter keys when you need á, é, í, ó, ú, or ñ.</p>
          <ul>
            <li><UiLabel>Check</UiLabel> checks a typed answer.</li>
            <li><UiLabel>Skip</UiLabel> moves on if you do not want to answer the current question.</li>
            <li><UiLabel>Next question</UiLabel> continues after an answer has been checked.</li>
            <li><UiLabel>See results</UiLabel> finishes the final question and opens the result summary.</li>
            <li><UiLabel>Back to topic</UiLabel> returns to the topic setup screen.</li>
          </ul>
          <p>After an answer is checked, read the explanation. Incorrect answers are recorded so you can target them again instead of repeatedly practising only material you already know.</p>
        </div>
      </section>

      <section className={styles.section} id="flashcards">
        <p className={styles.sectionNumber}>03</p>
        <div className={styles.sectionBody}>
          <h2>How to use Spanish Verb Flashcards</h2>
          <p>Flashcards use the Leitner system: cards you remember return less often, while cards you miss come back quickly.</p>
          <ol>
            <li>Read the Spanish verb and think of its English meaning.</li>
            <li>Select <UiLabel>Reveal</UiLabel>, or tap the card, to see the answer and example sentence.</li>
            <li>Use the speaker button if you want to hear the Spanish verb.</li>
            <li>Select the green <UiLabel>OK</UiLabel> checkmark if you remembered the meaning.</li>
            <li>Select the red <UiLabel>Not OK</UiLabel> cross if you need more practice.</li>
          </ol>
          <div className={styles.boxGrid} aria-label="Leitner review intervals">
            <div><strong>Box 1</strong><span>Every session</span></div>
            <div><strong>Box 2</strong><span>After 1 day</span></div>
            <div><strong>Box 3</strong><span>After 3 days</span></div>
            <div><strong>Box 4</strong><span>After 7 days</span></div>
          </div>
          <p>A correct recall moves the card forward by one box, up to Box 4. <UiLabel>Not OK</UiLabel> sends it back to Box 1. A card marked <UiLabel>due now</UiLabel> is ready for review.</p>
        </div>
      </section>

      <section className={styles.section} id="interface">
        <p className={styles.sectionNumber}>04</p>
        <div className={styles.sectionBody}>
          <h2>What the interface elements mean</h2>
          <div className={styles.definitionGrid}>
            <div>
              <h3>Home board</h3>
              <dl>
                <dt>Today&apos;s board</dt><dd>Your quizzes and deck, prioritised by what needs attention.</dd>
                <dt>due</dt><dd>Questions or cards ready to practise now.</dd>
                <dt>done / studied</dt><dd>Material you have already practised.</dd>
                <dt>Percentage</dt><dd>Your progress through that activity.</dd>
                <dt>Streak and week</dt><dd>A view of recent practice consistency, not a grade.</dd>
              </dl>
            </div>
            <div>
              <h3>Activity screens</h3>
              <dl>
                <dt>Question or card counter</dt><dd>Your current position in the session.</dd>
                <dt>Progress line</dt><dd>How far you are through the current round.</dd>
                <dt>Box 1–5</dt><dd>The flashcard&apos;s current review interval.</dd>
                <dt>Speaker</dt><dd>Plays Spanish audio when available.</dd>
                <dt>Explanation</dt><dd>Why the grammar answer is correct or what needs changing.</dd>
              </dl>
            </div>
          </div>
          <h3>Drawer menu</h3>
          <p>Open the drawer with <UiLabel>Open menu</UiLabel> in the top-left corner of the board.</p>
          <dl className={styles.drawerGuide}>
            <dt>Progress &amp; history</dt><dd>Rounds played, average accuracy, flashcards studied, weak areas, and recent rounds.</dd>
            <dt>Weekly recap</dt><dd>Your number of rounds and average accuracy for the current week.</dd>
            <dt>Mistake notebook</dt><dd>Rules connected to answers you have missed.</dd>
            <dt>Backup &amp; restore</dt><dd>Download your progress or import a previously saved backup.</dd>
            <dt>Settings</dt><dd>Contains the option to reset all saved progress.</dd>
            <dt>Light theme / Dark theme</dt><dd>Changes the appearance without changing your learning data.</dd>
          </dl>
        </div>
      </section>

      <section className={styles.section} id="backup">
        <p className={styles.sectionNumber}>05</p>
        <div className={styles.sectionBody}>
          <h2>Backup and restore</h2>
          <p>Your learning progress is kept in browser storage on the device you are using. If you clear browser data or move to another browser or device, that local progress does not automatically follow you.</p>
          <ul>
            <li>Select <UiLabel>Download backup</UiLabel> to save a JSON backup file containing quiz and flashcard progress.</li>
            <li>Select <UiLabel>Import backup</UiLabel> and choose a previous backup file to restore it.</li>
            <li>Download a backup before moving devices, clearing browser data, or resetting progress.</li>
            <li><UiLabel>Reset all progress</UiLabel> removes saved quiz and flashcard progress from the current device. Use it only when you want to start over.</li>
          </ul>
        </div>
      </section>

      <section className={styles.section} id="mistakes">
        <p className={styles.sectionNumber}>06</p>
        <div className={styles.sectionBody}>
          <h2>Mistake notebook</h2>
          <p>The Mistake notebook collects the grammar rules connected to incorrect quiz answers. It is designed for targeted review: instead of reading every rule again, you can see the areas that actually caused problems.</p>
          <p>Open it regularly after a few rounds and look for rules that keep returning. If no mistakes have been recorded, the drawer shows <UiLabel>No missed rules yet.</UiLabel></p>
        </div>
      </section>

      <section className={styles.section} id="tips">
        <p className={styles.sectionNumber}>07</p>
        <div className={styles.sectionBody}>
          <h2>Useful practice tips</h2>
          <ul>
            <li>Use a five-question round when you only have a few minutes. Frequent short sessions are more useful than waiting for a long study block.</li>
            <li>Use Choose mode when a topic is new, then switch to Type mode when you want stronger recall.</li>
            <li>Read the explanation after a mistake instead of immediately rushing to the next question.</li>
            <li>Use the conjugation chart when you are stuck, then return to the question and produce the answer yourself.</li>
            <li>Review flashcards that are due before worrying about adding more cards to the system.</li>
            <li>Use the Mistake notebook to decide which grammar topic deserves your next round.</li>
            <li>Listen to Spanish audio to connect written forms with pronunciation.</li>
            <li>Treat the streak and weekly recap as reminders to practise, not as a score you have to protect.</li>
          </ul>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Ready to practise?</p>
        <Link href="/">Back to today&apos;s board</Link>
      </footer>
    </main>
  );
}
