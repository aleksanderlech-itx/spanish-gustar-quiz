import { TRANSLATIONS } from "./translations.ts";
import { applySourcedQuestionPair } from "./sourced-quiz-content.ts";
import { withItemExplanation } from "./item-explanation.ts";
import { GUSTAR_EXPLANATIONS } from "./explanations-gustar.ts";

export type Question = {
  id: number;
  before: string;
  after: string;
  infinitive: string;
  answer: string;
  verbAnswer: string;
  objectPronoun: string;
  explanation: string;
  translations: { en: string; pl: string };
  subjectNumber: "singular" | "plural";
  isActivity: boolean;
  indirectObject: string;
  tense: "present" | "preterite" | "imperfect";
  level: "basic" | "intermediate" | "advanced";
  /** Shown in the empty blank instead of the infinitive, e.g. the bare gerund
   * when the learner has to attach pronouns to it. */
  blankHint?: string;
  /** The word or phrase in this sentence that decides the answer. It must appear
   * in the sentence and be named in the explanation (docs/explanation-quality.md). */
  cue?: string;
};

export const VERB_FORMS: Record<string, [string, string]> = {
  gustar: ["gusta", "gustan"],
  encantar: ["encanta", "encantan"],
  interesar: ["interesa", "interesan"],
  molestar: ["molesta", "molestan"],
  importar: ["importa", "importan"],
  faltar: ["falta", "faltan"],
  quedar: ["queda", "quedan"],
  doler: ["duele", "duelen"],
  parecer: ["parece", "parecen"],
};

