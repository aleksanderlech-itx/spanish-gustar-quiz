# 0009. Activity ids are permanent

- Status: Accepted
- Date: 2026-11-21
- Source: issue #160

## Context

An activity id is part of storage key names (`<id>-quiz-progress-v1`,
`<id>-topic-settings-v1`), notebook ids (`q:<id>:<questionId>`), the
completion map, the streak ledger and the locked days. The streak module
dropped ids it did not find in the registry and saved the shorter list on the
next write, so renaming or removing an activity erased it from past days for
good. The customisable board (#117, decision 0008) takes activities off the
Board, which would cause the same loss if it filtered what is stored.

## Decision

1. An activity id never changes once released, and is never reused for a
   different activity.
2. Stored data keeps ids the current build does not know. Code filters unknown
   ids when it evaluates (for example the daily goal), never when it writes.
3. Taking an activity off the Board changes what the daily goal requires. It
   does not change what is stored.

## Consequences

- Renaming an activity means changing its title, not its id.
- Retiring an activity leaves its id in learners' stored data; it is ignored
  by the goal check and harmless.
- `tests/streak.test.mjs` checks that a ledger and locked days holding an
  unknown id keep it after a read and write cycle.
