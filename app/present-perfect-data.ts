import type { Question } from "./quiz-data";
import { applySourcedQuestionPair } from "./sourced-quiz-content.ts";
import { withItemExplanation } from "./item-explanation.ts";
import { PRESENT_PERFECT_EXPLANATIONS } from "./explanations-present-perfect.ts";

/** Participle groups double as the topic's "Usage" filter values (stored in `infinitive`). */
export const PRESENT_PERFECT_GROUPS = ["regular -ado", "regular -ido", "irregular participle", "haber not tener", "negatives and questions"] as const;
export type PresentPerfectGroup = (typeof PRESENT_PERFECT_GROUPS)[number];

/** Present of haber, the only auxiliary of the perfect, in person order. */
export const HABER_PRESENT = ["he", "has", "ha", "hemos", "habéis", "han"] as const;
const PLURAL_HABER = new Set<string>(["hemos", "habéis", "han"]);

type Seed = readonly [
  group: PresentPerfectGroup,
  before: string,
  after: string,
  /** Haber + participle, with any pronoun or adverb that must come before haber. */
  answer: string,
  /** One wrong option: wrong haber person, regularised participle, tener, infinitive, gerund or a split verb. */
  distractor: string,
  en: string,
  level: Question["level"],
  /** Shown in the blank: the infinitive. */
  blankHint: string,
];

