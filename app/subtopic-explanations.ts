import type { Question } from "./quiz-data";
import type { QuizId } from "./quiz-config";

// Fallback explanations, one rule per subtopic, that name the item's cue when it
// has one. Every quiz item has its own explanation (app/explanations-<topic>.ts);
// these cover an item without one, for example in a future retry mode.

const SER_FORMS = new Set(["soy", "eres", "es", "somos", "sois", "son"]);

const capitalize = (value: string) => value.charAt(0).toLocaleUpperCase("es") + value.slice(1);

export function subtopicExplanation(quizId: QuizId, question: Question): string {
  const cue = capitalize(question.cue?.trim() || "The context");
  switch (quizId) {
    case "gustar":
      return question.isActivity
        ? `${cue} is the subject, and an infinitive subject always takes singular ${question.verbAnswer}.`
        : `${cue} is the subject and is ${question.subjectNumber}, so ${question.verbAnswer}.`;
    case "ser-estar":
      return SER_FORMS.has(question.answer)
        ? `${cue} decides it: ser is for what something is, such as identity, origin, material, time or events.`
        : `${cue} decides it: estar is for where something is and how it is right now.`;
    case "preterite-imperfect":
      return question.tense === "preterite"
        ? `${cue} marks a completed event, so preterite ${question.answer}.`
        : `${cue} sets background, a habit or an action in progress, so imperfect ${question.answer}.`;
    case "por-para":
      return question.answer === "por"
        ? "Por looks back: cause, exchange, duration, means or movement through a place."
        : "Para looks ahead: purpose, recipient, deadline or destination.";
    case "object-pronouns":
      if (question.infinitive === "direct object") {
        return `${cue} is what the verb acts on, the direct object, so ${question.answer} copies its gender and number.`;
      }
      if (question.infinitive === "indirect object") {
        return `${cue} is who receives or is affected, the indirect object, so ${question.answer}.`;
      }
      return `${cue} sets the pair: indirect before direct, and le or les becomes se before lo, la, los or las.`;
    case "saber-conocer": {
      const rule: Record<string, string> = {
        facts: "is information, and knowing information uses saber.",
        skills: "is an infinitive, and saber + infinitive means knowing how to do something.",
        people: "is a person, and knowing a person uses conocer with the personal a.",
        places: "is a place, and being familiar with a place uses conocer.",
        familiarity: "is a work, field or thing you are familiar with, so conocer.",
        "past meaning": "sets the past meaning: preterite saber means found out, preterite conocer means met.",
      };
      return `${cue} ${rule[question.infinitive] ?? "decides between saber and conocer."}`;
    }
  }
}

/** The explanation to show for an item: its own first, the subtopic rule otherwise. */
export function explanationFor(quizId: QuizId, question: Question): string {
  return question.explanation.trim() || subtopicExplanation(quizId, question);
}
