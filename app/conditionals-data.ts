import type { Question } from "./quiz-data";
import { applySourcedQuestionPair } from "./sourced-quiz-content.ts";
import { withItemExplanation } from "./item-explanation.ts";
import { CONDITIONALS_EXPLANATIONS } from "./explanations-conditionals.ts";

/**
 * Subtopic groups. They double as the topic's "Usage" filter values and the Mistake notebook chips
 * ("Conditionals: real condition"), and are stored in learners' browsers: never rename one.
 */
export const CONDITIONALS_GROUPS = ["real condition", "imperfect subjunctive", "regular conditional", "irregular conditional", "past unreal", "polite conditional"] as const;
export type ConditionalsGroup = (typeof CONDITIONALS_GROUPS)[number];

/** The twelve verbs with an irregular stem in the future and the conditional. */
export const IRREGULAR_CONDITIONAL_STEMS: Record<string, string> = {
  poder: "podr", tener: "tendr", hacer: "har", decir: "dir", querer: "querr", saber: "sabr",
  salir: "saldr", venir: "vendr", poner: "pondr", haber: "habr", caber: "cabr", valer: "valdr",
};

type Seed = readonly [
  /** Permanent question id. Never reuse or renumber: stored progress points at it. */
  id: number,
  group: ConditionalsGroup,
  before: string,
  after: string,
  /** The verb form in the blank, with any pronoun that belongs to it. */
  answer: string,
  /** One wrong option of the same verb, wrong in every region (see the rules below). */
  distractor: string,
  en: string,
  level: Question["level"],
  /** Shown in the blank: the infinitive. */
  blankHint: string,
];

// Scope: si clauses of the three types, plus the polite conditional. Imperfect subjunctive in -ra only,
// no vosotros, no mixed conditionals. Wrong options follow project rule 13:
// - A blank in the si clause always takes the conditional or the future after si as its wrong option.
// - The -ra form is never a wrong option in a result clause: pudiera, quisiera and debiera are accepted
//   there, and -ra for the conditional survives in parts of Latin America.
// - The imperfect indicative is never a wrong option in an imagined result (si tuviera, me lo compraba is
//   accepted colloquial Spanish), and the simple conditional is never a wrong option in a past unreal result,
//   where it would read as a mixed conditional.
// - Hubiera + participle is never a wrong option in a past unreal result: it is an accepted alternative to habría.
// - Modal verbs (poder, querer, deber) never take the conditional as a wrong option after a real condition,
//   where it softens an offer.
// - Polite items never offer puedes, pudieras, quisiera or quería as wrong options: all are polite and correct.
const seed: readonly Seed[] = [
  // --- real condition ---
  [11001, "real condition", "Si", "mañana, iremos al museo en vez de a la playa.", "llueve", "lloverá", "If it rains tomorrow, we will go to the museum instead of the beach.", "basic", "llover"],
  [11002, "real condition", "Si llueve mañana,", "en casa.", "nos quedaremos", "nos quedaríamos", "If it rains tomorrow, we will stay at home.", "basic", "quedarse"],
  [11003, "real condition", "Si", "tiempo esta tarde, te llamaré.", "tengo", "tendré", "If I have time this afternoon, I will call you.", "basic", "tener"],
  [11004, "real condition", "Si estudias cada día,", "el examen sin problemas.", "aprobarás", "aprobarías", "If you study every day, you will pass the exam without problems.", "basic", "aprobar"],
  [11005, "real condition", "Te prestaré mi coche si lo", "el sábado.", "necesitas", "necesitarás", "I will lend you my car if you need it on Saturday.", "intermediate", "necesitar"],
  [11006, "real condition", "Si tienes frío,", "la ventana.", "cierra", "cierres", "If you are cold, close the window.", "basic", "cerrar"],
  [11007, "real condition", "Si", "pronto, podremos tomar el primer tren.", "salimos", "saldremos", "If we leave early, we will be able to catch the first train.", "basic", "salir"],
  [11008, "real condition", "Si mis padres vienen este verano,", "con nosotros en la casa de la playa.", "se quedarán", "se quedarían", "If my parents come this summer, they will stay with us at the beach house.", "intermediate", "quedarse"],
  [11009, "real condition", "Llegaremos a tiempo si no", "tráfico.", "hay", "habrá", "We will arrive on time if there is no traffic.", "intermediate", "haber"],
  [11010, "real condition", "Si calientas el hielo,", "enseguida.", "se derrite", "se derrita", "If you heat ice, it melts straight away.", "intermediate", "derretirse"],
  [11011, "real condition", "Si", "hambre, hay pan en la cocina.", "tienes", "tendrás", "If you are hungry, there is bread in the kitchen.", "basic", "tener"],
  [11012, "real condition", "Si ves a Marta,", "que la espero en el café.", "dile", "le digas", "If you see Marta, tell her I am waiting for her at the café.", "intermediate", "decir"],
  [11013, "real condition", "Si", "a la fiesta, conocerás a mis primos.", "vienes", "vendrás", "If you come to the party, you will meet my cousins.", "basic", "venir"],
  [11014, "real condition", "Si no te das prisa,", "el autobús.", "perderás", "perderías", "If you don't hurry, you will miss the bus.", "intermediate", "perder"],
  [11015, "real condition", "Mi hermana se enfadará si no la", "por su cumpleaños.", "llamas", "llamarías", "My sister will get angry if you don't call her on her birthday.", "intermediate", "llamar"],
  [11016, "real condition", "Si los niños terminan los deberes,", "al parque.", "irán", "irían", "If the children finish their homework, they will go to the park.", "basic", "ir"],
  [11017, "real condition", "Si usted", "en el centro, le recomiendo este hotel.", "se aloja", "se alojaría", "If you are staying in the centre, I recommend this hotel.", "advanced", "alojarse"],
  [11018, "real condition", "Si llegas antes que yo,", "la mesa, por favor.", "reserva", "reserves", "If you get there before me, book the table, please.", "basic", "reservar"],
  [11019, "real condition", "Te mandaré un mensaje si", "algún problema.", "surge", "surgiría", "I will send you a message if any problem comes up.", "intermediate", "surgir"],
  [11020, "real condition", "Si nosotros ahorramos un poco cada mes,", "un coche nuevo el año que viene.", "compraremos", "compraríamos", "If we save a little every month, we will buy a new car next year.", "intermediate", "comprar"],
  [11021, "real condition", "Si", "la ventana, entrará aire fresco.", "abres", "abrirías", "If you open the window, fresh air will come in.", "basic", "abrir"],
  [11022, "real condition", "Si mezclas el azul y el amarillo,", "verde.", "sale", "salga", "If you mix blue and yellow, you get green.", "intermediate", "salir"],
  [11023, "real condition", "Los vecinos se quejarán si", "música tan alta otra vez.", "ponemos", "pondremos", "The neighbours will complain if we play such loud music again.", "intermediate", "poner"],
  [11024, "real condition", "Si ustedes reservan hoy,", "un descuento del diez por ciento.", "tendrán", "tendrían", "If you book today, you will get a ten per cent discount.", "intermediate", "tener"],
  [11025, "real condition", "Si", "el informe antes del viernes, el jefe estará contento.", "termino", "terminaré", "If I finish the report before Friday, the boss will be happy.", "intermediate", "terminar"],
];

