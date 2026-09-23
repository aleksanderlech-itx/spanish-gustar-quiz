import { SITE_CONFIG } from "./site-config.ts";
import { QUIZ_CONFIG, QUIZ_IDS, quizPath } from "./quiz-config.ts";
import { ACTIVITY_REGISTRY } from "./activity-registry.ts";
import { FLASHCARD_VERBS } from "./flashcards-data.ts";
import { NOTES_POSTS } from "./notes-posts.ts";
import type { Question } from "./quiz-data";

/**
 * /llms.txt and /llms-full.txt (https://llmstxt.org), built from the same
 * registries as the pages themselves so a new quiz or note shows up here
 * without a second list to maintain. Links always point at the production
 * host, whichever host serves the file.
 */

const absolute = (path: string): string => `${SITE_CONFIG.url}${path}`;

const flashcards = ACTIVITY_REGISTRY.find((entry) => entry.id === "flashcards");

const SUMMARY =
  "Free, mobile-first practice for the Spanish grammar patterns English speakers get wrong most: gustar-type verbs, ser vs estar, preterite vs imperfect, por vs para and object pronouns, plus spaced-repetition verb flashcards. Every quiz is a fill-in-the-blank round with an instant explanation for each answer. No account needed; progress is stored in the learner's browser.";

const PAGES = [
  { path: "/", title: "Home", description: "Board of every activity with the learner's progress on each." },
  { path: "/how-to-use", title: "How to use", description: "How rounds, flashcards, progress, backups and the mistake notebook work." },
  { path: "/about", title: "About", description: "What the app is, who it is for, and how progress is stored." },
];

const quizLine = (id: (typeof QUIZ_IDS)[number]): string => {
  const quiz = QUIZ_CONFIG[id];
  return `- [${quiz.title}](${absolute(quizPath(id))}): ${quiz.description} Level ${quiz.levelBand}.`;
};

export function buildLlmsTxt(): string {
  const lines = [
    `# ${SITE_CONFIG.name}`,
    "",
    `> ${SUMMARY}`,
    "",
    `A longer version with each topic's rule and sample questions is at ${absolute("/llms-full.txt")}.`,
    "",
    "## Quizzes",
    "",
    ...QUIZ_IDS.map(quizLine),
    "",
    "## Flashcards",
    "",
    `- [${flashcards?.title ?? "Spanish Verb Flashcards"}](${absolute("/flashcards")}): The ${FLASHCARD_VERBS.length} most frequent Spanish verbs, reviewed with Leitner-box spaced repetition.`,
    "",
    "## Notes",
    "",
    `- [Notes on Spanish grammar](${absolute("/notes")}): Index of short posts on common mistakes.`,
    ...NOTES_POSTS.map((post) => `- [${post.title}](${absolute(post.href)}): ${post.excerpt}`),
    "",
    "## Optional",
    "",
    ...PAGES.map((page) => `- [${page.title}](${absolute(page.path)}): ${page.description}`),
    "",
  ];
  return lines.join("\n");
}

/** The first question of each level, so the samples span the difficulty range. */
const sampleQuestions = (questions: Question[]): Question[] =>
  (["basic", "intermediate", "advanced"] as const)
    .map((level) => questions.find((question) => question.level === level))
    .filter((question): question is Question => question !== undefined);

const sampleLine = (question: Question): string => {
  const prompt = `${question.before.trim()} ___ ${question.after.trim()}`;
  const translation = question.translations.en ? ` (${question.translations.en})` : "";
  return `- ${prompt} → **${question.answer}**${translation} ${question.explanation}`;
};

export function buildLlmsFullTxt(): string {
  const quizSections = QUIZ_IDS.flatMap((id) => {
    const quiz = QUIZ_CONFIG[id];
    return [
      `## ${quiz.title}`,
      "",
      `URL: ${absolute(quizPath(id))}`,
      `Level: ${quiz.levelBand}. Questions: ${quiz.questions.length}.`,
      "",
      quiz.description,
      "",
      `### Rule: ${quiz.rule.title}`,
      "",
      quiz.rule.body,
      "",
      `- ${quiz.rule.singular}`,
      `- ${quiz.rule.plural}`,
      "",
      "### Sample questions",
      "",
      ...sampleQuestions(quiz.questions).map(sampleLine),
      ...(quiz.sources.length > 0
        ? ["", "### Sources", "", ...quiz.sources.map((source) => `- [${source.label}](${source.href})`)]
        : []),
      "",
    ];
  });

  const lines = [
    `# ${SITE_CONFIG.name}`,
    "",
    `> ${SUMMARY}`,
    "",
    `Site: ${SITE_CONFIG.url}`,
    "",
    "## How it works",
    "",
    "- A quiz round is 5, 10 or 20 fill-in-the-blank Spanish sentences. In Choose mode the learner picks from answer options; in Type mode they type the missing form.",
    "- Each answer is checked immediately and followed by an explanation of the rule and an English translation.",
    "- Rounds can be filtered by difficulty (basic, intermediate, advanced) and, where available, by verb or pronoun type. A reference chart, with audio, is linked from every topic.",
    "- Missed rules collect in a mistake notebook for targeted review. Progress, daily streaks and the notebook live in browser storage and can be downloaded and restored as a JSON backup.",
    "",
    ...quizSections,
    "## Spanish Verb Flashcards",
    "",
    `URL: ${absolute("/flashcards")}`,
    "",
    `${FLASHCARD_VERBS.length} high-frequency Spanish verbs with English glosses and example sentences, reviewed with a four-box Leitner schedule (every session, then after 1, 3 and 7 days): a remembered card moves up one box, a missed card goes back to box 1. Each verb has audio.`,
    "",
    "## Notes",
    "",
    ...NOTES_POSTS.map((post) => `- [${post.title}](${absolute(post.href)}): ${post.excerpt}`),
    "",
  ];
  return lines.join("\n");
}
