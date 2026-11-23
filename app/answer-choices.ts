import { type Question } from "./quiz-data";
import { QUIZ_CONFIG, type QuizId } from "./quiz-config";

export const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);
const PRONOUNS = ["me", "te", "le", "nos", "les"];

/** Up to 3 options, by the quiz's declared `choices` style (issue #151): "pair" offers the answer and the
 * question's wrong option; "pronoun-verb" mixes indirect object pronouns and the verb's other form. */
export const answerChoicesFor = (question: Question, quizId: QuizId) => {
  const quiz = QUIZ_CONFIG[quizId];
  if (quiz.choices === "pair") return shuffle([question.answer, question.objectPronoun].filter(Boolean));
  const choices = new Set<string>([question.answer]);
  const verbForms = quiz.forms[question.infinitive] ?? [question.verbAnswer, question.verbAnswer];
  choices.add(`${question.objectPronoun} ${verbForms.find((form) => form !== question.verbAnswer) ?? question.verbAnswer}`);
  PRONOUNS.filter((pronoun) => pronoun !== question.objectPronoun).forEach((pronoun) => choices.add(`${pronoun} ${question.verbAnswer}`));
  return shuffle([...choices].slice(0, 3));
};
