"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { findActivity, type ActivityId } from "./activity-registry";
import { addToBoard, answerSuggestion, type ShelfStatus } from "./board-state";

export type SuggestionContent = {
  /** The Activity whose Finished event triggered this Suggestion, if any. */
  finished: ActivityId | null;
  /** Activities never offered before: shown once, unticked (decision 0008). */
  fresh: ActivityId[];
  /** Up to 3 Shelf Activities, ranked. */
  suggested: Array<{ id: ActivityId; status: ShelfStatus }>;
  /** The Board is empty: the user must add at least one. */
  required: boolean;
};

const STATUS_LABEL: Record<ShelfStatus, string> = {
  "repeat-due": "Repeat due",
  "not-started": "Not started",
  started: "In progress",
  finished: "Finished",
};

type Props = { content: SuggestionContent | null; onAnswered: () => void };

/**
 * The Suggestion over the Board: after an Activity is Finished, and once for newly released
 * Activities. Uses a native modal <dialog> like day-complete-dialog.tsx, and waits for any
 * other open dialog (the welcome tutorial) so two never stack.
 */
export default function SuggestionDialog({ content, onAnswered }: Props) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [ticked, setTicked] = useState<Set<ActivityId>>(new Set());

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!content || !dialog || dialog.open) return;
    // A fresh offer starts with nothing ticked.
    setTicked(new Set());
    const other = [...document.querySelectorAll("dialog[open]")].find((element) => element !== dialog);
    if (!other) {
      dialog.showModal();
      return;
    }
    const showAfter = () => dialog.showModal();
    other.addEventListener("close", showAfter, { once: true });
    return () => other.removeEventListener("close", showAfter);
  }, [content]);

  if (!content) return null;

  const toggle = (id: ActivityId) => setTicked((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });

  const finish = (add: boolean) => {
    if (add) addToBoard([...ticked]);
    answerSuggestion(content.fresh);
    dialogRef.current?.close();
    onAnswered();
  };

  const finishedTitle = content.finished ? findActivity(content.finished)?.title : null;
  const heading = finishedTitle ? `You finished ${finishedTitle}` : content.required ? "Your board is empty" : "New on Spanish Quizzes";
  const row = (id: ActivityId, note: string) => (
    <li key={id}>
      <label className="activity-selection-row">
        <input type="checkbox" checked={ticked.has(id)} onChange={() => toggle(id)} />
        <span className="activity-selection-text">
          <strong>{findActivity(id)?.title ?? id}</strong>
          <em>{note}</em>
        </span>
      </label>
    </li>
  );

  return (
    <dialog
      ref={dialogRef}
      className="suggestion-dialog"
      aria-labelledby="suggestion-title"
      // An empty Board can't be left as it is: Escape does nothing until something is added.
      onCancel={(event) => { if (content.required) event.preventDefault(); else finish(false); }}
    >
      <h2 id="suggestion-title">{heading}</h2>
      <p className="suggestion-lead">
        {finishedTitle ? "It has moved to your shelf. " : ""}
        {content.required
          ? "Add at least one activity to keep your daily goal going."
          : "Add any of these to your board, or keep your board as it is."}
      </p>
      {content.fresh.length > 0 && (
        <>
          <p className="eyebrow">New</p>
          <ul className="activity-selection-list">{content.fresh.map((id) => row(id, "New activity"))}</ul>
        </>
      )}
      {content.suggested.length > 0 && (
        <>
          <p className="eyebrow">Suggested</p>
          <ul className="activity-selection-list">{content.suggested.map(({ id, status }) => row(id, STATUS_LABEL[status]))}</ul>
        </>
      )}
      <div className="activity-selection-actions">
        <button type="button" className="activity-selection-save" disabled={!ticked.size} onClick={() => finish(true)}>
          Add to board
        </button>
        {!content.required && (
          <button type="button" className="activity-selection-all" onClick={() => finish(false)}>Not now</button>
        )}
        <Link className="suggestion-all-link" href="/activities">See all activities</Link>
      </div>
    </dialog>
  );
}
