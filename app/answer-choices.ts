import { type Question } from "./quiz-data";
import { OBJECT_PRONOUN_TYPES } from "./object-pronouns-data";
import { SABER_CONOCER_USAGES } from "./saber-conocer-data";
import { REFLEXIVE_USAGES } from "./reflexive-verbs-data";

export const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);
const PRONOUNS = ["me", "te", "le", "nos", "les"];

/** Up to 3 options: the correct answer plus distractors drawn from the quiz's own verb forms/pronouns. */
export const answerChoicesFor = (question: Question, forms: Record<string, [string, string]>) => {
  if (question.infinitive === "ser / estar" || question.infinitive === "por / para" || (OBJECT_PRONOUN_TYPES as readonly string[]).includes(question.infinitive) || (SABER_CONOCER_USAGES as readonly string[]).includes(question.infinitive) || (REFLEXIVE_USAGES as readonly string[]).includes(question.infinitive) || question.tense === "preterite" || question.tense === "imperfect") {
    return shuffle([question.answer, question.objectPronoun].filter(Boolean));
  }
  const choices = new Set<string>([question.answer]);
  const verbForms = forms[question.infinitive] ?? [question.verbAnswer, question.verbAnswer];
  choices.add(`${question.objectPronoun} ${verbForms.find((form) => form !== question.verbAnswer) ?? question.verbAnswer}`);
  PRONOUNS.filter((pronoun) => pronoun !== question.objectPronoun).forEach((pronoun) => choices.add(`${pronoun} ${question.verbAnswer}`));
  return shuffle([...choices].slice(0, 3));
};
