import type { Question } from "./quiz-data";
import { applySourcedQuestionPair } from "./sourced-quiz-content.ts";
import { withItemExplanation } from "./item-explanation.ts";
import { SABER_CONOCER_EXPLANATIONS } from "./explanations-saber-conocer.ts";

/** Usage categories double as the topic's "Usage" filter values (stored in `infinitive`). */
export const SABER_CONOCER_USAGES = ["facts", "skills", "people", "places", "familiarity", "past meaning"] as const;
export type SaberConocerUsage = (typeof SABER_CONOCER_USAGES)[number];

type Tense = Question["tense"];
type Level = Question["level"];
type Seed = readonly [number, SaberConocerUsage, string, string, string, string, string, Level, Tense?];

const seed: Seed[] = [
  // --- Facts: saber + information, que, si or a question word ---
  [6001, "facts", "Yo no", " dónde está la estación.", "sé", "conozco", "I don't know where the station is.", "basic"],
  [6002, "facts", "¿Tú", " qué hora es?", "sabes", "conoces", "Do you know what time it is?", "basic"],
  [6003, "facts", "Mi madre", " el número de teléfono del médico.", "sabe", "conoce", "My mother knows the doctor's phone number.", "basic"],
  [6004, "facts", "Nosotros", " que mañana hay examen.", "sabemos", "conocemos", "We know that there is an exam tomorrow.", "basic"],
  [6005, "facts", "Los niños no", " la respuesta.", "saben", "conocen", "The children don't know the answer.", "basic"],
  [6006, "facts", "¿Usted", " cuánto cuesta el billete?", "sabe", "conoce", "Do you know how much the ticket costs?", "basic"],
  [6007, "facts", "Yo", " tu dirección de memoria.", "sé", "conozco", "I know your address by heart.", "intermediate"],
  [6008, "facts", "Ana", " por qué llegaste tarde.", "sabe", "conoce", "Ana knows why you arrived late.", "basic"],
  [6009, "facts", "¿Vosotros", " si el museo abre los lunes?", "sabéis", "conocéis", "Do you all know if the museum opens on Mondays?", "intermediate"],
  [6010, "facts", "No", " cómo se llama ese actor.", "sé", "conozco", "I don't know what that actor's name is.", "basic"],
  [6011, "facts", "Mis padres ya", " la noticia.", "saben", "conocen", "My parents already know the news.", "intermediate"],
  [6012, "facts", "Todo el mundo", " que el agua hierve a cien grados.", "sabe", "conoce", "Everyone knows that water boils at one hundred degrees.", "basic"],
  [6013, "facts", "¿Tú", " quién ganó el partido?", "sabes", "conoces", "Do you know who won the match?", "basic"],
  [6014, "facts", "Yo no", " nada de este asunto.", "sé", "conozco", "I don't know anything about this matter.", "intermediate"],
  [6015, "facts", "El profesor", " cuándo es la fiesta.", "sabe", "conoce", "The teacher knows when the party is.", "basic"],
  [6016, "facts", "Ellos no", " adónde vamos el sábado.", "saben", "conocen", "They don't know where we are going on Saturday.", "basic"],
  [6017, "facts", "Nosotros no", " qué pasó anoche.", "sabemos", "conocemos", "We don't know what happened last night.", "basic"],
  [6018, "facts", "Ella", " la fecha del examen.", "sabe", "conoce", "She knows the date of the exam.", "basic"],
  [6019, "facts", "¿Tú", " el resultado del partido?", "sabes", "conoces", "Do you know the result of the match?", "intermediate"],
  [6020, "facts", "Yo", " que tienes razón.", "sé", "conozco", "I know that you are right.", "basic"],
  [6021, "facts", "Carlos", " mucho de historia.", "sabe", "conoce", "Carlos knows a lot about history.", "intermediate"],
  [6022, "facts", "Mis amigos no", " lo que pasó.", "saben", "conocen", "My friends don't know what happened.", "basic"],
  [6023, "facts", "¿Alguien", " a qué hora sale el tren?", "sabe", "conoce", "Does anyone know what time the train leaves?", "basic"],
  [6024, "facts", "Yo no", " si Marta viene a cenar.", "sé", "conozco", "I don't know if Marta is coming to dinner.", "basic"],
  [6025, "facts", "Usted", " muy bien lo que quiere.", "sabe", "conoce", "You know very well what you want.", "intermediate"],
  [6026, "facts", "Los turistas no", " cuál es el autobús correcto.", "saben", "conocen", "The tourists don't know which bus is the right one.", "intermediate"],
  [6027, "facts", "Nadie", " dónde dejó Pablo las llaves.", "sabe", "conoce", "Nobody knows where Pablo left the keys.", "basic"],
  [6028, "facts", "¿Cómo", " tú eso?", "sabes", "conoces", "How do you know that?", "intermediate"],
  [6029, "facts", "Yo ya", " de memoria la lista de verbos.", "sé", "conozco", "I already know the verb list by heart.", "intermediate"],
  [6030, "facts", "Ella no", " qué decir.", "sabe", "conoce", "She doesn't know what to say.", "intermediate"],

  // --- Skills: saber + infinitive ---
  [6031, "skills", "Yo", " nadar muy bien.", "sé", "conozco", "I know how to swim very well.", "basic"],
  [6032, "skills", "¿Tú", " cocinar paella?", "sabes", "conoces", "Do you know how to cook paella?", "basic"],
  [6033, "skills", "Mi hermana", " tocar el piano.", "sabe", "conoce", "My sister can play the piano.", "basic"],
  [6034, "skills", "Nosotros no", " conducir todavía.", "sabemos", "conocemos", "We don't know how to drive yet.", "basic"],
  [6035, "skills", "Mis abuelos", " bailar tango.", "saben", "conocen", "My grandparents know how to dance the tango.", "basic"],
  [6036, "skills", "El niño ya", " leer y escribir.", "sabe", "conoce", "The child already knows how to read and write.", "basic"],
  [6037, "skills", "¿Ustedes", " hablar alemán?", "saben", "conocen", "Can you speak German?", "basic"],
  [6038, "skills", "Yo no", " usar este programa.", "sé", "conozco", "I don't know how to use this program.", "basic"],
  [6039, "skills", "Pedro", " arreglar bicicletas.", "sabe", "conoce", "Pedro knows how to fix bikes.", "basic"],
  [6040, "skills", "¿Vosotros", " esquiar?", "sabéis", "conocéis", "Do you all know how to ski?", "intermediate"],
  [6041, "skills", "Mi perro", " abrir la puerta solo.", "sabe", "conoce", "My dog knows how to open the door by himself.", "intermediate"],
  [6042, "skills", "Ellas", " jugar al ajedrez.", "saben", "conocen", "They know how to play chess.", "basic"],
  [6043, "skills", "Tú", " escuchar a los demás.", "sabes", "conoces", "You know how to listen to others.", "intermediate"],
  [6044, "skills", "Yo", " hacer una tortilla de patatas.", "sé", "conozco", "I know how to make a Spanish omelette.", "basic"],
  [6045, "skills", "Mi padre no", " nadar.", "sabe", "conoce", "My father can't swim.", "basic"],
  [6046, "skills", "Los estudiantes ya", " resolver estas ecuaciones.", "saben", "conocen", "The students already know how to solve these equations.", "intermediate"],
  [6047, "skills", "¿Usted", " montar a caballo?", "sabe", "conoce", "Do you know how to ride a horse?", "intermediate"],
  [6048, "skills", "Nosotros", " cambiar una rueda.", "sabemos", "conocemos", "We know how to change a tyre.", "intermediate"],
  [6049, "skills", "Lucía", " dibujar retratos increíbles.", "sabe", "conoce", "Lucía knows how to draw incredible portraits.", "intermediate"],
  [6050, "skills", "Quiero", " programar en Python.", "saber", "conocer", "I want to know how to program in Python.", "advanced"],

  // --- People: conocer + personal a ---
  [6051, "people", "Yo", " a tu hermano.", "conozco", "sé", "I know your brother.", "basic"],
  [6052, "people", "¿Tú", " a mis padres?", "conoces", "sabes", "Do you know my parents?", "basic"],
  [6053, "people", "Marta", " a mucha gente en Madrid.", "conoce", "sabe", "Marta knows a lot of people in Madrid.", "basic"],
  [6054, "people", "Nosotros no", " al nuevo profesor.", "conocemos", "sabemos", "We don't know the new teacher.", "basic"],
  [6055, "people", "Mis amigos", " a un actor famoso.", "conocen", "saben", "My friends know a famous actor.", "basic"],
  [6056, "people", "¿Usted", " al director del hotel?", "conoce", "sabe", "Do you know the hotel manager?", "basic"],
  [6057, "people", "Yo", " a Laura desde hace diez años.", "conozco", "sé", "I have known Laura for ten years.", "intermediate"],
  [6058, "people", "¿Vosotros", " a alguien en esta ciudad?", "conocéis", "sabéis", "Do you all know anyone in this city?", "intermediate"],
  [6059, "people", "Ella no", " a nadie en la fiesta.", "conoce", "sabe", "She doesn't know anyone at the party.", "basic"],
  [6060, "people", "Nosotros", " muy bien a nuestros vecinos.", "conocemos", "sabemos", "We know our neighbours very well.", "basic"],
  [6061, "people", "Quiero", " a tu novia.", "conocer", "saber", "I want to meet your girlfriend.", "intermediate"],
  [6062, "people", "Me encantaría", " a tus abuelos.", "conocer", "saber", "I would love to meet your grandparents.", "intermediate"],
  [6063, "people", "Mi madre", " a todos mis compañeros de clase.", "conoce", "sabe", "My mother knows all my classmates.", "basic"],
  [6064, "people", "Tú", " a Pablo mejor que nadie.", "conoces", "sabes", "You know Pablo better than anyone.", "intermediate"],
  [6065, "people", "Los alumnos todavía no", " a la directora.", "conocen", "saben", "The students don't know the head teacher yet.", "basic"],
  [6066, "people", "Yo no", " personalmente al autor.", "conozco", "sé", "I don't know the author personally.", "intermediate"],
  [6067, "people", "Ellos", " al alcalde del pueblo.", "conocen", "saben", "They know the town's mayor.", "basic"],
  [6068, "people", "Mi jefe", " a todos los clientes por su nombre.", "conoce", "sabe", "My boss knows all the clients by name.", "intermediate"],
  [6069, "people", "Creo que tú no me", " de verdad.", "conoces", "sabes", "I think you don't really know me.", "advanced"],
  [6070, "people", "Nosotros", " a una chica de Argentina.", "conocemos", "sabemos", "We know a girl from Argentina.", "basic"],
  [6071, "people", "Usted", " al médico de mi familia, ¿verdad?", "conoce", "sabe", "You know my family's doctor, don't you?", "intermediate"],
  [6072, "people", "Yo la", " del colegio.", "conozco", "sé", "I know her from school.", "advanced"],
  [6073, "people", "Mis hijos", " bien a su profesora de música.", "conocen", "saben", "My children know their music teacher well.", "basic"],
  [6074, "people", "¿Vosotros", " al chico que vive arriba?", "conocéis", "sabéis", "Do you all know the guy who lives upstairs?", "intermediate"],
  [6075, "people", "Ana quiere", " a gente nueva en el trabajo.", "conocer", "saber", "Ana wants to meet new people at work.", "intermediate"],

  // --- Places: conocer + place ---
  [6076, "places", "Yo", " Barcelona muy bien.", "conozco", "sé", "I know Barcelona very well.", "basic"],
  [6077, "places", "¿Tú", " México?", "conoces", "sabes", "Have you been to Mexico?", "basic"],
  [6078, "places", "Mis padres no", " Sevilla.", "conocen", "saben", "My parents have never been to Seville.", "basic"],
  [6079, "places", "Nosotros", " un restaurante muy bueno cerca de aquí.", "conocemos", "sabemos", "We know a very good restaurant near here.", "basic"],
  [6080, "places", "Ella", " todos los museos de la ciudad.", "conoce", "sabe", "She knows all the museums in the city.", "basic"],
  [6081, "places", "¿Usted", " este barrio?", "conoce", "sabe", "Do you know this neighbourhood?", "basic"],
  [6082, "places", "Quiero", " Japón algún día.", "conocer", "saber", "I want to visit Japan someday.", "intermediate"],
  [6083, "places", "Mi abuela", " cada rincón de su pueblo.", "conoce", "sabe", "My grandmother knows every corner of her village.", "intermediate"],
  [6084, "places", "¿Vosotros", " la playa de La Concha?", "conocéis", "sabéis", "Have you all been to La Concha beach?", "intermediate"],
  [6085, "places", "Yo no", " esta parte de la ciudad.", "conozco", "sé", "I don't know this part of the city.", "basic"],
  [6086, "places", "El taxista", " todas las calles de Madrid.", "conoce", "sabe", "The taxi driver knows all the streets of Madrid.", "intermediate"],
  [6087, "places", "Tú", " un buen lugar para cenar, ¿no?", "conoces", "sabes", "You know a good place to have dinner, don't you?", "intermediate"],
  [6088, "places", "Nosotros todavía no", " el nuevo centro comercial.", "conocemos", "sabemos", "We haven't been to the new shopping centre yet.", "intermediate"],
  [6089, "places", "Mis amigos", " muchos países de Europa.", "conocen", "saben", "My friends have been to many countries in Europe.", "basic"],
  [6090, "places", "Me gustaría", " Buenos Aires.", "conocer", "saber", "I would like to visit Buenos Aires.", "intermediate"],
  [6091, "places", "¿Tú", " un hotel barato en el centro?", "conoces", "sabes", "Do you know a cheap hotel in the centre?", "basic"],
  [6092, "places", "Los guías", " la catedral como la palma de su mano.", "conocen", "saben", "The guides know the cathedral like the back of their hand.", "advanced"],
  [6093, "places", "Yo", " una tienda donde venden pan casero.", "conozco", "sé", "I know a shop where they sell homemade bread.", "intermediate"],
  [6094, "places", "Usted no", " el norte de España, ¿verdad?", "conoce", "sabe", "You haven't been to the north of Spain, have you?", "intermediate"],
  [6095, "places", "Mi hermano", " bien las montañas de Asturias.", "conoce", "sabe", "My brother knows the mountains of Asturias well.", "intermediate"],

  // --- Familiarity: conocer + a work, a field or a thing ---
  [6096, "familiarity", "Yo", " este libro; lo leí el año pasado.", "conozco", "sé", "I know this book; I read it last year.", "intermediate"],
  [6097, "familiarity", "¿Tú", " la música de Rosalía?", "conoces", "sabes", "Are you familiar with Rosalía's music?", "basic"],
  [6098, "familiarity", "Nosotros", " bien la cocina peruana.", "conocemos", "sabemos", "We are familiar with Peruvian cuisine.", "intermediate"],
  [6099, "familiarity", "Mi profesor", " muy bien la obra de Cervantes.", "conoce", "sabe", "My teacher knows Cervantes's work very well.", "intermediate"],
  [6100, "familiarity", "¿Usted", " este programa de televisión?", "conoce", "sabe", "Are you familiar with this TV show?", "basic"],
  [6101, "familiarity", "Ellos no", " esa película.", "conocen", "saben", "They aren't familiar with that film.", "basic"],
  [6102, "familiarity", "Ella", " el mercado del arte contemporáneo.", "conoce", "sabe", "She knows the contemporary art market.", "advanced"],
  [6103, "familiarity", "Yo no", " esta marca de café.", "conozco", "sé", "I'm not familiar with this coffee brand.", "basic"],
  [6104, "familiarity", "¿Vosotros", " el juego del mus?", "conocéis", "sabéis", "Are you all familiar with the card game mus?", "intermediate"],
  [6105, "familiarity", "Mi hermano", " todos los cuadros de Goya del Prado.", "conoce", "sabe", "My brother knows all of Goya's paintings in the Prado.", "intermediate"],
  [6106, "familiarity", "Tú", " bien este tipo de problemas.", "conoces", "sabes", "You are familiar with this kind of problem.", "advanced"],
  [6107, "familiarity", "El mecánico", " este modelo de coche.", "conoce", "sabe", "The mechanic knows this car model.", "intermediate"],
  [6108, "familiarity", "Nosotros no", " la obra de ese pintor.", "conocemos", "sabemos", "We aren't familiar with that painter's work.", "basic"],
  [6109, "familiarity", "¿Tú", " alguna aplicación para aprender idiomas?", "conoces", "sabes", "Do you know any app for learning languages?", "basic"],
  [6110, "familiarity", "Los médicos", " bien los efectos de este medicamento.", "conocen", "saben", "Doctors are well aware of the effects of this medicine.", "advanced"],
  [6111, "familiarity", "Yo", " las novelas de Isabel Allende.", "conozco", "sé", "I know Isabel Allende's novels.", "basic"],
  [6112, "familiarity", "Mi abuelo", " todos los tipos de vino de la región.", "conoce", "sabe", "My grandfather knows all the kinds of wine in the region.", "intermediate"],
  [6113, "familiarity", "¿Usted", " la cultura japonesa?", "conoce", "sabe", "Are you familiar with Japanese culture?", "intermediate"],
  [6114, "familiarity", "Ella", " este estilo de arquitectura.", "conoce", "sabe", "She is familiar with this style of architecture.", "intermediate"],
  [6115, "familiarity", "Mis alumnos ya", " el subjuntivo, pero no lo dominan.", "conocen", "saben", "My students are already familiar with the subjunctive, but they haven't mastered it.", "advanced"],

  // --- Past meaning: preterite conocer = met, preterite saber = found out ---
  [6116, "past meaning", "Ayer", " a tu hermana en la fiesta.", "conocí", "supe", "Yesterday I met your sister at the party.", "intermediate", "preterite"],
  [6117, "past meaning", "Mis padres se", " en la universidad.", "conocieron", "supieron", "My parents met at university.", "intermediate", "preterite"],
  [6118, "past meaning", "¿Dónde", " tú a tu mejor amigo?", "conociste", "supiste", "Where did you meet your best friend?", "intermediate", "preterite"],
  [6119, "past meaning", "El verano pasado", " Lisboa por primera vez.", "conocimos", "supimos", "Last summer we visited Lisbon for the first time.", "intermediate", "preterite"],
  [6120, "past meaning", "Ana", " a su novio en un viaje a Italia.", "conoció", "supo", "Ana met her boyfriend on a trip to Italy.", "intermediate", "preterite"],
  [6121, "past meaning", "Los niños", " al nuevo maestro el lunes.", "conocieron", "supieron", "The children met the new teacher on Monday.", "intermediate", "preterite"],
  [6122, "past meaning", "Usted", " al presidente en 2019, ¿verdad?", "conoció", "supo", "You met the president in 2019, didn't you?", "advanced", "preterite"],
  [6123, "past meaning", "Cuando fuimos a Perú,", " Machu Picchu.", "conocimos", "supimos", "When we went to Peru, we saw Machu Picchu.", "intermediate", "preterite"],

  // --- Past meaning: preterite saber = found out ---
  [6124, "past meaning", "Ayer", " que te casas.", "supe", "conocí", "Yesterday I found out you're getting married.", "intermediate", "preterite"],
  [6125, "past meaning", "¿Cuándo", " tú la noticia?", "supiste", "conociste", "When did you find out the news?", "intermediate", "preterite"],
  [6126, "past meaning", "Ella", " la verdad al leer la carta.", "supo", "conoció", "She found out the truth when she read the letter.", "advanced", "preterite"],
  [6127, "past meaning", "Nosotros", " el resultado esta mañana.", "supimos", "conocimos", "We found out the result this morning.", "intermediate", "preterite"],
  [6128, "past meaning", "Mis padres", " lo del accidente por la radio.", "supieron", "conocieron", "My parents found out about the accident on the radio.", "advanced", "preterite"],
  [6129, "past meaning", "Por fin", " dónde vivía mi amigo de la infancia.", "supe", "conocí", "I finally found out where my childhood friend lived.", "advanced", "preterite"],
  [6130, "past meaning", "En ese momento, el detective", " quién era el ladrón.", "supo", "conoció", "At that moment, the detective found out who the thief was.", "advanced", "preterite"],
  [6131, "past meaning", "¿Cómo", " vosotros que estaba enfermo?", "supisteis", "conocisteis", "How did you all find out I was sick?", "advanced", "preterite"],
  [6132, "past meaning", "Ellos nunca", " por qué se cerró la tienda.", "supieron", "conocieron", "They never found out why the shop closed.", "advanced", "preterite"],

  // --- Past meaning: imperfect saber = knew (information or a skill) ---
  [6133, "past meaning", "De niño, yo ya", " nadar.", "sabía", "conocía", "As a child, I already knew how to swim.", "intermediate", "imperfect"],
  [6134, "past meaning", "Yo no", " que tenías un hermano.", "sabía", "conocía", "I didn't know you had a brother.", "intermediate", "imperfect"],
  [6135, "past meaning", "Mi abuela", " tocar la guitarra.", "sabía", "conocía", "My grandmother knew how to play the guitar.", "intermediate", "imperfect"],
  [6136, "past meaning", "¿Tú", " que el examen era hoy?", "sabías", "conocías", "Did you know the exam was today?", "intermediate", "imperfect"],
  [6137, "past meaning", "Nosotros no", " dónde estaba el hotel.", "sabíamos", "conocíamos", "We didn't know where the hotel was.", "intermediate", "imperfect"],
  [6138, "past meaning", "Todos", " la respuesta menos yo.", "sabían", "conocían", "Everyone knew the answer except me.", "intermediate", "imperfect"],
  [6139, "past meaning", "Ella", " que iba a llover, por eso llevó paraguas.", "sabía", "conocía", "She knew it was going to rain, so she took an umbrella.", "advanced", "imperfect"],
  [6140, "past meaning", "Usted ya", " lo que pasaba, ¿no?", "sabía", "conocía", "You already knew what was going on, didn't you?", "advanced", "imperfect"],

  // --- Past meaning: imperfect conocer = knew (a person or place) ---
  [6141, "past meaning", "En aquella época, yo", " a todos los vecinos.", "conocía", "sabía", "Back then, I knew all the neighbours.", "intermediate", "imperfect"],
  [6142, "past meaning", "Mi padre", " muy bien la ciudad porque trabajó allí.", "conocía", "sabía", "My father knew the city very well because he worked there.", "intermediate", "imperfect"],
  [6143, "past meaning", "¿Ya", " tú a Marcos antes de la boda?", "conocías", "sabías", "Did you already know Marcos before the wedding?", "advanced", "imperfect"],
  [6144, "past meaning", "Nosotros no", " ese restaurante hasta ayer.", "conocíamos", "sabíamos", "We didn't know that restaurant until yesterday.", "intermediate", "imperfect"],
  [6145, "past meaning", "Los estudiantes no", " al autor del libro.", "conocían", "sabían", "The students didn't know the author of the book.", "intermediate", "imperfect"],
  [6146, "past meaning", "Ella", " Roma como la palma de su mano.", "conocía", "sabía", "She knew Rome like the back of her hand.", "intermediate", "imperfect"],
  [6147, "past meaning", "Cuando era joven, Luis", " a muchos músicos.", "conocía", "sabía", "When he was young, Luis knew a lot of musicians.", "intermediate", "imperfect"],

  // --- Past meaning: contrasts ---
  [6148, "past meaning", "Yo ya la", " de vista, pero ayer hablé con ella por primera vez.", "conocía", "sabía", "I already knew her by sight, but yesterday I talked to her for the first time.", "advanced", "imperfect"],
  [6149, "past meaning", "Lo", " anoche, cuando me llamó su hermana.", "supe", "conocí", "I found out last night, when his sister called me.", "advanced", "preterite"],
  [6150, "past meaning", "Nos", " en 2015 y desde entonces somos amigos.", "conocimos", "supimos", "We met in 2015 and we've been friends ever since.", "advanced", "preterite"],
];

