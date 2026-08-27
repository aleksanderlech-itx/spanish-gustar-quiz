import type { QuizFilters } from "./quiz-logic";

export const DEFAULT_FILTERS: QuizFilters = { level: "all", verb: "all" };

/** Reuses each quiz's existing filterKey and {level, verb} shape from before the redesign. */
export const readQuizFilters = (filterKey: string): QuizFilters => {
  if (typeof window === "undefined") return DEFAULT_FILTERS;
  try {
    const raw = window.localStorage.getItem(filterKey);
    if (!raw) return DEFAULT_FILTERS;
    const parsed = JSON.parse(raw) as Partial<QuizFilters>;
    return { level: parsed.level ?? "all", verb: parsed.verb ?? "all" };
  } catch {
    return DEFAULT_FILTERS;
  }
};

export const writeQuizFilters = (filterKey: string, filters: QuizFilters) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(filterKey, JSON.stringify(filters));
  } catch {
    // Storage can be unavailable (private mode, quota); the picker just won't persist this session.
  }
};
