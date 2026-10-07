import type { Question } from "./quiz-data";
import { applySourcedQuestionPair } from "./sourced-quiz-content.ts";

/** Usage categories double as the topic's "Usage" filter values (stored in `infinitive`). */
export const SABER_CONOCER_USAGES = ["facts", "skills", "people", "places", "familiarity", "past meaning"] as const;
export type SaberConocerUsage = (typeof SABER_CONOCER_USAGES)[number];

type Tense = Question["tense"];
type Level = Question["level"];
type Seed = readonly [SaberConocerUsage, string, string, string, string, string, Level, string, Tense?];

const seed: Seed[] = [
  // --- Facts: saber + information, que, si or a question word ---
  ["facts", "Yo no", " dónde está la estación.", "sé", "conozco", "I don't know where the station is.", "basic", "Knowing a piece of information (dónde…) uses saber."],
  ["facts", "¿Tú", " qué hora es?", "sabes", "conoces", "Do you know what time it is?", "basic", "Knowing a fact like the time uses saber."],
  ["facts", "Mi madre", " el número de teléfono del médico.", "sabe", "conoce", "My mother knows the doctor's phone number.", "basic", "Knowing a specific piece of information, like a number, uses saber."],
  ["facts", "Nosotros", " que mañana hay examen.", "sabemos", "conocemos", "We know that there is an exam tomorrow.", "basic", "Saber que introduces a fact you know."],
  ["facts", "Los niños no", " la respuesta.", "saben", "conocen", "The children don't know the answer.", "basic", "Knowing an answer is knowing information, so it uses saber."],
  ["facts", "¿Usted", " cuánto cuesta el billete?", "sabe", "conoce", "Do you know how much the ticket costs?", "basic", "Knowing information (cuánto…) uses saber."],
  ["facts", "Yo", " tu dirección de memoria.", "sé", "conozco", "I know your address by heart.", "intermediate", "Knowing a fact by heart (de memoria) uses saber."],
  ["facts", "Ana", " por qué llegaste tarde.", "sabe", "conoce", "Ana knows why you arrived late.", "basic", "Knowing a reason (por qué…) uses saber."],
  ["facts", "¿Vosotros", " si el museo abre los lunes?", "sabéis", "conocéis", "Do you all know if the museum opens on Mondays?", "intermediate", "Saber si asks whether someone has a piece of information."],
  ["facts", "No", " cómo se llama ese actor.", "sé", "conozco", "I don't know what that actor's name is.", "basic", "Knowing a name as information (cómo se llama) uses saber."],
  ["facts", "Mis padres ya", " la noticia.", "saben", "conocen", "My parents already know the news.", "intermediate", "Knowing news is knowing information, so it uses saber."],
  ["facts", "Todo el mundo", " que el agua hierve a cien grados.", "sabe", "conoce", "Everyone knows that water boils at one hundred degrees.", "basic", "Saber que introduces a known fact."],
  ["facts", "¿Tú", " quién ganó el partido?", "sabes", "conoces", "Do you know who won the match?", "basic", "Knowing information (quién…) uses saber."],
  ["facts", "Yo no", " nada de este asunto.", "sé", "conozco", "I don't know anything about this matter.", "intermediate", "No saber nada means having no information about something."],
  ["facts", "El profesor", " cuándo es la fiesta.", "sabe", "conoce", "The teacher knows when the party is.", "basic", "Knowing information (cuándo…) uses saber."],
  ["facts", "Ellos no", " adónde vamos el sábado.", "saben", "conocen", "They don't know where we are going on Saturday.", "basic", "Knowing information (adónde…) uses saber."],
  ["facts", "Nosotros no", " qué pasó anoche.", "sabemos", "conocemos", "We don't know what happened last night.", "basic", "Knowing information (qué…) uses saber."],
  ["facts", "Ella", " la fecha del examen.", "sabe", "conoce", "She knows the date of the exam.", "basic", "Knowing a date is knowing a fact, so it uses saber."],
  ["facts", "¿Tú", " el resultado del partido?", "sabes", "conoces", "Do you know the result of the match?", "intermediate", "Knowing a result is knowing information, so it uses saber."],
  ["facts", "Yo", " que tienes razón.", "sé", "conozco", "I know that you are right.", "basic", "Saber que introduces a fact you know."],
  ["facts", "Carlos", " mucho de historia.", "sabe", "conoce", "Carlos knows a lot about history.", "intermediate", "Saber mucho de means having a lot of knowledge about a subject."],
  ["facts", "Mis amigos no", " lo que pasó.", "saben", "conocen", "My friends don't know what happened.", "basic", "Knowing what happened (lo que…) uses saber."],
  ["facts", "¿Alguien", " a qué hora sale el tren?", "sabe", "conoce", "Does anyone know what time the train leaves?", "basic", "Knowing information (a qué hora…) uses saber."],
  ["facts", "Yo no", " si Marta viene a cenar.", "sé", "conozco", "I don't know if Marta is coming to dinner.", "basic", "Saber si asks whether you have a piece of information."],
  ["facts", "Usted", " muy bien lo que quiere.", "sabe", "conoce", "You know very well what you want.", "intermediate", "Knowing what you want (lo que…) uses saber."],
  ["facts", "Los turistas no", " cuál es el autobús correcto.", "saben", "conocen", "The tourists don't know which bus is the right one.", "intermediate", "Knowing information (cuál…) uses saber."],
  ["facts", "Nadie", " dónde dejó Pablo las llaves.", "sabe", "conoce", "Nobody knows where Pablo left the keys.", "basic", "Knowing information (dónde…) uses saber."],
  ["facts", "¿Cómo", " tú eso?", "sabes", "conoces", "How do you know that?", "intermediate", "Knowing a fact (eso) uses saber."],
  ["facts", "Yo ya", " de memoria la lista de verbos.", "sé", "conozco", "I already know the verb list by heart.", "intermediate", "Saber de memoria means knowing something by heart."],
  ["facts", "Ella no", " qué decir.", "sabe", "conoce", "She doesn't know what to say.", "intermediate", "No saber qué + infinitive means not knowing what to do or say."],

  // --- Skills: saber + infinitive ---
  ["skills", "Yo", " nadar muy bien.", "sé", "conozco", "I know how to swim very well.", "basic", "Saber + infinitive means knowing how to do something."],
  ["skills", "¿Tú", " cocinar paella?", "sabes", "conoces", "Do you know how to cook paella?", "basic", "Saber + infinitive means knowing how to do something."],
  ["skills", "Mi hermana", " tocar el piano.", "sabe", "conoce", "My sister can play the piano.", "basic", "Saber + infinitive describes a learned skill."],
  ["skills", "Nosotros no", " conducir todavía.", "sabemos", "conocemos", "We don't know how to drive yet.", "basic", "Saber + infinitive describes a learned skill."],
  ["skills", "Mis abuelos", " bailar tango.", "saben", "conocen", "My grandparents know how to dance the tango.", "basic", "Saber + infinitive means knowing how to do something."],
  ["skills", "El niño ya", " leer y escribir.", "sabe", "conoce", "The child already knows how to read and write.", "basic", "Saber + infinitive describes a learned skill."],
  ["skills", "¿Ustedes", " hablar alemán?", "saben", "conocen", "Can you speak German?", "basic", "Saber + infinitive describes a skill such as speaking a language."],
  ["skills", "Yo no", " usar este programa.", "sé", "conozco", "I don't know how to use this program.", "basic", "Saber + infinitive means knowing how to do something."],
  ["skills", "Pedro", " arreglar bicicletas.", "sabe", "conoce", "Pedro knows how to fix bikes.", "basic", "Saber + infinitive describes a learned skill."],
  ["skills", "¿Vosotros", " esquiar?", "sabéis", "conocéis", "Do you all know how to ski?", "intermediate", "Saber + infinitive means knowing how to do something."],
  ["skills", "Mi perro", " abrir la puerta solo.", "sabe", "conoce", "My dog knows how to open the door by himself.", "intermediate", "Saber + infinitive describes an ability."],
  ["skills", "Ellas", " jugar al ajedrez.", "saben", "conocen", "They know how to play chess.", "basic", "Saber + infinitive means knowing how to do something."],
  ["skills", "Tú", " escuchar a los demás.", "sabes", "conoces", "You know how to listen to others.", "intermediate", "Saber + infinitive can describe a personal ability."],
  ["skills", "Yo", " hacer una tortilla de patatas.", "sé", "conozco", "I know how to make a Spanish omelette.", "basic", "Saber + infinitive means knowing how to do something."],
  ["skills", "Mi padre no", " nadar.", "sabe", "conoce", "My father can't swim.", "basic", "Saber + infinitive describes a skill; no saber nadar means not being able to swim."],
  ["skills", "Los estudiantes ya", " resolver estas ecuaciones.", "saben", "conocen", "The students already know how to solve these equations.", "intermediate", "Saber + infinitive describes a learned skill."],
  ["skills", "¿Usted", " montar a caballo?", "sabe", "conoce", "Do you know how to ride a horse?", "intermediate", "Saber + infinitive means knowing how to do something."],
  ["skills", "Nosotros", " cambiar una rueda.", "sabemos", "conocemos", "We know how to change a tyre.", "intermediate", "Saber + infinitive describes a practical skill."],
  ["skills", "Lucía", " dibujar retratos increíbles.", "sabe", "conoce", "Lucía knows how to draw incredible portraits.", "intermediate", "Saber + infinitive describes an ability."],
  ["skills", "Quiero", " programar en Python.", "saber", "conocer", "I want to know how to program in Python.", "advanced", "After querer, saber + infinitive still means knowing how to do something."],

  // --- People: conocer + personal a ---
  ["people", "Yo", " a tu hermano.", "conozco", "sé", "I know your brother.", "basic", "Knowing a person uses conocer, with the personal a."],
  ["people", "¿Tú", " a mis padres?", "conoces", "sabes", "Do you know my parents?", "basic", "Knowing a person uses conocer, with the personal a."],
  ["people", "Marta", " a mucha gente en Madrid.", "conoce", "sabe", "Marta knows a lot of people in Madrid.", "basic", "Knowing people uses conocer, with the personal a."],
  ["people", "Nosotros no", " al nuevo profesor.", "conocemos", "sabemos", "We don't know the new teacher.", "basic", "Knowing a person uses conocer; a + el becomes al."],
  ["people", "Mis amigos", " a un actor famoso.", "conocen", "saben", "My friends know a famous actor.", "basic", "Knowing a person uses conocer, with the personal a."],
  ["people", "¿Usted", " al director del hotel?", "conoce", "sabe", "Do you know the hotel manager?", "basic", "Knowing a person uses conocer; a + el becomes al."],
  ["people", "Yo", " a Laura desde hace diez años.", "conozco", "sé", "I have known Laura for ten years.", "intermediate", "Being acquainted with someone over time uses conocer."],
  ["people", "¿Vosotros", " a alguien en esta ciudad?", "conocéis", "sabéis", "Do you all know anyone in this city?", "intermediate", "Conocer a alguien means being acquainted with someone."],
  ["people", "Ella no", " a nadie en la fiesta.", "conoce", "sabe", "She doesn't know anyone at the party.", "basic", "Knowing people (a nadie) uses conocer."],
  ["people", "Nosotros", " muy bien a nuestros vecinos.", "conocemos", "sabemos", "We know our neighbours very well.", "basic", "Knowing people well uses conocer."],
  ["people", "Quiero", " a tu novia.", "conocer", "saber", "I want to meet your girlfriend.", "intermediate", "Conocer a alguien can mean meeting someone for the first time."],
  ["people", "Me encantaría", " a tus abuelos.", "conocer", "saber", "I would love to meet your grandparents.", "intermediate", "Conocer a alguien can mean meeting someone for the first time."],
  ["people", "Mi madre", " a todos mis compañeros de clase.", "conoce", "sabe", "My mother knows all my classmates.", "basic", "Knowing people uses conocer, with the personal a."],
  ["people", "Tú", " a Pablo mejor que nadie.", "conoces", "sabes", "You know Pablo better than anyone.", "intermediate", "Knowing a person well uses conocer."],
  ["people", "Los alumnos todavía no", " a la directora.", "conocen", "saben", "The students don't know the head teacher yet.", "basic", "Knowing a person uses conocer, with the personal a."],
  ["people", "Yo no", " personalmente al autor.", "conozco", "sé", "I don't know the author personally.", "intermediate", "Knowing a person uses conocer; personalmente stresses real acquaintance."],
  ["people", "Ellos", " al alcalde del pueblo.", "conocen", "saben", "They know the town's mayor.", "basic", "Knowing a person uses conocer; a + el becomes al."],
  ["people", "Mi jefe", " a todos los clientes por su nombre.", "conoce", "sabe", "My boss knows all the clients by name.", "intermediate", "Knowing people uses conocer, even when you also know their names."],
  ["people", "Creo que tú no me", " de verdad.", "conoces", "sabes", "I think you don't really know me.", "advanced", "Knowing a person uses conocer, even when the person is an object pronoun like me."],
  ["people", "Nosotros", " a una chica de Argentina.", "conocemos", "sabemos", "We know a girl from Argentina.", "basic", "Knowing a person uses conocer, with the personal a."],
  ["people", "Usted", " al médico de mi familia, ¿verdad?", "conoce", "sabe", "You know my family's doctor, don't you?", "intermediate", "Knowing a person uses conocer; a + el becomes al."],
  ["people", "Yo la", " del colegio.", "conozco", "sé", "I know her from school.", "advanced", "Knowing a person uses conocer, even when the person is an object pronoun like la."],
  ["people", "Mis hijos", " bien a su profesora de música.", "conocen", "saben", "My children know their music teacher well.", "basic", "Knowing a person well uses conocer."],
  ["people", "¿Vosotros", " al chico que vive arriba?", "conocéis", "sabéis", "Do you all know the guy who lives upstairs?", "intermediate", "Knowing a person uses conocer; a + el becomes al."],
  ["people", "Ana quiere", " a gente nueva en el trabajo.", "conocer", "saber", "Ana wants to meet new people at work.", "intermediate", "Conocer a gente means meeting people."],

  // --- Places: conocer + place ---
  ["places", "Yo", " Barcelona muy bien.", "conozco", "sé", "I know Barcelona very well.", "basic", "Being familiar with a place uses conocer."],
  ["places", "¿Tú", " México?", "conoces", "sabes", "Have you been to Mexico?", "basic", "Conocer a place means having been there or knowing it."],
  ["places", "Mis padres no", " Sevilla.", "conocen", "saben", "My parents have never been to Seville.", "basic", "Conocer a place means having been there or knowing it."],
  ["places", "Nosotros", " un restaurante muy bueno cerca de aquí.", "conocemos", "sabemos", "We know a very good restaurant near here.", "basic", "Knowing a place uses conocer."],
  ["places", "Ella", " todos los museos de la ciudad.", "conoce", "sabe", "She knows all the museums in the city.", "basic", "Knowing places uses conocer."],
  ["places", "¿Usted", " este barrio?", "conoce", "sabe", "Do you know this neighbourhood?", "basic", "Being familiar with a place uses conocer."],
  ["places", "Quiero", " Japón algún día.", "conocer", "saber", "I want to visit Japan someday.", "intermediate", "Conocer a country can mean getting to know it by visiting."],
  ["places", "Mi abuela", " cada rincón de su pueblo.", "conoce", "sabe", "My grandmother knows every corner of her village.", "intermediate", "Knowing a place in detail uses conocer."],
  ["places", "¿Vosotros", " la playa de La Concha?", "conocéis", "sabéis", "Have you all been to La Concha beach?", "intermediate", "Conocer a place means having been there or knowing it."],
  ["places", "Yo no", " esta parte de la ciudad.", "conozco", "sé", "I don't know this part of the city.", "basic", "Being familiar with a place uses conocer."],
  ["places", "El taxista", " todas las calles de Madrid.", "conoce", "sabe", "The taxi driver knows all the streets of Madrid.", "intermediate", "Knowing places uses conocer."],
  ["places", "Tú", " un buen lugar para cenar, ¿no?", "conoces", "sabes", "You know a good place to have dinner, don't you?", "intermediate", "Knowing a place uses conocer."],
  ["places", "Nosotros todavía no", " el nuevo centro comercial.", "conocemos", "sabemos", "We haven't been to the new shopping centre yet.", "intermediate", "Conocer a place means having been there."],
  ["places", "Mis amigos", " muchos países de Europa.", "conocen", "saben", "My friends have been to many countries in Europe.", "basic", "Conocer a country means having been there."],
  ["places", "Me gustaría", " Buenos Aires.", "conocer", "saber", "I would like to visit Buenos Aires.", "intermediate", "Conocer a city can mean getting to know it by visiting."],
  ["places", "¿Tú", " un hotel barato en el centro?", "conoces", "sabes", "Do you know a cheap hotel in the centre?", "basic", "Knowing a place uses conocer."],
  ["places", "Los guías", " la catedral como la palma de su mano.", "conocen", "saben", "The guides know the cathedral like the back of their hand.", "advanced", "Conocer algo como la palma de la mano means knowing a place thoroughly."],
  ["places", "Yo", " una tienda donde venden pan casero.", "conozco", "sé", "I know a shop where they sell homemade bread.", "intermediate", "Knowing a place uses conocer."],
  ["places", "Usted no", " el norte de España, ¿verdad?", "conoce", "sabe", "You haven't been to the north of Spain, have you?", "intermediate", "Conocer a region means having been there or knowing it."],
  ["places", "Mi hermano", " bien las montañas de Asturias.", "conoce", "sabe", "My brother knows the mountains of Asturias well.", "intermediate", "Being familiar with a place uses conocer."],

  // --- Familiarity: conocer + a work, a field or a thing ---
  ["familiarity", "Yo", " este libro; lo leí el año pasado.", "conozco", "sé", "I know this book; I read it last year.", "intermediate", "Being familiar with a work, like a book, uses conocer."],
  ["familiarity", "¿Tú", " la música de Rosalía?", "conoces", "sabes", "Are you familiar with Rosalía's music?", "basic", "Being familiar with someone's work uses conocer."],
  ["familiarity", "Nosotros", " bien la cocina peruana.", "conocemos", "sabemos", "We are familiar with Peruvian cuisine.", "intermediate", "Being familiar with a field, like a cuisine, uses conocer."],
  ["familiarity", "Mi profesor", " muy bien la obra de Cervantes.", "conoce", "sabe", "My teacher knows Cervantes's work very well.", "intermediate", "Being familiar with someone's work uses conocer."],
  ["familiarity", "¿Usted", " este programa de televisión?", "conoce", "sabe", "Are you familiar with this TV show?", "basic", "Being familiar with a thing uses conocer."],
  ["familiarity", "Ellos no", " esa película.", "conocen", "saben", "They aren't familiar with that film.", "basic", "Being familiar with a work, like a film, uses conocer."],
  ["familiarity", "Ella", " el mercado del arte contemporáneo.", "conoce", "sabe", "She knows the contemporary art market.", "advanced", "Being familiar with a field uses conocer."],
  ["familiarity", "Yo no", " esta marca de café.", "conozco", "sé", "I'm not familiar with this coffee brand.", "basic", "Being familiar with a thing uses conocer."],
  ["familiarity", "¿Vosotros", " el juego del mus?", "conocéis", "sabéis", "Are you all familiar with the card game mus?", "intermediate", "Being familiar with a game uses conocer; knowing how to play it would be saber jugar."],
  ["familiarity", "Mi hermano", " todos los cuadros de Goya del Prado.", "conoce", "sabe", "My brother knows all of Goya's paintings in the Prado.", "intermediate", "Being familiar with works of art uses conocer."],
  ["familiarity", "Tú", " bien este tipo de problemas.", "conoces", "sabes", "You are familiar with this kind of problem.", "advanced", "Being familiar with a kind of situation uses conocer."],
  ["familiarity", "El mecánico", " este modelo de coche.", "conoce", "sabe", "The mechanic knows this car model.", "intermediate", "Being familiar with a thing uses conocer."],
  ["familiarity", "Nosotros no", " la obra de ese pintor.", "conocemos", "sabemos", "We aren't familiar with that painter's work.", "basic", "Being familiar with someone's work uses conocer."],
  ["familiarity", "¿Tú", " alguna aplicación para aprender idiomas?", "conoces", "sabes", "Do you know any app for learning languages?", "basic", "Being familiar with a thing uses conocer."],
  ["familiarity", "Los médicos", " bien los efectos de este medicamento.", "conocen", "saben", "Doctors are well aware of the effects of this medicine.", "advanced", "Being familiar with the effects of something uses conocer."],
  ["familiarity", "Yo", " las novelas de Isabel Allende.", "conozco", "sé", "I know Isabel Allende's novels.", "basic", "Being familiar with works, like novels, uses conocer."],
  ["familiarity", "Mi abuelo", " todos los tipos de vino de la región.", "conoce", "sabe", "My grandfather knows all the kinds of wine in the region.", "intermediate", "Being familiar with things uses conocer."],
  ["familiarity", "¿Usted", " la cultura japonesa?", "conoce", "sabe", "Are you familiar with Japanese culture?", "intermediate", "Being familiar with a culture uses conocer."],
  ["familiarity", "Ella", " este estilo de arquitectura.", "conoce", "sabe", "She is familiar with this style of architecture.", "intermediate", "Being familiar with a style uses conocer."],
  ["familiarity", "Mis alumnos ya", " el subjuntivo, pero no lo dominan.", "conocen", "saben", "My students are already familiar with the subjunctive, but they haven't mastered it.", "advanced", "Conocer expresses familiarity with a topic, not mastery of it."],

  // --- Past meaning: preterite conocer = met, preterite saber = found out ---
  ["past meaning", "Ayer", " a tu hermana en la fiesta.", "conocí", "supe", "Yesterday I met your sister at the party.", "intermediate", "Preterite conocer means met someone for the first time.", "preterite"],
  ["past meaning", "Mis padres se", " en la universidad.", "conocieron", "supieron", "My parents met at university.", "intermediate", "Conocerse in the preterite means met each other.", "preterite"],
  ["past meaning", "¿Dónde", " tú a tu mejor amigo?", "conociste", "supiste", "Where did you meet your best friend?", "intermediate", "Preterite conocer means met someone for the first time.", "preterite"],
  ["past meaning", "El verano pasado", " Lisboa por primera vez.", "conocimos", "supimos", "Last summer we visited Lisbon for the first time.", "intermediate", "Preterite conocer with a place means saw or visited it for the first time.", "preterite"],
  ["past meaning", "Ana", " a su novio en un viaje a Italia.", "conoció", "supo", "Ana met her boyfriend on a trip to Italy.", "intermediate", "Preterite conocer means met someone for the first time.", "preterite"],
  ["past meaning", "Los niños", " al nuevo maestro el lunes.", "conocieron", "supieron", "The children met the new teacher on Monday.", "intermediate", "Preterite conocer means met someone for the first time.", "preterite"],
  ["past meaning", "Usted", " al presidente en 2019, ¿verdad?", "conoció", "supo", "You met the president in 2019, didn't you?", "advanced", "Preterite conocer means met someone for the first time.", "preterite"],
  ["past meaning", "Cuando fuimos a Perú,", " Machu Picchu.", "conocimos", "supimos", "When we went to Peru, we saw Machu Picchu.", "intermediate", "Preterite conocer with a place means saw or visited it for the first time.", "preterite"],

  // --- Past meaning: preterite saber = found out ---
  ["past meaning", "Ayer", " que te casas.", "supe", "conocí", "Yesterday I found out you're getting married.", "intermediate", "Preterite saber means found out.", "preterite"],
  ["past meaning", "¿Cuándo", " tú la noticia?", "supiste", "conociste", "When did you find out the news?", "intermediate", "Preterite saber means found out.", "preterite"],
  ["past meaning", "Ella", " la verdad al leer la carta.", "supo", "conoció", "She found out the truth when she read the letter.", "advanced", "Preterite saber means found out.", "preterite"],
  ["past meaning", "Nosotros", " el resultado esta mañana.", "supimos", "conocimos", "We found out the result this morning.", "intermediate", "Preterite saber means found out.", "preterite"],
  ["past meaning", "Mis padres", " lo del accidente por la radio.", "supieron", "conocieron", "My parents found out about the accident on the radio.", "advanced", "Preterite saber means found out.", "preterite"],
  ["past meaning", "Por fin", " dónde vivía mi amigo de la infancia.", "supe", "conocí", "I finally found out where my childhood friend lived.", "advanced", "Preterite saber with por fin marks the moment you found out.", "preterite"],
  ["past meaning", "En ese momento, el detective", " quién era el ladrón.", "supo", "conoció", "At that moment, the detective found out who the thief was.", "advanced", "Preterite saber means found out.", "preterite"],
  ["past meaning", "¿Cómo", " vosotros que estaba enfermo?", "supisteis", "conocisteis", "How did you all find out I was sick?", "advanced", "Preterite saber means found out.", "preterite"],
  ["past meaning", "Ellos nunca", " por qué se cerró la tienda.", "supieron", "conocieron", "They never found out why the shop closed.", "advanced", "Preterite saber means found out; nunca supieron means they never found out.", "preterite"],

  // --- Past meaning: imperfect saber = knew (information or a skill) ---
  ["past meaning", "De niño, yo ya", " nadar.", "sabía", "conocía", "As a child, I already knew how to swim.", "intermediate", "Imperfect saber + infinitive describes a skill you had in the past.", "imperfect"],
  ["past meaning", "Yo no", " que tenías un hermano.", "sabía", "conocía", "I didn't know you had a brother.", "intermediate", "Imperfect saber describes information you had, or lacked, in the past.", "imperfect"],
  ["past meaning", "Mi abuela", " tocar la guitarra.", "sabía", "conocía", "My grandmother knew how to play the guitar.", "intermediate", "Imperfect saber + infinitive describes a skill someone had in the past.", "imperfect"],
  ["past meaning", "¿Tú", " que el examen era hoy?", "sabías", "conocías", "Did you know the exam was today?", "intermediate", "Imperfect saber describes information you had in the past.", "imperfect"],
  ["past meaning", "Nosotros no", " dónde estaba el hotel.", "sabíamos", "conocíamos", "We didn't know where the hotel was.", "intermediate", "Imperfect saber describes information you had, or lacked, in the past.", "imperfect"],
  ["past meaning", "Todos", " la respuesta menos yo.", "sabían", "conocían", "Everyone knew the answer except me.", "intermediate", "Imperfect saber describes information people had in the past.", "imperfect"],
  ["past meaning", "Ella", " que iba a llover, por eso llevó paraguas.", "sabía", "conocía", "She knew it was going to rain, so she took an umbrella.", "advanced", "Imperfect saber describes information someone had in the past.", "imperfect"],
  ["past meaning", "Usted ya", " lo que pasaba, ¿no?", "sabía", "conocía", "You already knew what was going on, didn't you?", "advanced", "Imperfect saber describes information someone had in the past.", "imperfect"],

  // --- Past meaning: imperfect conocer = knew (a person or place) ---
  ["past meaning", "En aquella época, yo", " a todos los vecinos.", "conocía", "sabía", "Back then, I knew all the neighbours.", "intermediate", "Imperfect conocer describes being acquainted with people in the past.", "imperfect"],
  ["past meaning", "Mi padre", " muy bien la ciudad porque trabajó allí.", "conocía", "sabía", "My father knew the city very well because he worked there.", "intermediate", "Imperfect conocer describes familiarity with a place in the past.", "imperfect"],
  ["past meaning", "¿Ya", " tú a Marcos antes de la boda?", "conocías", "sabías", "Did you already know Marcos before the wedding?", "advanced", "Imperfect conocer describes an acquaintance that already existed.", "imperfect"],
  ["past meaning", "Nosotros no", " ese restaurante hasta ayer.", "conocíamos", "sabíamos", "We didn't know that restaurant until yesterday.", "intermediate", "Imperfect conocer describes familiarity with a place in the past.", "imperfect"],
  ["past meaning", "Los estudiantes no", " al autor del libro.", "conocían", "sabían", "The students didn't know the author of the book.", "intermediate", "Imperfect conocer describes being acquainted with someone in the past.", "imperfect"],
  ["past meaning", "Ella", " Roma como la palma de su mano.", "conocía", "sabía", "She knew Rome like the back of her hand.", "intermediate", "Imperfect conocer describes familiarity with a place in the past.", "imperfect"],
  ["past meaning", "Cuando era joven, Luis", " a muchos músicos.", "conocía", "sabía", "When he was young, Luis knew a lot of musicians.", "intermediate", "Imperfect conocer describes being acquainted with people in the past.", "imperfect"],

  // --- Past meaning: contrasts ---
  ["past meaning", "Yo ya la", " de vista, pero ayer hablé con ella por primera vez.", "conocía", "sabía", "I already knew her by sight, but yesterday I talked to her for the first time.", "advanced", "Conocer de vista means knowing someone by sight; the imperfect describes the earlier state.", "imperfect"],
  ["past meaning", "Lo", " anoche, cuando me llamó su hermana.", "supe", "conocí", "I found out last night, when his sister called me.", "advanced", "Preterite saber (lo supe) means found out at a specific moment.", "preterite"],
  ["past meaning", "Nos", " en 2015 y desde entonces somos amigos.", "conocimos", "supimos", "We met in 2015 and we've been friends ever since.", "advanced", "Conocerse in the preterite means met each other.", "preterite"],
];

export const SABER_CONOCER_QUESTIONS: Question[] = seed.map(([usage, before, after, answer, alternateAnswer, en, level, explanation, tense = "present"], index) => ({
  id: 6001 + index,
  before,
  after,
  infinitive: usage,
  answer,
  verbAnswer: answer,
  objectPronoun: alternateAnswer,
  explanation,
  translations: { en, pl: "" },
  subjectNumber: "singular",
  isActivity: false,
  indirectObject: "",
  tense,
  level,
  // The usage label would give the answer away, so the blank shows both verbs instead.
  blankHint: "saber / conocer",
})).map(applySourcedQuestionPair);

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
