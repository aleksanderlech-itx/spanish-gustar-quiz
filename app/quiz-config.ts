import { ALL_QUESTIONS, VERB_FORMS } from "./quiz-data";
import { PRETERITE_IMPERFECT_FORMS, PRETERITE_IMPERFECT_QUESTIONS } from "./preterite-imperfect-data";
import { SER_ESTAR_FORMS, SER_ESTAR_QUESTIONS } from "./ser-estar-data";
import { ruleForTense } from "./quiz-logic";
import type { Question } from "./quiz-data";

export type QuizId = "gustar" | "ser-estar" | "preterite-imperfect";

/** Each quiz's own crawlable URL, so every topic canonicalizes to itself instead of
 * every `?quiz=` variant resolving to the same root page. */
export const QUIZ_SLUGS: Record<QuizId, string> = {
  gustar: "gustar",
  "ser-estar": "ser-vs-estar",
  "preterite-imperfect": "preterite-vs-imperfect",
};

export const quizPath = (quizId: QuizId): string => `/${QUIZ_SLUGS[quizId]}`;

export const QUIZ_CONFIG = {
  gustar: {
    title: "Spanish Gustar Quiz",
    eyebrow: "Gustar patterns",
    heading: "Build the sentence, prove the rule.",
    copy: "Practise Spanish verbs that work like gustar with short, original sentences.",
    description: "Practise gustar and gustar-pattern verbs (encantar, interesar, molestar, doler and more) with 150 original Spanish sentences, instant explanations and audio.",
    levelBand: "A1–B1",
    questions: ALL_QUESTIONS,
    forms: VERB_FORMS,
    storageKey: "gustar-quiz-progress-v1",
    filterKey: "gustar-quiz-filters-v1",
    backupName: "spanish-gustar-quiz-progress.json",
    sources: [],
    rule: ruleForTense(),
  },
  "ser-estar": {
    title: "Ser vs Estar Quiz",
    eyebrow: "Ser vs estar",
    heading: "Name the state. Notice the frame.",
    copy: "Choose ser or estar through descriptions, locations, events and changing states.",
    description: "Choose ser or estar through 150 sentences covering identity, description, location, events and changing states, with instant explanations for every answer.",
    levelBand: "A1–B1",
    questions: SER_ESTAR_QUESTIONS,
    forms: SER_ESTAR_FORMS,
    storageKey: "ser-estar-quiz-progress-v1",
    filterKey: "ser-estar-quiz-filters-v1",
    backupName: "spanish-ser-estar-quiz-progress.json",
    sources: [{ label: "Instituto Cervantes: ser y estar", href: "https://cvc.cervantes.es/ensenanza/ese/programa_17/aprendiz_17.htm" }, { label: "Instituto Cervantes: actividad B1", href: "https://cvc.cervantes.es/ensenanza/actividades_ave/nivelii/ficha_20.htm" }],
    rule: { title: "Ser frames what something is. Estar frames how or where it is now.", body: "Use ser for identity, origin, material, time and defining qualities. Use estar for location, condition and a state linked to a situation.", singular: "La camisa es azul.", plural: "La camisa está mojada." },
  },
  "preterite-imperfect": {
    title: "Preterite vs Imperfect Quiz",
    eyebrow: "Preterite vs imperfect",
    heading: "Choose the past-tense frame.",
    copy: "Practise completed actions, repeated habits, background scenes and interruptions.",
    description: "Practise preterite vs imperfect with 150 sentences covering completed actions, past habits, background scenes and interruptions, with an explanation for every answer.",
    levelBand: "A2–B1",
    questions: PRETERITE_IMPERFECT_QUESTIONS,
    forms: PRETERITE_IMPERFECT_FORMS,
    storageKey: "preterite-imperfect-quiz-progress-v1",
    filterKey: "preterite-imperfect-quiz-filters-v1",
    backupName: "spanish-preterite-imperfect-quiz-progress.json",
    sources: [],
    rule: { title: "Preterite completes the event. Imperfect describes the frame.", body: "Use preterite for completed actions, sequences, starts and changes. Use imperfect for habits, ongoing actions, background details and repeated past situations.", singular: "Ayer fui al mercado.", plural: "De niño iba al parque." },
  },
} satisfies Record<QuizId, { title: string; eyebrow: string; heading: string; copy: string; description: string; levelBand: string; questions: Question[]; forms: Record<string, [string, string]>; storageKey: string; filterKey: string; backupName: string; sources: Array<{ label: string; href: string }>; rule: ReturnType<typeof ruleForTense> }>;
