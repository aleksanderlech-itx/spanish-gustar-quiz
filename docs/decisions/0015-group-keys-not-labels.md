# 0015. Groups are stored by key, never by the text on screen

- Status: Accepted
- Date: 2026-11-24
- Source: issues #152 and #158

## Context

Every quiz sorts its sentences into groups: a verb in Gustar, a usage in Saber
vs Conocer, a pattern in Present Perfect. The group's text ("past meaning",
"haber not tener") was the only identifier. Learners' browsers stored it in
three places: the saved filter, the mistake notebook's rule label ("Saber vs
conocer: past meaning"), and the `rule=` link of a mistakes activity. Renaming
a group or a quiz title would have:

- made a saved filter select no sentences;
- split notebook chips into old and new names, with old rule entries finding
  no sentences;
- sent a stale group to the fallback explanation.

Sentence Builder had shipped the same way on 24 Nov. At the same time the
shared `Question` type (#152) was shaped for Gustar, with a field named
`infinitive` holding every quiz's group.

The owner chose fixed slug keys with an upgrade step over freezing today's
text as keys, and an activity id plus rule key in the notebook over the
label.

## Decision

1. Every group has a fixed key: lowercase words joined by hyphens
   (`past-meaning`, `haber-not-tener`, `ser-estar`). Verb groups keep the verb
   (`gustar`, `tener`). A key never changes and is never reused.
2. The text shown is the group label: the quiz config's `groupLabels`, or
   `SENTENCE_BUILDER_GROUP_LABELS`; a group without one shows its key. A label
   can change at any time.
3. Every question's group is `group` on the base `Question` type. The shared
   type holds only what every quiz uses; Gustar adds its own fields in
   `GustarQuestion`.
4. Saved filters store the group key. A stored key that is not a current
   group reads as "all".
5. A notebook entry stores its activity id (`quizId`) and a rule key (`rule`):
   the group key, or the tense in Preterite vs Imperfect. Each quiz declares
   `ruleKey(question)` and `ruleLabel(key)`; the chip, mistakes activity and
   results screen build the label when they show it.
6. Schema 3 (decision 0010) upgrades saved filters and notebook rules from
   labels to keys. The labels as they were in schema 2 are frozen in
   `app/schema-2-labels.ts`, which the upgrade step, v1 notebook entries and
   old `rule=` links read. Never edit that file.
7. Content exports and the question id snapshot show the label, so a key
   change alone changes neither.

## Consequences

- A group label or quiz title can be reworded with a one-line change and no
  upgrade step.
- A new activity's groups need a key and, if it differs, a label. Storing
  display text in the browser needs a decision record.
- Removing a group leaves saved filters reading "all" and notebook entries
  with a rule no sentence matches; their sentences still retry.
