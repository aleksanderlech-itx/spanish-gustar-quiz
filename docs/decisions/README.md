# Decision log

One file per decision that shapes how the project is built or how work is
done. Each record says what was decided, why, and what it costs, so a later
change can tell whether the reasoning still holds.

## Adding a record

1. Copy the format below into `NNNN-short-title.md`, using the next free number.
2. Fill in every section. Link the PR or issue the decision came from.
3. Add a line to the index.
4. If the decision adds a rule that every session must follow, add it to
   "Project rules" below, linking the record. Do not copy it into `CLAUDE.md`:
   that file only points here.

A decision that is replaced is not deleted: set its status to
`Superseded by NNNN` and add the new record.

```markdown
# NNNN. Title

- Status: Accepted | Superseded by NNNN
- Date: YYYY-MM-DD
- Source: PR or issue link

## Context

What problem or situation called for a decision.

## Decision

What was decided, stated as rules where possible.

## Consequences

What this makes easier, what it costs, and what every later change must do.
```

## Project rules

Standing rules that apply to every change. Workflow rules (commit often, PR
with preview link, no production deploy without an explicit greenlight, delete
obsolete branches) live in `CLAUDE.md`. The rules below cover writing and
content. Each links to the record that explains it.

1. Ask when scope is ambiguous. Do not assume. Get explicit confirmation
   before scope expands.
2. No em dashes or en dashes anywhere: copy, code comments, data, docs, UI
   text.
3. Professional tone. No emoticons.
4. UI border radius is reduced by 50% relative to the current design. Do not
   apply full radius universally.
5. Explanations are in English only. Use neutral standard Spanish; regional
   forms only when they are the point of the item, flagged in the PR.
6. Do not hard-code the number of topics or a hand-written topic list in copy
   or docs. Say "about 150" for sentences per topic, never an exact figure.
   See [0003](0003-content-counts-and-notes-for-every-activity.md).
7. Every activity has its own entry in Notes, and ships with it. See
   [0003](0003-content-counts-and-notes-for-every-activity.md).
8. Docs ship with the feature: update How to use, About, meta descriptions,
   Notes and `docs/` in the same PR. See
   [0003](0003-content-counts-and-notes-for-every-activity.md).
9. Ko-fi is for tips only. No membership tiers or member-only content may be
   described anywhere. See [0004](0004-kofi-tips-only.md).
10. Every activity supports test mode. See
    [0001](0001-test-mode-for-every-activity.md).
11. Record every new decision here, in the PR that implements it.

## Index

| # | Decision | Status | Date |
| --- | --- | --- | --- |
| [0001](0001-test-mode-for-every-activity.md) | Test mode support for every activity | Accepted | 2026-10-16 |
| [0002](0002-quiz-engine-ui-direction.md) | Quiz engine UI direction | Accepted | 2026-08-11 |
| [0003](0003-content-counts-and-notes-for-every-activity.md) | Content counts and a Notes entry for every activity | Accepted | 2026-10-18 |
| [0004](0004-kofi-tips-only.md) | Ko-fi is for tips only | Accepted | 2026-10-18 |
