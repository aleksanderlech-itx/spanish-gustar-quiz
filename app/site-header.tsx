"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Logo from "./logo";
import Drawer from "./drawer";
import { useTheme } from "./use-theme";
import { SunIcon, MoonIcon } from "./theme-icons";
import { SITE_CONFIG } from "./site-config";

/** The same hamburger/logo/theme-toggle header as the home board, reused on every
 * other page so identity and the menu (progress, notebook, backup, settings) are
 * reachable from anywhere, not just "/". The home board keeps its own copy inline
 * since it's already identical markup wired to the board's own drawer instance. */
export default function SiteHeader() {
  const { theme, toggleTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} returnFocusRef={hamburgerRef} />
      <header className="board-header site-header">
        <button
          type="button"
          className="mode-switch"
          aria-label="Open menu"
          aria-haspopup="dialog"
          aria-expanded={drawerOpen}
          ref={hamburgerRef}
          onClick={() => setDrawerOpen(true)}
        >
          <span className="hamburger-icon" aria-hidden="true"><span /><span /><span /></span>
        </button>
        <Link href="/" className="board-title site-header-title">
          <Logo size={24} />
          <span>{SITE_CONFIG.name}</span>
        </Link>
        <button
          type="button"
          className="mode-switch board-header-theme"
          aria-pressed={theme === "dark"}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          onClick={toggleTheme}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          <span className="sr-only">{theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}</span>
        </button>
      </header>
    </>
  );
}
