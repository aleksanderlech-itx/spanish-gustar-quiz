import type { Question } from "./quiz-data";
import { applySourcedQuestionPair } from "./sourced-quiz-content.ts";

const seed = [
  // --- Duration (por) ---
  [4001, "Voy a estudiar", " dos horas esta tarde.", "por", "para", "I am going to study for two hours this afternoon.", "basic", "A length of time uses por."],
  [4002, "Ella trabajó", " seis meses en esa empresa.", "por", "para", "She worked for six months at that company.", "basic", "A length of time uses por."],
  [4003, "Vivimos en Chile", " tres años.", "por", "para", "We lived in Chile for three years.", "basic", "A length of time uses por."],
  [4004, "Practicaré español", " media hora cada día.", "por", "para", "I will practise Spanish for half an hour every day.", "basic", "A length of time uses por."],
  [4005, "El bebé durmió", " diez horas anoche.", "por", "para", "The baby slept for ten hours last night.", "basic", "A length of time uses por."],
  [4006, "Estuvimos en la playa", " todo el día.", "por", "para", "We were at the beach for the whole day.", "basic", "A length of time uses por."],
  [4007, "Van a viajar", " dos semanas.", "por", "para", "They are going to travel for two weeks.", "basic", "A length of time uses por."],
  [4008, "Esperamos", " veinte minutos en la parada.", "por", "para", "We waited for twenty minutes at the stop.", "basic", "A length of time uses por."],
  [4009, "Trabajó", " muchos años como enfermera.", "por", "para", "She worked for many years as a nurse.", "basic", "A length of time uses por."],
  [4010, "Caminamos", " una hora antes de cenar.", "por", "para", "We walked for an hour before dinner.", "basic", "A length of time uses por."],

  // --- Cause / reason (por) ---
  [4011, "Cancelaron el partido", " la lluvia.", "por", "para", "They cancelled the match because of the rain.", "basic", "The cause of something uses por."],
  [4012, "Llegué tarde", " el tráfico.", "por", "para", "I arrived late because of the traffic.", "basic", "The cause of something uses por."],
  [4013, "Lo hago", " amor, no por dinero.", "por", "para", "I do it out of love, not for money.", "intermediate", "The motive behind an action uses por."],
  [4014, "Se disculpó", " su error.", "por", "para", "He apologised for his mistake.", "basic", "The reason for an apology uses por."],
  [4015, "Está preocupada", " los exámenes.", "por", "para", "She is worried about the exams.", "intermediate", "The cause of worry uses por."],
  [4016, "Perdimos el vuelo", " el retraso del taxi.", "por", "para", "We missed the flight because of the taxi's delay.", "intermediate", "The cause of something uses por."],
  [4017, "Ganó el premio", " su esfuerzo.", "por", "para", "She won the prize because of her effort.", "intermediate", "The reason behind a result uses por."],
  [4018, "No pudimos salir", " el mal tiempo.", "por", "para", "We couldn't go out because of the bad weather.", "basic", "The cause of something uses por."],
  [4019, "Te doy las gracias", " tu ayuda.", "por", "para", "I thank you for your help.", "basic", "The reason for gratitude uses por."],
  [4020, "Ella lloró", " la triste noticia.", "por", "para", "She cried because of the sad news.", "intermediate", "The cause of an emotion uses por."],
  [4021, "El puente se cerró", " las obras.", "por", "para", "The bridge was closed because of the construction work.", "intermediate", "The cause of something uses por."],
  [4022, "Nos preocupamos", " su salud.", "por", "para", "We worry about his health.", "intermediate", "The cause of worry uses por."],
  [4023, "Se enfermó", " comer tanto.", "por", "para", "He got sick from eating so much.", "intermediate", "The cause of a result uses por."],
  [4024, "Todos aplaudieron", " su valentía.", "por", "para", "Everyone applauded because of her bravery.", "advanced", "The reason behind a reaction uses por."],
  [4025, "Renunció al trabajo", " el estrés.", "por", "para", "She quit the job because of the stress.", "advanced", "The cause of a decision uses por."],

  // --- Exchange / price (por) ---
  [4026, "Compré esta bicicleta", " cien euros.", "por", "para", "I bought this bike for one hundred euros.", "basic", "A price paid in exchange uses por."],
  [4027, "Cambié mi coche viejo", " uno nuevo.", "por", "para", "I traded my old car for a new one.", "basic", "An exchange of one thing for another uses por."],
  [4028, "Pagó treinta dólares", " el libro.", "por", "para", "She paid thirty dollars for the book.", "basic", "A price paid uses por."],
  [4029, "Vendí mi guitarra", " ciento cincuenta euros.", "por", "para", "I sold my guitar for one hundred fifty euros.", "basic", "A price received uses por."],
  [4030, "Te doy mi entrada", " la tuya.", "por", "para", "I'll give you my ticket for yours.", "intermediate", "A trade of one thing for another uses por."],
  [4031, "Compramos la casa", " un buen precio.", "por", "para", "We bought the house for a good price.", "basic", "A price paid uses por."],
  [4032, "Pagué diez euros", " el taxi.", "por", "para", "I paid ten euros for the taxi.", "basic", "A price paid uses por."],
  [4033, "Cambiamos euros", " dólares en el banco.", "por", "para", "We exchanged euros for dollars at the bank.", "intermediate", "A currency exchange uses por."],
  [4034, "Ofreció cincuenta euros", " el cuadro.", "por", "para", "He offered fifty euros for the painting.", "intermediate", "A price offered uses por."],
  [4035, "Compré este vestido", " muy poco dinero.", "por", "para", "I bought this dress for very little money.", "basic", "A price paid uses por."],

  // --- Means / manner (por) ---
  [4036, "Te llamo", " teléfono esta noche.", "por", "para", "I'll call you by phone tonight.", "basic", "A means of communication uses por."],
  [4037, "Mandaron el paquete", " correo.", "por", "para", "They sent the package by mail.", "basic", "A means of sending something uses por."],
  [4038, "Viajamos", " avión hasta Madrid.", "por", "para", "We travelled by plane to Madrid.", "basic", "A means of transport uses por."],
  [4039, "Nos comunicamos", " videollamada.", "por", "para", "We communicate by video call.", "intermediate", "A means of communication uses por."],
  [4040, "Envié el documento", " correo electrónico.", "por", "para", "I sent the document by email.", "basic", "A means of sending something uses por."],
  [4041, "Hablamos", " Skype la semana pasada.", "por", "para", "We spoke over Skype last week.", "intermediate", "A means of communication uses por."],
  [4042, "Vinieron", " barco desde Argentina.", "por", "para", "They came by boat from Argentina.", "basic", "A means of transport uses por."],
  [4043, "Se enteraron de la noticia", " la radio.", "por", "para", "They found out about the news through the radio.", "intermediate", "A means through which information travels uses por."],
  [4044, "Reservamos el hotel", " internet.", "por", "para", "We booked the hotel through the internet.", "basic", "A means used to do something uses por."],
  [4045, "Nos avisaron", " mensaje de texto.", "por", "para", "They notified us by text message.", "basic", "A means of communication uses por."],

  // --- Movement through / along (por) ---
  [4046, "Caminamos", " el parque esta mañana.", "por", "para", "We walked through the park this morning.", "basic", "Movement through a place uses por."],
  [4047, "El río pasa", " el centro de la ciudad.", "por", "para", "The river runs through the centre of the city.", "basic", "Movement through a place uses por."],
  [4048, "Fuimos", " la autopista para llegar más rápido.", "por", "para", "We went by the highway to arrive faster.", "intermediate", "A route travelled uses por."],
  [4049, "Paseamos", " la playa al atardecer.", "por", "para", "We strolled along the beach at sunset.", "basic", "Movement along a place uses por."],
  [4050, "Entramos", " la puerta principal.", "por", "para", "We came in through the main door.", "basic", "Movement through a place uses por."],
  [4051, "El ladrón escapó", " la ventana.", "por", "para", "The thief escaped through the window.", "intermediate", "Movement through a place uses por."],
  [4052, "Subimos", " las escaleras, no por el ascensor.", "por", "para", "We went up by the stairs, not the elevator.", "intermediate", "A route or means used uses por."],
  [4053, "Conducimos", " las montañas todo el fin de semana.", "por", "para", "We drove through the mountains all weekend.", "intermediate", "Movement through a place uses por."],
  [4054, "Pasamos", " tu casa antes de la fiesta.", "por", "para", "We'll swing by your house before the party.", "basic", "Movement past or through a place uses por."],
  [4055, "Los turistas caminan", " las calles antiguas.", "por", "para", "The tourists walk through the old streets.", "basic", "Movement through a place uses por."],

  // --- On behalf of / substitution (por) ---
  [4056, "Firmé el documento", " mi jefe porque estaba de viaje.", "por", "para", "I signed the document on behalf of my boss because he was travelling.", "advanced", "Acting in someone else's place uses por."],
  [4057, "Trabajé", " mi compañera porque ella estaba enferma.", "por", "para", "I worked in place of my colleague because she was sick.", "advanced", "Substituting for someone uses por."],
  [4058, "Hablé", " todo el equipo en la reunión.", "por", "para", "I spoke on behalf of the whole team at the meeting.", "intermediate", "Speaking on someone's behalf uses por."],
  [4059, "Ella respondió", " su hermano menor.", "por", "para", "She answered on behalf of her younger brother.", "intermediate", "Acting on someone's behalf uses por."],
  [4060, "El abogado habló", " su cliente.", "por", "para", "The lawyer spoke on behalf of his client.", "intermediate", "Speaking on someone's behalf uses por."],
  [4061, "Voté", " mi madre porque no pudo ir.", "por", "para", "I voted on behalf of my mother because she couldn't go.", "advanced", "Acting in someone's place uses por."],
  [4062, "Terminé el informe", " ti anoche.", "por", "para", "I finished the report for you (in your place) last night.", "advanced", "Doing something instead of someone uses por."],
  [4063, "Ana cocinó", " su madre ese día.", "por", "para", "Ana cooked in place of her mother that day.", "intermediate", "Substituting for someone uses por."],
  [4064, "Pagué la cuenta", " mis amigos.", "por", "para", "I paid the bill on behalf of my friends.", "intermediate", "Acting on someone's behalf uses por."],
  [4065, "El asistente respondió el correo", " el director.", "por", "para", "The assistant answered the email on behalf of the director.", "advanced", "Acting in someone's place uses por."],

  // --- Per / rate (por) ---
  [4066, "Vamos al gimnasio tres veces", " semana.", "por", "para", "We go to the gym three times a week.", "basic", "A rate or frequency uses por."],
  [4067, "El médico me visita dos veces", " mes.", "por", "para", "The doctor visits me twice a month.", "basic", "A rate or frequency uses por."],
  [4068, "El coche corre a cien kilómetros", " hora.", "por", "para", "The car goes one hundred kilometres per hour.", "basic", "A rate uses por."],
  [4069, "Cobra veinte euros", " hora de clase.", "por", "para", "He charges twenty euros per hour of class.", "basic", "A rate uses por."],
  [4070, "Comemos pescado una vez", " semana.", "por", "para", "We eat fish once a week.", "basic", "A rate or frequency uses por."],

  // --- Passive voice agent (por) ---
  [4071, "La novela fue escrita", " un autor famoso.", "por", "para", "The novel was written by a famous author.", "advanced", "The agent of a passive verb uses por."],
  [4072, "El puente fue construido", " ingenieros españoles.", "por", "para", "The bridge was built by Spanish engineers.", "advanced", "The agent of a passive verb uses por."],
  [4073, "La ciudad fue fundada", " los romanos.", "por", "para", "The city was founded by the Romans.", "advanced", "The agent of a passive verb uses por."],
  [4074, "El cuadro fue pintado", " Picasso.", "por", "para", "The painting was painted by Picasso.", "advanced", "The agent of a passive verb uses por."],
  [4075, "La empresa fue creada", " dos hermanos.", "por", "para", "The company was created by two brothers.", "advanced", "The agent of a passive verb uses por."],

  // --- Purpose / goal (para + infinitive) ---
  [4076, "Estudio español", " viajar a México.", "para", "por", "I study Spanish (in order) to travel to Mexico.", "basic", "The purpose of an action uses para."],
  [4077, "Ahorro dinero", " comprar una casa.", "para", "por", "I'm saving money (in order) to buy a house.", "basic", "The goal of an action uses para."],
  [4078, "Trabaja mucho", " mantener a su familia.", "para", "por", "He works hard to support his family.", "basic", "The purpose of an action uses para."],
  [4079, "Uso gafas", " leer mejor.", "para", "por", "I wear glasses to read better.", "basic", "The purpose of using something uses para."],
  [4080, "Necesito una llave", " abrir la puerta.", "para", "por", "I need a key to open the door.", "basic", "The purpose of an object uses para."],
  [4081, "Practicamos cada día", " mejorar.", "para", "por", "We practise every day to improve.", "basic", "The goal of an action uses para."],
  [4082, "Compré harina", " hacer pan.", "para", "por", "I bought flour to make bread.", "basic", "The purpose of buying something uses para."],
  [4083, "Llamé", " pedir información.", "para", "por", "I called to ask for information.", "basic", "The purpose of an action uses para."],
  [4084, "Fuimos al mercado", " comprar frutas.", "para", "por", "We went to the market to buy fruit.", "basic", "The purpose of an action uses para."],
  [4085, "Estudia de noche", " aprobar el examen.", "para", "por", "She studies at night to pass the exam.", "basic", "The goal of an action uses para."],
  [4086, "Necesitamos más tiempo", " terminar el proyecto.", "para", "por", "We need more time to finish the project.", "intermediate", "The purpose of something needed uses para."],
  [4087, "Usamos un mapa", " no perdernos.", "para", "por", "We used a map so as not to get lost.", "intermediate", "The purpose of using something uses para."],
  [4088, "Ella corre todos los días", " mantenerse en forma.", "para", "por", "She runs every day to stay in shape.", "basic", "The goal of an action uses para."],
  [4089, "Escribí una carta", " explicar la situación.", "para", "por", "I wrote a letter to explain the situation.", "intermediate", "The purpose of an action uses para."],
  [4090, "Compramos entradas", " ver la película.", "para", "por", "We bought tickets to see the movie.", "basic", "The purpose of an action uses para."],

  // --- Recipient (para) ---
  [4091, "Este regalo es", " ti.", "para", "por", "This gift is for you.", "basic", "The recipient of something uses para."],
  [4092, "Compré flores", " mi madre.", "para", "por", "I bought flowers for my mother.", "basic", "The recipient of something uses para."],
  [4093, "Hice una tarta", " los invitados.", "para", "por", "I made a cake for the guests.", "basic", "The recipient of something uses para."],
  [4094, "Traje un café", " mi jefe.", "para", "por", "I brought a coffee for my boss.", "basic", "The recipient of something uses para."],
  [4095, "Guardé un trozo de pastel", " ti.", "para", "por", "I saved a piece of cake for you.", "basic", "The recipient of something uses para."],
  [4096, "Este mensaje es", " todos los estudiantes.", "para", "por", "This message is for all the students.", "basic", "The recipient of something uses para."],
  [4097, "Compramos juguetes", " los niños.", "para", "por", "We bought toys for the children.", "basic", "The recipient of something uses para."],
  [4098, "Escribí esta canción", " mi esposa.", "para", "por", "I wrote this song for my wife.", "intermediate", "The recipient of something uses para."],
  [4099, "Reservé una mesa", " nosotros.", "para", "por", "I reserved a table for us.", "basic", "The recipient of something uses para."],
  [4100, "Preparé la cena", " mis padres.", "para", "por", "I prepared dinner for my parents.", "basic", "The recipient of something uses para."],
  [4101, "Compré un libro", " mi sobrino.", "para", "por", "I bought a book for my nephew.", "basic", "The recipient of something uses para."],
  [4102, "Hicimos una fiesta sorpresa", " ella.", "para", "por", "We threw a surprise party for her.", "intermediate", "The recipient of something uses para."],
  [4103, "Traje regalos", " toda la familia.", "para", "por", "I brought gifts for the whole family.", "basic", "The recipient of something uses para."],
  [4104, "Este consejo es", " ustedes.", "para", "por", "This advice is for you all.", "basic", "The recipient of something uses para."],
  [4105, "Compré un ramo de flores", " mi abuela.", "para", "por", "I bought a bouquet of flowers for my grandmother.", "basic", "The recipient of something uses para."],

  // --- Deadline (para) ---
  [4106, "La tarea es", " el lunes.", "para", "por", "The homework is due (for) Monday.", "basic", "A deadline uses para."],
  [4107, "Necesito el informe", " mañana.", "para", "por", "I need the report by tomorrow.", "basic", "A deadline uses para."],
  [4108, "El proyecto debe estar listo", " el viernes.", "para", "por", "The project must be ready by Friday.", "intermediate", "A deadline uses para."],
  [4109, "Reserva la mesa", " las ocho.", "para", "por", "Book the table for eight o'clock.", "basic", "A set point in time uses para."],
  [4110, "Termina esto", " el final del día.", "para", "por", "Finish this by the end of the day.", "intermediate", "A deadline uses para."],
  [4111, "El pago vence", " fin de mes.", "para", "por", "The payment is due by the end of the month.", "intermediate", "A deadline uses para."],
  [4112, "Quiero el coche reparado", " el sábado.", "para", "por", "I want the car fixed by Saturday.", "intermediate", "A deadline uses para."],
  [4113, "Necesito la respuesta", " esta tarde.", "para", "por", "I need the answer by this afternoon.", "basic", "A deadline uses para."],
  [4114, "El regalo debe llegar", " su cumpleaños.", "para", "por", "The gift must arrive by her birthday.", "intermediate", "A deadline uses para."],
  [4115, "Tenemos que entregar el examen", " las diez.", "para", "por", "We have to hand in the exam by ten o'clock.", "intermediate", "A deadline uses para."],

  // --- Destination (para) ---
  [4116, "Este tren sale", " Barcelona.", "para", "por", "This train leaves for Barcelona.", "basic", "A destination uses para."],
  [4117, "Salimos", " el aeropuerto en una hora.", "para", "por", "We are leaving for the airport in an hour.", "basic", "A destination uses para."],
  [4118, "El autobús va", " el centro.", "para", "por", "The bus goes towards the centre.", "basic", "A destination uses para."],
  [4119, "Partimos", " Argentina la próxima semana.", "para", "por", "We are departing for Argentina next week.", "intermediate", "A destination uses para."],
  [4120, "El vuelo sale", " México a las nueve.", "para", "por", "The flight leaves for Mexico at nine.", "basic", "A destination uses para."],
  [4121, "Vamos", " la playa este fin de semana.", "para", "por", "We're heading to the beach this weekend.", "basic", "A destination uses para."],
  [4122, "El barco navega", " las islas Canarias.", "para", "por", "The ship sails towards the Canary Islands.", "intermediate", "A destination uses para."],
  [4123, "Salió", " la oficina muy temprano.", "para", "por", "She left for the office very early.", "basic", "A destination uses para."],
  [4124, "Este camino va", " el pueblo.", "para", "por", "This road leads to the village.", "intermediate", "A destination uses para."],
  [4125, "Partimos", " casa después de la cena.", "para", "por", "We headed home after dinner.", "basic", "A destination uses para."],

  // --- Opinion (para) ---
  [4126, "", " mí, esta película es aburrida.", "para", "por", "For me, this movie is boring.", "intermediate", "An opinion or point of view uses para."],
  [4127, "", " nosotros, el examen fue muy difícil.", "para", "por", "For us, the exam was very difficult.", "intermediate", "An opinion or point of view uses para."],
  [4128, "", " ella, el español es fácil.", "para", "por", "For her, Spanish is easy.", "intermediate", "An opinion or point of view uses para."],
  [4129, "", " mis padres, la puntualidad es muy importante.", "para", "por", "For my parents, punctuality is very important.", "intermediate", "An opinion or point of view uses para."],
  [4130, "", " ti, todo parece sencillo.", "para", "por", "For you, everything seems simple.", "intermediate", "An opinion or point of view uses para."],

  // --- Employment / working for (para) ---
  [4131, "Trabajo", " una empresa internacional.", "para", "por", "I work for an international company.", "intermediate", "An employer uses para."],
  [4132, "Ella trabaja", " el gobierno.", "para", "por", "She works for the government.", "intermediate", "An employer uses para."],
  [4133, "Mi hermano trabaja", " un banco.", "para", "por", "My brother works for a bank.", "intermediate", "An employer uses para."],
  [4134, "Trabajamos", " una organización sin fines de lucro.", "para", "por", "We work for a non-profit organisation.", "intermediate", "An employer uses para."],
  [4135, "Él trabaja", " sí mismo como diseñador.", "para", "por", "He works for himself as a designer.", "intermediate", "An employer, even oneself, uses para."],

  // --- Contrast / comparison (para) ---
  [4136, "", " ser principiante, hablas muy bien.", "para", "por", "For a beginner, you speak very well.", "advanced", "A contrast against expectation uses para."],
  [4137, "", " tener solo diez años, dibuja increíblemente bien.", "para", "por", "For being only ten years old, she draws incredibly well.", "advanced", "A contrast against expectation uses para."],
  [4138, "", " ser tan joven, tiene mucha experiencia.", "para", "por", "For being so young, he has a lot of experience.", "advanced", "A contrast against expectation uses para."],
  [4139, "", " ser invierno, hace bastante calor.", "para", "por", "For winter, it's quite warm.", "advanced", "A contrast against expectation uses para."],
  [4140, "", " llevar poco tiempo aquí, conoces la ciudad muy bien.", "para", "por", "For having been here a short time, you know the city very well.", "advanced", "A contrast against expectation uses para."],

  // --- More purpose (para) ---
  [4141, "Necesitamos voluntarios", " organizar el evento.", "para", "por", "We need volunteers to organise the event.", "advanced", "The purpose of a need uses para."],
  [4142, "Ahorramos", " viajar por toda Europa algún día.", "para", "por", "We're saving up to travel all over Europe someday.", "advanced", "The goal of an action uses para."],
  [4143, "Estudia biología", " convertirse en médica.", "para", "por", "She studies biology to become a doctor.", "advanced", "The goal of an action uses para."],
  [4144, "Compramos ingredientes", " preparar una paella.", "para", "por", "We bought ingredients to make a paella.", "intermediate", "The purpose of an action uses para."],
  [4145, "Practican cada tarde", " ganar el campeonato.", "para", "por", "They practise every afternoon to win the championship.", "advanced", "The goal of an action uses para."],
  // --- More recipient / purpose (para) ---
  [4146, "Este premio es", " el mejor estudiante del año.", "para", "por", "This prize is for the best student of the year.", "intermediate", "The recipient of something uses para."],
  [4147, "Dejé una nota", " el vecino.", "para", "por", "I left a note for the neighbour.", "basic", "The recipient of something uses para."],
  [4148, "Compré un regalo especial", " mi mejor amiga.", "para", "por", "I bought a special gift for my best friend.", "basic", "The recipient of something uses para."],
  [4149, "Preparamos una sorpresa", " nuestros abuelos.", "para", "por", "We prepared a surprise for our grandparents.", "intermediate", "The recipient of something uses para."],
  [4150, "Este descuento es solo", " los socios del club.", "para", "por", "This discount is only for club members.", "intermediate", "The recipient of something uses para."],
] as const;

