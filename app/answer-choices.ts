import { type Question } from "./quiz-data";

export const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

/** Choice mode's options: the answer and the question's own wrong options, shuffled (issue #152). */
export const answerChoicesFor = (question: Question) => shuffle([question.answer, ...question.distractors].filter(Boolean));
