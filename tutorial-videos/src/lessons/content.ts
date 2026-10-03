/**
 * Grammar mini-lessons for the social posts that announce each new activity
 * in the roadmap (issue #65). One lesson per activity, rendered as a feed
 * post (4:5) and a reel (9:16).
 *
 * In Spanish text, *asterisks* mark the part to highlight in teal.
 */

export type Line = { es: string; en?: string; note?: string; wrong?: boolean };

export type Slide =
  /** A conjugation table: a verb across the six persons. */
  | { kind: "table"; eyebrow: string; title: string; rows: [string, string][]; note: string }
  /** A short list of forms, two columns. */
  | { kind: "list"; eyebrow: string; title: string; items: [string, string][]; note?: string }
  /** Example sentences with an English gloss and a short reason. */
  | { kind: "examples"; eyebrow: string; title: string; lines: Line[] }
  /** Pairs of sentences side by side: the same verb with two meanings or uses. */
  | { kind: "contrast"; eyebrow: string; title: string; labels: [string, string]; pairs: [Line, Line][] }
  /** A fill-in-the-blank question; the right option lights up after a beat. */
  | { kind: "quiz"; prompt: string; en: string; options: string[]; answer: string; why: string };

export type Lesson = {
  id: string;
  /** The roadmap cycle and the GitHub issue the activity ships under. */
  cycle: number;
  issue: number;
  title: string;
  hook: string;
  slides: Slide[];
};

export const LESSONS: Lesson[] = [
  {
    id: "reflexive-verbs",
    cycle: 2,
    issue: 68,
    title: "Reflexive verbs",
    hook: "Me, te, se: the small words that turn an action back on the person doing it.",
    slides: [
      {
        kind: "table",
        eyebrow: "The pronouns",
        title: "levantarse · to get up",
        rows: [
          ["yo", "*me* levanto"],
          ["tú", "*te* levantas"],
          ["él · ella · usted", "*se* levanta"],
          ["nosotros", "*nos* levantamos"],
          ["vosotros", "*os* levantáis"],
          ["ellos · ustedes", "*se* levantan"],
        ],
        note: "The pronoun always matches the subject.",
      },
      {
        kind: "examples",
        eyebrow: "Placement",
        title: "Where the pronoun goes",
        lines: [
          { es: "*Me* ducho cada mañana.", en: "I shower every morning.", note: "Before a conjugated verb" },
          { es: "Voy a duchar*me*.", en: "I'm going to shower.", note: "Or attached to an infinitive" },
          { es: "Estoy duchándo*me*.", en: "I'm showering.", note: "Or attached to a gerund" },
        ],
      },
      {
        kind: "contrast",
        eyebrow: "Meaning",
        title: "Same verb, new meaning",
        labels: ["Without se", "With se"],
        pairs: [
          [{ es: "Llamo a Ana.", en: "I call Ana." }, { es: "*Me* llamo Ana.", en: "My name is Ana." }],
          [{ es: "Voy al parque.", en: "I'm going to the park." }, { es: "*Me* voy.", en: "I'm leaving." }],
          [{ es: "Duermo mucho.", en: "I sleep a lot." }, { es: "*Me* duermo.", en: "I'm falling asleep." }],
        ],
      },
      {
        kind: "quiz",
        prompt: "Nosotros ___ acostamos tarde.",
        en: "We go to bed late.",
        options: ["me", "se", "nos"],
        answer: "nos",
        why: "Nosotros takes nos.",
      },
    ],
  },
  {
    id: "present-perfect",
    cycle: 3,
    issue: 69,
    title: "Present perfect",
    hook: "Have you ever…? Talk about what you've done with haber + participle.",
    slides: [
      {
        kind: "table",
        eyebrow: "haber + participle",
        title: "hablar · to speak",
        rows: [
          ["yo", "*he* hablado"],
          ["tú", "*has* hablado"],
          ["él · ella · usted", "*ha* hablado"],
          ["nosotros", "*hemos* hablado"],
          ["vosotros", "*habéis* hablado"],
          ["ellos · ustedes", "*han* hablado"],
        ],
        note: "-ar → -ado · -er and -ir → -ido",
      },
      {
        kind: "list",
        eyebrow: "Irregular participles",
        title: "Learn these by heart",
        items: [
          ["hacer", "*hecho*"],
          ["decir", "*dicho*"],
          ["ver", "*visto*"],
          ["escribir", "*escrito*"],
          ["volver", "*vuelto*"],
          ["abrir", "*abierto*"],
        ],
      },
      {
        kind: "examples",
        eyebrow: "Watch out",
        title: "Haber, never tener",
        lines: [
          { es: "*He* comido.", en: "I have eaten.", note: "Haber is the helper verb" },
          { es: "Tengo comido.", wrong: true, note: "Not tener" },
          { es: "Ella ha comid*o*.", en: "She has eaten.", note: "The participle never changes" },
        ],
      },
      {
        kind: "quiz",
        prompt: "¿Alguna vez ___ estado en México?",
        en: "Have you ever been to Mexico?",
        options: ["ha", "has", "tienes"],
        answer: "has",
        why: "Tú takes has + estado.",
      },
    ],
  },
  {
    id: "present-continuous",
    cycle: 4,
    issue: 70,
    title: "Present continuous",
    hook: "What are you doing right now? Estar + gerund.",
    slides: [
      {
        kind: "table",
        eyebrow: "estar + gerund",
        title: "hablar · to speak",
        rows: [
          ["yo", "*estoy* hablando"],
          ["tú", "*estás* hablando"],
          ["él · ella · usted", "*está* hablando"],
          ["nosotros", "*estamos* hablando"],
          ["vosotros", "*estáis* hablando"],
          ["ellos · ustedes", "*están* hablando"],
        ],
        note: "-ar → -ando · -er and -ir → -iendo",
      },
      {
        kind: "list",
        eyebrow: "Irregular gerunds",
        title: "Learn these by heart",
        items: [
          ["leer", "*leyendo*"],
          ["dormir", "*durmiendo*"],
          ["pedir", "*pidiendo*"],
          ["decir", "*diciendo*"],
          ["ir", "*yendo*"],
          ["oír", "*oyendo*"],
        ],
      },
      {
        kind: "examples",
        eyebrow: "Placement",
        title: "Where the pronoun goes",
        lines: [
          { es: "*Lo* estoy leyendo.", en: "I'm reading it.", note: "Before estar" },
          { es: "Estoy leyéndo*lo*.", en: "I'm reading it.", note: "Or attached, with an accent" },
        ],
      },
      {
        kind: "contrast",
        eyebrow: "Use",
        title: "In general, or right now",
        labels: ["In general", "Right now"],
        pairs: [
          [{ es: "Trabajo en un banco.", en: "I work at a bank." }, { es: "*Estoy trabajando*.", en: "I'm working." }],
          [{ es: "Lee mucho.", en: "She reads a lot." }, { es: "*Está leyendo*.", en: "She's reading." }],
        ],
      },
      {
        kind: "quiz",
        prompt: "Los niños ___ durmiendo.",
        en: "The children are sleeping.",
        options: ["son", "están", "estamos"],
        answer: "están",
        why: "Ellos takes están + durmiendo.",
      },
    ],
  },
];
