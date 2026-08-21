import { FLASHCARD_VERBS_PART_1 } from "./flashcards-verbs-part1.ts";
import { FLASHCARD_VERBS_PART_2 } from "./flashcards-verbs-part2.ts";

export type FlashcardVerb = {
  rank: number;
  spanish: string;
  english: string;
  example: string;
};

export const FLASHCARD_VERBS_SOURCE = {
  corpus: "OpenSubtitles2016 Spanish frequency data via hermitdave/FrequencyWords",
  sourceUrl: "https://github.com/hermitdave/FrequencyWords/blob/master/content/2016/es/es_50k.txt",
  methodology:
    "Use the general Spanish frequency corpus as a ranking signal, then manually filter and normalize infinitive verbs. English glosses and examples are project-authored rather than copied from a ready-made verb list.",
  licenseNote: "FrequencyWords content is CC BY-SA 4.0; project-authored glosses and examples are original.",
} as const;

const SPECIAL_EXAMPLES: Record<string, string> = {
  ser: "Quiero ser más paciente.",
  estar: "Voy a estar en casa esta tarde.",
  haber: "Tiene que haber otra solución.",
  poder: "Quiero poder hablar español con confianza.",
  saber: "Quiero saber la verdad.",
  querer: "Quiero aprender español.",
  deber: "Debes descansar un poco.",
  parecer: "Esto puede parecer difícil al principio.",
  quedar: "Podemos quedar mañana por la tarde.",
  conocer: "Me gustaría conocer mejor la ciudad.",
  sentir: "Puedo sentir el frío en las manos.",
  existir: "Debe existir una forma más sencilla.",
  ocurrir: "Eso puede ocurrir en cualquier momento.",
  resultar: "La tarea puede resultar más fácil de lo esperado.",
  nacer: "El bebé va a nacer en septiembre.",
  morir: "Nadie quiere morir joven.",
  gustar: "A Marta le puede gustar esta canción.",
  costar: "El viaje puede costar más de cien euros.",
  valer: "Este reloj puede valer mucho dinero.",
  preferir: "Prefiero viajar en tren.",
  odiar: "Odio esperar en filas largas.",
  amar: "Es fácil amar este lugar.",
  encantar: "A los niños les va a encantar el museo.",
  molestar: "El ruido puede molestar a los vecinos.",
  importar: "Lo que piensas puede importar mucho.",
  faltar: "Puede faltar una pieza.",
  doler: "Me puede doler la espalda después del viaje.",
  aburrir: "La película puede aburrir a los niños.",
  divertir: "El juego puede divertir a toda la familia.",
  interesar: "Este tema puede interesar a los estudiantes.",
  sorprender: "La respuesta puede sorprenderte.",
  cansar: "Caminar tanto puede cansar a cualquiera.",
  alegrar: "La noticia puede alegrar a tu madre.",
  entristecer: "La despedida puede entristecer a todos.",
  asustar: "Ese ruido puede asustar al perro.",
  temer: "No debes temer el cambio.",
  confiar: "Puedes confiar en ella.",
  dudar: "Es normal dudar al principio.",
  soñar: "Me gusta soñar con viajes largos.",
  desear: "Todos podemos desear algo mejor.",
  tener: "Quiero tener más tiempo libre.",
  convertirse: "La idea puede convertirse en un proyecto.",
  suceder: "Algo parecido puede suceder otra vez.",
  pertenecer: "Este libro puede pertenecer a Ana.",
  depender: "Todo puede depender del tiempo.",
  significar: "Esa palabra puede significar varias cosas.",
  representar: "Este símbolo puede representar la libertad.",
};

const INTRANSITIVE_EXAMPLES = new Set([
  "ir", "llegar", "venir", "salir", "volver", "vivir", "aparecer", "comenzar", "caer", "acabar", "partir",
  "correr", "trabajar", "crecer", "bajar", "subir", "regresar", "permanecer", "parar", "continuar", "entrar",
  "viajar", "caminar", "dormir", "cantar", "bailar", "nadar", "andar", "pasear", "girar", "arrancar", "frenar",
  "acelerar", "saltar", "funcionar", "navegar", "pausar", "reiniciar", "descansar", "despertar", "desayunar",
  "almorzar", "cenar", "merendar", "hervir", "volar", "competir", "empatar", "esquiar", "patinar", "escalar",
  "despegar", "aterrizar", "embarcar", "participar", "asistir", "colaborar", "registrarse", "iniciar", "acceder",
  "avanzar", "retroceder", "caducar", "respirar", "toser", "estornudar", "sangrar", "desaparecer", "hablar",
  "pensar", "leer", "estudiar", "jugar", "escuchar", "practicar", "aprender", "esperar", "conversar", "discutir",
  "gritar", "susurrar", "investigar", "experimentar", "liderar"
]);

function buildExample(spanish: string): string {
  const special = SPECIAL_EXAMPLES[spanish];
  if (special) return special;
  if (spanish.endsWith("se")) return `Voy a ${spanish} temprano.`;
  if (INTRANSITIVE_EXAMPLES.has(spanish)) return `Voy a ${spanish} hoy.`;
  return `Voy a ${spanish} eso hoy.`;
}

function parseRows(raw: string): Array<{ spanish: string; english: string }> {
  return raw.split("\n").map((line) => {
    const separator = line.indexOf("|");
    if (separator < 1) throw new Error(`Invalid flashcard row: ${line}`);
    return {
      spanish: line.slice(0, separator),
      english: line.slice(separator + 1),
    };
  });
}

const rows = [
  ...parseRows(FLASHCARD_VERBS_PART_1),
  ...parseRows(FLASHCARD_VERBS_PART_2),
];

if (rows.length !== 500) {
  throw new Error(`Expected 500 flashcard verbs, received ${rows.length}`);
}

export const FLASHCARD_VERBS: FlashcardVerb[] = rows.map(({ spanish, english }, index) => ({
  rank: index + 1,
  spanish,
  english,
  example: buildExample(spanish),
}));
