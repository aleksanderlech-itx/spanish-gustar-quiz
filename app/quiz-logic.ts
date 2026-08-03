export type QuizTense = "present" | "past" | "future";
export type QuizLevel = "basic" | "intermediate" | "advanced";

export type QuizQuestion = {
  id: number;
  infinitive: string;
  answer: string;
  tense: QuizTense;
  level: QuizLevel;
};

export type QuizResult = {
  date: string;
  score: number;
  percent: number;
  questionIds: number[];
  answers: string[];
  missedIds: number[];
  mode?: "regular" | "review";
  tense?: QuizTense;
};

export type QuizFilters = {
  tense: "all" | QuizTense;
  level: "all" | QuizLevel;
  verb: "all" | string;
};

export const normalizeAnswer = (value: string) => value.trim().toLocaleLowerCase("es");

export const filterQuestions = <T extends QuizQuestion>(questions: T[], filters: QuizFilters) =>
  questions.filter((question) =>
    (filters.tense === "all" || question.tense === filters.tense) &&
    (filters.level === "all" || question.level === filters.level) &&
    (filters.verb === "all" || question.infinitive === filters.verb));

export const getMissedIds = (items: QuizResult[]) => {
  const latest = new Map<number, boolean>();
  items.forEach((item) => item.questionIds.forEach((id) => latest.set(id, item.missedIds.includes(id))));
  return [...latest].filter(([, missed]) => missed).map(([id]) => id);
};

export const scoreRound = <T extends QuizQuestion>(round: T[], answers: string[]) => {
  const missedIds = round.filter((question, index) => normalizeAnswer(answers[index] ?? "") !== normalizeAnswer(question.answer)).map((question) => question.id);
  const score = round.length - missedIds.length;
  return { missedIds, score, percent: round.length ? Math.round((score / round.length) * 100) : 0 };
};

export const availableQuestions = <T extends QuizQuestion>(questions: T[], history: QuizResult[], missedOnly: boolean) => {
  if (missedOnly) {
    const missed = new Set(getMissedIds(history));
    return questions.filter((question) => missed.has(question.id));
  }
  const used = new Set(history.filter((item) => item.mode !== "review").flatMap((item) => item.questionIds));
  return questions.filter((question) => !used.has(question.id));
};

export const restartSelectedHistory = (history: QuizResult[], selectedIds: Set<number>) => history.flatMap((result) => {
  if (result.mode === "review") return [result];
  const keptIndexes = result.questionIds.map((id, index) => ({ id, index })).filter(({ id }) => !selectedIds.has(id));
  if (!keptIndexes.length) return [];
  const questionIds = keptIndexes.map(({ id }) => id);
  const answers = keptIndexes.map(({ index }) => result.answers[index] ?? "");
  const missedIds = result.missedIds.filter((id) => questionIds.includes(id));
  const score = questionIds.length - missedIds.length;
  return [{ ...result, questionIds, answers, missedIds, score, percent: Math.round((score / questionIds.length) * 100) }];
});

export const ruleForTense = (tense: QuizFilters["tense"]) => {
  if (tense === "past") return { title: "Use the preterite for a completed past reaction.", body: "One thing or an activity uses the third-person singular. Several things use the third-person plural.", singular: "Ayer me gustó el viaje.", plural: "Ayer me gustaron los viajes." };
  if (tense === "future") return { title: "Use the simple future for a future reaction.", body: "Keep the full infinitive and add the third-person singular or plural future ending.", singular: "Me gustará el viaje.", plural: "Me gustarán los viajes." };
  if (tense === "all") return { title: "The tense shows when; agreement shows how many.", body: "Choose present, completed past, or future, then match the verb to the singular or plural thing.", singular: "Me gusta · me gustó · me gustará", plural: "Me gustan · me gustaron · me gustarán" };
  return { title: "The verb agrees with the thing, not the person.", body: "One thing or an activity uses the singular. Several things use the plural.", singular: "Me gusta viajar.", plural: "Me gustan los viajes." };
};
