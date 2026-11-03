import { appStorage } from "./storage.ts";

/** dayKey of a day completed by an activity round that hasn't been celebrated on the board yet. Set only at
 * the moment an activity completes the day, so opening the app later that day doesn't replay the celebration. */
const PENDING_KEY = "spanish-quiz-day-celebration-pending-v1";

export const markDayCelebrationPending = (day: string) => {
  try {
    appStorage.setItem(PENDING_KEY, day);
  } catch {
    // Storage can be unavailable (private mode, quota); the board just won't celebrate this time.
  }
};

/** True once when the board is reached after an activity completed `today`. Always clears the flag, so a
 * celebration missed on the day (tab closed before returning) never shows on a later day. */
export const takeDayCelebration = (today: string): boolean => {
  try {
    const pending = appStorage.getItem(PENDING_KEY);
    if (pending === null) return false;
    appStorage.removeItem(PENDING_KEY);
    return pending === today;
  } catch {
    return false;
  }
};
