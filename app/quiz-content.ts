import type { QuizId } from "./quiz-config";

export type QuizExample = { es: string; en: string };
export type QuizFaqItem = { question: string; answer: string };

export type QuizContent = {
  paragraphs: string[];
  examples: QuizExample[];
  faq: QuizFaqItem[];
};

export const QUIZ_CONTENT: Record<QuizId, QuizContent> = {
  gustar: {
    paragraphs: [
      "Gustar does not work the way most English speakers expect it to. In English you say I like coffee, so I is the subject and coffee is the object. In Spanish it flips around. Me gusta el café means something closer to coffee is pleasing to me, the coffee becomes the subject and you turn into an indirect object, marked by me, te, le, nos or les.",
      "That is why gustar shows up almost only in the third person, gusta or gustan, depending on whether the thing being liked is singular or plural. A mi hermano le gustan los perros uses gustan because perros is plural, even though the sentence is really about my brother. A handful of other verbs follow the exact same pattern: encantar, interesar, molestar, importar, faltar, quedar, doler and parecer.",
      "Once you stop asking who likes what and start asking what is the subject here, the pattern gets a lot easier. This quiz has 150 sentences built around gustar and its relatives so you can practice spotting the subject and picking the right pronoun until it stops feeling backwards.",
    ],
    examples: [
      { es: "Me gusta la música clásica.", en: "I like classical music." },
      { es: "¿Te gustan las películas de terror?", en: "Do you like horror movies?" },
      { es: "A ella le encanta viajar.", en: "She loves to travel." },
      { es: "No nos interesa ese programa.", en: "We are not interested in that show." },
      { es: "A los niños les duelen los pies.", en: "The children's feet hurt." },
    ],
    faq: [
      {
        question: "Why does gustar work backwards in English?",
        answer:
          "Because gustar means something closer to to be pleasing to than to like. The thing you like is the subject of the sentence, and you show up as an indirect object pronoun instead.",
      },
      {
        question: "How do I know if I need gusta or gustan?",
        answer: "Look at the thing being liked, not the person. One thing, gusta. More than one thing, gustan.",
      },
      {
        question: "What other verbs work like gustar?",
        answer: "Encantar, interesar, molestar, importar, faltar, quedar, doler and parecer all follow the same pattern.",
      },
      {
        question: "Do I need to memorise all the pronoun forms?",
        answer: "In practice you will mostly use me, te, le, nos and les, so start with those and the rest follows.",
      },
    ],
  },
  "ser-estar": {
    paragraphs: [
      "Ser and estar both translate as to be, that is exactly why they cause trouble. English only has one verb for it, so learners go looking for a translation rule and there is not really a clean one. What matters is the kind of information the sentence is giving.",
      "Ser is for identity, origin, material, time and traits that do not really change. Soy profesora. La mesa es de madera. La fiesta es el sábado. Estar is for location and for a state that could change. Estoy en casa. La sopa está fría. Los niños están cansados.",
      "Some adjectives actually shift meaning depending on which verb they are paired with. Ser aburrido means a person or thing is boring by nature. Estar aburrido means someone feels bored right now, a completely different idea using the same word.",
      "This quiz walks through 150 sentences covering identity, description, location, events and changing states, with an explanation for every answer, so the pattern starts to feel familiar instead of random.",
    ],
    examples: [
      { es: "El museo está cerca de la estación.", en: "The museum is near the station." },
      { es: "Marta es médica.", en: "Marta is a doctor." },
      { es: "La puerta está cerrada.", en: "The door is closed." },
      { es: "Hoy es lunes.", en: "Today is Monday." },
    ],
    faq: [
      {
        question: "Is there a simple rule for ser vs estar?",
        answer:
          "Not a perfectly clean one, but a rough guide helps. Ser for what something is, estar for where it is or how it is doing right now.",
      },
      {
        question: "Why does ser aburrido mean something different from estar aburrido?",
        answer:
          "Because some adjectives change meaning with each verb. Ser aburrido describes a boring person or thing, estar aburrido describes someone who feels bored at the moment.",
      },
      {
        question: "Do I always use estar for locations?",
        answer: "Yes, physical location always takes estar, even for permanent buildings. El museo está cerca de la estación.",
      },
      {
        question: "When do I use ser for time?",
        answer: "For dates, days and the time an event happens. Hoy es lunes. La reunión es a las tres.",
      },
    ],
  },
  "preterite-imperfect": {
    paragraphs: [
      "English gets by with one simple past tense, so preterite versus imperfect is often the first real headache in Spanish grammar. Both describe the past, they just answer different questions.",
      "Preterite is for actions that happened and finished. Ayer fui al mercado describes a trip that happened once, at a specific point, and it is over. Imperfect is for the background, things that were ongoing, repeated or still in progress when something else happened. De niño iba al parque cada tarde describes a habit, not a single trip.",
      "The two often show up in the same sentence. Mientras Marta preparaba la cena, sonó el teléfono uses imperfect for the ongoing action and preterite for the interruption. A useful trick is picturing imperfect as the scene and preterite as the event that happens inside it.",
      "This quiz has 150 sentences moving between completed actions, habits, background description and interruptions, with the reasoning behind every answer, until the difference stops feeling random.",
    ],
    examples: [
      { es: "Anoche Marta preparó la cena a las ocho.", en: "Last night Marta prepared dinner at eight." },
      { es: "Normalmente salíamos temprano para la escuela.", en: "We usually left early for school." },
      { es: "El tren llegaba cuando empezó la lluvia.", en: "The train was arriving when the rain started." },
      { es: "En 2020 Ana vivió en Sevilla.", en: "In 2020 Ana lived in Seville." },
    ],
    faq: [
      {
        question: "What is the easiest way to tell preterite and imperfect apart?",
        answer:
          "Ask if the action is finished or ongoing. Finished and specific, use preterite. Ongoing, repeated or background, use imperfect.",
      },
      {
        question: "Can both tenses show up in the same sentence?",
        answer:
          "All the time. One common pattern is imperfect for what was happening and preterite for what interrupted it, like Dormía cuando sonó el teléfono.",
      },
      {
        question: "Are there words that hint at which tense to use?",
        answer:
          "Yes. Ayer, de repente and una vez usually point to preterite. De niño, siempre and mientras usually point to imperfect.",
      },
      {
        question: "Does preterite always mean something happened only once?",
        answer:
          "No, it just means the action is treated as complete. Fuimos al cine tres veces el mes pasado is preterite even though it happened three times, because the trips are counted as finished events.",
      },
    ],
  },
};
