"use client";

import { upgradeStoredData } from "./stored-data";

// Runs when this module first loads in the browser, before any component's effect reads storage,
// so every reader sees data at the current schema.
if (typeof window !== "undefined") upgradeStoredData();

/** Mounted once in the root layout; renders nothing. Its import is what runs the upgrade. */
export default function StoredDataUpgrade() {
  return null;
}
