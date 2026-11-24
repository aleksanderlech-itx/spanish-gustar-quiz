import type { ProgressActivityId } from "./activity-registry.ts";

/**
 * Until schema 3, learners' browsers stored group and notebook rule *labels*, the text shown on screen
 * (decision 0015). This is a frozen copy of those labels and the key each one became. Only the schema 2
 * to 3 upgrade, v1 notebook entries and old `rule=` links read it. Never edit it: later label changes
 * go in the quiz config, and keys never change.
 */

/** Each activity's group labels that differ from their keys, as they were in schema 2. */
const SCHEMA_2_GROUP_KEYS: Partial<Record<ProgressActivityId, Record<string, string>>> = {
  "ser-estar": { "ser / estar": "ser-estar" },
  "por-para": { "por / para": "por-para" },
  "object-pronouns": { "direct object": "direct-object", "indirect object": "indirect-object", "double pronouns": "double-pronouns" },
  "saber-conocer": { "past meaning": "past-meaning" },
  "reflexive-verbs": { "daily routine": "daily-routine", "meaning change": "meaning-change" },
  "present-perfect": {
    "regular -ado": "regular-ado", "regular -ido": "regular-ido", "irregular participle": "irregular-participle",
    "haber not tener": "haber-not-tener", "negatives and questions": "negatives-and-questions",
  },
  "present-continuous": {
    "regular -ando": "regular-ando", "regular -iendo": "regular-iendo", "irregular gerund": "irregular-gerund",
    "pronoun placement": "pronoun-placement", "gerund or infinitive": "gerund-or-infinitive",
  },
  "sentence-builder": { "object pronouns": "object-pronouns", "ser and estar": "ser-and-estar", "present and past": "present-and-past" },
};

/** The saved filter of every activity whose group labels differ from their keys. */
export const SCHEMA_2_FILTER_KEYS: Partial<Record<ProgressActivityId, string>> = {
  "ser-estar": "ser-estar-quiz-filters-v1",
  "por-para": "por-para-quiz-filters-v1",
  "object-pronouns": "object-pronouns-quiz-filters-v1",
  "saber-conocer": "saber-conocer-quiz-filters-v1",
  "reflexive-verbs": "reflexive-verbs-quiz-filters-v1",
  "present-perfect": "present-perfect-quiz-filters-v1",
  "present-continuous": "present-continuous-quiz-filters-v1",
  "sentence-builder": "sentence-builder-filters-v1",
};

/** Notebook rule labels that were a whole label, not "Prefix: group". */
const WHOLE_RULES: Record<string, [ProgressActivityId, string]> = {
  "Ser vs estar": ["ser-estar", "ser-estar"],
  "Por vs para": ["por-para", "por-para"],
  Preterite: ["preterite-imperfect", "preterite"],
  Imperfect: ["preterite-imperfect", "imperfect"],
};

const RULE_PREFIXES: Array<[string, ProgressActivityId]> = [
  ["Gustar pattern: ", "gustar"],
  ["Object pronouns: ", "object-pronouns"],
  ["Saber vs conocer: ", "saber-conocer"],
  ["Reflexive verbs: ", "reflexive-verbs"],
  ["Present perfect: ", "present-perfect"],
  ["Present continuous: ", "present-continuous"],
  ["Sentence Builder: ", "sentence-builder"],
];

/** A schema 2 group label's key: the frozen mapping, or the text itself where label and key were the same. */
export const groupKeyFromSchema2 = (activityId: ProgressActivityId, label: string): string =>
  SCHEMA_2_GROUP_KEYS[activityId]?.[label] ?? label;

/** A schema 2 notebook rule label's activity and rule key, or null when no activity used that label. */
export const ruleFromSchema2Label = (label: string): { activityId: ProgressActivityId; key: string } | null => {
  const whole = WHOLE_RULES[label];
  if (whole) return { activityId: whole[0], key: whole[1] };
  const match = RULE_PREFIXES.find(([prefix]) => label.startsWith(prefix));
  if (!match) return null;
  const [prefix, activityId] = match;
  return { activityId, key: groupKeyFromSchema2(activityId, label.slice(prefix.length)) };
};
