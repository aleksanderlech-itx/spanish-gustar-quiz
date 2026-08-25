"use client";

import { useEffect, useState } from "react";
import { type QuizId } from "./quiz-config";
import Flashcards from "./flashcards";
import TopicDetail from "./topic-detail";
import Round from "./round";

const quizIdFromLocation = (): QuizId => {
  const value = new URLSearchParams(window.location.search).get("quiz");
  return value === "ser-estar" || value === "preterite-imperfect" ? value : "gustar";
};

type HomeScreen = { screen: "flashcards" } | { screen: "round"; quizId: QuizId } | { screen: "detail"; quizId: QuizId };

const homeScreenFromLocation = (): HomeScreen => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("quiz") === "flashcards") return { screen: "flashcards" };
  const quizId = quizIdFromLocation();
  if (params.get("play") === "1") return { screen: "round", quizId };
  return { screen: "detail", quizId };
};

export default function Home() {
  // Which screen to show depends on window.location, which isn't available during
  // the server render — resolve it after mount (matches QuizSelector's ready/open
  // pattern) rather than guessing server-side and risking a hydration mismatch.
  const [home, setHome] = useState<HomeScreen | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHome(homeScreenFromLocation());
  }, []);

  if (!home) return null;
  if (home.screen === "flashcards") return <Flashcards />;
  if (home.screen === "round") return <Round quizId={home.quizId} />;
  return <TopicDetail quizId={home.quizId} />;
}