// Regional scope matches the other banks: tú, usted, vosotros (habéis) and ustedes (han); no voseo.
// The preterite is never a wrong option: it is correct for recent events in Latin American Spanish.
// "Haber not tener" items use intransitive verbs only, so tener + participle can never be a valid reading.
const seed: readonly Seed[] = [
  // --- regular -ado ---
  ["regular -ado", "Hoy yo", "con mi madre por teléfono.", "he hablado", "ha hablado", "Today I have spoken to my mother on the phone.", "basic", "hablar"],
  ["regular -ado", "¿Tú", "alguna vez en un tren nocturno?", "has viajado", "has viajar", "Have you ever travelled on a night train?", "basic", "viajar"],
  ["regular -ado", "Esta semana mi hermano", "mucho en la oficina.", "ha trabajado", "han trabajado", "My brother has worked a lot at the office this week.", "basic", "trabajar"],
  ["regular -ado", "Nosotros ya", "la cena.", "hemos preparado", "habemos preparado", "We have already made dinner.", "intermediate", "preparar"],
  ["regular -ado", "¿Vosotros", "el billete de vuelta?", "habéis comprado", "han comprado", "Have you all bought the return ticket?", "intermediate", "comprar"],
  ["regular -ado", "Mis padres", "la casa este verano.", "han pintado", "ha pintado", "My parents have painted the house this summer.", "basic", "pintar"],
  ["regular -ado", "Este año yo", "Japón por primera vez.", "he visitado", "he visitar", "This year I have visited Japan for the first time.", "basic", "visitar"],
  ["regular -ado", "Ustedes", "muy bien hoy.", "han jugado", "habéis jugado", "You have played very well today.", "intermediate", "jugar"],
  ["regular -ado", "La profesora", "la lección dos veces.", "ha explicado", "ha explicada", "The teacher has explained the lesson twice.", "intermediate", "explicar"],
  ["regular -ado", "¿Usted", "ya la factura?", "ha pagado", "has pagado", "Have you already paid the bill?", "intermediate", "pagar"],
  ["regular -ado", "Hoy nosotros", "en un restaurante italiano.", "hemos cenado", "hemos cenar", "Today we have had dinner at an Italian restaurant.", "basic", "cenar"],
  ["regular -ado", "Mis amigos", "toda la noche.", "han bailado", "han bailando", "My friends have danced all night.", "intermediate", "bailar"],
  ["regular -ado", "Yo nunca", "a caballo.", "he montado", "he montar", "I have never ridden a horse.", "basic", "montar"],
  ["regular -ado", "Esta mañana tú", "el autobús de las ocho.", "has tomado", "has tomar", "This morning you took the eight o'clock bus.", "basic", "tomar"],
  ["regular -ado", "El tren", "con veinte minutos de retraso.", "ha llegado", "han llegado", "The train has arrived twenty minutes late.", "basic", "llegar"],
  ["regular -ado", "Las niñas", "toda la tarde en el parque.", "han patinado", "ha patinado", "The girls have been skating in the park all afternoon.", "intermediate", "patinar"],
  ["regular -ado", "Vosotros", "mucho hoy en clase.", "habéis hablado", "habéis hablados", "You all have talked a lot in class today.", "intermediate", "hablar"],
  ["regular -ado", "¿Ya", "tú las maletas?", "has preparado", "ha preparado", "Have you packed your suitcases yet?", "basic", "preparar"],
  ["regular -ado", "Últimamente yo", "mucho español.", "he estudiado", "he estudiar", "Lately I have studied a lot of Spanish.", "basic", "estudiar"],
  ["regular -ado", "Mi abuela", "una tarta para todos.", "ha horneado", "ha horneada", "My grandmother has baked a cake for everyone.", "intermediate", "hornear"],
  ["regular -ado", "Nosotros", "en el lago tres veces este mes.", "hemos nadado", "han nadado", "We have swum in the lake three times this month.", "basic", "nadar"],
  ["regular -ado", "Los vecinos", "el coche delante de mi puerta.", "han aparcado", "ha aparcado", "The neighbours have parked the car in front of my door.", "intermediate", "aparcar"],
  ["regular -ado", "¿Ustedes", "el museo nuevo?", "han visitado", "habéis visitado", "Have you visited the new museum?", "intermediate", "visitar"],
  ["regular -ado", "Este fin de semana yo", "mi habitación.", "he limpiado", "he limpiar", "This weekend I have cleaned my room.", "basic", "limpiar"],
  ["regular -ado", "Mi jefe", "la reunión hasta el lunes.", "ha aplazado", "han aplazado", "My boss has postponed the meeting until Monday.", "intermediate", "aplazar"],
  ["regular -ado", "Tú", "muy bien en el examen.", "has contestado", "has contestar", "You have answered very well in the exam.", "basic", "contestar"],
  ["regular -ado", "Hoy los alumnos", "muchas preguntas.", "han preguntado", "han preguntando", "Today the students have asked a lot of questions.", "intermediate", "preguntar"],
  ["regular -ado", "¿Vosotros", "ya el cumpleaños de Ana?", "habéis celebrado", "habéis celebrar", "Have you all celebrated Ana's birthday yet?", "intermediate", "celebrar"],
  ["regular -ado", "Este mes ella", "de leer dos libros.", "ha terminado", "he terminado", "This month she has finished reading two books.", "basic", "terminar"],
  ["regular -ado", "Yo", "las llaves en algún sitio.", "he dejado", "ha dejado", "I've left the keys somewhere.", "basic", "dejar"],
  ["regular -ado", "Nosotros", "a todos nuestros amigos a la boda.", "hemos invitado", "hemos invitados", "We have invited all our friends to the wedding.", "intermediate", "invitar"],
  ["regular -ado", "¿Usted", "alguna vez en el extranjero?", "ha trabajado", "has trabajado", "Have you ever worked abroad?", "intermediate", "trabajar"],
  ["regular -ado", "Los precios", "mucho este año.", "han aumentado", "ha aumentado", "Prices have gone up a lot this year.", "intermediate", "aumentar"],
  ["regular -ado", "Hasta ahora todo", "muy bien.", "ha funcionado", "han funcionado", "So far everything has worked very well.", "intermediate", "funcionar"],
  ["regular -ado", "Vosotros", "mucho para el examen, ¿verdad?", "habéis estudiado", "habéis estudiando", "You all have studied a lot for the exam, right?", "intermediate", "estudiar"],

  // --- regular -ido ---
  ["regular -ido", "Hoy yo", "demasiado chocolate.", "he comido", "he comer", "Today I have eaten too much chocolate.", "basic", "comer"],
  ["regular -ido", "¿Tú", "ya el correo de Marta?", "has leído", "has leer", "Have you read Marta's email yet?", "intermediate", "leer"],
  ["regular -ido", "Mi hija", "dos centímetros este año.", "ha crecido", "ha crecer", "My daughter has grown two centimetres this year.", "basic", "crecer"],
  ["regular -ido", "Nosotros", "en esta ciudad desde 2010.", "hemos vivido", "hemos vivir", "We have lived in this city since 2010.", "intermediate", "vivir"],
  ["regular -ido", "Mis primos", "de vacaciones esta mañana.", "han salido", "ha salido", "My cousins left on holiday this morning.", "basic", "salir"],
  ["regular -ido", "¿Vosotros", "bien en el hotel?", "habéis dormido", "habéis dormir", "Have you all slept well at the hotel?", "intermediate", "dormir"],
  ["regular -ido", "Ella", "un premio por su novela.", "ha recibido", "han recibido", "She has received a prize for her novel.", "basic", "recibir"],
  ["regular -ido", "¿Ustedes", "la noticia?", "han oído", "habéis oído", "Have you heard the news?", "intermediate", "oír"],
  ["regular -ido", "Hoy yo", "a tus padres.", "he conocido", "ha conocido", "Today I have met your parents.", "basic", "conocer"],
  ["regular -ido", "El niño ya", "toda la leche.", "ha bebido", "ha beber", "The boy has already drunk all the milk.", "basic", "beber"],
  ["regular -ido", "Nosotros", "la casa de la playa.", "hemos vendido", "hemos vender", "We have sold the beach house.", "basic", "vender"],
  ["regular -ido", "Las temperaturas", "mucho esta semana.", "han subido", "ha subido", "Temperatures have risen a lot this week.", "intermediate", "subir"],
  ["regular -ido", "¿Tú", "alguna vez a una ópera?", "has ido", "has ir", "Have you ever been to an opera?", "basic", "ir"],
  ["regular -ido", "Mi abuelo", "en su pueblo toda la vida.", "ha vivido", "han vivido", "My grandfather has lived in his village all his life.", "basic", "vivir"],
  ["regular -ido", "Esta mañana yo", "en bici al trabajo.", "he venido", "he vinido", "This morning I came to work by bike.", "intermediate", "venir"],
  ["regular -ido", "Vosotros", "la respuesta correcta.", "habéis elegido", "habéis elegir", "You all have chosen the right answer.", "intermediate", "elegir"],
  ["regular -ido", "Ellos", "mucho en este curso.", "han aprendido", "ha aprendido", "They have learned a lot on this course.", "basic", "aprender"],
  ["regular -ido", "¿Usted", "ya el menú?", "ha pedido", "has pedido", "Have you ordered from the menu yet?", "intermediate", "pedir"],
  ["regular -ido", "Yo nunca", "esa historia.", "he creído", "he creer", "I have never believed that story.", "intermediate", "creer"],
  ["regular -ido", "El equipo", "el partido de hoy.", "ha perdido", "han perdido", "The team has lost today's match.", "intermediate", "perder"],
  ["regular -ido", "Nosotras", "todas las preguntas.", "hemos entendido", "hemos entender", "We have understood all the questions.", "basic", "entender"],
  ["regular -ido", "¿Ustedes", "el vino para la cena?", "han traído", "han traer", "Have you brought the wine for dinner?", "intermediate", "traer"],
  ["regular -ido", "Tú", "diez kilómetros esta mañana.", "has corrido", "ha corrido", "You have run ten kilometres this morning.", "basic", "correr"],
  ["regular -ido", "La empresa", "a veinte personas este año.", "ha despedido", "han despedido", "The company has laid off twenty people this year.", "advanced", "despedir"],
  ["regular -ido", "Mis hermanos", "la tarta en partes iguales.", "han repartido", "ha repartido", "My brothers have shared out the cake equally.", "intermediate", "repartir"],
  ["regular -ido", "Yo ya", "a tu pregunta.", "he respondido", "he responder", "I have already answered your question.", "basic", "responder"],
  ["regular -ido", "¿Vosotros", "algo del accidente?", "habéis sabido", "han sabido", "Have you all heard anything about the accident?", "advanced", "saber"],
  ["regular -ido", "Esta semana ella", "a todas las clases.", "ha asistido", "ha asistir", "This week she has attended all the classes.", "intermediate", "asistir"],
  ["regular -ido", "Los niños", "sus juguetes con los primos.", "han compartido", "ha compartido", "The children have shared their toys with their cousins.", "basic", "compartir"],
  ["regular -ido", "Hasta hoy nadie", "resolver el misterio.", "ha conseguido", "han conseguido", "Until today nobody has managed to solve the mystery.", "advanced", "conseguir"],

  // --- irregular participle ---
  ["irregular participle", "Yo", "la ventana porque hace calor.", "he abierto", "he abrido", "I have opened the window because it's hot.", "basic", "abrir"],
  ["irregular participle", "¿Tú", "la última película de Almodóvar?", "has visto", "has veído", "Have you seen Almodóvar's latest film?", "basic", "ver"],
  ["irregular participle", "Mi madre", "una carta a su hermana.", "ha escrito", "ha escribido", "My mother has written a letter to her sister.", "basic", "escribir"],
  ["irregular participle", "Nosotros", "los deberes.", "hemos hecho", "hemos hacido", "We have done the homework.", "basic", "hacer"],
  ["irregular participle", "¿Qué te", "el médico?", "ha dicho", "ha decido", "What has the doctor told you?", "basic", "decir"],
  ["irregular participle", "Los niños", "el jarrón del salón.", "han roto", "han rompido", "The children have broken the vase in the living room.", "intermediate", "romper"],
  ["irregular participle", "Mi padre ya", "del trabajo.", "ha vuelto", "ha volvido", "My father has already come back from work.", "intermediate", "volver"],
  ["irregular participle", "¿Dónde", "vosotros las llaves?", "habéis puesto", "habéis ponido", "Where have you all put the keys?", "intermediate", "poner"],
  ["irregular participle", "El viejo perro de mis vecinos", "esta semana.", "ha muerto", "ha morido", "My neighbours' old dog has died this week.", "intermediate", "morir"],
  ["irregular participle", "Los científicos", "una nueva especie.", "han descubierto", "han descubrido", "The scientists have discovered a new species.", "advanced", "descubrir"],
  ["irregular participle", "Por fin yo", "el problema de matemáticas.", "he resuelto", "he resolvido", "At last I have solved the maths problem.", "advanced", "resolver"],
  ["irregular participle", "La nieve", "todo el jardín.", "ha cubierto", "ha cubrido", "The snow has covered the whole garden.", "advanced", "cubrir"],
  ["irregular participle", "¿Ya", "tú los libros a la biblioteca?", "has devuelto", "has devolvido", "Have you returned the books to the library yet?", "intermediate", "devolver"],
  ["irregular participle", "Ustedes", "mucho por nosotros.", "han hecho", "han hacido", "You have done a lot for us.", "basic", "hacer"],
  ["irregular participle", "Yo nunca", "un fantasma.", "he visto", "he veído", "I have never seen a ghost.", "basic", "ver"],
  ["irregular participle", "Mi hermana", "una canción para la boda.", "ha compuesto", "ha componido", "My sister has composed a song for the wedding.", "advanced", "componer"],
  ["irregular participle", "¿Quién", "la puerta?", "ha abierto", "ha abrido", "Who has opened the door?", "basic", "abrir"],
  ["irregular participle", "Nosotros", "la verdad a la policía.", "hemos dicho", "hemos decido", "We have told the police the truth.", "intermediate", "decir"],
  ["irregular participle", "Esta tarde vosotros", "la mesa.", "habéis puesto", "habéis ponido", "This afternoon you all have set the table.", "basic", "poner"],
  ["irregular participle", "Los turistas", "a su hotel.", "han vuelto", "han volvido", "The tourists have gone back to their hotel.", "intermediate", "volver"],
  ["irregular participle", "Ella", "los regalos en papel rojo.", "ha envuelto", "ha envolvido", "She has wrapped the presents in red paper.", "advanced", "envolver"],
  ["irregular participle", "Yo no", "nada a nadie.", "he dicho", "he decido", "I haven't told anyone anything.", "intermediate", "decir"],
  ["irregular participle", "Mis hijos ya", "sus maletas.", "han deshecho", "han deshacido", "My children have already unpacked their suitcases.", "advanced", "deshacer"],
  ["irregular participle", "El jefe", "un cambio de horario.", "ha propuesto", "ha proponido", "The boss has proposed a change of schedule.", "advanced", "proponer"],
  ["irregular participle", "¿Ustedes", "alguna vez un eclipse?", "han visto", "han veído", "Have you ever seen an eclipse?", "intermediate", "ver"],
  ["irregular participle", "Nosotros", "las ventanas para ventilar.", "hemos abierto", "hemos abrido", "We have opened the windows to air the room.", "basic", "abrir"],
  ["irregular participle", "Tú", "muchas tonterías hoy.", "has dicho", "has decido", "You have said a lot of silly things today.", "intermediate", "decir"],
  ["irregular participle", "Mis abuelos", "muchos cambios en el pueblo.", "han visto", "han vido", "My grandparents have seen many changes in the village.", "basic", "ver"],
  ["irregular participle", "¿Qué", "vosotros este fin de semana?", "habéis hecho", "habéis hacido", "What have you all done this weekend?", "intermediate", "hacer"],
  ["irregular participle", "El niño", "sus gafas.", "ha roto", "ha rompido", "The boy has broken his glasses.", "basic", "romper"],
  ["irregular participle", "Yo", "el libro en la estantería.", "he puesto", "he ponido", "I have put the book on the shelf.", "basic", "poner"],
  ["irregular participle", "Los periodistas", "toda la historia.", "han escrito", "han escribido", "The journalists have written the whole story.", "basic", "escribir"],
  ["irregular participle", "Usted", "un error en la factura.", "ha descubierto", "ha descubrido", "You have discovered an error in the invoice.", "advanced", "descubrir"],
  ["irregular participle", "Este año nosotros", "a Italia dos veces.", "hemos vuelto", "hemos volvido", "This year we have gone back to Italy twice.", "intermediate", "volver"],
  ["irregular participle", "¿Ya", "tú el café?", "has hecho", "has hacido", "Have you made the coffee yet?", "basic", "hacer"],
  ["irregular participle", "Las tiendas", "sus puertas a las diez.", "han abierto", "han abrido", "The shops have opened their doors at ten.", "intermediate", "abrir"],
  ["irregular participle", "El ayuntamiento", "el problema del tráfico.", "ha resuelto", "ha resolvido", "The town hall has solved the traffic problem.", "advanced", "resolver"],
  ["irregular participle", "Vosotros", "la verdad desde el principio.", "habéis dicho", "habéis decido", "You all have told the truth from the start.", "intermediate", "decir"],
  ["irregular participle", "Mi hermano", "su casa en venta.", "ha puesto", "ha ponido", "My brother has put his house up for sale.", "intermediate", "poner"],
  ["irregular participle", "Yo", "una novela de trescientas páginas.", "he escrito", "he escribido", "I have written a three-hundred-page novel.", "intermediate", "escribir"],
  ["irregular participle", "Los médicos", "un nuevo tratamiento.", "han propuesto", "han proponido", "The doctors have proposed a new treatment.", "advanced", "proponer"],
  ["irregular participle", "El resultado", "a todo el equipo.", "ha satisfecho", "ha satisfacido", "The result has satisfied the whole team.", "advanced", "satisfacer"],
  ["irregular participle", "El arquitecto", "los planos tres veces.", "ha rehecho", "ha rehacido", "The architect has redone the plans three times.", "advanced", "rehacer"],
  ["irregular participle", "Nosotras", "la mesa para diez personas.", "hemos puesto", "hemos ponido", "We have set the table for ten people.", "basic", "poner"],
  ["irregular participle", "Tú siempre", "la verdad.", "has dicho", "has decido", "You have always told the truth.", "basic", "decir"],

  // --- haber not tener ---
  ["haber not tener", "Hoy yo", "muy poco.", "he dormido", "tengo dormido", "Today I have slept very little.", "intermediate", "dormir"],
  ["haber not tener", "¿Tú", "ya con el director?", "has hablado", "tienes hablado", "Have you spoken to the director yet?", "intermediate", "hablar"],
  ["haber not tener", "Mi hermano", "tarde otra vez.", "ha llegado", "tiene llegado", "My brother has arrived late again.", "intermediate", "llegar"],
  ["haber not tener", "Nosotros", "tarde a la reunión.", "hemos llegado", "tenemos llegado", "We have arrived late to the meeting.", "intermediate", "llegar"],
  ["haber not tener", "Mis padres", "por toda Europa.", "han viajado", "tienen viajado", "My parents have travelled all over Europe.", "intermediate", "viajar"],
  ["haber not tener", "¿Vosotros ya", "del colegio?", "habéis vuelto", "tenéis vuelto", "Have you all come back from school yet?", "advanced", "volver"],
  ["haber not tener", "Ella", "mucho esta semana.", "ha llorado", "tiene llorado", "She has cried a lot this week.", "intermediate", "llorar"],
  ["haber not tener", "Ustedes", "muchísimo hoy.", "han caminado", "tienen caminado", "You have walked a huge amount today.", "intermediate", "caminar"],
  ["haber not tener", "Yo", "a muchos sitios este año.", "he ido", "tengo ido", "I have been to lots of places this year.", "intermediate", "ir"],
  ["haber not tener", "El bebé", "mucho este mes.", "ha crecido", "tiene crecido", "The baby has grown a lot this month.", "intermediate", "crecer"],
  ["haber not tener", "Tú", "muy bien en la carrera.", "has corrido", "tienes corrido", "You have run very well in the race.", "intermediate", "correr"],
  ["haber not tener", "Mis amigas", "de la fiesta muy tarde.", "han salido", "tienen salido", "My friends have left the party very late.", "intermediate", "salir"],
  ["haber not tener", "Nosotros", "en tres países distintos.", "hemos vivido", "tenemos vivido", "We have lived in three different countries.", "advanced", "vivir"],
  ["haber not tener", "Usted", "mucho últimamente.", "ha mejorado", "tiene mejorado", "You have improved a lot recently.", "advanced", "mejorar"],
  ["haber not tener", "¿Por qué", "tú tan tarde?", "has venido", "tienes venido", "Why have you come so late?", "intermediate", "venir"],
  ["haber not tener", "Vosotros", "demasiado hoy.", "habéis trabajado", "tenéis trabajado", "You all have worked too much today.", "advanced", "trabajar"],
  ["haber not tener", "Las llaves", "otra vez.", "han desaparecido", "tienen desaparecido", "The keys have disappeared again.", "advanced", "desaparecer"],
  ["haber not tener", "Mi abuela", "por fin del hospital.", "ha salido", "tiene salido", "My grandmother has finally come out of hospital.", "intermediate", "salir"],
  ["haber not tener", "Yo", "muchísimo esta tarde.", "he nadado", "tengo nadado", "I have swum a huge amount this afternoon.", "intermediate", "nadar"],
  ["haber not tener", "Ellos", "antes que nosotros.", "han llegado", "tienen llegado", "They have arrived before us.", "advanced", "llegar"],

  // --- negatives and questions ---
  ["negatives and questions", "¿El libro? Todavía no", ".", "lo he leído", "he lo leído", "The book? I haven't read it yet.", "intermediate", "leer"],
  ["negatives and questions", "Hoy", "a las seis.", "me he levantado", "he me levantado", "Today I got up at six.", "intermediate", "levantarse"],
  ["negatives and questions", "¿Tú ya", "?", "te has duchado", "has te duchado", "Have you showered yet?", "intermediate", "ducharse"],
  ["negatives and questions", "¿Tú", "?", "ya has comido", "has ya comido", "Have you eaten yet?", "intermediate", "comer"],
  ["negatives and questions", "Mis padres", "de casa.", "ya han salido", "han ya salido", "My parents have already left home.", "intermediate", "salir"],
  ["negatives and questions", "¿Las llaves? No sé dónde", ".", "las he puesto", "he las puesto", "The keys? I don't know where I've put them.", "advanced", "poner"],
  ["negatives and questions", "A mi hermana no", "la verdad.", "le hemos dicho", "hemos le dicho", "We haven't told my sister the truth.", "advanced", "decir"],
  ["negatives and questions", "¿Vosotros ya", "?", "os habéis vestido", "habéis os vestido", "Have you all got dressed yet?", "intermediate", "vestirse"],
  ["negatives and questions", "Mi jefe nunca", "un día de vacaciones.", "se ha tomado", "ha se tomado", "My boss has never taken a day off.", "advanced", "tomarse"],
  ["negatives and questions", "¿Ustedes ya", "?", "se han presentado", "han se presentado", "Have you introduced yourselves yet?", "intermediate", "presentarse"],
  ["negatives and questions", "Ellos todavía no", "la noticia.", "nos han dado", "han nos dado", "They still haven't given us the news.", "advanced", "dar"],
  ["negatives and questions", "¿Por qué no", "antes?", "me lo has dicho", "me has lo dicho", "Why haven't you told me before?", "advanced", "decir"],
  ["negatives and questions", "Yo", "en Argentina.", "nunca he estado", "he nunca estado", "I have never been to Argentina.", "intermediate", "estar"],
  ["negatives and questions", "¿La cena? Nosotros ya", ".", "la hemos preparado", "hemos la preparado", "Dinner? We have already made it.", "intermediate", "preparar"],
  ["negatives and questions", "¿Mis gafas? ¿Vosotros", "?", "las habéis visto", "habéis las visto", "My glasses? Have you all seen them?", "intermediate", "ver"],
  ["negatives and questions", "Ella todavía no", ".", "se ha despertado", "ha se despertado", "She hasn't woken up yet.", "intermediate", "despertarse"],
  ["negatives and questions", "A los niños ya", "el cuento.", "les he leído", "he les leído", "I've already read the children the story.", "advanced", "leer"],
  ["negatives and questions", "Mis amigos nunca", ".", "me han mentido", "han me mentido", "My friends have never lied to me.", "intermediate", "mentir"],
  ["negatives and questions", "¿Usted ya", "el regalo a su hijo?", "le ha dado", "ha le dado", "Have you already given your son the present?", "advanced", "dar"],
  ["negatives and questions", "Hoy no", "bien.", "me he sentido", "he me sentido", "Today I haven't felt well.", "intermediate", "sentirse"],
];

