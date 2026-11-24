import type { QuizFilters } from "./quiz-logic";
import { appStorage } from "./storage.ts";

export const DEFAULT_FILTERS: QuizFilters = { level: "all", verb: "all" };

/**
 * Reuses each quiz's existing filterKey and {level, verb} shape from before the redesign. `verb` holds a
 * group key (decision 0015); one that is not in `groups` (a group since removed) reads as "all".
 */
export const readQuizFilters = (filterKey: string, groups: readonly string[]): QuizFilters => {
  if (typeof window === "undefined") return DEFAULT_FILTERS;
  try {
    const raw = appStorage.getItem(filterKey);
    if (!raw) return DEFAULT_FILTERS;
    const parsed = JSON.parse(raw) as Partial<QuizFilters>;
    const verb = typeof parsed.verb === "string" && groups.includes(parsed.verb) ? parsed.verb : "all";
    return { level: parsed.level ?? "all", verb };
  } catch {
    return DEFAULT_FILTERS;
  }
};

export const writeQuizFilters = (filterKey: string, filters: QuizFilters) => {
  if (typeof window === "undefined") return;
  try {
    appStorage.setItem(filterKey, JSON.stringify(filters));
  } catch {
    // Storage can be unavailable (private mode, quota); the picker just won't persist this session.
  }
};
