"use client";

import { useRouter } from "next/navigation";
import ActivitySelection from "../activity-selection";

/** The Selection screen for later edits: saving returns to the Board. */
export default function ActivitiesEditor() {
  const router = useRouter();
  return <ActivitySelection mode="edit" onDone={() => router.push("/")} />;
}
