"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { clearTestData, forgetTestModeForTab, isTestMode, rememberTestModeForTab, TEST_MODE_PARAM } from "./storage";

const TITLE_PREFIX = "[Test] ";

/**
 * The test mode indicator and its controls. Renders nothing in normal mode. In test mode it shows a small
 * fixed chip that takes no space in the page flow, prefixes the document title, and keeps `?test=1` in the
 * URL across navigation so a refreshed or copied address stays in test mode.
 */
export default function TestMode() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [kept, setKept] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isTestMode()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActive(false);
      return;
    }
    setActive(true);
    setKept(rememberTestModeForTab());
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get(TEST_MODE_PARAM) !== "1") {
        url.searchParams.set(TEST_MODE_PARAM, "1");
        window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
      }
    } catch {
      // URL or history unavailable; the tab flag still holds the mode.
    }
  }, [pathname]);

  useEffect(() => {
    if (!active) return;
    const applyPrefix = () => {
      if (!document.title.startsWith(TITLE_PREFIX)) document.title = `${TITLE_PREFIX}${document.title}`;
    };
    applyPrefix();
    // The framework rewrites the title on navigation; put the prefix back each time.
    const observer = new MutationObserver(applyPrefix);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => {
      observer.disconnect();
      if (document.title.startsWith(TITLE_PREFIX)) document.title = document.title.slice(TITLE_PREFIX.length);
    };
  }, [active]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest("[data-test-mode-ui]")) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  if (!active) return null;

  const exit = () => {
    forgetTestModeForTab();
    const url = new URL(window.location.href);
    url.searchParams.delete(TEST_MODE_PARAM);
    window.location.assign(`${url.pathname}${url.search}${url.hash}`);
  };

  const reset = () => {
    if (!window.confirm("Delete all test progress? Your real progress is not affected.")) return;
    clearTestData();
    window.location.reload();
  };

  return (
    <div data-test-mode-ui="">
      <button
        type="button"
        className="test-chip"
        aria-haspopup="menu"
        aria-expanded={open}
        title={kept ? "Test mode is on" : "Browser storage is blocked, so test mode ends if you leave this page"}
        onClick={() => setOpen((value) => !value)}
      >
        {kept ? "Test" : "Test (not kept)"}
      </button>
      {open && (
        <div className="test-chip-menu" role="menu">
          <button type="button" role="menuitem" onClick={exit}>Exit test mode</button>
          <button type="button" role="menuitem" onClick={reset}>Reset test data</button>
        </div>
      )}
    </div>
  );
}
