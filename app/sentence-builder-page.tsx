"use client";

import { useSearchParams } from "next/navigation";
import SentenceBuilderTopic from "./sentence-builder-topic";
import SentenceBuilderRound from "./sentence-builder-round";

/** Sentence Builder's dispatch: the topic page, a round (?play=1), or a mistakes retry (?mistakes=1). */
export default function SentenceBuilderPage() {
  const params = useSearchParams();
  if (params.get("mistakes") === "1") return <SentenceBuilderRound retry retryRule={params.get("rule")} />;
  if (params.get("play") === "1") return <SentenceBuilderRound />;
  return <SentenceBuilderTopic />;
}
