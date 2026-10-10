import type { Question } from "./quiz-data";
import { applySourcedQuestionPair } from "./sourced-quiz-content.ts";
import { withItemExplanation } from "./item-explanation.ts";
import { OBJECT_PRONOUN_EXPLANATIONS } from "./explanations-object-pronouns.ts";

/** Filter values for this quiz. They live in `infinitive`, the field the shared
 * second filter already matches on, so the existing picker filters by pronoun type. */
export const OBJECT_PRONOUN_TYPES = ["direct object", "indirect object", "double pronouns"] as const;
export type ObjectPronounType = (typeof OBJECT_PRONOUN_TYPES)[number];

type Seed = readonly [
  type: ObjectPronounType,
  before: string,
  after: string,
  answer: string,
  distractor: string,
  en: string,
  level: Question["level"],
  /** Only for attachment items: the bare gerund/infinitive shown in the blank. */
  blankHint?: string,
];

const seed: readonly Seed[] = [
  // --- Direct object: lo, la, los, las before a conjugated verb ---
  ["direct object", "¿El café? Yo", "tomo sin azúcar.", "lo", "la", "The coffee? I drink it without sugar.", "basic"],
  ["direct object", "¿La sopa? Mi hijo nunca", "come.", "la", "lo", "The soup? My son never eats it.", "basic"],
  ["direct object", "¿Los zapatos nuevos? Ana", "lleva hoy.", "los", "las", "The new shoes? Ana is wearing them today.", "basic"],
  ["direct object", "¿Las llaves? Pablo", "tiene en el bolsillo.", "las", "los", "The keys? Pablo has them in his pocket.", "basic"],
  ["direct object", "Compré una revista y", "leí en el tren.", "la", "lo", "I bought a magazine and read it on the train.", "basic"],
  ["direct object", "Tengo dos entradas, pero no", "necesito.", "las", "los", "I have two tickets, but I don't need them.", "basic"],
  ["direct object", "¿Dónde está el mando? No", "encuentro.", "lo", "la", "Where is the remote? I can't find it.", "basic"],
  ["direct object", "Esta película es muy buena; yo", "vi el sábado.", "la", "lo", "This film is very good; I saw it on Saturday.", "basic"],
  ["direct object", "Hay galletas en la mesa, pero los niños no", "quieren.", "las", "los", "There are biscuits on the table, but the children don't want them.", "basic"],
  ["direct object", "¿Los deberes? Ya", "terminé.", "los", "les", "The homework? I already finished it.", "basic"],
  ["direct object", "El pan está duro; ¿por qué no", "tiras?", "lo", "la", "The bread is hard; why don't you throw it away?", "basic"],
  ["direct object", "La maleta ya está lista; mi padre", "lleva al coche.", "la", "lo", "The suitcase is ready; my father is taking it to the car.", "basic"],
  ["direct object", "¿El coche? Carlos", "aparca siempre en la calle.", "lo", "la", "The car? Carlos always parks it on the street.", "basic"],
  ["direct object", "¿Tienes las gafas? No,", "dejé en casa.", "las", "los", "Do you have the glasses? No, I left them at home.", "basic"],
  ["direct object", "¿Quieres probar estas manzanas? Yo ya", "probé.", "las", "los", "Do you want to try these apples? I already tried them.", "basic"],
  ["direct object", "Hice una tarta y mis amigos", "probaron enseguida.", "la", "lo", "I made a cake and my friends tried it straight away.", "basic"],
  ["direct object", "¿Las noticias? Siempre", "escuchamos en la radio.", "las", "les", "The news? We always listen to it on the radio.", "basic"],

  // --- Direct object: people (me, te, lo, la, nos, los, las) ---
  ["direct object", "Mi abuela me llama y yo", "visito los domingos.", "la", "lo", "My grandmother calls me and I visit her on Sundays.", "intermediate"],
  ["direct object", "Juan está en la estación. ¿Tú", "recoges?", "lo", "la", "Juan is at the station. Will you pick him up?", "intermediate"],
  ["direct object", "\"¿Me oyes bien?\" \"Sí,", "oigo perfectamente.\"", "te", "me", "\"Can you hear me well?\" \"Yes, I can hear you perfectly.\"", "basic"],
  ["direct object", "Cuando llegamos tarde, el profesor", "mira con cara seria.", "nos", "los", "When we arrive late, the teacher looks at us with a serious face.", "intermediate"],
  ["direct object", "Mis padres", "quieren mucho.", "me", "mi", "My parents love me a lot.", "basic"],
  ["direct object", "Mis primos viven lejos y casi nunca", "veo.", "los", "las", "My cousins live far away and I almost never see them.", "basic"],
  ["direct object", "Ana y Lucía", "invitaron a su boda.", "nos", "los", "Ana and Lucía invited us to their wedding.", "intermediate"],
  ["direct object", "Mi hermana es muy simpática; todos", "adoran.", "la", "le", "My sister is very friendly; everyone adores her.", "intermediate"],
  ["direct object", "Si tienes problemas, yo", "ayudo.", "te", "ti", "If you have problems, I'll help you.", "basic"],
  ["direct object", "Cuando éramos pequeños, nuestros abuelos", "llevaban al parque.", "nos", "los", "When we were little, our grandparents took us to the park.", "intermediate"],
  ["direct object", "\"¿Me esperas?\" \"Sí,", "espero en la puerta.\"", "te", "me", "\"Will you wait for me?\" \"Yes, I'll wait for you at the door.\"", "basic"],
  ["direct object", "Nuestros amigos", "llaman cada semana.", "nos", "los", "Our friends call us every week.", "basic"],

  // --- Direct object: placement with haber, estar + gerund and ir a + infinitive ---
  ["direct object", "¿Las fotos? Todavía no", "he visto.", "las", "los", "The photos? I still haven't seen them.", "intermediate"],
  ["direct object", "¿El correo de Sonia? Ya", "he leído.", "lo", "le", "Sonia's email? I've already read it.", "intermediate"],
  ["direct object", "¿Y la carta? Nadie", "ha abierto.", "la", "lo", "And the letter? Nobody has opened it.", "intermediate"],
  ["direct object", "¿Los platos? Mi hermano ya", "ha lavado.", "los", "las", "The dishes? My brother has already washed them.", "intermediate"],
  ["direct object", "Ese chico", "está mirando desde la ventana.", "te", "ti", "That guy is looking at you from the window.", "intermediate"],
  ["direct object", "¿El partido? Nosotros", "estamos viendo en casa de Luis.", "lo", "le", "The match? We're watching it at Luis's place.", "intermediate"],
  ["direct object", "¿Las flores? Mi madre", "va a poner en la mesa.", "las", "los", "The flowers? My mother is going to put them on the table.", "intermediate"],

  // --- Direct object: attached to a gerund or infinitive ---
  ["direct object", "¿El libro? Estoy", "ahora mismo.", "leyéndolo", "leyendolo", "The book? I'm reading it right now.", "intermediate", "leyendo"],
  ["direct object", "¿La cena? Mi padre está", "en la cocina.", "preparándola", "preparándolo", "Dinner? My father is making it in the kitchen.", "intermediate", "preparando"],
  ["direct object", "¿Los ejercicios? Seguimos", "con el profesor.", "haciéndolos", "haciéndolas", "The exercises? We're still doing them with the teacher.", "advanced", "haciendo"],
  ["direct object", "¿Las camisas? Estoy", "ahora.", "planchándolas", "planchandolas", "The shirts? I'm ironing them now.", "intermediate", "planchando"],
  ["direct object", "¿Tu hermano? Estoy", "ahora mismo.", "llamándolo", "llamandolo", "Your brother? I'm calling him right now.", "intermediate", "llamando"],
  ["direct object", "¿Esta chaqueta? Quiero", "hoy.", "comprarla", "comprarlo", "This jacket? I want to buy it today.", "intermediate", "comprar"],
  ["direct object", "¿Los documentos? Tienes que", "antes del viernes.", "firmarlos", "firmarlas", "The documents? You have to sign them before Friday.", "intermediate", "firmar"],
  ["direct object", "Mi amiga llega a las seis y voy a", "al aeropuerto.", "buscarla", "buscarle", "My friend arrives at six and I'm going to pick her up at the airport.", "intermediate", "buscar"],
  ["direct object", "¿El piso? Van a", "el mes que viene.", "venderlo", "venderla", "The flat? They're going to sell it next month.", "intermediate", "vender"],

  // --- Direct object: neuter lo and a fronted object repeated by a pronoun ---
  ["direct object", "\"¿Sabes que Carla se muda?\" \"Sí, ya", "sé.\"", "lo", "la", "\"Do you know that Carla is moving?\" \"Yes, I already know.\"", "intermediate"],
  ["direct object", "\"¿Es verdad que cierran el museo?\" \"No", "creo.\"", "lo", "la", "\"Is it true that they're closing the museum?\" \"I don't think so.\"", "advanced"],
  ["direct object", "A su hermana", "vi ayer en el mercado.", "la", "le", "I saw his sister yesterday at the market.", "advanced"],
  ["direct object", "Los tomates", "compré en el mercado.", "los", "las", "I bought the tomatoes at the market.", "advanced"],
  ["direct object", "Esa canción", "canta todo el mundo.", "la", "le", "Everyone sings that song.", "advanced"],

  // --- Indirect object: me, te, le, nos, les before a conjugated verb ---
  ["indirect object", "Mañana es el cumpleaños de mi madre y", "voy a regalar flores.", "le", "la", "Tomorrow is my mother's birthday and I'm going to give her flowers.", "basic"],
  ["indirect object", "¿Qué", "vas a decir a tu jefe?", "le", "lo", "What are you going to tell your boss?", "intermediate"],
  ["indirect object", "Mis alumnos", "escriben correos a menudo.", "me", "mi", "My students often write emails to me.", "basic"],
  ["indirect object", "¿Quién", "explicó la lección a los niños?", "les", "los", "Who explained the lesson to the children?", "intermediate"],
  ["indirect object", "Ana", "prestó su bicicleta a Carlos.", "le", "lo", "Ana lent her bike to Carlos.", "intermediate"],
  ["indirect object", "Cuando viajo,", "mando postales a mis padres.", "les", "los", "When I travel, I send postcards to my parents.", "basic"],
  ["indirect object", "¿Tu hermano", "devolvió el dinero?", "te", "ti", "Did your brother give the money back to you?", "basic"],
  ["indirect object", "El camarero", "trajo la cuenta.", "nos", "los", "The waiter brought us the bill.", "basic"],
  ["indirect object", "Siempre", "cuento mis secretos a mi mejor amiga.", "le", "la", "I always tell my secrets to my best friend.", "intermediate"],
  ["indirect object", "La profesora", "preguntó a los estudiantes por el examen.", "les", "los", "The teacher asked the students about the exam.", "intermediate"],
  ["indirect object", "Tengo frío; ¿tú", "puedes dar una manta?", "me", "mi", "I'm cold; can you give me a blanket?", "basic"],
  ["indirect object", "El médico", "recetó unas pastillas a mi padre.", "le", "lo", "The doctor prescribed some pills for my father.", "intermediate"],
  ["indirect object", "¿Qué", "pasa a Lucía? Está muy callada.", "le", "la", "What's wrong with Lucía? She's very quiet.", "intermediate"],
  ["indirect object", "Los vecinos", "pidieron silencio a los estudiantes del piso de arriba.", "les", "los", "The neighbours asked the students upstairs to be quiet.", "intermediate"],
  ["indirect object", "Yo", "escribo todos los días, pero tú nunca contestas.", "te", "ti", "I write to you every day, but you never answer.", "basic"],
  ["indirect object", "Nuestros padres", "dieron una sorpresa el fin de semana.", "nos", "los", "Our parents gave us a surprise at the weekend.", "basic"],
  ["indirect object", "Cuando llegó el cartero,", "di una propina.", "le", "lo", "When the postman arrived, I gave him a tip.", "basic"],
  ["indirect object", "¿Por qué no", "compras un regalo a tu hermana?", "le", "la", "Why don't you buy your sister a present?", "intermediate"],
  ["indirect object", "A mis hijos", "encanta el helado.", "les", "los", "My children love ice cream.", "basic"],
  ["indirect object", "A nosotros", "interesa mucho la historia.", "nos", "los", "We're very interested in history.", "basic"],
  ["indirect object", "¿Ya", "mandaste las fotos a tus primos?", "les", "los", "Did you already send the photos to your cousins?", "intermediate"],
  ["indirect object", "El jefe", "ofreció un contrato nuevo a Elena.", "le", "la", "The boss offered Elena a new contract.", "intermediate"],
  ["indirect object", "La tienda", "devolvió el dinero a los clientes.", "les", "los", "The shop gave the customers their money back.", "intermediate"],
  ["indirect object", "Mi novio siempre", "trae flores.", "me", "mi", "My boyfriend always brings me flowers.", "basic"],
  ["indirect object", "Ella nunca", "dice mentiras a sus amigos.", "les", "los", "She never tells her friends lies.", "intermediate"],
  ["indirect object", "El guía", "está explicando la historia del castillo a los turistas.", "les", "los", "The guide is explaining the history of the castle to the tourists.", "intermediate"],
  ["indirect object", "¿Qué", "regalaste a tu novia por su cumpleaños?", "le", "la", "What did you give your girlfriend for her birthday?", "intermediate"],
  ["indirect object", "Cuando era niño, mi madre", "leía cuentos cada noche.", "me", "mi", "When I was a child, my mother read me stories every night.", "basic"],
  ["indirect object", "¿Ya", "contaste a tus padres lo del viaje?", "les", "los", "Have you told your parents about the trip yet?", "intermediate"],
  ["indirect object", "Los abuelos", "dejaron la casa a sus nietos.", "les", "los", "The grandparents left the house to their grandchildren.", "intermediate"],
  ["indirect object", "¿Quieres que", "preste mi coche?", "te", "ti", "Do you want me to lend you my car?", "intermediate"],
  ["indirect object", "El profesor", "puso una mala nota a Pedro.", "le", "lo", "The teacher gave Pedro a bad mark.", "intermediate"],
  ["indirect object", "Los niños", "piden dulces a su abuela.", "le", "la", "The children ask their grandmother for sweets.", "basic"],
  ["indirect object", "Mi jefe no", "ha contestado todavía.", "me", "mi", "My boss hasn't answered me yet.", "intermediate"],

  // --- Indirect object: usted/ustedes and clarification with a + person ---
  ["indirect object", "Señora García,", "traigo los documentos que pidió.", "le", "la", "Mrs García, I'm bringing you the documents you asked for.", "advanced"],
  ["indirect object", "El dentista", "sacó una muela a mi hermano.", "le", "lo", "The dentist pulled one of my brother's teeth.", "advanced"],
  ["indirect object", "Hoy", "toca a ti fregar los platos.", "te", "ti", "Today it's your turn to wash the dishes.", "intermediate"],
  ["indirect object", "A ella", "dieron el premio, no a él.", "le", "la", "They gave the prize to her, not to him.", "advanced"],
  ["indirect object", "A usted", "debo una explicación.", "le", "lo", "I owe you an explanation.", "advanced"],
  ["indirect object", "A ustedes", "mando la información por correo.", "les", "los", "I'll send you all the information by email.", "intermediate"],

  // --- Indirect object: attached to a gerund or infinitive ---
  ["indirect object", "Voy a", "un mensaje a Marta.", "escribirle", "escribirla", "I'm going to write Marta a message.", "intermediate", "escribir"],
  ["indirect object", "Estoy", "la verdad a mis padres.", "diciéndoles", "diciéndolos", "I'm telling my parents the truth.", "advanced", "diciendo"],
  ["indirect object", "¿Puedes", "la sal, por favor?", "pasarme", "pasarte", "Can you pass me the salt, please?", "intermediate", "pasar"],
  ["indirect object", "Necesito", "una pregunta, profesora.", "hacerle", "hacerla", "I need to ask you a question, teacher.", "advanced", "hacer"],
  ["indirect object", "Estamos", "una carta a los Reyes Magos.", "escribiéndoles", "escribiéndolos", "We're writing a letter to the Three Kings.", "advanced", "escribiendo"],

  // --- Double pronouns: indirect before direct (me/te/nos + lo/la/los/las) ---
  ["double pronouns", "¿El libro? Mi hermano", "prestó ayer.", "me lo", "lo me", "The book? My brother lent it to me yesterday.", "basic"],
  ["double pronouns", "¿La foto? Yo", "mando ahora.", "te la", "la te", "The photo? I'll send it to you now.", "basic"],
  ["double pronouns", "¿El postre? El camarero", "trae enseguida.", "nos lo", "lo nos", "The dessert? The waiter will bring it to us right away.", "basic"],
  ["double pronouns", "¿Las fotos del viaje? Ana", "enseñó ayer.", "nos las", "nos los", "The trip photos? Ana showed them to us yesterday.", "basic"],
  ["double pronouns", "¿Mi bolígrafo? Sí, ahora", "devuelvo.", "te lo", "te la", "My pen? Yes, I'll give it back to you now.", "basic"],
  ["double pronouns", "¿Quién te regaló esa bufanda? Mi abuela", "regaló.", "me la", "me lo", "Who gave you that scarf? My grandmother gave it to me.", "basic"],
  ["double pronouns", "Si necesitas el coche, yo", "presto.", "te lo", "se lo", "If you need the car, I'll lend it to you.", "basic"],
  ["double pronouns", "El profesor explicó el ejercicio a Marta y luego", "explicó a mí.", "me lo", "se lo", "The teacher explained the exercise to Marta and then explained it to me.", "intermediate"],
  ["double pronouns", "¿La receta? Mi tía", "dio a nosotras.", "nos la", "se la", "The recipe? My aunt gave it to us.", "advanced"],
  ["double pronouns", "¿Los billetes? Yo", "compro a ti si quieres.", "te los", "se los", "The tickets? I'll buy them for you if you want.", "intermediate"],
  ["double pronouns", "¿Las gafas? Mamá", "ha guardado.", "te las", "te los", "The glasses? Mum has put them away for you.", "intermediate"],
  ["double pronouns", "¿La mesa? Mis amigos", "han vendido a buen precio.", "me la", "me lo", "The table? My friends have sold it to me at a good price.", "intermediate"],
  ["double pronouns", "¿El vestido? Mi madre", "hizo a mí para la boda.", "me lo", "me la", "The dress? My mother made it for me for the wedding.", "intermediate"],
  ["double pronouns", "¿Necesitas mi diccionario? Ahora", "dejo.", "te lo", "te la", "Do you need my dictionary? I'll lend it to you now.", "basic"],
  ["double pronouns", "¿Tus padres te compraron la moto? Sí,", "compraron el año pasado.", "me la", "me lo", "Did your parents buy you the motorbike? Yes, they bought it for me last year.", "basic"],
  ["double pronouns", "¿Me explicas el problema? Claro, ahora", "explico.", "te lo", "me lo", "Will you explain the problem to me? Sure, I'll explain it to you now.", "basic"],
  ["double pronouns", "¿Me das tu dirección? Sí,", "doy ahora.", "te la", "te lo", "Will you give me your address? Yes, I'll give it to you now.", "basic"],
  ["double pronouns", "¿Me prestas tus apuntes? Sí,", "presto mañana.", "te los", "te las", "Will you lend me your notes? Yes, I'll lend them to you tomorrow.", "basic"],

  // --- Double pronouns: le/les become se before lo/la/los/las ---
  ["double pronouns", "¿Las llaves? Juan", "dio a su hermana.", "se las", "le las", "The keys? Juan gave them to his sister.", "intermediate"],
  ["double pronouns", "¿El regalo? Nosotros", "dimos a Pablo ayer.", "se lo", "le lo", "The present? We gave it to Pablo yesterday.", "intermediate"],
  ["double pronouns", "¿Los apuntes? Carmen", "presta a sus compañeros.", "se los", "les los", "The notes? Carmen lends them to her classmates.", "intermediate"],
  ["double pronouns", "¿La verdad? No", "dije a mis padres.", "se la", "les la", "The truth? I didn't tell it to my parents.", "intermediate"],
  ["double pronouns", "¿La pregunta? Ya", "hice a la profesora.", "se la", "le la", "The question? I already asked the teacher.", "intermediate"],
  ["double pronouns", "¿El dinero? Mañana", "devuelvo a ustedes.", "se lo", "les lo", "The money? I'll give it back to you all tomorrow.", "advanced"],
  ["double pronouns", "¿Las flores? Mi padre", "compró a mi madre.", "se las", "le las", "The flowers? My father bought them for my mother.", "intermediate"],
  ["double pronouns", "¿Los resultados? El médico", "explicó a la paciente.", "se los", "le los", "The results? The doctor explained them to the patient.", "intermediate"],
  ["double pronouns", "¿El paquete? El cartero", "entregó a mis vecinos.", "se lo", "les lo", "The parcel? The postman delivered it to my neighbours.", "intermediate"],
  ["double pronouns", "¿La contraseña? No", "puedo decir a nadie.", "se la", "le la", "The password? I can't tell it to anyone.", "advanced"],
  ["double pronouns", "¿El informe? Ya", "he enviado al director.", "se lo", "le lo", "The report? I've already sent it to the director.", "intermediate"],
  ["double pronouns", "¿Las noticias? Todavía no", "han contado a los niños.", "se las", "les las", "The news? They haven't told the children yet.", "intermediate"],
  ["double pronouns", "¿Tu número? Ya", "he dado a Laura.", "se lo", "se la", "Your number? I've already given it to Laura.", "intermediate"],
  ["double pronouns", "¿La carta? Mi hermano", "está escribiendo a su novia.", "se la", "le la", "The letter? My brother is writing it to his girlfriend.", "intermediate"],
  ["double pronouns", "¿El secreto? Mis amigos", "están contando a todo el mundo.", "se lo", "les lo", "The secret? My friends are telling it to everyone.", "intermediate"],
  ["double pronouns", "¿La tarta? Nosotros", "vamos a llevar a la abuela.", "se la", "le la", "The cake? We're going to take it to grandma.", "intermediate"],
  ["double pronouns", "¿Los juguetes? Mis padres", "van a comprar a mi hermano.", "se los", "les los", "The toys? My parents are going to buy them for my brother.", "intermediate"],
  ["double pronouns", "¿El mensaje? Ya", "mandé a él, no a ella.", "se lo", "le lo", "The message? I already sent it to him, not to her.", "advanced"],
  ["double pronouns", "¿Las entradas? Ya", "di a ustedes, ¿no?", "se las", "les las", "The tickets? I already gave them to you all, didn't I?", "advanced"],
  ["double pronouns", "¿Le diste las llaves a Mario? Sí, ya", "di.", "se las", "le las", "Did you give the keys to Mario? Yes, I already gave them to him.", "intermediate"],
  ["double pronouns", "¿Les mandaste la invitación a tus tíos? No, todavía no", "he mandado.", "se la", "les la", "Did you send the invitation to your aunt and uncle? No, I haven't sent it yet.", "intermediate"],
  ["double pronouns", "¿Le compraste el pastel a Ana? Sí,", "compré esta mañana.", "se lo", "le lo", "Did you buy the cake for Ana? Yes, I bought it for her this morning.", "basic"],
  ["double pronouns", "¿Le regalas los pendientes a tu madre? Sí,", "regalo para su cumpleaños.", "se los", "se las", "Are you giving the earrings to your mother? Yes, I'm giving them to her for her birthday.", "intermediate"],
  ["double pronouns", "¿Quién les explicó el problema a los alumnos? La directora", "explicó.", "se lo", "les lo", "Who explained the problem to the students? The head teacher explained it to them.", "intermediate"],
  ["double pronouns", "¿Le pediste permiso a tu padre? Sí,", "pedí ayer.", "se lo", "le lo", "Did you ask your father for permission? Yes, I asked him for it yesterday.", "intermediate"],
  ["double pronouns", "¿Le devolviste la chaqueta a Sara? Sí, ya", "devolví.", "se la", "se lo", "Did you give the jacket back to Sara? Yes, I already gave it back to her.", "intermediate"],

  // --- Double pronouns: attached to a gerund or infinitive ---
  ["double pronouns", "¿El cuento? Estoy", "a mi hija.", "leyéndoselo", "leyéndolelo", "The story? I'm reading it to my daughter.", "advanced", "leyendo"],
  ["double pronouns", "¿La lección? El profesor está", "a los alumnos.", "explicándosela", "explicándolesla", "The lesson? The teacher is explaining it to the students.", "advanced", "explicando"],
  ["double pronouns", "¿Las fotos? Estoy", "ahora mismo.", "mandándotelas", "mandándotelos", "The photos? I'm sending them to you right now.", "advanced", "mandando"],
  ["double pronouns", "¿El menú? El camarero está", "ahora.", "trayéndonoslo", "trayéndonosla", "The menu? The waiter is bringing it to us now.", "advanced", "trayendo"],
  ["double pronouns", "¿Los regalos? Papá está", "a los niños.", "dándoselos", "dándoselas", "The presents? Dad is giving them to the children.", "advanced", "dando"],
  ["double pronouns", "¿El libro? Voy a", "mañana.", "devolvértelo", "devolvérselo", "The book? I'm going to give it back to you tomorrow.", "advanced", "devolver"],
  ["double pronouns", "¿La bicicleta? Quiero", "a mi primo.", "prestársela", "prestárlela", "The bike? I want to lend it to my cousin.", "advanced", "prestar"],
  ["double pronouns", "¿Los documentos? Tengo que", "al abogado hoy.", "mandárselos", "mandárselas", "The documents? I have to send them to the lawyer today.", "advanced", "mandar"],
  ["double pronouns", "¿La canción? ¿Puedes", "otra vez?", "cantármela", "cantármelo", "The song? Can you sing it to me again?", "intermediate", "cantar"],
  ["double pronouns", "¿El plan? Queremos", "a nuestros jefes.", "explicárselo", "explicárselos", "The plan? We want to explain it to our bosses.", "advanced", "explicar"],
  ["double pronouns", "Si quieres las fotos, puedo", "esta noche.", "enviártelas", "enviártelos", "If you want the photos, I can send them to you tonight.", "intermediate", "enviar"],
];

