# 0007. Question ids are explicit and permanent

- Status: Accepted
- Date: 2026-11-11
- Source: issue #154, risk R1 in `docs/data-map-and-risks-2026-11.md`

## Context

Every bank derived a question's id from its row position (`id: base + index`).
Stored round history, the mistake notebook, the per-item explanations and the
generated sentence pairs are all keyed by that id. Inserting, deleting or
reordering one row renumbered every later question, and where neighbouring
answers were the same nothing failed: learners' progress and the explanations
moved to other sentences without an error. The tests checked only the count and
the id range.

## Decision

- Each seed row carries its own id as its first value. No id is computed from
  a position.
- An id belongs to one sentence for good. Correcting a sentence keeps its id. A
  new sentence gets an id that was never used. A removed sentence retires its
  id, and a retired id is never reused.
- `tests/question-id-snapshot.json` records, for every id, the sentence with
  its answer and the seed fields (wrong option, group, tense, level), plus the
  retired ids. `tests/question-ids.test.mjs` fails when a bank and the snapshot
  disagree.
- The snapshot is changed only by
  `node --experimental-strip-types scripts/update-question-snapshot.mjs`, after
  a deliberate content change, and its diff is reviewed in the PR.

## Consequences

- Rows can be reordered or grouped freely; ids no longer need to be contiguous.
- Every content PR that adds, corrects or removes a sentence also changes the
  snapshot, which makes the change visible in review.
- New banks pick a free id range (the next free thousand) and write the ids
  into their seed rows.
- Gustar still derives `level` from a row's position inside its verb list, so
  reordering Gustar rows changes their difficulty label. That is left for the
  base type work in #152.
