# 0005. One manual test plan, kept in docs and updated with each feature

- Status: Accepted
- Date: 2026-10-18
- Source: Aleksander, tester handover of 2026-10-18;
  plan added in https://github.com/aleksanderlech-itx/spanish-gustar-quiz/pull/131

## Context

A tester who does not read Spanish is about to run a manual pass of the app.
The plan for that pass was written outside the repo and had no agreed home.
Without one, later plans would end up in PR bodies, chat or local files, and
would drift from the app as features change.

## Decision

- The manual test plan lives in one file: `docs/manual-test-plan.md`. Do not
  add per-feature manual test plans elsewhere, and do not put it in `tests/`,
  which holds only automated tests.
- Any PR that adds or changes something a tester can see or do (an activity,
  a screen, a setting, copy the plan quotes) updates the plan in the same PR:
  add or change the cases, and update "Last updated" and the PR it covers.
- The plan follows the project rules like any other doc: no dashes, no fixed
  topic count or hand-written topic list, Ko-fi described as tips only.

## Consequences

- The tester always gets the current plan from `main`, with no handover step.
- Every user-facing PR costs a small doc edit, which reviewers check.
- Step 7 of the test mode checklist in `CLAUDE.md` (the preview check) stays a
  per-PR check; the plan's test mode section covers the same ground for the
  full manual pass.
