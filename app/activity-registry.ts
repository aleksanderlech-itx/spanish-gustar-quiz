import { QUIZ_CONFIG, QUIZ_IDS, QUIZ_SLUGS, quizPath, isQuizId, type QuizId } from "./quiz-config.ts";

export type ActivityId = QuizId | "flashcards";
export type ActivityType = "fill-in-blank" | "flashcards";

/**
 * One entry per activity on the homepage board: enough metadata to drive the
 * selector, navigation and progress lookups without each of those hardcoding
 * the list of activities themselves. Fill-in-the-blank entries are derived
 * from QUIZ_CONFIG (the single source for that content) rather than repeated
 * here; flashcards is the one activity that isn't quiz-shaped.
 */
export type ActivityRegistryEntry = {
  id: ActivityId;
  slug: string;
  path: string;
  title: string;
  shortDescription: string;
  activityType: ActivityType;
  /** Activity kind; quiz-selector.tsx maps each activity ID to its dashboard icon. */
  icon: "quiz" | "deck";
  storageKey: string;
};

const quizActivities: ActivityRegistryEntry[] = QUIZ_IDS.map((id) => ({
  id,
  slug: QUIZ_SLUGS[id],
  path: quizPath(id),
  title: QUIZ_CONFIG[id].title.replace(" Quiz", ""),
  shortDescription: QUIZ_CONFIG[id].copy,
  activityType: "fill-in-blank",
  icon: "quiz",
  storageKey: QUIZ_CONFIG[id].storageKey,
}));

const flashcardsActivity: ActivityRegistryEntry = {
  id: "flashcards",
  slug: "flashcards",
  path: "/flashcards",
  title: "Spanish Verb Flashcards",
  shortDescription: "Review verb forms with spaced-repetition flashcards.",
  activityType: "flashcards",
  icon: "deck",
  storageKey: "spanish-flashcards-leitner-v2",
};

export const ACTIVITY_REGISTRY: ActivityRegistryEntry[] = [...quizActivities, flashcardsActivity];

export const findActivity = (id: string): ActivityRegistryEntry | undefined =>
  ACTIVITY_REGISTRY.find((entry) => entry.id === id);

export { isQuizId };
