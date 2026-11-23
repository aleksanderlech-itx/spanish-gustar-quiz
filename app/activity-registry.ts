import { QUIZ_CONFIG, QUIZ_IDS, QUIZ_SLUGS, quizPath, isQuizId, type QuizId } from "./quiz-config.ts";

import {
  SENTENCE_BUILDER_DESCRIPTION, SENTENCE_BUILDER_ICON_PATH, SENTENCE_BUILDER_ID, SENTENCE_BUILDER_INTRODUCED_ON,
  SENTENCE_BUILDER_PATH, SENTENCE_BUILDER_STORAGE_KEY, SENTENCE_BUILDER_TITLE,
} from "./sentence-builder-config.ts";

export type SentenceBuilderId = typeof SENTENCE_BUILDER_ID;
export type ActivityId = QuizId | "flashcards" | SentenceBuilderId;
/** An Activity whose progress is a history of rounds: every quiz, and Sentence Builder. */
export type ProgressActivityId = Exclude<ActivityId, "flashcards">;
export type ActivityType = "fill-in-blank" | "flashcards" | "sentence-builder";

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
  icon: "quiz" | "deck" | "builder";
  /** SVG path data for the board tile's icon (24x24, stroked). Flashcards draws its own. */
  iconPath?: string;
  storageKey: string;
  /** Day key the activity went live; the streak doesn't require it on earlier days. */
  introducedOn?: string;
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
  iconPath: QUIZ_CONFIG[id].iconPath,
  introducedOn: QUIZ_CONFIG[id].introducedOn,
}));

const sentenceBuilderActivity: ActivityRegistryEntry = {
  id: SENTENCE_BUILDER_ID,
  slug: SENTENCE_BUILDER_ID,
  path: SENTENCE_BUILDER_PATH,
  title: SENTENCE_BUILDER_TITLE,
  shortDescription: SENTENCE_BUILDER_DESCRIPTION,
  activityType: "sentence-builder",
  icon: "builder",
  iconPath: SENTENCE_BUILDER_ICON_PATH,
  storageKey: SENTENCE_BUILDER_STORAGE_KEY,
  introducedOn: SENTENCE_BUILDER_INTRODUCED_ON,
};

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

export const ACTIVITY_REGISTRY: ActivityRegistryEntry[] = [...quizActivities, sentenceBuilderActivity, flashcardsActivity];

export const isSentenceBuilderId = (id: string): id is SentenceBuilderId => id === SENTENCE_BUILDER_ID;
/** Activities with a history of rounds, in registry order. */
export const PROGRESS_ACTIVITY_IDS = ACTIVITY_REGISTRY.filter((entry) => entry.activityType !== "flashcards").map((entry) => entry.id as ProgressActivityId);

export const findActivity = (id: string): ActivityRegistryEntry | undefined =>
  ACTIVITY_REGISTRY.find((entry) => entry.id === id);

export { isQuizId };
