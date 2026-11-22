import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const makeStore = (initial = {}) => {
  const map = new Map(Object.entries(initial));
  return {
    map,
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    key: (index) => [...map.keys()][index] ?? null,
    get length() {
      return map.size;
    },
  };
};
const events = [];
const install = ({ search = "", local = {}, cookie = "" } = {}) => {
  const localStorage = makeStore(local);
  let jar = cookie;
  const reloads = [];
  globalThis.document = {
    get cookie() {
      return jar;
    },
    set cookie(value) {
      const [pair] = value.split(";");
      const name = pair.split("=")[0].trim();
      if (/Max-Age=0/.test(value)) jar = jar.split(";").map((part) => part.trim()).filter((part) => part && part.split("=")[0] !== name).join("; ");
    },
  };
  globalThis.CustomEvent = class extends Event {
    constructor(type, init) {
      super(type);
      this.detail = init?.detail;
    }
  };
  globalThis.window = {
    location: { search, hostname: "spanish-quizz.es", reload: () => reloads.push(true) },
    localStorage,
    sessionStorage: makeStore(),
    dispatchEvent: (event) => events.push([event.type, event.detail]),
  };
  return { localStorage, reloads };
};

install();
const { CONSENT_KEY, readConsent, writeConsent, isConsentCurrent } = await import("../app/consent.ts");

test("no choice means no consent", () => {
  install();
  assert.equal(readConsent(), null);
});

test("a choice holds for 12 months, then the bar asks again", () => {
  const at = "2026-01-10T10:00:00.000Z";
  assert.equal(isConsentCurrent(at, new Date("2026-12-31T10:00:00Z")), true);
  assert.equal(isConsentCurrent(at, new Date("2027-01-11T10:00:00Z")), false);
  install({ local: { [CONSENT_KEY]: JSON.stringify({ choice: "accepted", at }) } });
  assert.equal(readConsent(new Date("2026-06-01T10:00:00Z")), "accepted");
  assert.equal(readConsent(new Date("2027-02-01T10:00:00Z")), null);
});

test("a damaged value counts as no choice", () => {
  install({ local: { [CONSENT_KEY]: "{nope" } });
  assert.equal(readConsent(), null);
});

test("accepting saves the choice and announces it without a reload", () => {
  const { reloads } = install();
  events.length = 0;
  writeConsent("accepted");
  assert.equal(readConsent(), "accepted");
  assert.deepEqual(events, [["spanish-quiz-consent-change", "accepted"]]);
  assert.equal(reloads.length, 0);
});

test("withdrawing an earlier Accept deletes analytics cookies, keeps the theme cookie, and reloads", () => {
  const { reloads } = install({
    local: { [CONSENT_KEY]: JSON.stringify({ choice: "accepted", at: new Date().toISOString() }) },
    cookie: "_ga=GA1.1.1; _ga_ABC=GS1; _clck=x; _clsk=y; spanish-quiz-theme=dark",
  });
  writeConsent("rejected");
  assert.equal(readConsent(), "rejected");
  assert.equal(document.cookie, "spanish-quiz-theme=dark");
  assert.equal(reloads.length, 1);
});

test("rejecting without an earlier Accept does not reload", () => {
  const { reloads } = install();
  writeConsent("rejected");
  assert.equal(reloads.length, 0);
});

test("the consent choice is not progress: not in backups, not cleared by reset", async () => {
  install();
  const { BACKUP_KEYS } = await import("../app/stored-data.ts");
  assert.equal(BACKUP_KEYS.some((spec) => spec.key === CONSENT_KEY), false);
});

test("analytics load only after Accept and never in test mode", async () => {
  const source = await readFile(new URL("../app/analytics-scripts.tsx", import.meta.url), "utf8");
  assert.match(source, /if \(isTestMode\(\)\) return;/);
  assert.match(source, /setEnabled\(readConsent\(\) === "accepted"\)/);
  assert.match(source, /if \(!enabled\) return null;/);
  const banner = await readFile(new URL("../app/consent-banner.tsx", import.meta.url), "utf8");
  assert.match(banner, /if \(isTestMode\(\)\) return;/);
  // Waits while any dialog is open, such as the first-visit welcome.
  assert.match(banner, /if \(!wanted \|\| dialogOpen\) return null;/);
  // Accept and Reject share one style.
  assert.match(banner, /<button type="button" onClick=\{\(\) => choose\("rejected"\)\}>Reject<\/button>\s*<button type="button" onClick=\{\(\) => choose\("accepted"\)\}>Accept<\/button>/);
});

test("the footer links Privacy and Cookie settings", async () => {
  const footer = await readFile(new URL("../app/site-footer.tsx", import.meta.url), "utf8");
  assert.match(footer, /<a href="\/privacy">Privacy<\/a>/);
  assert.match(footer, /<ConsentSettingsButton \/>/);
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
  assert.match(layout, /<ConsentBanner \/>/);
});
