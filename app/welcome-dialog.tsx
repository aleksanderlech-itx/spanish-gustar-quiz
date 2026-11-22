"use client";

import { useEffect, useRef } from "react";

/** How long the shelf section's highlight border runs after the dialog closes. */
const HIGHLIGHT_MS = 4000;

/**
 * Shown once, on the Board load that creates a new user's starter Board (decision 0011): says some
 * activities were picked for them and where to change that. Closing it scrolls to the expanded shelf
 * section below the Board and highlights it for a few seconds.
 */
export default function WelcomeDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) dialog.showModal();
  }, [open]);

  const highlightShelf = () => {
    const shelf = document.querySelector<HTMLElement>(".board-shelf");
    if (shelf) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      shelf.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      shelf.classList.add("board-shelf-highlight");
      window.setTimeout(() => shelf.classList.remove("board-shelf-highlight"), HIGHLIGHT_MS);
    }
    onClose();
  };

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className="suggestion-dialog welcome-dialog"
      aria-labelledby="welcome-title"
      onClose={highlightShelf}
      onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}
    >
      <h2 id="welcome-title">Welcome! We picked some activities to start</h2>
      <p className="suggestion-lead">
        Your daily goal is a round in each activity on your board. Add more from the shelf below, or change
        the whole choice under Your activities. You can do both any time from the menu.
      </p>
      <div className="activity-selection-actions">
        <button type="button" className="activity-selection-save" onClick={() => dialogRef.current?.close()} autoFocus>
          Got it
        </button>
      </div>
    </dialog>
  );
}
