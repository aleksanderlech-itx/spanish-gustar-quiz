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
const seed: readonly Seed[] = [];

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
