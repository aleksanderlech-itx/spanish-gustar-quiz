# 0001. Test mode support for every activity

- Status: Accepted
- Date: 2026-10-16
- Source: [#121](https://github.com/aleksanderlech-itx/spanish-gustar-quiz/pull/121)
  (test mode), [#122](https://github.com/aleksanderlech-itx/spanish-gustar-quiz/pull/122)
  (rule for new activities)

## Context

Testers who do not read Spanish could not finish quizzes, so they could not
check flows end to end. Testing on a real browser profile also mixed test runs
into real progress: daily goal, streak, accuracy, notebook, flashcards and
settings. Test visits were counted in analytics.

## Decision

Opening any page with `?test=1` starts test mode, an isolated session that
shows the right answer.

- **One storage access point.** Every progress and settings read or write goes
  through `appStorage` and `appSessionStorage` in `app/storage.ts`. In test
  mode every key gets the `sq_test_` prefix, so real keys are never read or
  written, and test keys are never touched in normal mode. The theme
  preference is the only deliberate exception: it is a display preference
  shared by every session on the device.
- **Lifetime per tab.** A `sessionStorage` flag keeps the mode when navigation
  drops the parameter, and the parameter is put back on the URL. A fresh tab
  without `?test=1` is always normal mode.
- **Visible but out of the way.** A small fixed chip (no layout impact) with
  Exit and Reset, and a `[Test]` title prefix. Exit keeps test data. Reset
  clears only the test namespace.
- **Right answer shown, only in test mode.** Choice questions highlight the
  correct option by color only, typed answers are prefilled, self-graded
  cards mark the button that records success. Normal mode renders nothing
  extra.
- **Choice mode by default** in test mode. A saved choice still wins.
- **No outside effects.** Analytics scripts are not loaded in test sessions,
  and no state goes into cookies or outside services.

Every new activity or feature that stores progress or has a right answer
must support test mode. The checklist (storage, hint, registry, defaults,
outside state, tests, preview check) is in `CLAUDE.md` under
"Test mode support for new activities" and must be included in the brief
and the PR.

## Consequences

- Direct `window.localStorage` or `window.sessionStorage` calls are
  forbidden outside `app/storage.ts` (theme aside).
  `tests/test-mode.test.mjs` fails if one appears.
- Every new activity must be registered in `app/activity-registry.ts` so
  progress, streak, backup, restore and reset cover it in both modes.
- Every new kind of answer interface needs its own test mode hint, gated on
  `isTestMode()`.
- Each new activity adds tests showing that a test session leaves real keys
  unchanged and that the hint only shows in test mode, plus a manual check on
  the PR preview.
- Analytics scripts load from a client component after mount, because
  detecting test mode needs the URL and the tab flag. Normal visitors still
  get both scripts, slightly after hydration.
- If browser storage is blocked, the tab flag cannot be stored and test mode
  lasts only while `?test=1` stays in the URL. The chip warns about it.
