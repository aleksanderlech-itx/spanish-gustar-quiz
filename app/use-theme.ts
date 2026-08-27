"use client";

import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "spanish-quiz-theme";

const applyTheme = (theme: Theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable (private mode, quota); theme still applies for this load.
  }
};

/**
 * Reads the theme applied by the pre-paint script in app/layout.tsx and
 * exposes a toggle. The attribute (not React state) stays the runtime
 * source of truth so every component sees the same value without a
 * shared provider.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // The pre-paint script in layout.tsx already set this before hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      applyTheme(next);
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
