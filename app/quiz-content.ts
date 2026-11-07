import type { QuizId } from "./quiz-config";
import { SOURCED_QUIZ_PAIRS } from "./sourced-quiz-content.ts";

export type QuizExample = { es: string; en: string };
export type QuizFaqItem = { question: string; answer: string };

export type QuizContent = {
  paragraphs: string[];
  examples: QuizExample[];
  faq: QuizFaqItem[];
};

function sourcedExamples(ids: number[]): QuizExample[] {
  return ids.map((id) => {
    const pair = SOURCED_QUIZ_PAIRS[id];
    if (!pair) throw new Error(`Missing sourced example pair for question ${id}`);
    return { es: pair.spanish, en: pair.english };
  });
}

export const QUIZ_CONTENT: Record<QuizId, QuizContent> = {
  gustar: {
    paragraphs: [
      "Gustar does not work the way most English speakers expect it to. In English you say I like coffee, so I is the subject and coffee is the object. In Spanish it flips around. Me gusta el café means something closer to coffee is pleasing to me, the coffee becomes the subject and you turn into an indirect object, marked by me, te, le, nos or les.",
      "That is why gustar shows up almost only in the third person, gusta or gustan, depending on whether the thing being liked is singular or plural. A mi hermano le gustan los perros uses gustan because perros is plural, even though the sentence is really about my brother. A handful of other verbs follow the exact same pattern: encantar, interesar, molestar, importar, faltar, quedar, doler and parecer.",
      "Once you stop asking who likes what and start asking what is the subject here, the pattern gets a lot easier. This quiz has about 150 sentences built around gustar and its relatives so you can practice spotting the subject and picking the right pronoun until it stops feeling backwards.",
    ],
    examples: sourcedExamples([1, 2, 36, 58, 128]),
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
      "This quiz walks through about 150 sentences covering identity, description, location, events and changing states, with an explanation for every answer, so the pattern starts to feel familiar instead of random.",
    ],
    examples: sourcedExamples([2001, 2002, 2009, 2015]),
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
      "This quiz has about 150 sentences moving between completed actions, habits, background description and interruptions, with the reasoning behind every answer, until the difference stops feeling random.",
    ],
    examples: sourcedExamples([3001, 3002, 3007, 3008]),
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
  "por-para": {
    paragraphs: [
      "Por and para both translate as for, which is exactly why English speakers reach for the wrong one so often. Neither preposition is a direct match for anything in English, so the safest approach is to stop translating and start asking what job the word is doing in the sentence.",
      "Por looks backward, toward a cause, a duration, an exchange or a means. Lo hice por amor points at the motive. Estudié por dos horas points at how long. Lo compré por veinte euros points at what was traded for it. Para looks forward, toward a purpose, a recipient or a deadline. Estudio para aprobar el examen points at the goal. Este regalo es para ti points at who receives it.",
      "A handful of contexts show the contrast clearly with the same verb. Trabajo por mi familia means I work for my family's sake, out of love or necessity. Trabajo para mi familia means my family's business employs me. Same verb, same object, a completely different relationship because of one preposition.",
      "This quiz has about 150 sentences covering cause, duration, exchange, means, movement, purpose, recipients, deadlines and destinations, with an explanation for every answer, until the backward-versus-forward instinct starts to feel automatic.",
    ],
    examples: sourcedExamples([4001, 4016, 4076, 4091, 4106]),
    faq: [
      {
        question: "What is the simplest way to choose between por and para?",
        answer:
          "Ask whether the sentence points backward to a cause, duration, exchange or means (por) or forward to a purpose, recipient or deadline (para).",
      },
      {
        question: "Why does trabajar por and trabajar para mean different things?",
        answer:
          "Trabajar por someone means acting for their sake or in their place. Trabajar para someone means they are your employer. The verb stays the same; the preposition changes the relationship.",
      },
      {
        question: "Does por always mean because of?",
        answer: "Not always, but cause is one of its core uses, alongside duration, exchange, means and movement through a place.",
      },
      {
        question: "How do I know if para introduces a deadline or a destination?",
        answer: "Context tells you: a date or time after para is a deadline, a place after para is a destination.",
      },
    ],
  },
  "object-pronouns": {
    paragraphs: [
      "Object pronouns let Spanish avoid repeating a noun. Instead of Compro el pan, you say Lo compro once everyone knows what el pan is. The hard part for English speakers is that Spanish has two sets: direct object pronouns for the thing or person the action lands on, and indirect object pronouns for the person who receives it or is affected by it.",
      "Direct objects answer what? or whom?: me, te, lo, la, nos, los, las. Lo and la agree with the noun they replace, so el libro becomes lo and la carta becomes la. Indirect objects answer to whom? or for whom?: me, te, le, nos, les. Le and les don't change for gender, so le doy works for él, ella and usted alike.",
      "Both kinds go before a conjugated verb (lo veo, no le escribo, lo he leído) or attach to the end of a gerund or infinitive (estoy leyéndolo, voy a comprarla). Attaching usually needs a written accent to keep the stress where it was. With two pronouns, the indirect one always goes first, and le or les turns into se before lo, la, los or las: le doy el libro becomes se lo doy, never le lo doy. Because se can mean him, her, you or them, Spanish often adds a + person to make it clear: se lo di a María.",
      "This quiz has about 150 sentences split into direct, indirect and double-pronoun items, with an explanation for every answer. Use the pronoun type filter to drill one set at a time, then mix them once the choice feels automatic.",
    ],
    examples: sourcedExamples([5001, 5051, 5101, 5037, 5146]),
    faq: [
      {
        question: "How do I know whether to use lo or le?",
        answer:
          "Ask what the pronoun replaces. The thing or person the action lands on directly is a direct object (lo, la, los, las). The person who receives something or benefits from the action is an indirect object (le, les).",
      },
      {
        question: "Why does le become se?",
        answer: "Spanish never puts le or les directly before lo, la, los or las. When they meet, le and les turn into se: le doy el regalo becomes se lo doy.",
      },
      {
        question: "Where do object pronouns go in the sentence?",
        answer:
          "Before a conjugated verb (lo compro, se lo he dado), or attached to the end of a gerund or infinitive (comprándolo, dárselo). With estar + gerund or ir a + infinitive, both positions are correct.",
      },
      {
        question: "Why do some attached forms need an accent?",
        answer:
          "Adding syllables to the end of a word can move the stress, so a written accent keeps it where it was. A gerund with any attached pronoun takes one (leyéndolo), and so does an infinitive with two (dárselo).",
      },
    ],
  },
  "saber-conocer": {
    paragraphs: [
      "Saber and conocer both translate as to know, so English gives you no clue which one a sentence needs. Spanish splits knowing into two kinds: knowing information, and being acquainted with someone or something.",
      "Saber is for facts and skills. Use it for a piece of information (sé su número), before que, si or a question word (no sé dónde vive), and before an infinitive to say you know how to do something (sabe nadar). Conocer is for acquaintance and familiarity. Use it for people, always with the personal a (conozco a Marta), for places you have been (conocemos Sevilla), and for works, styles or fields you are familiar with (conoces este libro).",
      "The past tense adds a twist. In the preterite, the moment of knowing becomes an event: supe means I found out, and conocí means I met, or saw a place for the first time. The imperfect keeps the ordinary meaning of a state: sabía means I knew, and conocía means I was acquainted with. Ayer supe la noticia and ayer conocí a tu hermana both describe something that happened, not something you already knew.",
      "This quiz has about 150 sentences split into facts, skills, people, places, familiarity and past-tense meaning, with an explanation for every answer. Use the usage filter to drill one group at a time, then mix them once the choice feels automatic.",
    ],
    examples: sourcedExamples([6001, 6031, 6061, 6091, 6121]),
    faq: [
      {
        question: "What is the simplest way to choose between saber and conocer?",
        answer:
          "Ask whether you know a fact or how to do something (saber), or whether you are acquainted with a person, a place or a thing (conocer).",
      },
      {
        question: "Why does conocer take a before people?",
        answer: "A person who is the direct object of a verb takes the personal a in Spanish: conozco a Ana, conoces al profesor. Saber is never used with a person as its object this way.",
      },
      {
        question: "Can saber be followed by an infinitive?",
        answer: "Yes. Saber + infinitive means knowing how to do something: sé nadar, ¿sabes cocinar? Conocer is never followed by an infinitive in this sense.",
      },
      {
        question: "Why does supe mean found out?",
        answer:
          "The preterite turns a state into an event. With saber, the event is the moment you learned something, so supe means found out. With conocer, the event is the first meeting, so conocí means met. The imperfect forms sabía and conocía keep the ordinary meaning, knew.",
      },
    ],
  },
  "reflexive-verbs": {
    paragraphs: [
      "A reflexive verb describes an action the subject does to itself. English often hides this (I get up, she gets dressed), but Spanish marks it with a pronoun that mirrors the subject: me levanto, se viste. The pronoun always matches the person: me for yo, te for tú, se for él, ella and usted, nos for nosotros, os for vosotros, and se again for ellos and ustedes.",
      "Many reflexive verbs belong to the daily routine (despertarse, ducharse, acostarse), to movement (sentarse, acercarse, mudarse) and to feelings (preocuparse, aburrirse, enfadarse). Without the pronoun the verb acts on someone else: acuesto al bebé means I put the baby to bed, me acuesto means I go to bed.",
      "Some verbs change meaning with se. Ir is to go, irse is to leave; dormir is to sleep, dormirse is to fall asleep; acordar is to agree, acordarse de is to remember; llamar is to call, llamarse is to be called. Placement matters too: the pronoun goes before a conjugated verb (no me acuerdo), or on the end of an infinitive or gerund (tengo que levantarme, está duchándose).",
      "This quiz has about 150 sentences split into daily routine, movement, emotions, meaning change, placement and idiomatic uses, with an explanation for every answer. Use the usage filter to drill one group at a time, then mix them once the pronoun comes without thinking.",
    ],
    examples: sourcedExamples([7001, 7031, 7051, 7076, 7106, 7131]),
    faq: [
      {
        question: "How do I know which reflexive pronoun to use?",
        answer: "Find the subject and mirror it: yo me, tú te, él, ella or usted se, nosotros nos, vosotros os, ellos, ellas or ustedes se. Usted and ustedes always take se, never te or os.",
      },
      {
        question: "Where does the reflexive pronoun go?",
        answer:
          "Before a conjugated verb (me levanto, no me levanto). With an infinitive or gerund you can attach it to the end (voy a levantarme, estoy levantándome) or put it before the helper verb (me voy a levantar), but never between the two.",
      },
      {
        question: "Why do some attached forms need an accent?",
        answer: "Adding a pronoun to a gerund adds a syllable, so a written accent keeps the stress where it was: lavando becomes lavándose. An infinitive with one pronoun needs no accent: levantarme.",
      },
      {
        question: "Why does me lavo las manos not say mis manos?",
        answer: "The reflexive pronoun already shows whose hands they are, so Spanish uses the article with body parts and clothes: me lavo las manos, se pone el abrigo.",
      },
    ],
  },  "present-perfect": {
    paragraphs: [
      "The present perfect talks about past actions that still reach the present: things that happened today, this week or this year, and experiences in your life so far. Spanish builds it like English, with an auxiliary and a participle: he comido is I have eaten. The auxiliary is always haber, conjugated in the present: he, has, ha, hemos, habéis, han.",
      "Regular participles are easy: -ar verbs take -ado (hablar, hablado) and -er and -ir verbs take -ido (comer, comido; vivir, vivido). A few add an accent to keep the stress: leído, oído, traído. The common irregular ones need memorising: abierto, dicho, escrito, hecho, muerto, puesto, roto, visto and vuelto, plus verbs built on them like descubierto, devuelto and propuesto.",
      "Two habits keep the tense correct. First, the have of I have eaten is haber, never tener: tengo means I own. Second, haber and the participle stay together. Pronouns, no, ya and nunca all go before haber (no lo he visto, ya hemos comido), and the participle never changes for gender or number after haber.",
      "This quiz has 150 sentences split into regular -ado participles, regular -ido participles, irregular participles, haber not tener, and negatives and questions, with an explanation for every answer. Use the usage filter to drill one group at a time, then mix them once haber comes without thinking.",
    ],
    examples: sourcedExamples([8001, 8036, 8066, 8070, 8111, 8131]),
    faq: [
      {
        question: "When do I use the present perfect instead of the preterite?",
        answer: "In Spain, use the present perfect for actions in a time period that is still running (hoy, esta semana, este año) and for life experience (alguna vez, nunca). Much of Latin America prefers the preterite for recent events, so hoy comí is also correct there. This quiz never marks the preterite wrong.",
      },
      {
        question: "Why can't I use tener like English have?",
        answer: "Tener means to own or to have to (tener que). The auxiliary of every compound tense is haber: he comido, never tengo comido.",
      },
      {
        question: "Does the participle agree with the subject?",
        answer: "Not after haber. The participle always ends in -o: ella ha llegado, nosotras hemos terminado. It only agrees when it works as an adjective, for example after estar: la puerta está abierta.",
      },
      {
        question: "Where do pronouns and no go?",
        answer: "Before haber, all of them: no lo he visto, ya me he duchado, se lo hemos dicho. Nothing goes between haber and the participle, and you cannot attach a pronoun to the participle.",
      },
    ],
  },
  "present-continuous": {
    paragraphs: [
      "The present continuous describes what is happening right now or around now: estoy leyendo is I am reading. Spanish builds it like English, with a form of to be and an -ing form. The verb is always estar, conjugated in the present: estoy, estás, está, estamos, estáis, están. Ser never forms the continuous.",
      "The gerund is regular for most verbs: -ar verbs take -ando (hablar, hablando) and -er and -ir verbs take -iendo (comer, comiendo; vivir, viviendo). A few change. Many -ir verbs swap e for i or o for u (pedir, pidiendo; decir, diciendo; dormir, durmiendo), and when the stem ends in a vowel the i becomes y (leer, leyendo; oír, oyendo; construir, construyendo). Ir gives yendo.",
      "Pronouns have two homes: before estar (lo estoy leyendo, me estoy duchando) or attached to the end of the gerund, which then needs a written accent (estoy leyéndolo, estoy duchándome). Pick one: the pronoun never sits between estar and the gerund, and it never appears twice.",
      "English uses -ing in places where Spanish uses the infinitive: after a preposition (antes de comer), after verbs like gustar, querer or tener que, and when the activity is a noun (nadar es sano). This quiz has about 150 sentences split into regular -ando gerunds, regular -iendo gerunds, irregular gerunds, pronoun placement, and gerund or infinitive, with an explanation for every answer.",
    ],
    examples: sourcedExamples([9001, 9031, 9061, 9091, 9106, 9121]),
    faq: [
      {
        question: "When do I use the present continuous instead of the simple present?",
        answer: "Use it to stress that an action is in progress right now or during a temporary period: estoy leyendo, este mes estoy trabajando mucho. The simple present can also describe the moment (ahora leo), so it is never wrong in this quiz.",
      },
      {
        question: "Why is it estar and not ser?",
        answer: "The continuous is always estar plus the gerund. Soy leyendo is never correct, in any region.",
      },
      {
        question: "Where do the pronouns go?",
        answer: "Either before estar (lo estoy haciendo) or attached to the gerund with an accent (estoy haciéndolo). Both are correct. Never put it between the two words, and never use it twice.",
      },
      {
        question: "Why can't I translate every -ing with a gerund?",
        answer: "Spanish uses the infinitive as the noun form of a verb. Swimming is fun is nadar es divertido, and before eating is antes de comer. The gerund only follows estar and a few verbs like seguir.",
      },
    ],
  },
};
