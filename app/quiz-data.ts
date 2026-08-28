import { TRANSLATIONS } from "./translations.ts";

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

export const QUESTION_BANKS: Record<string, Array<[string, string, "s" | "p", string]>> = {
  gustar: [
    ["A Marta le", "el café colombiano.", "s", "el café colombiano"], ["Me", "los conciertos de rock.", "p", "los conciertos"], ["¿Te", "viajar en tren?", "s", "the activity viajar"], ["Nos", "esta canción española.", "s", "esta canción"], ["A mis padres les", "las ciudades pequeñas.", "p", "las ciudades"], ["No le", "levantarse temprano.", "s", "the activity levantarse"], ["A Juan le", "la comida picante.", "s", "la comida"], ["¿A ustedes les", "estos ejercicios?", "p", "estos ejercicios"], ["Les", "caminar por la montaña.", "s", "the activity caminar"], ["A mí me", "las películas antiguas.", "p", "las películas"], ["A Laura le", "bailar salsa.", "s", "the activity bailar"], ["No nos", "los hoteles grandes.", "p", "los hoteles"], ["¿Le", "esta chaqueta azul?", "s", "esta chaqueta"], ["A los niños les", "los cuentos cortos.", "p", "los cuentos"], ["Te", "cocinar para tus amigos.", "s", "the activity cocinar"], ["Me", "la música en directo.", "s", "la música"], ["A Pedro y Ana les", "las rutas en bicicleta.", "p", "las rutas"], ["Nos", "aprender idiomas.", "s", "the activity aprender"], ["¿Les", "el nuevo restaurante?", "s", "el restaurante"], ["No te", "estas botas negras.", "p", "estas botas"], ["A usted le", "leer antes de dormir.", "s", "the activity leer"], ["Me", "los domingos tranquilos.", "p", "los domingos"], ["A Carlos le", "la cerveza checa.", "s", "la cerveza"], ["Nos", "las excursiones largas.", "p", "las excursiones"], ["¿Te", "trabajar desde casa?", "s", "the activity trabajar"], ["A ellas les", "este barrio.", "s", "este barrio"], ["No me", "los vuelos nocturnos.", "p", "los vuelos"], ["A Pablo le", "nadar en el mar.", "s", "the activity nadar"], ["¿A ustedes les", "la paella?", "s", "la paella"], ["Les", "estas fotografías.", "p", "estas fotografías"], ["A nosotros nos", "salir los viernes.", "s", "the activity salir"], ["Te", "el clima de España.", "s", "el clima"], ["A Sofía le", "los libros de historia.", "p", "los libros"], ["Me", "conducir por carreteras tranquilas.", "s", "the activity conducir"], ["¿Le", "las clases de español?", "p", "las clases"]
  ],
  encantar: [
    ["Me", "esta banda.", "s", "esta banda"], ["A Elena le", "los mercados locales.", "p", "los mercados"], ["Nos", "viajar sin prisa.", "s", "the activity viajar"], ["¿Te", "estas tapas?", "p", "estas tapas"], ["A los niños les", "el chocolate.", "s", "el chocolate"], ["Le", "bailar flamenco.", "s", "the activity bailar"], ["A ustedes les", "las playas del norte.", "p", "las playas"], ["A mí me", "la guitarra eléctrica.", "s", "la guitarra"], ["Les", "hacer senderismo.", "s", "the activity hacer"], ["¿Nos", "los pueblos blancos?", "p", "los pueblos"], ["A Julia le", "esta novela.", "s", "esta novela"], ["Te", "los desayunos largos.", "p", "los desayunos"], ["A mis amigos les", "cocinar juntos.", "s", "the activity cocinar"], ["Me", "las montañas.", "p", "las montañas"], ["A usted le", "el arte moderno.", "s", "el arte"], ["Nos", "escuchar música en vivo.", "s", "the activity escuchar"], ["¿Les", "estas vistas?", "p", "estas vistas"], ["A Roberto le", "la arquitectura antigua.", "s", "la arquitectura"], ["A ustedes les", "los viajes en bicicleta.", "p", "los viajes"], ["Te", "aprender palabras nuevas.", "s", "the activity aprender"]
  ],
  interesar: [
    ["Me", "la historia de España.", "s", "la historia"], ["A Daniel le", "los idiomas.", "p", "los idiomas"], ["Nos", "aprender sobre otras culturas.", "s", "the activity aprender"], ["¿Te", "estas noticias?", "p", "estas noticias"], ["A ellos les", "el ciclismo.", "s", "el ciclismo"], ["No le", "hablar de política.", "s", "the activity hablar"], ["A ustedes les", "los museos pequeños.", "p", "los museos"], ["A mí me", "la tecnología.", "s", "la tecnología"], ["Les", "conocer gente nueva.", "s", "the activity conocer"], ["¿Nos", "estos cursos?", "p", "estos cursos"], ["A Paula le", "la fotografía.", "s", "la fotografía"], ["Te", "los documentales.", "p", "los documentales"], ["A mis compañeros les", "mejorar su español.", "s", "the activity mejorar"], ["Me", "las rutas históricas.", "p", "las rutas"], ["A usted le", "el proyecto nuevo.", "s", "el proyecto"], ["Nos", "entender la gramática.", "s", "the activity entender"], ["¿Les", "estas propuestas?", "p", "estas propuestas"], ["A Tomás le", "la economía.", "s", "la economía"], ["A ustedes les", "los deportes de montaña.", "p", "los deportes"], ["Te", "leer en español.", "s", "the activity leer"]
  ],
  molestar: [
    ["Me", "el ruido de la calle.", "s", "el ruido"], ["A Sara le", "las luces fuertes.", "p", "las luces"], ["Nos", "esperar mucho tiempo.", "s", "the activity esperar"], ["¿Te", "estos comentarios?", "p", "estos comentarios"], ["A ellos les", "el humo.", "s", "el humo"], ["No le", "trabajar los sábados.", "s", "the activity trabajar"], ["A ustedes les", "los precios altos.", "p", "los precios"], ["A mí me", "la música demasiado alta.", "s", "la música"], ["Les", "levantarse tan temprano.", "s", "the activity levantarse"], ["¿Nos", "estas interrupciones?", "p", "estas interrupciones"], ["A David le", "el frío.", "s", "el frío"], ["Te", "los vuelos con escalas.", "p", "los vuelos"], ["A mis vecinos les", "oír al perro por la noche.", "s", "the activity oír"], ["Me", "las habitaciones oscuras.", "p", "las habitaciones"], ["A usted le", "este olor.", "s", "este olor"]
  ],
  importar: [
    ["Me", "la calidad del servicio.", "s", "la calidad"], ["A Luis le", "los pequeños detalles.", "p", "los detalles"], ["Nos", "llegar a tiempo.", "s", "the activity llegar"], ["¿Te", "estas diferencias?", "p", "estas diferencias"], ["A ellos les", "el resultado final.", "s", "el resultado"], ["No le", "trabajar solo.", "s", "the activity trabajar"], ["A ustedes les", "los horarios flexibles.", "p", "los horarios"], ["A mí me", "la opinión de mi familia.", "s", "la opinión"], ["Les", "mantenerse activos.", "s", "the activity mantenerse"], ["¿Nos", "estos cambios?", "p", "estos cambios"], ["A Eva le", "el medio ambiente.", "s", "el medio ambiente"], ["Te", "las condiciones del viaje.", "p", "las condiciones"], ["A mis colegas les", "terminar bien el proyecto.", "s", "the activity terminar"], ["Me", "las respuestas claras.", "p", "las respuestas"], ["A usted le", "esta decisión.", "s", "esta decisión"]
  ],
  faltar: [
    ["Me", "un billete para Madrid.", "s", "un billete"], ["A Clara le", "dos documentos.", "p", "dos documentos"], ["Nos", "terminar el último ejercicio.", "s", "the activity terminar"], ["¿Te", "estas páginas?", "p", "estas páginas"], ["A ellos les", "un poco de tiempo.", "s", "un poco de tiempo"], ["Le", "practicar más.", "s", "the activity practicar"], ["A ustedes les", "las entradas para el concierto.", "p", "las entradas"], ["A mí me", "una buena mochila.", "s", "una mochila"], ["Les", "visitar dos ciudades.", "s", "the activity visitar"], ["¿Nos", "algunas sillas?", "p", "algunas sillas"]
  ],
  quedar: [
    ["Me", "una semana de vacaciones.", "s", "una semana"], ["A Raúl le", "tres preguntas.", "p", "tres preguntas"], ["Nos", "reservar el hotel.", "s", "the activity reservar"], ["¿Te", "bien estos pantalones?", "p", "estos pantalones"], ["A ellos les", "poco dinero.", "s", "poco dinero"], ["Le", "preparar la cena.", "s", "the activity preparar"], ["A ustedes les", "dos días libres.", "p", "dos días"], ["A mí me", "bien esta camisa.", "s", "esta camisa"], ["Les", "recorrer diez kilómetros.", "s", "the activity recorrer"], ["¿Nos", "suficientes botellas de agua?", "p", "suficientes botellas"]
  ],
  doler: [
    ["Me", "la espalda.", "s", "la espalda"], ["A Carmen le", "las rodillas.", "p", "las rodillas"], ["Nos", "caminar con estas botas.", "s", "the activity caminar"], ["¿Te", "los hombros?", "p", "los hombros"], ["A ellos les", "la cabeza.", "s", "la cabeza"], ["Le", "subir escaleras.", "s", "the activity subir"], ["A ustedes les", "los pies.", "p", "los pies"], ["A mí me", "el brazo derecho.", "s", "el brazo"], ["Les", "hacer este movimiento.", "s", "the activity hacer"], ["¿Nos", "las piernas después de correr?", "p", "las piernas"], ["A Andrés le", "la garganta.", "s", "la garganta"], ["Te", "los dedos.", "p", "los dedos"], ["A mis amigos les", "dormir en el suelo.", "s", "the activity dormir"], ["Me", "las muñecas.", "p", "las muñecas"], ["A usted le", "el cuello.", "s", "el cuello"]
  ],
  parecer: [
    ["Me", "interesante esta idea.", "s", "esta idea"], ["A Laura le", "caros estos hoteles.", "p", "estos hoteles"], ["Nos", "útil practicar cada día.", "s", "the activity practicar"], ["¿Te", "claras estas instrucciones?", "p", "estas instrucciones"], ["A ellos les", "buena la propuesta.", "s", "la propuesta"], ["Le", "difícil conducir de noche.", "s", "the activity conducir"], ["A ustedes les", "largos los ejercicios.", "p", "los ejercicios"], ["A mí me", "perfecta esta solución.", "s", "esta solución"], ["Les", "mejor salir temprano.", "s", "the activity salir"], ["¿Nos", "correctas estas respuestas?", "p", "estas respuestas"]
  ]
};

