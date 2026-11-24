import type { QuizContent, QuizExample } from "./quiz-content";
import { SENTENCE_BUILDER_GROUPS, SENTENCE_BUILDER_ITEMS } from "./sentence-builder-data.ts";

const examples = (ids: number[]): QuizExample[] => ids.map((id) => {
  const item = SENTENCE_BUILDER_ITEMS.find((candidate) => candidate.id === id);
  if (!item) throw new Error(`Missing Sentence Builder Item ${id}`);
  return { es: item.spanish, en: item.english };
});

const groupList = (groups: readonly string[]) =>
  `${groups.slice(0, -1).join(", ")}, and ${groups[groups.length - 1]}`;

/** The "How this works" section on Sentence Builder's page, in the same shape as the grammar quizzes'. */
export const SENTENCE_BUILDER_CONTENT: QuizContent = {
  paragraphs: [
    "Each sentence shows its English meaning and the Spanish words shuffled below it. Tap the words in the order you think is right. Tap a placed word to send it back, or use Undo and Reset. Once every word is placed, Check tells you whether the whole sentence is right, and an explanation names the word that decides the order.",
    `Spanish word order is freer than English, but it is not free. Questions open with the question word, no sits right before the verb, and object pronouns such as me, te, lo and se go before a conjugated verb. The sentences are grouped by the pattern they practise: ${groupList(SENTENCE_BUILDER_GROUPS)}.`,
    "When Spanish allows more than one natural order, every one of them counts as right. The sentences come from Tatoeba, an open collection of real sentences with their translations, so what you build is Spanish people actually write.",
  ],
  examples: examples([10001, 10015, 10046, 10071, 10089]),
  faq: [
    {
      question: "Why does no go right before the verb?",
      answer:
        "In Spanish, no comes right before the conjugated verb, and before any object pronoun in front of it, as in No se lo digas. Words like nada, nunca and nadie can then follow the verb, which gives Spanish its double negatives: No sé nada de música.",
    },
    {
      question: "Where do object pronouns go?",
      answer:
        "Before a conjugated verb, as in Te diré el resto mañana, or joined to the end of an infinitive, as in No necesito decirte nada. With two pronouns the indirect one comes first, and le or les turns into se before lo or la.",
    },
    {
      question: "Does the subject always come first?",
      answer:
        "No. Spanish often leaves the subject out, because the verb ending already shows who it is, and time words can move around: Ayer estuve en Boston and Estuve en Boston ayer are both natural. That is why some sentences accept more than one order.",
    },
    {
      question: "What happens when I get a sentence wrong?",
      answer:
        "The words in the wrong place are marked, and you see the right sentence with its explanation. The sentence goes into your mistake notebook and comes back when you practise the misses.",
    },
  ],
};
