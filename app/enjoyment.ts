const SESSION_SHOWN_KEY = "spanish-quiz-enjoyment-session-shown";
const LAST_ANSWERED_KEY = "spanish-quiz-enjoyment-last-answered-v1";
const RECENT_ANSWER_WINDOW_DAYS = 7;

/** At most once per browser session, and not again for a user who answered within the last week. */
export const shouldShowEnjoymentGate = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    if (window.sessionStorage.getItem(SESSION_SHOWN_KEY)) return false;
    const lastAnswered = window.localStorage.getItem(LAST_ANSWERED_KEY);
    if (lastAnswered) {
      const days = (Date.now() - Date.parse(lastAnswered)) / 86_400_000;
      if (days < RECENT_ANSWER_WINDOW_DAYS) return false;
    }
    return true;
  } catch {
    return false;
  }
};

export const markEnjoymentGateShown = () => {
  try {
    window.sessionStorage.setItem(SESSION_SHOWN_KEY, "1");
  } catch {
    // Storage can be unavailable; worst case the gate shows again this session.
  }
};

export const markEnjoymentAnswered = () => {
  try {
    window.sessionStorage.setItem(SESSION_SHOWN_KEY, "1");
    window.localStorage.setItem(LAST_ANSWERED_KEY, new Date().toISOString());
  } catch {
    // Storage can be unavailable; worst case the gate shows again next round.
  }
};