export const SABER_CONOCER_QUESTIONS: Question[] = seed.map(([id, usage, before, after, answer, alternateAnswer, en, level, tense = "present"]) => ({
  id,
  before,
  after,
  infinitive: usage,
  answer,
  verbAnswer: answer,
  objectPronoun: alternateAnswer,
  // Written per item in explanations-saber-conocer.ts.
  explanation: "",
  translations: { en, pl: "" },
  subjectNumber: "singular",
  isActivity: false,
  indirectObject: "",
  tense,
  level,
  // The usage label would give the answer away, so the blank shows both verbs instead.
  blankHint: "saber / conocer",
})).map(applySourcedQuestionPair).map(withItemExplanation(SABER_CONOCER_EXPLANATIONS));

/** One entry per usage, so the shared "second filter" can list them. */
export const SABER_CONOCER_FORMS: Record<SaberConocerUsage, [string, string]> = {
  facts: ["sé que…", "sé dónde…"],
  skills: ["sé nadar", "sabe cocinar"],
  people: ["conozco a Ana", "conoce al profesor"],
  places: ["conozco Madrid", "conoces México"],
  familiarity: ["conozco este libro", "conoce la obra"],
  "past meaning": ["supe = found out", "conocí = met"],
};

type ConjugatedTense = "present" | "preterite" | "imperfect";

