"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";

// Server rendering has no DOM, so useLayoutEffect would warn there; useEffect
// is a no-op difference in that environment since neither runs during SSR.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "spanish-quiz-theme";
const THEME_CHANGE_EVENT = "spanish-quiz-theme-change";
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

const readTheme = (): Theme => (document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");

const applyTheme = (theme: Theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable (private mode, quota); theme still applies for this load.
  }
  try {
    // Also persist as a cookie so the server can render the right theme on the
    // next request (see the RootLayout head read in app/layout.tsx). This is
    // what keeps the toggle sticking through a reload or fresh navigation on
    // browsers where localStorage is blocked or cleared but cookies aren't.
    document.cookie = `${THEME_STORAGE_KEY}=${theme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax`;
  } catch {
    // Cookie writes can be blocked too; the DOM attribute above still applies for this load.
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
  // Starts as "light" to match the server-rendered markup exactly (the server has
  // no DOM to read a real theme from), then syncs to the real value before paint.
  const [theme, setTheme] = useState<Theme>("light");

  useIsomorphicLayoutEffect(() => {
    // The pre-paint script in layout.tsx already set the DOM attribute before
    // hydration; this only pulls React's state in sync with it, synchronously
    // before the browser paints so there's no visible flash of the wrong icon.
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
