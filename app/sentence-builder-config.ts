import type { SentenceBuilderItem } from "./sentence-builder-data.ts";

/**
 * Sentence Builder's fixed identity: id, URL, storage keys and labels (decision 0013). Kept apart from the
 * Item data so the activity registry and storage code can import it without the sentences.
 * The id, storage keys and group keys are stored in learners' browsers: never change them (decisions 0009, 0015).
 */
export const SENTENCE_BUILDER_ID = "sentence-builder";
export const SENTENCE_BUILDER_PATH = "/sentence-builder";
export const SENTENCE_BUILDER_TITLE = "Sentence Builder";
export const SENTENCE_BUILDER_DESCRIPTION = "Put shuffled Spanish words in order to build the sentence for an English prompt.";
export const SENTENCE_BUILDER_STORAGE_KEY = "sentence-builder-progress-v1";
export const SENTENCE_BUILDER_FILTER_KEY = "sentence-builder-filters-v1";
/** Day the activity goes live; the daily goal only requires it from then on. Set to the release day. */
export const SENTENCE_BUILDER_INTRODUCED_ON = "2026-11-24";
/** Three stacked blocks: pieces put in order. */
export const SENTENCE_BUILDER_ICON_PATH = "M4 5h9v4H4zM8 10h12v4H8zM4 15h7v4H4z";

/** What a learner sees for each group key, where it differs from the key (decision 0015). */
export const SENTENCE_BUILDER_GROUP_LABELS: Record<string, string> = {
  "object-pronouns": "object pronouns",
  "ser-and-estar": "ser and estar",
  "present-and-past": "present and past",
};
export const sentenceBuilderGroupLabel = (key: string) => SENTENCE_BUILDER_GROUP_LABELS[key] ?? key;
/** The mistake notebook's key for an Item: its group key, stored in learners' browsers (decision 0015). */
export const sentenceBuilderRuleKey = (item: Pick<SentenceBuilderItem, "group">) => item.group;
/** The text shown for a Sentence Builder rule key. */
export const sentenceBuilderRuleLabel = (key: string) => `Sentence Builder: ${sentenceBuilderGroupLabel(key)}`;
