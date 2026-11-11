import type { Question } from "./quiz-data";
import { applySourcedQuestionPair } from "./sourced-quiz-content.ts";
import { withItemExplanation } from "./item-explanation.ts";
import { PRESENT_CONTINUOUS_EXPLANATIONS } from "./explanations-present-continuous.ts";

/** Usage groups double as the topic's "Usage" filter values (stored in `infinitive`). */
export const PRESENT_CONTINUOUS_GROUPS = ["regular -ando", "regular -iendo", "irregular gerund", "pronoun placement", "gerund or infinitive"] as const;
export type PresentContinuousGroup = (typeof PRESENT_CONTINUOUS_GROUPS)[number];

/** Present of estar, the auxiliary of the continuous, in person order. */
export const ESTAR_PRESENT = ["estoy", "estás", "está", "estamos", "estáis", "están"] as const;
const PLURAL_ESTAR = new Set<string>(["estamos", "estáis", "están"]);

type Seed = readonly [
  /** Permanent question id. Never reuse or renumber: stored progress points at it. */
  id: number,
  group: PresentContinuousGroup,
  before: string,
  after: string,
  /** Estar + gerund; the gerund with attached pronouns when estar is already in the sentence; or the infinitive. */
  answer: string,
  /** One wrong option, wrong in every region: wrong estar person, ser, infinitive or participle after estar,
   * a misspelled gerund, a misplaced or repeated pronoun, or the gerund where Spanish needs the infinitive. */
  distractor: string,
  en: string,
  level: Question["level"],
  /** Shown in the blank: the infinitive. */
  blankHint: string,
];

