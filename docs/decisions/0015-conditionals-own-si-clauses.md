# 0015. Conditionals: one activity owns every si clause

- Status: Accepted
- Date: 2026-11-28
- Source: owner approval of the off-roadmap Conditionals brief, 2026-11-28 (PR for the `conditionals` activity)

## Context

The owner approved a Conditionals activity outside roadmap #65. It practises si
clauses with the imperfect subjunctive (tuviera) and the pluperfect subjunctive
(hubiera tenido), which overlaps the planned Past subjunctive activity (#73,
Cycle 10). #73 plans -ra forms after past triggers (era importante que...),
past purpose clauses (para que organizáramos...) and a contrast with the present
subjunctive; it does not mention si clauses. Without a split, the two banks
could repeat sentences and share Mistake notebook chips.

## Decision

- **Ownership.** Conditionals owns every sentence built on si plus the imperfect
  or pluperfect subjunctive, and the polite conditional. #73 and any later
  subjunctive activity do not use si clauses or como si; their chips use their
  own prefix, never "Conditionals:".
- **Scope.** The three si clause types (real, imagined, past unreal) and the
  polite conditional. Imperfect subjunctive in -ra only; no -se forms anywhere.
  No vosotros. No mixed conditionals, and no conditional structures without si
  other than polite requests and wishes.
- **Identity.** Activity id and slug `conditionals`, chip label
  `Conditionals: <group>`, question ids 11001 to 11150. The six groups are
  permanent: real condition, imperfect subjunctive, regular conditional,
  irregular conditional, past unreal, polite conditional.
- **Options.** Two per item, like every pair quiz. A blank in the si clause
  always takes the conditional or the future after si as its wrong option.
- **Wrong options that are never offered** (project rule 13):
  - an -ra form in a result clause (pudiera, quisiera and debiera are accepted
    there, and -ra for the conditional survives in parts of Latin America);
  - the imperfect indicative in an imagined result (accepted colloquially);
  - the simple conditional in a past unreal result (it reads as a mixed
    conditional), and hubiera plus participle there (an accepted alternative);
  - the conditional of poder, querer or deber after a real condition (it
    softens an offer);
  - puedes, pudieras, quisiera or quería in a polite request.

## Consequences

- #73 can start from a clear boundary: past-trigger and purpose clauses, never
  si. Its brief should repeat this split.
- Some learner errors the brief listed (si tenga, si tenía) cannot be wrong
  options with two choices, because the si clause option is always the
  conditional or the future. The Notes article covers them instead.
- The wrong-option rules are enforced by `tests/conditionals-data.test.mjs`.
- When #152 (base question type) and #158 (group keys) land, this bank moves
  with the others; ids and group names stay as they are.
