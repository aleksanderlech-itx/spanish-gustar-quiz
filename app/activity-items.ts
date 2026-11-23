import { QUIZ_CONFIG, isQuizId } from "./quiz-config.ts";
import { SENTENCE_BUILDER_ITEMS } from "./sentence-builder-data.ts";
import type { ProgressActivityId } from "./activity-registry.ts";

/** The Items of an Activity with rounds, as far as progress needs them: their ids and level. */
export type ProgressItem = { id: number; level: string };

export const progressItemsFor = (id: ProgressActivityId): ProgressItem[] =>
  isQuizId(id) ? QUIZ_CONFIG[id].questions : SENTENCE_BUILDER_ITEMS;
