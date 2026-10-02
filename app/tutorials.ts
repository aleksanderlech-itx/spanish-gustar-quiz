/** Short video tutorials shown on the How to Use page and offered by the welcome
 * modal on the home board. The clips are rendered from these same steps by
 * tutorial-videos/ (see its README); a null `videoSrc` shows the poster and the
 * written steps without a player. */
export type TutorialId = "features" | "how-to-use" | "activities-review" | "support";

export type Tutorial = {
  id: TutorialId;
  title: string;
  summary: string;
  steps: string[];
  poster: string;
  videoSrc: string | null;
};

export const TUTORIALS: Tutorial[] = [
  {
    id: "features",
    title: "What's in the app",
    summary: "A quick look at the board, the grammar topics and the flashcard deck.",
    steps: [
      "The home board lists six grammar topics and a verb flashcard deck, ordered by what needs attention.",
      "Each tile shows how much you've practised and what is due today.",
      "The streak and week strip track how consistently you practise.",
      "The menu holds your history, mistake notebook, backup and settings.",
    ],
    poster: "/tutorials/features-poster.jpg",
    videoSrc: "/tutorials/features.mp4",
  },
  {
    id: "how-to-use",
    title: "Play a round",
    summary: "From picking a topic to reading your results.",
    steps: [
      "Pick a topic, then choose a round length of 5, 10 or 20 questions.",
      "Choose gives you answer options; Type makes you write the missing form.",
      "Read the explanation after each answer. Misses go to your mistake notebook.",
      "Results show your score and let you practise the misses.",
    ],
    poster: "/tutorials/how-to-use-poster.jpg",
    videoSrc: "/tutorials/how-to-use.mp4",
  },
  {
    id: "activities-review",
    title: "Review what's due",
    summary: "How flashcard boxes and due counts bring material back at the right time.",
    steps: [
      "Reveal a card, then mark it Got it or Again.",
      "Cards climb four boxes: every session, then after 1, 3 and 7 days. A miss sends a card back to Box 1.",
      "The due count on each tile shows what is ready to review now.",
      "Practise the misses replays the quiz questions you got wrong.",
    ],
    poster: "/tutorials/activities-review-poster.jpg",
    videoSrc: "/tutorials/activities-review.mp4",
  },
  {
    id: "support",
    title: "Support the project",
    summary: "The app is free, needs no sign-in and keeps your progress on your device.",
    steps: [
      "Every topic and the flashcard deck are free, with no account.",
      "Your progress stays in this browser. Use Backup & restore to move it.",
      "If the app helps you, you can support it on Ko-fi from the results screen or the menu.",
    ],
    poster: "/tutorials/support-poster.jpg",
    videoSrc: "/tutorials/support.mp4",
  },
];

/** localStorage: "1" once the learner ticks "Don't show this again". A preference
 * like the theme, not progress, so backup/restore and reset leave it alone. */
export const TUTORIAL_DISMISSED_KEY = "spanish-tutorial-dismissed";
/** sessionStorage: set once the modal has been offered in this browser session, so
 * returning to the board from a round doesn't offer it again. */
export const TUTORIAL_OFFERED_KEY = "spanish-tutorial-offered";

export const TUTORIALS_HREF = "/how-to-use#tutorials";
export const tutorialHref = (id: TutorialId) => `/how-to-use#tutorial-${id}`;

/** True when the welcome modal should open: not permanently dismissed and not
 * already offered in this session. Storage failures count as "don't show", so a
 * browser that blocks storage isn't nagged on every visit. */
export const shouldOfferTutorial = (local: Pick<Storage, "getItem">, session: Pick<Storage, "getItem">): boolean => {
  try {
    return local.getItem(TUTORIAL_DISMISSED_KEY) !== "1" && session.getItem(TUTORIAL_OFFERED_KEY) !== "1";
  } catch {
    return false;
  }
};