export const POR_PARA_QUESTIONS: Question[] = seed.map(([id, before, after, answer, alternateAnswer, en, level, explanation]) => ({
  id,
  before,
  after,
  infinitive: "por / para",
  answer,
  verbAnswer: answer,
  objectPronoun: alternateAnswer,
  explanation,
  translations: { en, pl: "" },
  subjectNumber: "singular",
  isActivity: false,
  indirectObject: "",
  tense: "present",
  level,
})).map(applySourcedQuestionPair);

export const POR_PARA_FORMS: Record<string, [string, string]> = {
  "por / para": ["por", "para"],
};

/** Reference tables for the in-round "Usage examples": one example sentence per usage,
 * built from the sentences in the topic explainer so the overlay and the explainer agree. */
export const POR_PARA_CHART: Array<{ title: string; rows: Array<{ label: string; form: string }> }> = [
  {
    title: "Por looks back",
    rows: [
      { label: "cause or motive", form: "Lo hice por amor." },
      { label: "duration", form: "Estudié por dos horas." },
      { label: "exchange or price", form: "Lo compré por veinte euros." },
      { label: "means", form: "Te llamo por teléfono." },
      { label: "movement through a place", form: "Caminamos por el parque." },
    ],
  },
  {
    title: "Para looks ahead",
    rows: [
      { label: "purpose", form: "Estudio para aprobar el examen." },
      { label: "recipient", form: "Este regalo es para ti." },
      { label: "deadline", form: "La tarea es para el lunes." },
      { label: "destination", form: "Salimos para Madrid mañana." },
    ],
  },
];
