"use client";

import { useEffect, useRef } from "react";

const CONFETTI_COLORS = ["var(--sun)", "var(--primary)", "var(--clay)"];
/** Fixed spread, so the burst renders the same on every visit and stays pure during render. */
const CONFETTI = Array.from({ length: 26 }, (_, index) => ({
  left: `${(index * 37 + 11) % 100}%`,
  delay: `${0.2 + ((index * 7) % 10) / 20}s`,
  color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
}));

const RAYS: Array<[number, number, number, number]> = [
  [28, 2, 28, -6], [54, 28, 62, 28], [28, 54, 28, 62], [2, 28, -6, 28],
  [46, 10, 52, 4], [46, 46, 52, 52], [10, 46, 4, 52], [10, 10, 4, 4],
];

type Props = { open: boolean; streak: number; done: number; total: number; onClose: () => void };

/** Shown on the board once, right after the round that completed every activity for today. Uses a native
 * modal <dialog>, like tutorial-modal.tsx, for the focus trap, Escape and focus return. */
export default function DayCompleteDialog({ open, streak, done, total, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog || dialog.open) return;
    // Waits for another modal already up (the welcome tutorial) so the two never stack.
    const other = [...document.querySelectorAll("dialog[open]")].find((element) => element !== dialog);
    if (!other) {
      dialog.showModal();
      return;
    }
    const showAfter = () => dialog.showModal();
    other.addEventListener("close", showAfter, { once: true });
    return () => other.removeEventListener("close", showAfter);
  }, [open]);

  const close = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      className="day-complete-dialog"
      aria-labelledby="day-complete-title"
      onClose={onClose}
      onClick={(event) => { if (event.target === event.currentTarget) close(); }}
    >
      <div className="day-complete-confetti" aria-hidden="true">
        {CONFETTI.map((piece, index) => (
          <i key={index} style={{ left: piece.left, background: piece.color, animationDelay: piece.delay }} />
        ))}
      </div>
      <div className="day-complete-card">
        <svg className="day-complete-seal" viewBox="0 0 56 56" aria-hidden="true">
          {RAYS.map(([x1, y1, x2, y2], index) => <line key={index} className="day-complete-ray" x1={x1} y1={y1} x2={x2} y2={y2} />)}
          <circle className="day-complete-disc" cx="28" cy="28" r="22" />
          <path className="day-complete-tick" d="M18 29l7 7 13-14" />
        </svg>
        <h2 id="day-complete-title" lang="es">¡Día completado!</h2>
        <p className="day-complete-sub">Every activity on today&apos;s board is done.</p>
        <div className="day-complete-stats">
          <div><strong>{done}/{total}</strong><span>activities</span></div>
          <div><strong>{streak}</strong><span lang="es">{streak === 1 ? "día seguido" : "días seguidos"}</span></div>
        </div>
        <button type="button" className="day-complete-dismiss" lang="es" onClick={close} autoFocus>¡Vamos!</button>
      </div>
    </dialog>
  );
}