// Regional scope matches the other banks: tú, usted, vosotros (estáis) and ustedes (están); no voseo.
// The simple present is never a wrong option: "Ahora preparo la cena" is also correct Spanish.
// Pronoun placement items fix the position with the sentence: either estar is outside the blank and the
// pronoun must attach to the gerund, or the pronoun is outside the blank and must not be repeated.
const seed: readonly Seed[] = [
  // --- regular -ando ---
  [9001, "regular -ando", "Ahora mismo yo", "la cena para todos.", "estoy preparando", "está preparando", "Right now I am making dinner for everyone.", "basic", "preparar"],
  [9002, "regular -ando", "¿Con quién", "tú por teléfono?", "estás hablando", "estás hablar", "Who are you talking to on the phone?", "basic", "hablar"],
  [9003, "regular -ando", "Mi hermana", "en el jardín en este momento.", "está trabajando", "es trabajando", "My sister is working in the garden at the moment.", "basic", "trabajar"],
  [9004, "regular -ando", "Nosotros", "la radio en la cocina.", "estamos escuchando", "están escuchando", "We are listening to the radio in the kitchen.", "basic", "escuchar"],
  [9005, "regular -ando", "¿Vosotros", "para el examen de mañana?", "estáis estudiando", "estáis estudiar", "Are you all studying for tomorrow's exam?", "intermediate", "estudiar"],
  [9006, "regular -ando", "Los niños", "en la piscina ahora.", "están nadando", "está nadando", "The children are swimming in the pool now.", "basic", "nadar"],
  [9007, "regular -ando", "Ustedes", "demasiado rápido por esta calle.", "están caminando", "estáis caminando", "You are walking too fast along this street.", "intermediate", "caminar"],
  [9008, "regular -ando", "Perdone, ¿usted", "a alguien?", "está esperando", "estás esperando", "Excuse me, are you waiting for someone?", "intermediate", "esperar"],
  [9009, "regular -ando", "Yo", "inglés a un grupo de adultos este mes.", "estoy enseñando", "soy enseñando", "I am teaching English to a group of adults this month.", "intermediate", "enseñar"],
  [9010, "regular -ando", "Mira, el bebé", "otra vez.", "está llorando", "está llorar", "Look, the baby is crying again.", "basic", "llorar"],
  [9011, "regular -ando", "Tú", "muy bien esta canción.", "estás cantando", "estás cantado", "You are singing this song very well.", "basic", "cantar"],
  [9012, "regular -ando", "Mis padres", "el salón este fin de semana.", "están pintando", "están pintar", "My parents are painting the living room this weekend.", "basic", "pintar"],
  [9013, "regular -ando", "Nosotras", "un viaje a Portugal.", "estamos planeando", "estamos planear", "We are planning a trip to Portugal.", "intermediate", "planear"],
  [9014, "regular -ando", "¿Qué", "tú en el ordenador?", "estás buscando", "está buscando", "What are you looking for on the computer?", "basic", "buscar"],
  [9015, "regular -ando", "El camarero", "la mesa de la terraza.", "está limpiando", "están limpiando", "The waiter is cleaning the table on the terrace.", "basic", "limpiar"],
  [9016, "regular -ando", "Vosotras", "muy bien en este partido.", "estáis jugando", "estáis jugar", "You all are playing very well in this match.", "intermediate", "jugar"],
  [9017, "regular -ando", "Últimamente yo", "mucho en bicicleta.", "estoy montando", "estoy montar", "Lately I have been riding my bike a lot.", "intermediate", "montar"],
  [9018, "regular -ando", "Ahora los estudiantes", "sus respuestas.", "están revisando", "son revisando", "Now the students are checking their answers.", "intermediate", "revisar"],
  [9019, "regular -ando", "¿Ustedes", "bien en el hotel?", "están descansando", "estáis descansando", "Are you resting well at the hotel?", "intermediate", "descansar"],
  [9020, "regular -ando", "Mi abuelo", "las plantas del balcón.", "está regando", "está regar", "My grandfather is watering the plants on the balcony.", "basic", "regar"],
  [9021, "regular -ando", "Yo", "con mis amigos por el parque.", "estoy paseando", "estamos paseando", "I am taking a walk with my friends in the park.", "basic", "pasear"],
  [9022, "regular -ando", "Esta semana nosotros", "en un proyecto nuevo.", "estamos trabajando", "estamos trabajado", "This week we are working on a new project.", "intermediate", "trabajar"],
  [9023, "regular -ando", "¡Silencio! El profesor", "la lección.", "está explicando", "es explicando", "Quiet! The teacher is explaining the lesson.", "basic", "explicar"],
  [9024, "regular -ando", "Las chicas", "salsa en la plaza.", "están bailando", "está bailando", "The girls are dancing salsa in the square.", "basic", "bailar"],
  [9025, "regular -ando", "¿Tú", "la tele o puedo apagarla?", "estás mirando", "estás mirar", "Are you watching the TV or can I turn it off?", "intermediate", "mirar"],
  [9026, "regular -ando", "El avión", "en este momento.", "está aterrizando", "están aterrizando", "The plane is landing at the moment.", "intermediate", "aterrizar"],
  [9027, "regular -ando", "Vosotros", "la mudanza muy bien.", "estáis organizando", "están organizando", "You all are organising the move very well.", "intermediate", "organizar"],
  [9028, "regular -ando", "La gente", "en la calle para ver el desfile.", "está esperando", "están esperando", "People are waiting in the street to see the parade.", "advanced", "esperar"],
  [9029, "regular -ando", "¿Usted", "la cuenta con tarjeta?", "está pagando", "estás pagando", "Are you paying the bill by card?", "intermediate", "pagar"],
  [9030, "regular -ando", "Mi familia y yo", "mucho de estas vacaciones.", "estamos disfrutando", "están disfrutando", "My family and I are really enjoying this holiday.", "advanced", "disfrutar"],

  // --- regular -iendo ---
  [9031, "regular -iendo", "Ahora mismo yo", "un correo a mi jefa.", "estoy escribiendo", "estoy escribando", "Right now I am writing an email to my boss.", "basic", "escribir"],
  [9032, "regular -iendo", "¿Qué", "tú? Huele muy bien.", "estás comiendo", "estás comer", "What are you eating? It smells very good.", "basic", "comer"],
  [9033, "regular -iendo", "Mi hermano", "en Berlín este año.", "está viviendo", "es viviendo", "My brother is living in Berlin this year.", "intermediate", "vivir"],
  [9034, "regular -iendo", "Nosotros", "mucho vocabulario nuevo.", "estamos aprendiendo", "están aprendiendo", "We are learning a lot of new vocabulary.", "basic", "aprender"],
  [9035, "regular -iendo", "Los corredores", "por el centro de la ciudad.", "están corriendo", "está corriendo", "The runners are running through the city centre.", "basic", "correr"],
  [9036, "regular -iendo", "¿Vosotros", "los deberes ahora?", "estáis haciendo", "estáis hacer", "Are you all doing your homework now?", "basic", "hacer"],
  [9037, "regular -iendo", "Shh, los niños", "una película.", "están viendo", "están ver", "Shh, the children are watching a film.", "basic", "ver"],
  [9038, "regular -iendo", "Mira por la ventana:", "mucho.", "está lloviendo", "es lloviendo", "Look out of the window: it is raining a lot.", "basic", "llover"],
  [9039, "regular -iendo", "Usted", "demasiado café, señor.", "está bebiendo", "estás bebiendo", "You are drinking too much coffee, sir.", "intermediate", "beber"],
  [9040, "regular -iendo", "Ustedes", "la tienda muy temprano hoy.", "están abriendo", "estáis abriendo", "You are opening the shop very early today.", "intermediate", "abrir"],
  [9041, "regular -iendo", "Yo", "de casa ahora mismo, te llamo luego.", "estoy saliendo", "estoy salir", "I am leaving home right now, I'll call you later.", "intermediate", "salir"],
  [9042, "regular -iendo", "Mi padre", "la mesa para la cena.", "está poniendo", "están poniendo", "My father is setting the table for dinner.", "basic", "poner"],
  [9043, "regular -iendo", "Tú", "fotos de todo el viaje.", "estás subiendo", "estás subir", "You are uploading photos of the whole trip.", "intermediate", "subir"],
  [9044, "regular -iendo", "El equipo", "el partido por dos goles.", "está perdiendo", "están perdiendo", "The team is losing the match by two goals.", "advanced", "perder"],
  [9045, "regular -iendo", "Nosotras", "un piso con dos amigas.", "estamos compartiendo", "estamos compartir", "We are sharing a flat with two friends.", "intermediate", "compartir"],
  [9046, "regular -iendo", "Vosotras", "muchos mensajes hoy.", "estáis recibiendo", "están recibiendo", "You all are getting a lot of messages today.", "intermediate", "recibir"],
  [9047, "regular -iendo", "Mis tíos", "su coche viejo.", "están vendiendo", "son vendiendo", "My aunt and uncle are selling their old car.", "basic", "vender"],
  [9048, "regular -iendo", "Yo no", "nada de lo que dice.", "estoy entendiendo", "estoy entender", "I am not understanding anything he is saying.", "intermediate", "entender"],
  [9049, "regular -iendo", "La abuela", "las luces del salón.", "está encendiendo", "está encender", "Grandma is turning on the lights in the living room.", "basic", "encender"],
  [9050, "regular -iendo", "¿Ustedes", "el postre?", "están escogiendo", "estáis escogiendo", "Are you choosing dessert?", "intermediate", "escoger"],
  [9051, "regular -iendo", "El paciente", "mucho dolor hoy.", "está sufriendo", "es sufriendo", "The patient is in a lot of pain today.", "intermediate", "sufrir"],
  [9052, "regular -iendo", "Los chicos", "sobre fútbol otra vez.", "están discutiendo", "están discutir", "The boys are arguing about football again.", "basic", "discutir"],
  [9053, "regular -iendo", "Yo", "la cocina después de la cena.", "estoy barriendo", "estoy barrer", "I am sweeping the kitchen after dinner.", "basic", "barrer"],
  [9054, "regular -iendo", "Todo el mundo", "la final en la tele.", "está viendo", "están viendo", "Everyone is watching the final on TV.", "advanced", "ver"],
  [9055, "regular -iendo", "Mi amiga y yo", "una novela juntas.", "estamos escribiendo", "están escribiendo", "My friend and I are writing a novel together.", "advanced", "escribir"],
  [9056, "regular -iendo", "¿Tú", "un vestido para la boda?", "estás cosiendo", "estás coser", "Are you sewing a dress for the wedding?", "intermediate", "coser"],
  [9057, "regular -iendo", "El profesor", "el problema en la pizarra.", "está resolviendo", "es resolviendo", "The teacher is solving the problem on the board.", "intermediate", "resolver"],
  [9058, "regular -iendo", "Vosotros", "adónde ir de vacaciones.", "estáis decidiendo", "están decidiendo", "You all are deciding where to go on holiday.", "intermediate", "decidir"],
  [9059, "regular -iendo", "La testigo", "al ladrón a la policía.", "está describiendo", "está describir", "The witness is describing the thief to the police.", "advanced", "describir"],
  [9060, "regular -iendo", "Mi perro", "un hueso en el jardín.", "está escondiendo", "están escondiendo", "My dog is hiding a bone in the garden.", "basic", "esconder"],

  // --- irregular gerund ---
  [9061, "irregular gerund", "Ahora mismo yo", "el periódico.", "estoy leyendo", "estoy leiendo", "Right now I am reading the newspaper.", "basic", "leer"],
  [9062, "irregular gerund", "¿Qué", "tú? No te oigo bien.", "estás diciendo", "estás deciendo", "What are you saying? I can't hear you well.", "basic", "decir"],
  [9063, "irregular gerund", "El bebé", "en su cuna.", "está durmiendo", "está dormiendo", "The baby is sleeping in his cot.", "basic", "dormir"],
  [9064, "irregular gerund", "Nosotros", "una pizza por teléfono.", "estamos pidiendo", "estamos pediendo", "We are ordering a pizza by phone.", "basic", "pedir"],
  [9065, "irregular gerund", "Los camareros", "la comida ahora.", "están sirviendo", "están serviendo", "The waiters are serving the food now.", "basic", "servir"],
  [9066, "irregular gerund", "¿Vosotros", "ese ruido?", "estáis oyendo", "estáis oiendo", "Can you all hear that noise?", "intermediate", "oír"],
  [9067, "irregular gerund", "Mi madre", "patatas para la tortilla.", "está friendo", "está freyendo", "My mother is frying potatoes for the omelette.", "intermediate", "freír"],
  [9068, "irregular gerund", "¿De qué", "tú? ¿Qué es tan gracioso?", "estás riendo", "estás reyendo", "What are you laughing at? What's so funny?", "intermediate", "reír"],
  [9069, "irregular gerund", "Ustedes", "las mismas preguntas una y otra vez.", "están repitiendo", "están repetiendo", "You are repeating the same questions over and over.", "intermediate", "repetir"],
  [9070, "irregular gerund", "Usted", "las instrucciones muy bien.", "está siguiendo", "está seguiendo", "You are following the instructions very well.", "intermediate", "seguir"],
  [9071, "irregular gerund", "Ya", "para allá, llego en diez minutos.", "estoy yendo", "estoy iendo", "I'm on my way there already, I'll arrive in ten minutes.", "intermediate", "ir"],
  [9072, "irregular gerund", "Los obreros", "un puente nuevo sobre el río.", "están construyendo", "están construiendo", "The workers are building a new bridge over the river.", "intermediate", "construir"],
  [9073, "irregular gerund", "Mira, las hojas", "de los árboles.", "están cayendo", "están caiendo", "Look, the leaves are falling from the trees.", "basic", "caer"],
  [9074, "irregular gerund", "Mi hijo", "muy buenas notas este trimestre.", "está consiguiendo", "está conseguiendo", "My son is getting very good marks this term.", "intermediate", "conseguir"],
  [9075, "irregular gerund", "La profesora", "los exámenes en su despacho.", "está corrigiendo", "está corregiendo", "The teacher is marking the exams in her office.", "intermediate", "corregir"],
  [9076, "irregular gerund", "Cuidado, el agua", "en la olla.", "está hirviendo", "está herviendo", "Careful, the water is boiling in the pot.", "intermediate", "hervir"],
  [9077, "irregular gerund", "Tú me", "otra vez, lo sé.", "estás mintiendo", "estás mentiendo", "You are lying to me again, I know it.", "intermediate", "mentir"],
  [9078, "irregular gerund", "Los atletas", "por la medalla de oro.", "están compitiendo", "están competiendo", "The athletes are competing for the gold medal.", "intermediate", "competir"],
  [9079, "irregular gerund", "Vosotras", "el regalo para Marta.", "estáis eligiendo", "estáis elegiendo", "You all are choosing the present for Marta.", "intermediate", "elegir"],
  [9080, "irregular gerund", "Mis amigos me", "un recuerdo de México.", "están trayendo", "están traiendo", "My friends are bringing me a souvenir from Mexico.", "intermediate", "traer"],
  [9081, "irregular gerund", "Yo", "mucho frío en esta casa.", "estoy sintiendo", "estoy sentiendo", "I am feeling very cold in this house.", "intermediate", "sentir"],
  [9082, "irregular gerund", "El ladrón", "de la policía por los tejados.", "está huyendo", "está huiendo", "The thief is fleeing from the police across the rooftops.", "advanced", "huir"],
  [9083, "irregular gerund", "Los gatos", "al sol.", "están durmiendo", "están dormiendo", "The cats are sleeping in the sun.", "basic", "dormir"],
  [9084, "irregular gerund", "Las plantas", "por falta de agua.", "están muriendo", "están moriendo", "The plants are dying from lack of water.", "advanced", "morir"],
  [9085, "irregular gerund", "¿Usted", "bien lo que digo?", "está oyendo", "está oiendo", "Can you hear what I'm saying properly?", "intermediate", "oír"],
  [9086, "irregular gerund", "Nosotros", "el río hasta el pueblo.", "estamos siguiendo", "estamos seguiendo", "We are following the river to the village.", "intermediate", "seguir"],
  [9087, "irregular gerund", "La tormenta", "muchos árboles del parque.", "está destruyendo", "está destruiendo", "The storm is destroying a lot of trees in the park.", "advanced", "destruir"],
  [9088, "irregular gerund", "La enfermera", "la temperatura a los pacientes.", "está midiendo", "está mediendo", "The nurse is taking the patients' temperature.", "advanced", "medir"],
  [9089, "irregular gerund", "¿Qué", "vosotros en el club de lectura?", "estáis leyendo", "estáis leiendo", "What are you all reading in the book club?", "basic", "leer"],
  [9090, "irregular gerund", "El jefe", "a varios empleados.", "está despidiendo", "está despediendo", "The boss is firing several employees.", "advanced", "despedir"],

  // --- pronoun placement ---
  [9091, "pronoun placement", "¿El periódico? Estoy", "en el sofá.", "leyéndolo", "leyendolo", "The newspaper? I am reading it on the sofa.", "intermediate", "leer"],
  [9092, "pronoun placement", "¿La carta? Mi madre está", "en la cocina.", "escribiéndola", "la escribiendo", "The letter? My mother is writing it in the kitchen.", "intermediate", "escribir"],
  [9093, "pronoun placement", "Ahora mismo estoy", "con agua fría.", "duchándome", "duchandome", "Right now I am having a shower with cold water.", "intermediate", "ducharse"],
  [9094, "pronoun placement", "Los niños están", "para ir al colegio.", "vistiéndose", "vistiendose", "The children are getting dressed for school.", "intermediate", "vestirse"],
  [9095, "pronoun placement", "¿Las fotos? Estamos", "ahora.", "mirándolas", "las mirando", "The photos? We are looking at them now.", "intermediate", "mirar"],
  [9096, "pronoun placement", "¿Tu coche? Mi hermano está", "en el garaje.", "arreglándolo", "arreglandolo", "Your car? My brother is fixing it in the garage.", "intermediate", "arreglar"],
  [9097, "pronoun placement", "Ana, ¿estás", "en la fiesta?", "divirtiéndote", "divertiéndote", "Ana, are you having fun at the party?", "advanced", "divertirse"],
  [9098, "pronoun placement", "¿El regalo? Estoy", "a mi hermana ahora.", "dándoselo", "dandoselo", "The present? I am giving it to my sister now.", "advanced", "dar"],
  [9099, "pronoun placement", "¿La verdad? El testigo está", "al juez.", "diciéndosela", "diciendosela", "The truth? The witness is telling it to the judge.", "advanced", "decir"],
  [9100, "pronoun placement", "Mis padres están", "en el sofá.", "relajándose", "relajandose", "My parents are relaxing on the sofa.", "intermediate", "relajarse"],
  [9101, "pronoun placement", "¿Los platos? Vosotros estáis", "muy rápido.", "lavándolos", "los lavando", "The dishes? You all are washing them very fast.", "intermediate", "lavar"],
  [9102, "pronoun placement", "¿La cena? Estamos", "para todos.", "preparándola", "preparandola", "Dinner? We are making it for everyone.", "intermediate", "preparar"],
  [9103, "pronoun placement", "¿Las instrucciones? Ustedes están", "con mucha atención.", "leyéndolas", "las leyendo", "The instructions? You are reading them very carefully.", "intermediate", "leer"],
  [9104, "pronoun placement", "El perro está", "al sol en la terraza.", "secándose", "secandose", "The dog is drying off in the sun on the terrace.", "intermediate", "secarse"],
  [9105, "pronoun placement", "¿El problema? La profesora está", "a los alumnos paso a paso.", "explicándoselo", "explicandoselo", "The problem? The teacher is explaining it to the students step by step.", "advanced", "explicar"],
  [9106, "pronoun placement", "¿El libro? Yo lo", "ahora mismo.", "estoy leyendo", "estoy leyéndolo", "The book? I'm reading it right now.", "intermediate", "leer"],
  [9107, "pronoun placement", "Mi hermana se", "el pelo en el baño.", "está secando", "está secándose", "My sister is drying her hair in the bathroom.", "intermediate", "secarse"],
  [9108, "pronoun placement", "¿Las llaves? Nosotros las", "por toda la casa.", "estamos buscando", "estamos buscándolas", "The keys? We are looking for them all over the house.", "intermediate", "buscar"],
  [9109, "pronoun placement", "Tranquila, yo te", "con atención.", "estoy escuchando", "estoy escuchándote", "Don't worry, I am listening to you carefully.", "intermediate", "escuchar"],
  [9110, "pronoun placement", "¿La película? Los niños la", "en el salón.", "están viendo", "están viéndola", "The film? The children are watching it in the living room.", "intermediate", "ver"],
  [9111, "pronoun placement", "Vosotros os", "muchísimo en la fiesta, ¿verdad?", "estáis divirtiendo", "estáis divirtiéndoos", "You all are having a great time at the party, aren't you?", "advanced", "divertirse"],
  [9112, "pronoun placement", "¿Usted me", "bien desde ahí?", "está oyendo", "está oyéndome", "Can you hear me properly from there?", "intermediate", "oír"],
  [9113, "pronoun placement", "Yo me", "para la entrevista de trabajo.", "estoy preparando", "estoy preparándome", "I am getting ready for the job interview.", "intermediate", "prepararse"],
  [9114, "pronoun placement", "¿El informe? Mi jefe me lo", "ahora mismo.", "está pidiendo", "está pidiéndomelo", "The report? My boss is asking me for it right now.", "advanced", "pedir"],
  [9115, "pronoun placement", "Tú se lo", "a todo el mundo.", "estás contando", "estás contándoselo", "You are telling it to everyone.", "advanced", "contar"],
  [9116, "pronoun placement", "Los invitados se", "ya.", "están despidiendo", "están despidiéndose", "The guests are saying goodbye now.", "advanced", "despedirse"],
  [9117, "pronoun placement", "¿La casa? Mis abuelos la", "este año.", "están vendiendo", "están vendiéndola", "The house? My grandparents are selling it this year.", "intermediate", "vender"],
  [9118, "pronoun placement", "Ustedes se", "mucho con este calor.", "están quejando", "están quejándose", "You are complaining a lot in this heat.", "intermediate", "quejarse"],
  [9119, "pronoun placement", "Nosotras nos", "para salir.", "estamos arreglando", "estamos arreglándonos", "We are getting ready to go out.", "intermediate", "arreglarse"],
  [9120, "pronoun placement", "¿Los deberes? Tú los", "sin ganas.", "estás haciendo", "estás haciéndolos", "Your homework? You are doing it half-heartedly.", "intermediate", "hacer"],

  // --- gerund or infinitive ---
  [9121, "gerund or infinitive", "Me encanta", "en el mar en verano.", "nadar", "nadando", "I love swimming in the sea in summer.", "basic", "nadar"],
  [9122, "gerund or infinitive", "Para mí,", "es el mejor ejercicio.", "correr", "corriendo", "For me, running is the best exercise.", "advanced", "correr"],
  [9123, "gerund or infinitive", "Antes de", ", me lavo las manos.", "comer", "comiendo", "Before eating, I wash my hands.", "basic", "comer"],
  [9124, "gerund or infinitive", "Estoy cansado de", "el autobús cada mañana.", "esperar", "esperando", "I'm tired of waiting for the bus every morning.", "intermediate", "esperar"],
  [9125, "gerund or infinitive", "Aquí está prohibido", ".", "fumar", "fumando", "Smoking is not allowed here.", "basic", "fumar"],
  [9126, "gerund or infinitive", "Después de", ", vamos a dar un paseo.", "cenar", "cenando", "After having dinner, we are going for a walk.", "basic", "cenar"],
  [9127, "gerund or infinitive", "Mi hermano odia", "temprano los domingos.", "levantarse", "levantándose", "My brother hates getting up early on Sundays.", "intermediate", "levantarse"],
  [9128, "gerund or infinitive", "Gracias por", "a la fiesta.", "venir", "viniendo", "Thank you for coming to the party.", "basic", "venir"],
  [9129, "gerund or infinitive", "Estamos pensando en", "un coche nuevo.", "comprar", "comprando", "We are thinking about buying a new car.", "intermediate", "comprar"],
  [9130, "gerund or infinitive", "Sin", "nada, se fue de la reunión.", "decir", "diciendo", "Without saying anything, he left the meeting.", "advanced", "decir"],
  [9131, "gerund or infinitive", "Lo que más me gusta es", "con mis amigos.", "viajar", "viajando", "What I like most is travelling with my friends.", "advanced", "viajar"],
  [9132, "gerund or infinitive", "Quiero", "a tocar la guitarra este año.", "aprender", "aprendiendo", "I want to learn to play the guitar this year.", "basic", "aprender"],
  [9133, "gerund or infinitive", "Mis padres van a", "la cocina este verano.", "pintar", "pintando", "My parents are going to paint the kitchen this summer.", "basic", "pintar"],
  [9134, "gerund or infinitive", "¡Deja de", "y escúchame!", "hablar", "hablando", "Stop talking and listen to me!", "intermediate", "hablar"],
  [9135, "gerund or infinitive", "Tengo que", "el informe antes del viernes.", "terminar", "terminando", "I have to finish the report before Friday.", "basic", "terminar"],
  [9136, "gerund or infinitive", "Ahora mismo yo", "en el mar.", "estoy nadando", "estoy nadar", "Right now I am swimming in the sea.", "basic", "nadar"],
  [9137, "gerund or infinitive", "Mira, Pablo", "por la playa.", "está corriendo", "está correr", "Look, Pablo is running along the beach.", "basic", "correr"],
  [9138, "gerund or infinitive", "Nosotros", "ahora, ¿te llamo luego?", "estamos comiendo", "estamos comer", "We are eating now, shall I call you later?", "basic", "comer"],
  [9139, "gerund or infinitive", "Shh, los vecinos", "la siesta.", "están durmiendo", "están dormir", "Shh, the neighbours are having a nap.", "intermediate", "dormir"],
  [9140, "gerund or infinitive", "¿Vosotros", "el autobús o el tren?", "estáis esperando", "estáis esperar", "Are you all waiting for the bus or the train?", "basic", "esperar"],
  [9141, "gerund or infinitive", "Ella", "a tocar la guitarra este año.", "está aprendiendo", "está aprender", "She is learning to play the guitar this year.", "intermediate", "aprender"],
  [9142, "gerund or infinitive", "¿Qué", "tú en este momento?", "estás haciendo", "estás hacer", "What are you doing at the moment?", "basic", "hacer"],
  [9143, "gerund or infinitive", "Mis amigos", "por Asia este verano.", "están viajando", "están viajar", "My friends are travelling around Asia this summer.", "intermediate", "viajar"],
  [9144, "gerund or infinitive", "Ustedes", "demasiado alto.", "están hablando", "están hablar", "You are talking too loudly.", "basic", "hablar"],
  [9145, "gerund or infinitive", "Usted", "el informe ahora, ¿verdad?", "está terminando", "está terminar", "You are finishing the report now, aren't you?", "intermediate", "terminar"],
  [9146, "gerund or infinitive", "Ahora mi hermano", "la habitación.", "está pintando", "está pintar", "Now my brother is painting the bedroom.", "basic", "pintar"],
  [9147, "gerund or infinitive", "Yo", "a mis abuelos esta semana.", "estoy visitando", "estoy visitar", "I am visiting my grandparents this week.", "intermediate", "visitar"],
  [9148, "gerund or infinitive", "Nosotras", "un piso nuevo en el centro.", "estamos buscando", "estamos buscar", "We are looking for a new flat in the centre.", "intermediate", "buscar"],
  [9149, "gerund or infinitive", "Tú", "mucho últimamente.", "estás leyendo", "estás leer", "You are reading a lot lately.", "intermediate", "leer"],
  [9150, "gerund or infinitive", "Vosotros", "la cena en la cocina.", "estáis preparando", "estáis preparar", "You all are making dinner in the kitchen.", "basic", "preparar"],
];

