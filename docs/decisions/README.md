# Decision log

One file per decision that shapes how the project is built or how work is
done. Each record says what was decided, why, and what it costs, so a later
change can tell whether the reasoning still holds.

## Adding a record

1. Copy the format below into `NNNN-short-title.md`, using the next free number.
2. Fill in every section. Link the PR or issue the decision came from.
3. Add a line to the index.
4. If the decision adds a rule that every session must follow, also add the
   rule to `CLAUDE.md` and link back to the record from there.

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

## Index

| # | Decision | Status | Date |
| --- | --- | --- | --- |
| [0001](0001-test-mode-for-every-activity.md) | Test mode support for every activity | Accepted | 2026-10-16 |
| [0002](0002-quiz-engine-ui-direction.md) | Quiz engine UI direction | Accepted | 2026-08-11 |
