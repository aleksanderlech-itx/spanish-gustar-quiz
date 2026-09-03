"use client";

import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "spanish-quiz-theme";
const THEME_CHANGE_EVENT = "spanish-quiz-theme-change";

const readTheme = (): Theme => (document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");

const applyTheme = (theme: Theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable (private mode, quota); theme still applies for this load.
  }
  // Multiple components call useTheme() at once (site header, drawer, the board's
  // own header). Each keeps its own React state, so without broadcasting a toggle
  // fired from one instance left the others showing the stale theme until they
  // happened to re-render — the toggle button looked like it needed a second click.
  window.dispatchEvent(new CustomEvent<Theme>(THEME_CHANGE_EVENT, { detail: theme }));
};

/**
 * Reads the theme applied by the pre-paint script in app/layout.tsx and
 * exposes a toggle. The attribute (not React state) stays the runtime
 * source of truth; every instance also listens for changes made by any
 * other instance so they all stay in sync.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => (typeof document === "undefined" ? "light" : readTheme()));

  useEffect(() => {
    // The pre-paint script in layout.tsx already set this before hydration,
    // but re-sync in case it ran after this component's initial state read.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(readTheme());

    const onThemeChange = (event: Event) => {
      setTheme((event as CustomEvent<Theme>).detail);
    };
    window.addEventListener(THEME_CHANGE_EVENT, onThemeChange);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, onThemeChange);
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(readTheme() === "dark" ? "light" : "dark");
  }, []);

  return { theme, toggleTheme };
}
