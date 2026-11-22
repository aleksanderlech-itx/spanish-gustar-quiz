"use client";

import { useEffect, useState } from "react";
import { CONSENT_OPEN_EVENT, readConsent, writeConsent } from "./consent";
import { isTestMode } from "./storage";

/**
 * The analytics choice (decision 0012): a bar at the bottom of the page with Accept and Reject given equal
 * weight. Shown when there is no current choice, or when "Cookie settings" asks for it. It waits while any
 * dialog is open (the first-visit welcome, the tutorial), so a visitor sees one message at a time. Test
 * sessions never see it: they load no analytics either way.
 */
export default function ConsentBanner() {
  const [wanted, setWanted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (isTestMode()) return;
    // Browser storage is unavailable during the server render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWanted(readConsent() === null);
    const open = () => setWanted(true);
    window.addEventListener(CONSENT_OPEN_EVENT, open);
    const watchDialogs = () => setDialogOpen(!!document.querySelector("dialog[open]"));
    watchDialogs();
    const observer = new MutationObserver(watchDialogs);
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["open"], childList: true });
    return () => {
      window.removeEventListener(CONSENT_OPEN_EVENT, open);
      observer.disconnect();
    };
  }, []);

  if (!wanted || dialogOpen) return null;

  const choose = (choice: "accepted" | "rejected") => {
    setWanted(false);
    writeConsent(choice);
  };

  return (
    <section className="consent-banner" role="region" aria-label="Analytics choice">
      <p>
        With your permission we use Google Analytics and Microsoft Clarity to see how the app is used and what to
        improve. They set cookies and Clarity records how you move through pages. Nothing loads unless you accept.{" "}
        <a href="/privacy">Privacy</a>
      </p>
      <div className="consent-banner-actions">
        <button type="button" onClick={() => choose("rejected")}>Reject</button>
        <button type="button" onClick={() => choose("accepted")}>Accept</button>
      </div>
    </section>
  );
}
