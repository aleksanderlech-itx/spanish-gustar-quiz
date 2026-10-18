# Working agreement: git & deployment

The user (aleksander.lech@itixo.com) works from Linux, Windows, the desktop
app, and mobile: this file is the source of truth for workflow rules in
every session, since local settings don't follow across devices.

## Branching

- `main` is the only long-lived branch and is production
  (deploys to https://spanish-quizz.es).
- There is no `staging` branch or environment. Feature work happens on a
  branch off `main`, merged via PR. Review happens against the PR's own
  preview deployment, not a shared staging environment.

## Rules

1. **Commit after every meaningful change.** Don't batch unrelated work into
   one commit; don't leave finished work uncommitted at the end of a turn.
2. **Open a PR for changes and share the preview link.** Every PR into
   `main` gets an automatic preview Worker deployment
   (`.github/workflows/pr-preview.yml`), which comments the preview URL on
   the PR. Tell the user the PR link and the preview link once it's up:
   don't just say "pushed."
3. **Never deploy to production without an explicit greenlight.** The
   `Deploy Production` workflow (`.github/workflows/deploy-production.yml`)
   is `workflow_dispatch`-only: merging to `main` does NOT auto-deploy.
   Only trigger it (or ask the user to) after they explicitly say to ship
   to prod in that conversation. A prior approval does not carry over to a
   later, unrelated change.
4. **Delete obsolete/merged branches.** `.github/workflows/branch-cleanup.yml`
   auto-deletes a PR's head branch once merged. If you create a branch that
   ends up abandoned (superseded, closed without merging), delete it
   yourself once you're done with it.

# Test mode support for new activities

Test mode (open any page with `?test=1`) lets a tester who does not read
Spanish finish any activity in an isolated session. It is implemented in
`app/storage.ts`, `app/test-mode.tsx` and `app/test-mode.css`. Every new
activity or feature that stores progress or has a right answer must support
it. Include this checklist in the brief and the PR for every such change.
Why this was decided: `docs/decisions/0001-test-mode-for-every-activity.md`.

1. **Storage.** Read and write only through `appStorage` and
   `appSessionStorage` from `app/storage.ts`. Never call `window.localStorage`
   or `window.sessionStorage` directly: `tests/test-mode.test.mjs` fails if
   you do. The theme preference is the only deliberate exception.
2. **Right answer shown.** In test mode the tester must be able to see what to
   do. Use `isTestMode()` and render the hint only then:
   - Choice questions: highlight the correct option (existing activities do
     this in `app/round.tsx`). Color only, no label, readable in light and dark.
   - Typed answers: prefill the correct answer.
   - Self-graded cards: mark the button that records success.
   - Any new kind of interface: add the equivalent hint. Normal mode must
     render nothing extra.
3. **Registry.** Register the activity in `app/activity-registry.ts` so its
   progress, the streak, and backup, restore and reset include it.
4. **Defaults.** If the activity has answer modes, test mode starts in choice
   mode (see `app/topic-settings.ts`).
5. **State outside browser storage.** Do not keep state in cookies, and do not
   send analytics events or call outside services with test data. Analytics
   scripts load through `app/analytics-scripts.tsx`, which skips test sessions.
6. **Tests.** Extend `tests/test-mode.test.mjs`: a test session of the new
   activity leaves every real key unchanged, and the hint is gated on test
   mode.
7. **Preview check.** On the PR preview, open the activity with `?test=1`,
   finish it using only the hints, then confirm real progress (open a new tab
   without the parameter) is untouched.

# Decision log

Decisions and their reasoning are recorded in `docs/decisions/` (format and
index in its `README.md`). When a change makes a decision that later work must
follow, add a record there; if it adds a rule for every session, also add the
rule here and link the record.
