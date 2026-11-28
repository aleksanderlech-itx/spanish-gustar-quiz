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

  // --- imperfect subjunctive ---
  [11026, "imperfect subjunctive", "Si", "más dinero, viajaría por todo el mundo.", "tuviera", "tendría", "If I had more money, I would travel all over the world.", "basic", "tener"],
  [11027, "imperfect subjunctive", "Si yo", "tú, hablaría con ella hoy mismo.", "fuera", "sería", "If I were you, I would talk to her today.", "intermediate", "ser"],
  [11028, "imperfect subjunctive", "Si yo", "volar, iría a verte cada día.", "pudiera", "podría", "If I could fly, I would go and see you every day.", "intermediate", "poder"],
  [11029, "imperfect subjunctive", "Si mi hermano", "más, sacaría mejores notas.", "estudiara", "estudiaría", "If my brother studied more, he would get better marks.", "basic", "estudiar"],
  [11030, "imperfect subjunctive", "Compraríamos esa casa si", "más barata.", "fuera", "sería", "We would buy that house if it were cheaper.", "intermediate", "ser"],
  [11031, "imperfect subjunctive", "Si", "en la playa, nadaríamos todos los días.", "viviéramos", "viviríamos", "If we lived by the beach, we would swim every day.", "intermediate", "vivir"],
  [11032, "imperfect subjunctive", "Si tú", "a cocinar, no comerías siempre pizza.", "supieras", "sabrías", "If you knew how to cook, you wouldn't always eat pizza.", "intermediate", "saber"],
  [11033, "imperfect subjunctive", "Mis padres estarían más tranquilos si los", "más a menudo.", "llamaras", "llamarías", "My parents would be calmer if you called them more often.", "intermediate", "llamar"],
  [11034, "imperfect subjunctive", "Si no", "que trabajar, aprendería a tocar la guitarra.", "tuviera", "tendría", "If I didn't have to work, I would learn to play the guitar.", "intermediate", "tener"],
  [11035, "imperfect subjunctive", "Si ellos", "la verdad, se enfadarían.", "supieran", "sabrían", "If they knew the truth, they would get angry.", "intermediate", "saber"],
  [11036, "imperfect subjunctive", "Te ayudaría con la mudanza si no", "de viaje.", "estuviera", "estaría", "I would help you with the move if I weren't away on a trip.", "intermediate", "estar"],
  [11037, "imperfect subjunctive", "Si", "la lotería, ¿qué harías?", "ganaras", "ganarías", "If you won the lottery, what would you do?", "basic", "ganar"],
  [11038, "imperfect subjunctive", "Si el restaurante", "más cerca, cenaríamos allí más a menudo.", "estuviera", "estaría", "If the restaurant were closer, we would have dinner there more often.", "basic", "estar"],
  [11039, "imperfect subjunctive", "Yo iría a la boda si me", ".", "invitaran", "invitarían", "I would go to the wedding if they invited me.", "intermediate", "invitar"],
  [11040, "imperfect subjunctive", "Si usted", "más agua, se sentiría mejor.", "bebiera", "bebería", "If you drank more water, you would feel better.", "intermediate", "beber"],
  [11041, "imperfect subjunctive", "Si nosotros", "un perro, lo sacaríamos a pasear cada mañana.", "tuviéramos", "tendríamos", "If we had a dog, we would take it for a walk every morning.", "basic", "tener"],
  [11042, "imperfect subjunctive", "Ana estaría más contenta si su jefe la", "más.", "valorara", "valoraría", "Ana would be happier if her boss valued her more.", "advanced", "valorar"],
  [11043, "imperfect subjunctive", "Si yo", "más alto, jugaría al baloncesto.", "fuera", "sería", "If I were taller, I would play basketball.", "basic", "ser"],
  [11044, "imperfect subjunctive", "Si los niños", "antes, no estarían tan cansados por la mañana.", "se acostaran", "se acostarían", "If the children went to bed earlier, they wouldn't be so tired in the morning.", "intermediate", "acostarse"],
  [11045, "imperfect subjunctive", "¿Qué harías tú si", "en otro país?", "vivieras", "vivirías", "What would you do if you lived in another country?", "basic", "vivir"],
  [11046, "imperfect subjunctive", "Si", "hablar con un animal, ¿cuál elegirías?", "pudieras", "podrías", "If you could talk to an animal, which one would you choose?", "intermediate", "poder"],
  [11047, "imperfect subjunctive", "Si mis amigos", "en mi ciudad, los vería todos los fines de semana.", "vivieran", "vivirán", "If my friends lived in my city, I would see them every weekend.", "intermediate", "vivir"],
  [11048, "imperfect subjunctive", "Llegaríamos antes si", "el metro en vez del autobús.", "tomáramos", "tomaríamos", "We would get there sooner if we took the metro instead of the bus.", "intermediate", "tomar"],
  [11049, "imperfect subjunctive", "Si ella", "más paciencia, sería una buena profesora.", "tuviera", "tendrá", "If she had more patience, she would be a good teacher.", "intermediate", "tener"],
  [11050, "imperfect subjunctive", "Si", "sol, iríamos a la playa, pero está lloviendo.", "hiciera", "haría", "If it were sunny, we would go to the beach, but it is raining.", "intermediate", "hacer"],
  [11051, "imperfect subjunctive", "Hablaría mejor inglés si", "un año en Londres.", "pasara", "pasaría", "I would speak better English if I spent a year in London.", "intermediate", "pasar"],
  [11052, "imperfect subjunctive", "Si ustedes", "el tren de las ocho, llegarían a tiempo.", "tomaran", "tomarán", "If you took the eight o'clock train, you would arrive on time.", "intermediate", "tomar"],
  [11053, "imperfect subjunctive", "Si", "más horas, estaría de mejor humor.", "durmiera", "dormiría", "If I slept more hours, I would be in a better mood.", "advanced", "dormir"],
  [11054, "imperfect subjunctive", "Mi abuela sería feliz si", "a verla más a menudo.", "fuéramos", "iríamos", "My grandmother would be happy if we went to see her more often.", "advanced", "ir"],
  [11055, "imperfect subjunctive", "Si tú me", "la verdad, te perdonaría.", "dijeras", "dirías", "If you told me the truth, I would forgive you.", "advanced", "decir"],

  // --- regular conditional ---
  [11056, "regular conditional", "Si vivieras más cerca, te", "más a menudo.", "visitaría", "visitaré", "If you lived closer, I would visit you more often.", "basic", "visitar"],
  [11057, "regular conditional", "Si tuviera un jardín,", "tomates y lechugas.", "plantaría", "plantaré", "If I had a garden, I would grow tomatoes and lettuces.", "intermediate", "plantar"],
  [11058, "regular conditional", "Nosotros", "más si el gimnasio estuviera cerca.", "entrenaríamos", "entrenaremos", "We would train more if the gym were nearby.", "intermediate", "entrenar"],
  [11059, "regular conditional", "Si ganara la lotería,", "un viaje alrededor del mundo.", "organizaría", "organizaré", "If I won the lottery, I would organise a trip around the world.", "intermediate", "organizar"],
  [11060, "regular conditional", "Si mi hermana supiera conducir,", "al trabajo en coche.", "iría", "irá", "If my sister knew how to drive, she would go to work by car.", "basic", "ir"],
  [11061, "regular conditional", "Tú", "mejor si apagaras el móvil por la noche.", "dormirías", "dormirás", "You would sleep better if you switched off your phone at night.", "intermediate", "dormir"],
  [11062, "regular conditional", "Si hiciera buen tiempo,", "en la terraza.", "comeríamos", "comeremos", "If the weather were nice, we would eat on the terrace.", "basic", "comer"],
  [11063, "regular conditional", "Si los hoteles fueran más baratos, más turistas", "la ciudad.", "visitarían", "visitarán", "If the hotels were cheaper, more tourists would visit the city.", "intermediate", "visitar"],
  [11064, "regular conditional", "Yo", "más libros si tuviera más tiempo libre.", "leería", "leeré", "I would read more books if I had more free time.", "basic", "leer"],
  [11065, "regular conditional", "Si usted probara este plato, le", ".", "encantaría", "encantará", "If you tried this dish, you would love it.", "intermediate", "encantar"],
  [11066, "regular conditional", "Si ellos hablaran español,", "mejor con sus vecinos.", "se entenderían", "se entenderán", "If they spoke Spanish, they would get on better with their neighbours.", "intermediate", "entenderse"],
  [11067, "regular conditional", "Mi padre", "antes si no tuviera tanto trabajo.", "se jubilaría", "se jubilará", "My father would retire earlier if he didn't have so much work.", "advanced", "jubilarse"],
  [11068, "regular conditional", "Si estudiaras medicina,", "una excelente doctora.", "serías", "serás", "If you studied medicine, you would be an excellent doctor.", "basic", "ser"],
  [11069, "regular conditional", "Si el museo abriera los lunes, lo", "hoy.", "veríamos", "veremos", "If the museum opened on Mondays, we would see it today.", "intermediate", "ver"],
  [11070, "regular conditional", "Ustedes", "dinero si compraran los billetes por internet.", "ahorrarían", "ahorrarán", "You would save money if you bought the tickets online.", "intermediate", "ahorrar"],
  [11071, "regular conditional", "Si yo fuera el alcalde,", "más parques en la ciudad.", "construiría", "construiré", "If I were the mayor, I would build more parks in the city.", "intermediate", "construir"],
  [11072, "regular conditional", "Si tuviéramos más espacio,", "a toda la familia en Navidad.", "invitaríamos", "invitaremos", "If we had more space, we would invite the whole family at Christmas.", "intermediate", "invitar"],
  [11073, "regular conditional", "¿Me", "si te lo pidiera?", "ayudarías", "ayudarás", "Would you help me if I asked you?", "basic", "ayudar"],
  [11074, "regular conditional", "Si no lloviera tanto, mi madre", "más en el jardín.", "trabajaría", "trabajará", "If it didn't rain so much, my mother would work more in the garden.", "basic", "trabajar"],
  [11075, "regular conditional", "Si pudieras cambiar algo de tu vida, ¿qué", "?", "cambiarías", "cambiarás", "If you could change something in your life, what would you change?", "intermediate", "cambiar"],

  // --- irregular conditional ---
  [11076, "irregular conditional", "Yo", "ir a la fiesta si tuviera tiempo.", "podría", "podería", "I would be able to go to the party if I had time.", "basic", "poder"],
  [11077, "irregular conditional", "Si estudiaras más,", "aprobar todas las asignaturas.", "podrías", "poderías", "If you studied more, you could pass all your subjects.", "basic", "poder"],
  [11078, "irregular conditional", "Mis hermanos", "venir el sábado si no trabajaran.", "podrían", "poderían", "My brothers could come on Saturday if they weren't working.", "intermediate", "poder"],
  [11079, "irregular conditional", "Si viviéramos en el campo,", "más tiempo libre.", "tendríamos", "teneríamos", "If we lived in the countryside, we would have more free time.", "intermediate", "tener"],
  [11080, "irregular conditional", "Si mi padre dejara de fumar,", "más energía.", "tendría", "tenería", "If my father stopped smoking, he would have more energy.", "basic", "tener"],
  [11081, "irregular conditional", "Tú no", "tantos problemas si escucharas a tus padres.", "tendrías", "tendrás", "You wouldn't have so many problems if you listened to your parents.", "intermediate", "tener"],
  [11082, "irregular conditional", "Si tuviera más tiempo,", "deporte todos los días.", "haría", "hacería", "If I had more time, I would do sport every day.", "basic", "hacer"],
  [11083, "irregular conditional", "Si hubiera nieve,", "un muñeco de nieve en el jardín.", "haríamos", "haceríamos", "If there were snow, we would make a snowman in the garden.", "intermediate", "hacer"],
  [11084, "irregular conditional", "¿Qué", "ustedes si perdieran el último tren?", "harían", "hacerían", "What would you do if you missed the last train?", "intermediate", "hacer"],
  [11085, "irregular conditional", "Si yo fuera tú, le", "la verdad.", "diría", "deciría", "If I were you, I would tell him the truth.", "intermediate", "decir"],
  [11086, "irregular conditional", "Si alguien te ofreciera ese trabajo, ¿qué le", "?", "dirías", "decirías", "If someone offered you that job, what would you say to them?", "intermediate", "decir"],
  [11087, "irregular conditional", "Si pudiera elegir,", "vivir cerca del mar.", "querría", "querería", "If I could choose, I would want to live near the sea.", "intermediate", "querer"],
  [11088, "irregular conditional", "Mis hijos", "un perro si tuviéramos un jardín más grande.", "querrían", "quererían", "My children would want a dog if we had a bigger garden.", "advanced", "querer"],
  [11089, "irregular conditional", "Si leyeras el manual,", "cómo funciona la máquina.", "sabrías", "saberías", "If you read the manual, you would know how the machine works.", "intermediate", "saber"],
  [11090, "irregular conditional", "Si los alumnos repasaran en casa,", "las respuestas del examen.", "sabrían", "saberían", "If the students revised at home, they would know the answers in the exam.", "intermediate", "saber"],
  [11091, "irregular conditional", "Yo", "más temprano si el autobús pasara antes.", "saldría", "saliría", "I would leave earlier if the bus came sooner.", "intermediate", "salir"],
  [11092, "irregular conditional", "Si no lloviera,", "a dar un paseo.", "saldríamos", "saliríamos", "If it weren't raining, we would go out for a walk.", "basic", "salir"],
  [11093, "irregular conditional", "Si te invitara a mi casa, ¿", "?", "vendrías", "venirías", "If I invited you to my house, would you come?", "intermediate", "venir"],
  [11094, "irregular conditional", "Mis abuelos", "más a menudo si viviéramos más cerca.", "vendrían", "venirían", "My grandparents would come more often if we lived closer.", "intermediate", "venir"],
  [11095, "irregular conditional", "Si tuviera un vestido rojo, me lo", "para la boda.", "pondría", "ponería", "If I had a red dress, I would wear it to the wedding.", "intermediate", "poner"],
  [11096, "irregular conditional", "Si hiciera frío, los niños se", "el abrigo.", "pondrían", "ponerían", "If it were cold, the children would put their coats on.", "basic", "poner"],
  [11097, "irregular conditional", "En esta calle", "más tiendas si hubiera más turistas.", "habría", "habería", "There would be more shops in this street if there were more tourists.", "advanced", "haber"],
  [11098, "irregular conditional", "Si el concierto fuera gratis,", "mucha más gente.", "habría", "habería", "If the concert were free, there would be many more people.", "intermediate", "haber"],
  [11099, "irregular conditional", "Si el coche fuera más grande,", "todos en él.", "cabríamos", "caberíamos", "If the car were bigger, we would all fit in it.", "advanced", "caber"],
  [11100, "irregular conditional", "Esta casa", "mucho más si tuviera piscina.", "valdría", "valería", "This house would be worth much more if it had a pool.", "advanced", "valer"],
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