const QUESTIONS: Question[] = Object.entries(QUESTION_BANKS).flatMap(([infinitive, rows]) =>
  rows.map(([before, after, number, subject], index) => {
    const pronounMatch = before.match(/\b(me|te|le|nos|les)\b/i);
    const objectPronoun = pronounMatch?.[1]?.toLocaleLowerCase("es") ?? "";
    const promptBefore = pronounMatch
      ? `${before.slice(0, pronounMatch.index)}${before.slice((pronounMatch.index ?? 0) + pronounMatch[0].length)}`.trimEnd()
      : before;
    const verbAnswer = VERB_FORMS[infinitive][number === "s" ? 0 : 1];
    return {
    id: Object.entries(QUESTION_BANKS).slice(0, Object.keys(QUESTION_BANKS).indexOf(infinitive)).reduce((n, [, r]) => n + r.length, 0) + index + 1,
    before: promptBefore,
    after,
    infinitive,
    answer: `${objectPronoun} ${verbAnswer}`,
    verbAnswer,
    objectPronoun,
    explanation: `Use “${objectPronoun}” as the indirect object pronoun. ${subject.charAt(0).toUpperCase() + subject.slice(1)} ${number === "s" ? "is singular (or an infinitive activity)" : "is plural"}, so the verb is “${verbAnswer}”.`,
    translations: {
      en: TRANSLATIONS[Object.entries(QUESTION_BANKS).slice(0, Object.keys(QUESTION_BANKS).indexOf(infinitive)).reduce((n, [, r]) => n + r.length, 0) + index],
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
export const ALL_QUESTIONS = QUESTIONS;
