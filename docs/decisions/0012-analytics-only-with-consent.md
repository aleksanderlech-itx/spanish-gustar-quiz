# 0012. Analytics load only with opt-in consent

- Status: Accepted
- Date: 2026-11-22
- Source: issue #146

## Context

Google Analytics and Microsoft Clarity (session recording) loaded for every
production visitor, with no consent prompt and no privacy page. The site is on
a `.es` domain and addresses EU learners, so the GDPR and the Spanish cookie
rules (LSSI article 22.2, AEPD guidance) apply. The alternatives were an
opt-in banner, or replacing both with cookieless analytics and dropping
Clarity. The owner chose to keep both tools behind opt-in consent.

## Decision

1. Google Analytics and Microsoft Clarity load only after the visitor chooses
   "Accept". Before a choice, or after "Reject", no request is made to them.
2. The choice is a bar at the bottom of the page (`app/consent-banner.tsx`)
   with Accept and Reject in the same style. It does not block the page, and
   it waits while a dialog is open (the first-visit welcome, the tutorial).
3. The choice is stored in `spanish-quiz-analytics-consent-v1` through
   `appStorage` (`app/consent.ts`) and asked again after 12 months. It is a
   privacy setting, not progress: it is not in backups and "Reset all progress"
   does not clear it.
4. "Cookie settings" in the footer and on `/privacy` reopens the bar.
   Withdrawing an earlier "Accept" deletes the analytics cookies on the site's
   domain and reloads the page.
5. Test mode never shows the bar and never loads analytics. Preview hosts show
   the bar but never load analytics (production host check in the layout).
6. `/privacy` names the controller (Aleksander Lech,
   spanish-quizzes@proton.me), lists what the browser stores, the third parties
   (Google, Microsoft after consent; Cloudflare hosting; the Ko-fi button image)
   and the visitor's rights. It is in the footer, the sitemap and `llms.txt`.

## Consequences

- Visitors who reject or ignore the bar are not counted; analytics numbers drop.
- Any new tracker, pixel or non-essential cookie must load only after consent,
  and be listed on `/privacy`.
- The privacy page wording is a draft by the developer. It needs review by
  someone qualified in privacy law before production, and again whenever the
  third parties change.