export const PRESENT_PERFECT_QUESTIONS: Question[] = seed.map(([group, before, after, answer, distractor, en, level, blankHint], index) => ({
  id: 8001 + index,
  before,
  after,
  infinitive: group,
  answer,
  verbAnswer: answer,
  objectPronoun: distractor,
  // Written per item in explanations-present-perfect.ts.
  explanation: "",
  translations: { en, pl: "" },
  subjectNumber: answer.split(" ").some((word) => PLURAL_HABER.has(word)) ? ("plural" as const) : ("singular" as const),
  isActivity: false,
  indirectObject: "",
  // Haber is in the present; the shared Question type has no separate perfect tense.
  tense: "present" as const,
  level,
  blankHint,
})).map(applySourcedQuestionPair).map(withItemExplanation(PRESENT_PERFECT_EXPLANATIONS));

/** One entry per group, so the shared "second filter" can list them. */
export const PRESENT_PERFECT_FORMS: Record<PresentPerfectGroup, [string, string]> = {
  "regular -ado": ["he hablado", "han viajado"],
  "regular -ido": ["he comido", "han vivido"],
  "irregular participle": ["he visto", "han hecho"],
  "haber not tener": ["he llegado", "han salido"],
  "negatives and questions": ["no lo he visto", "¿ya has comido?"],
};

