"use client";

import { useEffect, useState } from "react";
import { ACTIVITY_REGISTRY, type ActivityId } from "./activity-registry";
import { answerSuggestion, boardActivityIds, chooseBoard, shelfEntries, type ShelfStatus } from "./board-state";

const STATUS_NOTE: Partial<Record<ShelfStatus, string>> = {
  "repeat-due": "Repeat due. Starts over when added; your mistakes stay.",
  finished: "Finished. Starts over when added; your mistakes stay.",
  started: "In progress",
};

type Props = { onDone: () => void };

/**
 * The Selection screen at /activities (decision 0008): one row per Activity with a checkbox. Saving puts
 * exactly the ticked Activities on the Board; at least one is required. New users don't see it first:
 * they start with the starter Board.
 */
export default function ActivitySelection({ onDone }: Props) {
  const [ready, setReady] = useState(false);
  const [checked, setChecked] = useState<Set<ActivityId>>(new Set());
  const [notes, setNotes] = useState<Partial<Record<ActivityId, string>>>({});

  useEffect(() => {
    // The current Board (before any Board exists: the Activities played so far).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChecked(new Set(boardActivityIds()));
    setNotes(Object.fromEntries(shelfEntries().map((entry) => [entry.id, STATUS_NOTE[entry.status]])));
    setReady(true);
  }, []);

  const toggle = (id: ActivityId) => setChecked((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });

  const save = () => {
    if (!checked.size) return;
    chooseBoard(ACTIVITY_REGISTRY.map((entry) => entry.id).filter((id) => checked.has(id)));
    // Saving a Selection answers any pending Suggestion: the user just chose their whole Board.
    answerSuggestion([]);
    onDone();
  };

  if (!ready) return null;

  return (
    <section className="activity-selection" aria-labelledby="activity-selection-title">
      <p className="eyebrow">Your activities</p>
      <h1 id="activity-selection-title">Choose what&apos;s on your board</h1>
      <p className="activity-selection-lead">
        Your daily goal is a round in every activity on your board, so pick as many as you want to keep up.
        The rest wait on your shelf, and you can change this any time.
      </p>
      <div className="activity-selection-tools">
        <button type="button" className="activity-selection-all" onClick={() => setChecked(new Set(ACTIVITY_REGISTRY.map((entry) => entry.id)))}>
          Use all
        </button>
        <span aria-live="polite">{checked.size} selected</span>
      </div>
      <ul className="activity-selection-list">
        {ACTIVITY_REGISTRY.map((entry) => (
          <li key={entry.id}>
            <label className="activity-selection-row">
              <input type="checkbox" checked={checked.has(entry.id)} onChange={() => toggle(entry.id)} />
              <span className="activity-selection-text">
                <strong>{entry.title}</strong>
                <span>{entry.shortDescription}</span>
                {notes[entry.id] && <em>{notes[entry.id]}</em>}
              </span>
            </label>
          </li>
        ))}
      </ul>
      <div className="activity-selection-actions">
        <button type="button" className="activity-selection-save" onClick={save} disabled={!checked.size}>
          Save
        </button>
        {!checked.size && <span className="activity-selection-hint">Pick at least one activity.</span>}
      </div>
    </section>
  );
}
