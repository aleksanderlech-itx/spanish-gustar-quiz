import type { Question } from "./quiz-data";

type Level = Question["level"];

type Template = {
  before: string;
  after: string;
  infinitive: string;
  preterite: string;
  imperfect: string;
  answerTense: "preterite" | "imperfect";
  en: string;
  level: Level;
  reason: string;
};

const templates: Template[] = [
  { before: "Ayer yo", after: " al mercado.", infinitive: "ir", preterite: "fui", imperfect: "iba", answerTense: "preterite", en: "Yesterday I went to the market.", level: "basic", reason: "Ayer marks one completed past action." },
  { before: "De niño, yo", after: " al parque cada tarde.", infinitive: "ir", preterite: "fui", imperfect: "iba", answerTense: "imperfect", en: "As a child, I used to go to the park every afternoon.", level: "basic", reason: "De niño and cada tarde describe a repeated past habit." },
  { before: "Anoche Marta", after: " la cena a las ocho.", infinitive: "preparar", preterite: "preparó", imperfect: "preparaba", answerTense: "preterite", en: "Last night Marta prepared dinner at eight.", level: "basic", reason: "Anoche and a las ocho frame a completed event." },
  { before: "Mientras Marta", after: " la cena, sonó el teléfono.", infinitive: "preparar", preterite: "preparó", imperfect: "preparaba", answerTense: "imperfect", en: "While Marta was preparing dinner, the phone rang.", level: "basic", reason: "Mientras sets background action in progress." },
  { before: "El sábado nosotros", after: " temprano.", infinitive: "salir", preterite: "salimos", imperfect: "salíamos", answerTense: "preterite", en: "On Saturday we left early.", level: "basic", reason: "El sábado points to one completed occasion." },
  { before: "Normalmente nosotros", after: " temprano para la escuela.", infinitive: "salir", preterite: "salimos", imperfect: "salíamos", answerTense: "imperfect", en: "Normally we used to leave early for school.", level: "basic", reason: "Normalmente signals repeated past routine." },
  { before: "De repente, el tren", after: " en la estación.", infinitive: "llegar", preterite: "llegó", imperfect: "llegaba", answerTense: "preterite", en: "Suddenly, the train arrived at the station.", level: "intermediate", reason: "De repente introduces a completed interrupting action." },
  { before: "El tren", after: " cuando empezó la lluvia.", infinitive: "llegar", preterite: "llegó", imperfect: "llegaba", answerTense: "imperfect", en: "The train was arriving when the rain started.", level: "intermediate", reason: "The arrival was in progress when another event happened." },
  { before: "En 2020 Ana", after: " en Sevilla.", infinitive: "vivir", preterite: "vivió", imperfect: "vivía", answerTense: "preterite", en: "In 2020 Ana lived in Seville.", level: "intermediate", reason: "A bounded time period can use preterite." },
  { before: "Cuando la conocí, Ana", after: " en Sevilla.", infinitive: "vivir", preterite: "vivió", imperfect: "vivía", answerTense: "imperfect", en: "When I met her, Ana was living in Seville.", level: "intermediate", reason: "The living situation is background information." },
  { before: "El profesor", after: " la regla y luego dio ejemplos.", infinitive: "explicar", preterite: "explicó", imperfect: "explicaba", answerTense: "preterite", en: "The teacher explained the rule and then gave examples.", level: "intermediate", reason: "A sequence of completed actions uses preterite." },
  { before: "El profesor", after: " la regla cuando entró el director.", infinitive: "explicar", preterite: "explicó", imperfect: "explicaba", answerTense: "imperfect", en: "The teacher was explaining the rule when the principal came in.", level: "intermediate", reason: "The explanation was ongoing background action." },
  { before: "Al ver las noticias, Luis", after: " nervioso.", infinitive: "ponerse", preterite: "se puso", imperfect: "se ponía", answerTense: "preterite", en: "When he saw the news, Luis became nervous.", level: "advanced", reason: "A change of state at a moment uses preterite." },
  { before: "Cada vez que hablaba en público, Luis", after: " nervioso.", infinitive: "ponerse", preterite: "se puso", imperfect: "se ponía", answerTense: "imperfect", en: "Every time he spoke in public, Luis would get nervous.", level: "advanced", reason: "Cada vez que describes repeated past behavior." },
  { before: "La reunión", after: " a las diez.", infinitive: "empezar", preterite: "empezó", imperfect: "empezaba", answerTense: "preterite", en: "The meeting started at ten.", level: "advanced", reason: "A starting point is a completed event." },
  { before: "La reunión ya", after: " cuando llegué.", infinitive: "empezar", preterite: "empezó", imperfect: "empezaba", answerTense: "imperfect", en: "The meeting was already starting when I arrived.", level: "advanced", reason: "The starting was in progress when another action happened." },
];