export const PRESENT_CONTINUOUS_QUESTIONS: Question[] = seed.map(([id, group, before, after, answer, distractor, en, level, blankHint]) => ({
  id,
  before,
  after,
  infinitive: group,
  answer,
  verbAnswer: answer,
  objectPronoun: distractor,
  // Written per item in explanations-present-continuous.ts.
  explanation: "",
  translations: { en, pl: "" },
  subjectNumber: answer.split(" ").some((word) => PLURAL_ESTAR.has(word)) ? ("plural" as const) : ("singular" as const),
  isActivity: false,
  indirectObject: "",
  // Estar is in the present; the shared Question type has no separate continuous tense.
  tense: "present" as const,
  level,
  blankHint,
})).map(applySourcedQuestionPair).map(withItemExplanation(PRESENT_CONTINUOUS_EXPLANATIONS));

/** One entry per group, so the shared "second filter" can list them. */
export const PRESENT_CONTINUOUS_FORMS: Record<PresentContinuousGroup, [string, string]> = {
  "regular -ando": ["estoy hablando", "están trabajando"],
  "regular -iendo": ["estoy comiendo", "están escribiendo"],
  "irregular gerund": ["estoy leyendo", "están durmiendo"],
  "pronoun placement": ["lo estoy leyendo", "estoy leyéndolo"],
  "gerund or infinitive": ["estoy nadando", "me encanta nadar"],
};