/** Reference tables for the in-round "Perfect chart". */
export const PRESENT_PERFECT_CHART: Array<{ title: string; rows: Array<{ label: string; form: string }> }> = [
  {
    title: "Haber · present",
    rows: [
      { label: "yo", form: "he hablado" },
      { label: "tú", form: "has hablado" },
      { label: "él / ella / usted", form: "ha hablado" },
      { label: "nosotros / nosotras", form: "hemos hablado" },
      { label: "vosotros / vosotras", form: "habéis hablado" },
      { label: "ellos / ellas / ustedes", form: "han hablado" },
    ],
  },
  {
    title: "Regular participles",
    rows: [
      { label: "-ar", form: "hablar → hablado" },
      { label: "-er", form: "comer → comido" },
      { label: "-ir", form: "vivir → vivido" },
      { label: "with an accent", form: "leer → leído, oír → oído" },
    ],
  },
  {
    title: "Common irregular participles",
    rows: [
      { label: "abrir", form: "abierto" },
      { label: "cubrir", form: "cubierto" },
      { label: "decir", form: "dicho" },
      { label: "escribir", form: "escrito" },
      { label: "hacer", form: "hecho" },
      { label: "morir", form: "muerto" },
      { label: "poner", form: "puesto" },
      { label: "resolver", form: "resuelto" },
      { label: "romper", form: "roto" },
      { label: "ver", form: "visto" },
      { label: "volver", form: "vuelto" },
    ],
  },
  {
    title: "Word order",
    rows: [
      { label: "pronoun before haber", form: "lo he visto" },
      { label: "no before everything", form: "no lo he visto" },
      { label: "ya, nunca before haber", form: "ya he comido" },
      { label: "never split haber", form: "not he lo visto" },
    ],
  },
];