/** A conjugated form counts as plural when its verb ends in -mos or -n (tendríamos, hubieran ido). */
const isPlural = (answer: string) => {
  const verbs = answer.split(" ").filter((word) => !["me", "te", "se", "nos", "le", "les", "lo", "la"].includes(word));
  return verbs.some((word) => /(mos|n)$/u.test(word));
};

export const CONDITIONALS_QUESTIONS: Question[] = seed.map(([id, group, before, after, answer, distractor, en, level, blankHint]) => ({
  id,
  before,
  after,
  infinitive: group,
  answer,
  verbAnswer: answer,
  objectPronoun: distractor,
  // Written per item in explanations-conditionals.ts.
  explanation: "",
  translations: { en, pl: "" },
  subjectNumber: isPlural(answer) ? ("plural" as const) : ("singular" as const),
  isActivity: false,
  indirectObject: "",
  // The shared Question type has no conditional or subjunctive tense; the group carries the grammar point.
  tense: "present" as const,
  level,
  blankHint,
})).map(applySourcedQuestionPair).map(withItemExplanation(CONDITIONALS_EXPLANATIONS));

/** One entry per group, so the shared "second filter" can list them. */
export const CONDITIONALS_FORMS: Record<ConditionalsGroup, [string, string]> = {
  "real condition": ["si tengo tiempo", "iré"],
  "imperfect subjunctive": ["si tuviera tiempo", "si fuéramos ricos"],
  "regular conditional": ["viajaría", "comeríamos"],
  "irregular conditional": ["podría", "tendríamos"],
  "past unreal": ["si hubiera tenido tiempo", "habría ido"],
  "polite conditional": ["¿podrías ayudarme?", "me gustaría un café"],
};

/** Reference tables for the in-round "Conditionals chart". No vosotros, -ra forms only. */
export const CONDITIONALS_CHART: Array<{ title: string; rows: Array<{ label: string; form: string }> }> = [
  {
    title: "The three types",
    rows: [
      { label: "real: si + present, then future", form: "Si tengo tiempo, iré." },
      { label: "imagined: si + imperfect subjunctive, then conditional", form: "Si tuviera tiempo, iría." },
      { label: "past unreal: si + hubiera + participle, then habría + participle", form: "Si hubiera tenido tiempo, habría ido." },
    ],
  },
  {
    title: "Imperfect subjunctive · -ra",
    rows: [
      { label: "yo", form: "hablara, tuviera" },
      { label: "tú", form: "hablaras, tuvieras" },
      { label: "él / ella / usted", form: "hablara, tuviera" },
      { label: "nosotros / nosotras", form: "habláramos, tuviéramos" },
      { label: "ellos / ellas / ustedes", form: "hablaran, tuvieran" },
    ],
  },
  {
    title: "Conditional · infinitive + -ía",
    rows: [
      { label: "yo", form: "hablaría" },
      { label: "tú", form: "hablarías" },
      { label: "él / ella / usted", form: "hablaría" },
      { label: "nosotros / nosotras", form: "hablaríamos" },
      { label: "ellos / ellas / ustedes", form: "hablarían" },
    ],
  },
  {
    title: "Irregular conditional stems",
    rows: Object.entries(IRREGULAR_CONDITIONAL_STEMS).map(([infinitive, stem]) => ({ label: `${infinitive}: ${stem}-`, form: `${stem}ía` })),
  },
  {
    title: "Polite requests",
    rows: [
      { label: "poder", form: "¿Podrías ayudarme?" },
      { label: "gustar", form: "Me gustaría un café." },
      { label: "querer", form: "Querría reservar una mesa." },
    ],
  },
];