/** Reference tables for the in-round "Continuous chart". */
export const PRESENT_CONTINUOUS_CHART: Array<{ title: string; rows: Array<{ label: string; form: string }> }> = [
  {
    title: "Estar · present",
    rows: [
      { label: "yo", form: "estoy hablando" },
      { label: "tú", form: "estás hablando" },
      { label: "él / ella / usted", form: "está hablando" },
      { label: "nosotros / nosotras", form: "estamos hablando" },
      { label: "vosotros / vosotras", form: "estáis hablando" },
      { label: "ellos / ellas / ustedes", form: "están hablando" },
    ],
  },
  {
    title: "Regular gerunds",
    rows: [
      { label: "-ar: hablar", form: "hablando" },
      { label: "-er: comer", form: "comiendo" },
      { label: "-ir: vivir", form: "viviendo" },
    ],
  },
  {
    title: "Irregular gerunds",
    rows: [
      { label: "e to i: pedir", form: "pidiendo" },
      { label: "e to i: decir", form: "diciendo" },
      { label: "e to i: seguir", form: "siguiendo" },
      { label: "o to u: dormir", form: "durmiendo" },
      { label: "o to u: morir", form: "muriendo" },
      { label: "y: leer", form: "leyendo" },
      { label: "y: oír", form: "oyendo" },
      { label: "y: construir", form: "construyendo" },
      { label: "ir", form: "yendo" },
      { label: "reír", form: "riendo" },
    ],
  },
  {
    title: "Pronouns",
    rows: [
      { label: "before estar", form: "lo estoy leyendo" },
      { label: "or attached, with an accent", form: "estoy leyéndolo" },
      { label: "reflexive before estar", form: "me estoy duchando" },
      { label: "or attached", form: "estoy duchándome" },
      { label: "two pronouns attached", form: "estoy dándoselo" },
    ],
  },
];
