"use client";

import { useRef } from "react";

export type HelpTopic = "topic-detail" | "round" | "flashcards";

type HelpContent = { title: string; points: string[]; guideHref: string };

export const HELP_CONTENT: Record<HelpTopic, HelpContent> = {
  "topic-detail": {
    title: "Setting up a round",
    points: [
      "Round length picks 5, 10 or 20 questions.",
      "Choose gives you answer options — faster, good for a new topic.",
      "Type makes you write the missing form yourself — harder, and it sticks better.",
      "Filters narrow the sentences by difficulty and verb. They also scope \"Practise the misses\".",
      "The ring shows how much of the topic you've practised; \"due\" counts questions ready to review.",
    ],
    guideHref: "/how-to-use#quizzes",
  },
  round: {
    title: "During a round",
    points: [
      "Read the English meaning, then complete the Spanish sentence.",
      "In Choose mode, tap an answer. In Type mode, enter the missing form and press Check — use the accent keys for á é í ó ú ñ.",
      "Stuck? Open the conjugation chart; your round stays exactly where it was.",
      "Skip moves on without recording an answer, so the question comes back in a later round.",
      "After each answer, read the explanation. Misses are saved to your mistake notebook.",
      "Your score is saved when you finish the last question.",
    ],
    guideHref: "/how-to-use#quizzes",
  },
  flashcards: {
    title: "Using the flashcards",
    points: [
      "Read the Spanish verb and think of its English meaning.",
      "Tap the card or Reveal to see the meaning and an example sentence. The speaker plays the Spanish.",
      "Press the green check if you remembered it, the red cross if you didn't.",
      "Cards move through four boxes: Box 1 every session, then 1, 3 and 7 days. A miss sends a card back to Box 1.",
      "The difficulty buttons filter which verbs come up.",
    ],
    guideHref: "/how-to-use#flashcards",
  },
};

/** Help icon for activity screen headers. Opens a native modal <dialog>, which
 * handles the focus trap, Escape to close and returning focus to the icon. */
export default function HelpButton({ topic }: { topic: HelpTopic }) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const content = HELP_CONTENT[topic];
  const titleId = `help-${topic}-title`;
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button type="button" className="help-button" aria-label="Help" aria-haspopup="dialog" onClick={() => dialogRef.current?.showModal()}>
        <span aria-hidden="true">?</span>
      </button>
      <dialog
        ref={dialogRef}
        className="help-dialog"
        aria-labelledby={titleId}
        // A click on the backdrop lands on the <dialog> itself; clicks inside land on its children.
        onClick={(event) => { if (event.target === event.currentTarget) close(); }}
      >
        <div className="help-dialog-body">
          <div className="help-dialog-top">
            <h2 id={titleId}>{content.title}</h2>
            <button type="button" className="help-dialog-close" aria-label="Close help" onClick={close}>✕</button>
          </div>
          <ul className="help-dialog-points">
            {content.points.map((point) => <li key={point}>{point}</li>)}
          </ul>
          {/* New tab: rounds and flashcard sessions live only in memory, so navigating away would lose them. */}
          <div className="help-dialog-guide-row">
            <a className="help-dialog-guide" href={content.guideHref} target="_blank" rel="noopener noreferrer" aria-describedby={`${titleId}-new-tab`}>Read the full guide →</a>
            <p className="help-dialog-note" id={`${titleId}-new-tab`}>Opens in a new tab, so you won&apos;t lose your place here.</p>
          </div>
        </div>
      </dialog>
    </>
  );
}