// The first value in each row is the permanent question id. Never reuse or renumber it:
// stored progress, the mistake notebook, explanations and sourced pairs all point at it.
export const QUESTION_BANKS: Record<string, Array<[id: number, before: string, after: string, number: "s" | "p", subject: string]>> = {
  gustar: [
    [1, "A Marta le", "el café colombiano.", "s", "el café colombiano"], [2, "Me", "los conciertos de rock.", "p", "los conciertos"], [3, "¿Te", "viajar en tren?", "s", "the activity viajar"], [4, "Nos", "esta canción española.", "s", "esta canción"], [5, "A mis padres les", "las ciudades pequeñas.", "p", "las ciudades"], [6, "No le", "levantarse temprano.", "s", "the activity levantarse"], [7, "A Juan le", "la comida picante.", "s", "la comida"], [8, "¿A ustedes les", "estos ejercicios?", "p", "estos ejercicios"], [9, "Les", "caminar por la montaña.", "s", "the activity caminar"], [10, "A mí me", "las películas antiguas.", "p", "las películas"], [11, "A Laura le", "bailar salsa.", "s", "the activity bailar"], [12, "No nos", "los hoteles grandes.", "p", "los hoteles"], [13, "¿Le", "esta chaqueta azul?", "s", "esta chaqueta"], [14, "A los niños les", "los cuentos cortos.", "p", "los cuentos"], [15, "Te", "cocinar para tus amigos.", "s", "the activity cocinar"], [16, "Me", "la música en directo.", "s", "la música"], [17, "A Pedro y Ana les", "las rutas en bicicleta.", "p", "las rutas"], [18, "Nos", "aprender idiomas.", "s", "the activity aprender"], [19, "¿Les", "el nuevo restaurante?", "s", "el restaurante"], [20, "No te", "estas botas negras.", "p", "estas botas"], [21, "A usted le", "leer antes de dormir.", "s", "the activity leer"], [22, "Me", "los domingos tranquilos.", "p", "los domingos"], [23, "A Carlos le", "la cerveza checa.", "s", "la cerveza"], [24, "Nos", "las excursiones largas.", "p", "las excursiones"], [25, "¿Te", "trabajar desde casa?", "s", "the activity trabajar"], [26, "A ellas les", "este barrio.", "s", "este barrio"], [27, "No me", "los vuelos nocturnos.", "p", "los vuelos"], [28, "A Pablo le", "nadar en el mar.", "s", "the activity nadar"], [29, "¿A ustedes les", "la paella?", "s", "la paella"], [30, "Les", "estas fotografías.", "p", "estas fotografías"], [31, "A nosotros nos", "salir los viernes.", "s", "the activity salir"], [32, "Te", "el clima de España.", "s", "el clima"], [33, "A Sofía le", "los libros de historia.", "p", "los libros"], [34, "Me", "conducir por carreteras tranquilas.", "s", "the activity conducir"], [35, "¿Le", "las clases de español?", "p", "las clases"]
  ],
  encantar: [
    [36, "Me", "esta banda.", "s", "esta banda"], [37, "A Elena le", "los mercados locales.", "p", "los mercados"], [38, "Nos", "viajar sin prisa.", "s", "the activity viajar"], [39, "¿Te", "estas tapas?", "p", "estas tapas"], [40, "A los niños les", "el chocolate.", "s", "el chocolate"], [41, "Le", "bailar flamenco.", "s", "the activity bailar"], [42, "A ustedes les", "las playas del norte.", "p", "las playas"], [43, "A mí me", "la guitarra eléctrica.", "s", "la guitarra"], [44, "Les", "hacer senderismo.", "s", "the activity hacer"], [45, "¿Nos", "los pueblos blancos?", "p", "los pueblos"], [46, "A Julia le", "esta novela.", "s", "esta novela"], [47, "Te", "los desayunos largos.", "p", "los desayunos"], [48, "A mis amigos les", "cocinar juntos.", "s", "the activity cocinar"], [49, "Me", "las montañas.", "p", "las montañas"], [50, "A usted le", "el arte moderno.", "s", "el arte"], [51, "Nos", "escuchar música en vivo.", "s", "the activity escuchar"], [52, "¿Les", "estas vistas?", "p", "estas vistas"], [53, "A Roberto le", "la arquitectura antigua.", "s", "la arquitectura"], [54, "A ustedes les", "los viajes en bicicleta.", "p", "los viajes"], [55, "Te", "aprender palabras nuevas.", "s", "the activity aprender"]
  ],
  interesar: [
    [56, "Me", "la historia de España.", "s", "la historia"], [57, "A Daniel le", "los idiomas.", "p", "los idiomas"], [58, "Nos", "aprender sobre otras culturas.", "s", "the activity aprender"], [59, "¿Te", "estas noticias?", "p", "estas noticias"], [60, "A ellos les", "el ciclismo.", "s", "el ciclismo"], [61, "No le", "hablar de política.", "s", "the activity hablar"], [62, "A ustedes les", "los museos pequeños.", "p", "los museos"], [63, "A mí me", "la tecnología.", "s", "la tecnología"], [64, "Les", "conocer gente nueva.", "s", "the activity conocer"], [65, "¿Nos", "estos cursos?", "p", "estos cursos"], [66, "A Paula le", "la fotografía.", "s", "la fotografía"], [67, "Te", "los documentales.", "p", "los documentales"], [68, "A mis compañeros les", "mejorar su español.", "s", "the activity mejorar"], [69, "Me", "las rutas históricas.", "p", "las rutas"], [70, "A usted le", "el proyecto nuevo.", "s", "el proyecto"], [71, "Nos", "entender la gramática.", "s", "the activity entender"], [72, "¿Les", "estas propuestas?", "p", "estas propuestas"], [73, "A Tomás le", "la economía.", "s", "la economía"], [74, "A ustedes les", "los deportes de montaña.", "p", "los deportes"], [75, "Te", "leer en español.", "s", "the activity leer"]
  ],
  molestar: [
    [76, "Me", "el ruido de la calle.", "s", "el ruido"], [77, "A Sara le", "las luces fuertes.", "p", "las luces"], [78, "Nos", "esperar mucho tiempo.", "s", "the activity esperar"], [79, "¿Te", "estos comentarios?", "p", "estos comentarios"], [80, "A ellos les", "el humo.", "s", "el humo"], [81, "No le", "trabajar los sábados.", "s", "the activity trabajar"], [82, "A ustedes les", "los precios altos.", "p", "los precios"], [83, "A mí me", "la música demasiado alta.", "s", "la música"], [84, "Les", "levantarse tan temprano.", "s", "the activity levantarse"], [85, "¿Nos", "estas interrupciones?", "p", "estas interrupciones"], [86, "A David le", "el frío.", "s", "el frío"], [87, "Te", "los vuelos con escalas.", "p", "los vuelos"], [88, "A mis vecinos les", "oír al perro por la noche.", "s", "the activity oír"], [89, "Me", "las habitaciones oscuras.", "p", "las habitaciones"], [90, "A usted le", "este olor.", "s", "este olor"]
  ],
  importar: [
    [91, "Me", "la calidad del servicio.", "s", "la calidad"], [92, "A Luis le", "los pequeños detalles.", "p", "los detalles"], [93, "Nos", "llegar a tiempo.", "s", "the activity llegar"], [94, "¿Te", "estas diferencias?", "p", "estas diferencias"], [95, "A ellos les", "el resultado final.", "s", "el resultado"], [96, "No le", "trabajar solo.", "s", "the activity trabajar"], [97, "A ustedes les", "los horarios flexibles.", "p", "los horarios"], [98, "A mí me", "la opinión de mi familia.", "s", "la opinión"], [99, "Les", "mantenerse activos.", "s", "the activity mantenerse"], [100, "¿Nos", "estos cambios?", "p", "estos cambios"], [101, "A Eva le", "el medio ambiente.", "s", "el medio ambiente"], [102, "Te", "las condiciones del viaje.", "p", "las condiciones"], [103, "A mis colegas les", "terminar bien el proyecto.", "s", "the activity terminar"], [104, "Me", "las respuestas claras.", "p", "las respuestas"], [105, "A usted le", "esta decisión.", "s", "esta decisión"]
  ],
  faltar: [
    [106, "Me", "un billete para Madrid.", "s", "un billete"], [107, "A Clara le", "dos documentos.", "p", "dos documentos"], [108, "Nos", "terminar el último ejercicio.", "s", "the activity terminar"], [109, "¿Te", "estas páginas?", "p", "estas páginas"], [110, "A ellos les", "un poco de tiempo.", "s", "un poco de tiempo"], [111, "Le", "practicar más.", "s", "the activity practicar"], [112, "A ustedes les", "las entradas para el concierto.", "p", "las entradas"], [113, "A mí me", "una buena mochila.", "s", "una mochila"], [114, "Les", "visitar dos ciudades.", "s", "the activity visitar"], [115, "¿Nos", "algunas sillas?", "p", "algunas sillas"]
  ],
  quedar: [
    [116, "Me", "una semana de vacaciones.", "s", "una semana"], [117, "A Raúl le", "tres preguntas.", "p", "tres preguntas"], [118, "Nos", "reservar el hotel.", "s", "the activity reservar"], [119, "¿Te", "bien estos pantalones?", "p", "estos pantalones"], [120, "A ellos les", "poco dinero.", "s", "poco dinero"], [121, "Le", "preparar la cena.", "s", "the activity preparar"], [122, "A ustedes les", "dos días libres.", "p", "dos días"], [123, "A mí me", "bien esta camisa.", "s", "esta camisa"], [124, "Les", "recorrer diez kilómetros.", "s", "the activity recorrer"], [125, "¿Nos", "suficientes botellas de agua?", "p", "suficientes botellas"]
  ],
  doler: [
    [126, "Me", "la espalda.", "s", "la espalda"], [127, "A Carmen le", "las rodillas.", "p", "las rodillas"], [128, "Nos", "caminar con estas botas.", "s", "the activity caminar"], [129, "¿Te", "los hombros?", "p", "los hombros"], [130, "A ellos les", "la cabeza.", "s", "la cabeza"], [131, "Le", "subir escaleras.", "s", "the activity subir"], [132, "A ustedes les", "los pies.", "p", "los pies"], [133, "A mí me", "el brazo derecho.", "s", "el brazo"], [134, "Les", "hacer este movimiento.", "s", "the activity hacer"], [135, "¿Nos", "las piernas después de correr?", "p", "las piernas"], [136, "A Andrés le", "la garganta.", "s", "la garganta"], [137, "Te", "los dedos.", "p", "los dedos"], [138, "A mis amigos les", "dormir en el suelo.", "s", "the activity dormir"], [139, "Me", "las muñecas.", "p", "las muñecas"], [140, "A usted le", "el cuello.", "s", "el cuello"]
  ],
  parecer: [
    [141, "Me", "interesante esta idea.", "s", "esta idea"], [142, "A Laura le", "caros estos hoteles.", "p", "estos hoteles"], [143, "Nos", "útil practicar cada día.", "s", "the activity practicar"], [144, "¿Te", "claras estas instrucciones?", "p", "estas instrucciones"], [145, "A ellos les", "buena la propuesta.", "s", "la propuesta"], [146, "Le", "difícil conducir de noche.", "s", "the activity conducir"], [147, "A ustedes les", "largos los ejercicios.", "p", "los ejercicios"], [148, "A mí me", "perfecta esta solución.", "s", "esta solución"], [149, "Les", "mejor salir temprano.", "s", "the activity salir"], [150, "¿Nos", "correctas estas respuestas?", "p", "estas respuestas"]
  ]
};