export const OBJECT_PRONOUN_QUESTIONS: Question[] = seed.map(([type, before, after, answer, distractor, en, level, blankHint], index) => ({
  id: 5001 + index,
  before,
  after,
  infinitive: type,
  answer,
  verbAnswer: answer,
  objectPronoun: distractor,
  // Written per item in explanations-object-pronouns.ts.
  explanation: "",
  translations: { en, pl: "" },
  subjectNumber: "singular",
  isActivity: false,
  indirectObject: "",
  tense: "present",
  level,
  ...(blankHint ? { blankHint } : {}),
})).map(applySourcedQuestionPair).map(withItemExplanation(OBJECT_PRONOUN_EXPLANATIONS));

/** One entry per pronoun type, so the shared "second filter" and chart can list them. */
export const OBJECT_PRONOUN_FORMS: Record<string, [string, string]> = {
  "direct object": ["me, te, lo, la", "nos, los, las"],
  "indirect object": ["me, te, le", "nos, les"],
  "double pronouns": ["me lo, te la, se lo…", "nos los, se las…"],
};

/** Reference tables for the in-round "Pronoun chart": who or what each pronoun stands for. */
export const OBJECT_PRONOUN_CHART: Record<ObjectPronounType, Array<{ label: string; form: string }>> = {
  "direct object": [
    { label: "yo", form: "me" },
    { label: "tú", form: "te" },
    { label: "él / usted / masc. thing", form: "lo" },
    { label: "ella / usted / fem. thing", form: "la" },
    { label: "nosotros / nosotras", form: "nos" },
    { label: "ellos / ustedes / masc. things", form: "los" },
    { label: "ellas / ustedes / fem. things", form: "las" },
  ],
  "indirect object": [
    { label: "yo", form: "me" },
    { label: "tú", form: "te" },
    { label: "él / ella / usted", form: "le" },
    { label: "nosotros / nosotras", form: "nos" },
    { label: "ellos / ellas / ustedes", form: "les" },
  ],
  "double pronouns": [
    { label: "me + lo", form: "me lo" },
    { label: "te + la", form: "te la" },
    { label: "nos + los", form: "nos los" },
    { label: "le + lo", form: "se lo" },
    { label: "le + la", form: "se la" },
    { label: "les + los", form: "se los" },
    { label: "les + las", form: "se las" },
  ],
};
