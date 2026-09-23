/**
 * Read-modify-write for one activity's progress key. `read` runs at save time, so the
 * update starts from what's in localStorage now, not from a copy loaded when the page
 * opened — another tab with the same activity open can't have its save overwritten.
 */
export const updateStoredProgress = <T>(key: string, read: () => T, update: (current: T) => T): T => {
  const next = update(read());
  window.localStorage.setItem(key, JSON.stringify(next));
  return next;
};