/** Full paradigms for the conjugation chart. */
export const SABER_CONOCER_CONJUGATIONS: Array<{ subject: string; saber: Record<ConjugatedTense, string>; conocer: Record<ConjugatedTense, string> }> = [
  { subject: "yo", saber: { present: "sé", preterite: "supe", imperfect: "sabía" }, conocer: { present: "conozco", preterite: "conocí", imperfect: "conocía" } },
  { subject: "tú", saber: { present: "sabes", preterite: "supiste", imperfect: "sabías" }, conocer: { present: "conoces", preterite: "conociste", imperfect: "conocías" } },
  { subject: "él / ella / usted", saber: { present: "sabe", preterite: "supo", imperfect: "sabía" }, conocer: { present: "conoce", preterite: "conoció", imperfect: "conocía" } },
  { subject: "nosotros", saber: { present: "sabemos", preterite: "supimos", imperfect: "sabíamos" }, conocer: { present: "conocemos", preterite: "conocimos", imperfect: "conocíamos" } },
  { subject: "vosotros", saber: { present: "sabéis", preterite: "supisteis", imperfect: "sabíais" }, conocer: { present: "conocéis", preterite: "conocisteis", imperfect: "conocíais" } },
  { subject: "ellos / ellas / ustedes", saber: { present: "saben", preterite: "supieron", imperfect: "sabían" }, conocer: { present: "conocen", preterite: "conocieron", imperfect: "conocían" } },
];