const QUESTIONS: Question[] = Object.entries(QUESTION_BANKS).flatMap(([infinitive, rows]) =>
  rows.map(([id, before, after, number, subject], index) => {
    const pronounMatch = before.match(/\b(me|te|le|nos|les)\b/i);
    const objectPronoun = pronounMatch?.[1]?.toLocaleLowerCase("es") ?? "";
    const promptBefore = pronounMatch
      ? `${before.slice(0, pronounMatch.index)}${before.slice((pronounMatch.index ?? 0) + pronounMatch[0].length)}`.trimEnd()
      : before;
    const verbAnswer = VERB_FORMS[infinitive][number === "s" ? 0 : 1];
    return {
    id,
    before: promptBefore,
    after,
    infinitive,
    answer: `${objectPronoun} ${verbAnswer}`,
    verbAnswer,
    objectPronoun,
    // Written per item in explanations-gustar.ts.
    explanation: "",
    translations: {
      en: TRANSLATIONS[id - 1],
      pl: "",
    },
    subjectNumber: number === "s" ? "singular" : "plural",
    isActivity: subject.startsWith("the activity"),
    indirectObject: objectPronoun,
    tense: "present",
    level: (index < Math.ceil(rows.length / 3) ? "basic" : index < Math.ceil((rows.length * 2) / 3) ? "intermediate" : "advanced") as Question["level"],
    };
  })
);

// Issue #24, Stage 5: the previous COMPLEX_QUESTIONS block (18 subordinate-clause
// items sourced from complex-questions.ts) has been removed. Those sentences used
// heavier constructions ("aunque...", "lo que...", "cada vez que...") that were the
// weakest fit for the A2-B1 audience this quiz targets, and removing them brings the
// dataset to exactly the 150-question target already reached by QUESTION_BANKS above.
export const ALL_QUESTIONS = QUESTIONS.map(applySourcedQuestionPair).map(withItemExplanation(GUSTAR_EXPLANATIONS));
