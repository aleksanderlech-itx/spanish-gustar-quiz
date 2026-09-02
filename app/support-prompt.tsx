"use client";

import { useEffect, useState } from "react";
import { shouldShowEnjoymentGate, markEnjoymentGateShown } from "./enjoyment";
import KofiButton from "./kofi-button";

export default function SupportPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Browser storage is unavailable during the server render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(shouldShowEnjoymentGate());
  }, []);

  if (!show) return null;

  return (
    <section className="results-support">
      <p className="results-support-question">If you liked it, consider supporting this project.</p>
      <KofiButton className="results-kofi-link" onClick={markEnjoymentGateShown} />
    </section>
  );
}
