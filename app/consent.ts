import { appStorage } from "./storage.ts";

/**
 * The visitor's analytics choice (decision 0012). Google Analytics and Microsoft Clarity load only after
 * "Accept". The choice is a privacy setting, not progress: it is kept outside backups and "Reset all
 * progress", and asked again once it is 12 months old.
 */

export const CONSENT_KEY = "spanish-quiz-analytics-consent-v1";
/** Fired on window when the choice changes or the banner should open again. */
export const CONSENT_CHANGE_EVENT = "spanish-quiz-consent-change";
export const CONSENT_OPEN_EVENT = "spanish-quiz-consent-open";
const CONSENT_MONTHS = 12;

export type ConsentChoice = "accepted" | "rejected";
type StoredConsent = { choice: ConsentChoice; at: string };

/** Cookies Google Analytics and Clarity set on this site's domain, removed when consent is withdrawn. */
const ANALYTICS_COOKIE = /^(_ga|_ga_.*|_gid|_gat.*|_clck|_clsk|CLID|MUID)$/;

const parse = (raw: string | null): StoredConsent | null => {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<StoredConsent>;
    if ((value.choice === "accepted" || value.choice === "rejected") && typeof value.at === "string") {
      return { choice: value.choice, at: value.at };
    }
  } catch {
    // A damaged value counts as no choice: the banner asks again.
  }
  return null;
};

/** Whether a choice made at `at` still holds at `now`: for 12 months. */
export const isConsentCurrent = (at: string, now = new Date()): boolean => {
  const expires = new Date(at);
  if (Number.isNaN(expires.getTime())) return false;
  expires.setMonth(expires.getMonth() + CONSENT_MONTHS);
  return now < expires;
};

/** The visitor's current choice, or null when there is none or it has expired. */
export const readConsent = (now = new Date()): ConsentChoice | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = parse(appStorage.getItem(CONSENT_KEY));
    return stored && isConsentCurrent(stored.at, now) ? stored.choice : null;
  } catch {
    return null;
  }
};

/** Removes analytics cookies on this host and its parent domain. */
export const deleteAnalyticsCookies = () => {
  if (typeof document === "undefined") return;
  const host = window.location.hostname;
  const domains = ["", host, `.${host.split(".").slice(-2).join(".")}`];
  document.cookie.split(";").map((part) => part.split("=")[0].trim()).filter((name) => ANALYTICS_COOKIE.test(name)).forEach((name) => {
    domains.forEach((domain) => {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    });
  });
};

/**
 * Saves the choice. Accepting starts analytics on this page. Withdrawing an earlier "Accept" deletes the
 * analytics cookies and reloads, so scripts already running stop.
 */
export const writeConsent = (choice: ConsentChoice, now = new Date()) => {
  if (typeof window === "undefined") return;
  const withdrawing = choice === "rejected" && readConsent(now) === "accepted";
  try {
    appStorage.setItem(CONSENT_KEY, JSON.stringify({ choice, at: now.toISOString() }));
  } catch {
    // Storage blocked: the choice holds for this page only, and the banner asks again next time.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: choice }));
  if (withdrawing) {
    deleteAnalyticsCookies();
    window.location.reload();
  }
};

/** Opens the banner again, from "Cookie settings" in the footer or on the privacy page. */
export const openConsentSettings = () => {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
};
