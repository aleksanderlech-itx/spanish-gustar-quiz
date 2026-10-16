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

/** Text added in front of every key. Empty in normal mode, so real keys are untouched. */
export const storageKeyPrefix = (): string => "";

const wrap = (pick: () => Storage): Store => ({
  getItem: (key) => pick().getItem(storageKeyPrefix() + key),
  setItem: (key, value) => pick().setItem(storageKeyPrefix() + key, value),
  removeItem: (key) => pick().removeItem(storageKeyPrefix() + key),
});

export const appStorage: Store = wrap(() => window.localStorage);
export const appSessionStorage: Store = wrap(() => window.sessionStorage);
