"use client";

import { useSearchParams } from "next/navigation";
import { type QuizId } from "./quiz-config";
import TopicDetail from "./topic-detail";
import Round from "./round";
import VerbChart from "./verb-chart";

/** Same play/chart dispatch as the home page's shell, fixed to one quiz's own URL
 * instead of reading the quiz id from a `?quiz=` param. */
export default function QuizPage({ quizId }: { quizId: QuizId }) {
  const params = useSearchParams();

  if (params.get("chart") === "1") return <VerbChart quizId={quizId} infinitive={params.get("verb") ?? undefined} />;
  if (params.get("play") === "1") return <Round quizId={quizId} />;
  return <TopicDetail quizId={quizId} />;
}
