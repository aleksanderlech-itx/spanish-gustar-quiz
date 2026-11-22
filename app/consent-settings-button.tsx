"use client";

import { openConsentSettings } from "./consent";

/** Reopens the analytics choice: in the footer and on the privacy page. */
export default function ConsentSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className ?? "consent-settings-link"} onClick={openConsentSettings}>
      Cookie settings
    </button>
  );
}
