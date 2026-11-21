"use client";

import { useEffect, useState } from "react";
import { findActivity, type ActivityId } from "./activity-registry";
import { addToBoard, hasChosenBoard, isOnBoard } from "./board-state";

/**
 * Shown on a results screen when the round was an Activity on the Shelf (opened through a link):
 * the round was practice only, and one tap puts the Activity on the Board (decision 0008).
 */
export default function AddToBoardOffer({ activityId }: { activityId: ActivityId }) {
  const [state, setState] = useState<"hidden" | "offer" | "added">("hidden");

  useEffect(() => {
    // Browser storage is unavailable during the server render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(hasChosenBoard() && !isOnBoard(activityId) ? "offer" : "hidden");
  }, [activityId]);

  if (state === "hidden") return null;
  const title = findActivity(activityId)?.title ?? "This activity";

  return (
    <section className="add-to-board-offer" aria-live="polite">
      {state === "offer" ? (
        <>
          <p>{title} is on your shelf, so this round was practice only and doesn&apos;t count toward today&apos;s goal.</p>
          <button type="button" className="secondary" onClick={() => { addToBoard([activityId]); setState("added"); }}>
            Add to your board
          </button>
        </>
      ) : (
        <p>{title} is on your board. It counts toward your daily goal from now on.</p>
      )}
    </section>
  );
}
