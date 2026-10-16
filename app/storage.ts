/**
 * The single access point for the app's progress and settings in browser storage.
 *
 * Every read and write of a quiz, flashcard, streak, notebook or settings key goes through
 * `appStorage` (localStorage) or `appSessionStorage` (sessionStorage), so one place decides
 * which keys a session actually touches. That is what lets a separate, isolated session
 * (test mode) exist without any of its data ever reaching the real keys.
 *
 * Deliberately not routed through here: the theme preference (localStorage plus a cookie
 * read on the server), which is a display preference shared by every session on the device.
 *
 * The wrappers pass storage errors through unchanged, so callers keep their own try/catch
 * handling exactly as before. `window` is read lazily on each call so tests can stub it.
 */

type Store = Pick<Storage, "getItem" | "setItem" | "removeItem">;

/** URL parameter that starts test mode: `?test=1`. */
export const TEST_MODE_PARAM = "test";
/** sessionStorage key holding the per-tab test mode flag. Stored outside the test namespace on purpose:
 * it is what decides the namespace, so it is never prefixed. It dies when the tab closes. */
export const TEST_MODE_FLAG_KEY = "sq-test-mode";

const hasTestParam = (): boolean => {
  try {
    return new URLSearchParams(window.location.search).get(TEST_MODE_PARAM) === "1";
  } catch {
    return false;
  }
};

const hasTestFlag = (): boolean => {
  try {
    return window.sessionStorage.getItem(TEST_MODE_FLAG_KEY) === "1";
  } catch {
    return false;
  }
};

/** Test mode is on while the URL carries `?test=1`, or the tab's flag is set. The flag is what keeps the
 * mode when navigation drops the parameter. A fresh tab without the parameter is always normal mode. */
export const isTestMode = (): boolean => {
  if (typeof window === "undefined") return false;
  return hasTestParam() || hasTestFlag();
};

/** Sets the tab flag once the URL has asked for test mode. Returns false when the flag could not be stored
 * (blocked storage), in which case the mode lasts only while the parameter stays in the URL. */
export const rememberTestModeForTab = (): boolean => {
  if (!hasTestParam()) return hasTestFlag();
  try {
    window.sessionStorage.setItem(TEST_MODE_FLAG_KEY, "1");
    return true;
  } catch {
    return false;
  }
};

/** Leaves test mode for this tab. The caller then reloads without the parameter. */
export const forgetTestModeForTab = () => {
  try {
    window.sessionStorage.removeItem(TEST_MODE_FLAG_KEY);
  } catch {
    // Storage blocked; the flag was never stored, so there is nothing to clear.
  }
};

/** Every key written in test mode starts with this, which no real key does. Reset removes exactly these. */
export const TEST_KEY_PREFIX = "sq_test_";

/** Removes only test-namespace keys, from both localStorage and sessionStorage. Real keys and the tab flag
 * are never touched. */
export const clearTestData = () => {
  [() => window.localStorage, () => window.sessionStorage].forEach((pick) => {
    try {
      const store = pick();
      const doomed: string[] = [];
      for (let i = 0; i < store.length; i += 1) {
        const key = store.key(i);
        if (key && key.startsWith(TEST_KEY_PREFIX)) doomed.push(key);
      }
      doomed.forEach((key) => store.removeItem(key));
    } catch {
      // Storage blocked; there is no test data to clear.
    }
  });
};

/** Text added in front of every key: the test prefix in test mode, empty otherwise, so real keys are untouched
 * in test mode and test keys are never read in normal mode. */
export const storageKeyPrefix = (): string => (isTestMode() ? TEST_KEY_PREFIX : "");

const wrap = (pick: () => Storage): Store => ({
  getItem: (key) => pick().getItem(storageKeyPrefix() + key),
  setItem: (key, value) => pick().setItem(storageKeyPrefix() + key, value),
  removeItem: (key) => pick().removeItem(storageKeyPrefix() + key),
});

export const appStorage: Store = wrap(() => window.localStorage);
export const appSessionStorage: Store = wrap(() => window.sessionStorage);
