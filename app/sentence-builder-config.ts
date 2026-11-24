import type { SentenceBuilderItem } from "./sentence-builder-data.ts";

/**
 * Sentence Builder's fixed identity: id, URL, storage keys and labels (decision 0013). Kept apart from the
 * Item data so the activity registry and storage code can import it without the sentences.
 * The id, keys and rule labels are stored in learners' browsers: never change them (decision 0009).
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

const RULE_PREFIX = "Sentence Builder: ";
/** The mistake notebook's label for an Item: its pattern group. */
export const sentenceBuilderRuleLabel = (item: Pick<SentenceBuilderItem, "group">) => `${RULE_PREFIX}${item.group}`;
export const ownsSentenceBuilderRule = (rule: string) => rule.startsWith(RULE_PREFIX);
