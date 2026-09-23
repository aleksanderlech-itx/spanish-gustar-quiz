/** Every post listed on /notes, newest first. Shared by the notes index and
 * /llms.txt so a new post only has to be added here. */
export type NotesPost = { href: string; title: string; excerpt: string };

export const NOTES_POSTS: NotesPost[] = [
  {
    href: "/notes/preterite-vs-imperfect-signal-words",
    title: "Preterite vs imperfect: the words that give it away",
    excerpt: "Ayer, cada, mientras, de repente. The small time words that tell you which past tense to use, and when not to trust them.",
  },
  {
    href: "/notes/por-vs-para-mistakes",
    title: "4 mistakes learners make with por vs para",
    excerpt: "Both usually translate as for. These are the four uses of for where learners pick the wrong one most often.",
  },
  {
    href: "/notes/gustar-mistakes",
    title: "3 mistakes learners make with gustar",
    excerpt: "Gustar works backwards compared to English. These are the three slips the gustar quiz is built around.",
  },
  {
    href: "/notes/ser-vs-estar-mistakes",
    title: "3 mistakes learners make with ser vs estar",
    excerpt: "The rule sounds easy until you write your own sentences. Here are the three slips that keep coming back.",
  },
  {
    href: "/notes/encantar-vs-gustar",
    title: "Encantar vs gustar: what is the difference",
    excerpt: "Same grammar, different strength. Once you have gustar down, encantar is mostly a vocabulary question.",
  },
];
