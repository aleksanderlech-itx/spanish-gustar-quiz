"use client";

import { useEffect, useRef, useState } from "react";
import { shouldOfferTutorial, TUTORIAL_DISMISSED_KEY, TUTORIAL_OFFERED_KEY, TUTORIALS, TUTORIALS_HREF } from "./tutorials";

/** Welcome modal offered on the home board at every app open (once per browser
 * session) until the learner ticks "Don't show this again". Uses a native modal
 * <dialog>, like help-modal.tsx, for the focus trap, Escape and focus return. */
export default function TutorialModal() {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const poster = TUTORIALS[0].poster;

  useEffect(() => {
    if (!shouldOfferTutorial(window.localStorage, window.sessionStorage)) return;
    try {
      window.sessionStorage.setItem(TUTORIAL_OFFERED_KEY, "1");
    } catch {
      // Session storage blocked; the modal may be offered again on the next visit to the board.
    }
    dialogRef.current?.showModal();
  }, []);

  // Saved as soon as it's ticked, rather than on close, so "Show me around"
  // navigating away can't drop the choice.
  const onOptOutChange = (checked: boolean) => {
    setDontShowAgain(checked);
    try {
      if (checked) window.localStorage.setItem(TUTORIAL_DISMISSED_KEY, "1");
      else window.localStorage.removeItem(TUTORIAL_DISMISSED_KEY);
    } catch {
      // Storage blocked; the choice can't persist, and the session flag still stops a repeat this visit.
    }
  };
  const close = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      className="help-dialog tutorial-dialog"
      aria-labelledby="tutorial-dialog-title"
      onClick={(event) => { if (event.target === event.currentTarget) close(); }}
    >
      <div className="help-dialog-body">
        <div className="help-dialog-top">
          <h2 id="tutorial-dialog-title">New here?</h2>
          <button type="button" className="help-dialog-close" aria-label="Close" onClick={close}>✕</button>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="tutorial-dialog-poster" src={poster} alt="" width={1080} height={1350} />
        <p className="tutorial-dialog-question">Want a quick tour of the app? Four short videos cover the features, playing a round, reviewing and support.</p>
        <div className="tutorial-dialog-actions">
          <a className="tutorial-dialog-primary" href={TUTORIALS_HREF} onClick={close}>Show me around</a>
          <button type="button" className="tutorial-dialog-secondary" onClick={close}>Not now</button>
        </div>
        <label className="tutorial-dialog-optout">
          <input type="checkbox" checked={dontShowAgain} onChange={(event) => onOptOutChange(event.target.checked)} />
          Don&apos;t show this again
        </label>
      </div>
    </dialog>
  );
}