export const PRETERITE_IMPERFECT_QUESTIONS: Question[] = templates.map((template, index) => ({
  id: 3001 + index,
  before: template.before,
  after: template.after,
  infinitive: template.infinitive,
  answer: template[template.answerTense],
  verbAnswer: template.answerTense,
  objectPronoun: template.answerTense === "preterite" ? template.imperfect : template.preterite,
  explanation: `${template.reason} Correct tense: ${template.answerTense}.`,
  translations: { en: template.en, pl: "" },
  subjectNumber: "singular",
  isActivity: false,
  indirectObject: template.answerTense,
  tense: template.answerTense,
  level: template.level,
}));

export const PRETERITE_IMPERFECT_FORMS: Record<string, [string, string]> = Object.fromEntries(
  [...new Set(templates.map((template) => template.infinitive))].map((infinitive) => [infinitive, ["preterite", "imperfect"]]),
);

export const PRETERITE_IMPERFECT_CONJUGATIONS: Record<string, Array<{ subject: string; preterite: string; imperfect: string }>> = {
  ir: [
    { subject: "yo", preterite: "fui", imperfect: "iba" },
    { subject: "tú", preterite: "fuiste", imperfect: "ibas" },
    { subject: "él / ella / usted", preterite: "fue", imperfect: "iba" },
    { subject: "nosotros", preterite: "fuimos", imperfect: "íbamos" },
    { subject: "vosotros", preterite: "fuisteis", imperfect: "ibais" },
    { subject: "ellos / ellas / ustedes", preterite: "fueron", imperfect: "iban" },
  ],
  preparar: [
    { subject: "yo", preterite: "preparé", imperfect: "preparaba" },
    { subject: "tú", preterite: "preparaste", imperfect: "preparabas" },
    { subject: "él / ella / usted", preterite: "preparó", imperfect: "preparaba" },
    { subject: "nosotros", preterite: "preparamos", imperfect: "preparábamos" },
    { subject: "vosotros", preterite: "preparasteis", imperfect: "preparabais" },
    { subject: "ellos / ellas / ustedes", preterite: "prepararon", imperfect: "preparaban" },
  ],
  salir: [
    { subject: "yo", preterite: "salí", imperfect: "salía" },
    { subject: "tú", preterite: "saliste", imperfect: "salías" },
    { subject: "él / ella / usted", preterite: "salió", imperfect: "salía" },
    { subject: "nosotros", preterite: "salimos", imperfect: "salíamos" },
    { subject: "vosotros", preterite: "salisteis", imperfect: "salíais" },
    { subject: "ellos / ellas / ustedes", preterite: "salieron", imperfect: "salían" },
  ],
  llegar: [
    { subject: "yo", preterite: "llegué", imperfect: "llegaba" },
    { subject: "tú", preterite: "llegaste", imperfect: "llegabas" },
    { subject: "él / ella / usted", preterite: "llegó", imperfect: "llegaba" },
    { subject: "nosotros", preterite: "llegamos", imperfect: "llegábamos" },
    { subject: "vosotros", preterite: "llegasteis", imperfect: "llegabais" },
    { subject: "ellos / ellas / ustedes", preterite: "llegaron", imperfect: "llegaban" },
  ],
  vivir: [
    { subject: "yo", preterite: "viví", imperfect: "vivía" },
    { subject: "tú", preterite: "viviste", imperfect: "vivías" },
    { subject: "él / ella / usted", preterite: "vivió", imperfect: "vivía" },
    { subject: "nosotros", preterite: "vivimos", imperfect: "vivíamos" },
    { subject: "vosotros", preterite: "vivisteis", imperfect: "vivíais" },
    { subject: "ellos / ellas / ustedes", preterite: "vivieron", imperfect: "vivían" },
  ],
  explicar: [
    { subject: "yo", preterite: "expliqué", imperfect: "explicaba" },
    { subject: "tú", preterite: "explicaste", imperfect: "explicabas" },
    { subject: "él / ella / usted", preterite: "explicó", imperfect: "explicaba" },
    { subject: "nosotros", preterite: "explicamos", imperfect: "explicábamos" },
    { subject: "vosotros", preterite: "explicasteis", imperfect: "explicabais" },
    { subject: "ellos / ellas / ustedes", preterite: "explicaron", imperfect: "explicaban" },
  ],
  ponerse: [
    { subject: "yo", preterite: "me puse", imperfect: "me ponía" },
    { subject: "tú", preterite: "te pusiste", imperfect: "te ponías" },
    { subject: "él / ella / usted", preterite: "se puso", imperfect: "se ponía" },
    { subject: "nosotros", preterite: "nos pusimos", imperfect: "nos poníamos" },
    { subject: "vosotros", preterite: "os pusisteis", imperfect: "os poníais" },
    { subject: "ellos / ellas / ustedes", preterite: "se pusieron", imperfect: "se ponían" },
  ],
  empezar: [
    { subject: "yo", preterite: "empecé", imperfect: "empezaba" },
    { subject: "tú", preterite: "empezaste", imperfect: "empezabas" },
    { subject: "él / ella / usted", preterite: "empezó", imperfect: "empezaba" },
    { subject: "nosotros", preterite: "empezamos", imperfect: "empezábamos" },
    { subject: "vosotros", preterite: "empezasteis", imperfect: "empezabais" },
    { subject: "ellos / ellas / ustedes", preterite: "empezaron", imperfect: "empezaban" },
  ],
};
