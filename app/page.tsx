"use client";

import { useSearchParams } from "next/navigation";
import { resolveQuizId, type QuizId } from "./quiz-config";
import Flashcards from "./flashcards";
import TopicDetail from "./topic-detail";
import Round from "./round";
import VerbChart from "./verb-chart";

const quizIdFromParams = (params: URLSearchParams): QuizId => resolveQuizId(params.get("quiz"));

export default function Home() {
  // useSearchParams is router-connected (server: request context, client: reactive
  // to navigation), unlike a one-shot read of the browser's own location at mount —
  // it re-renders this on every client-side Link navigation, not just the first load.
  const params = useSearchParams();

  if (params.get("quiz") === "flashcards") return <Flashcards />;
  const quizId = quizIdFromParams(params);
  if (params.get("chart") === "1") return <VerbChart quizId={quizId} infinitive={params.get("verb") ?? undefined} />;
  if (params.get("play") === "1") return <Round quizId={quizId} />;
  return <TopicDetail quizId={quizId} />;
}
