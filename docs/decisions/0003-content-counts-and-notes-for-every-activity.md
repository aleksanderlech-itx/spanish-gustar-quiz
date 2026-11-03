# 0003. Content counts and a Notes entry for every activity

- Status: Accepted
- Date: 2026-10-18
- Source: Aleksander, docs and content audit of 2026-10-18 (PR link added when
  opened)

## Context

The audit found that public copy and project docs disagree about how many
grammar topics the app has and which ones. The homepage title and meta
description name only gustar, ser vs estar and past tense. About lists four
topics, How to use lists five and its video text says six, while the app has
seven (gustar, ser vs estar, por vs para, preterite vs imperfect, object
pronouns, saber vs conocer, reflexive verbs). The sentence count ("150") is
stated as an exact figure although it can change. Notes has six articles, and
two activities (object pronouns, reflexive verbs) have none.

New activities will keep arriving, so any fixed list or count goes stale again.

## Decision

- **No fixed topic counts or hand-written topic lists in copy.** Use generic
  wording ("grammar topics and verb flashcards"), or build the list from the
  activity data so it cannot drift. This covers page titles, meta
  descriptions, og and twitter tags, About, How to use, Notes intro text, and
  project docs.
- **Sentence counts are approximate.** Write "about 150 sentences per topic",
  never an exact number, in copy and docs.
- **Every activity has its own entry in Notes.** A short grammar article that
  links to the quiz topic. An activity is not ready to release without it.
- **Docs ship with the feature.** A PR that adds or changes an activity also
  updates, in the same PR: How to use, About, page meta descriptions, Notes,
  and the project docs under `docs/`.

## Consequences

- The release checklist for a new activity gains two items: the Notes entry
  and the copy and meta review. Put them in the brief and the PR description,
  next to the test mode checklist from `0001`.
- Existing gaps are follow-up work, not done by this record: Notes entries for
  object pronouns and reflexive verbs, and rewriting the stale topic lists and
  meta tags listed in the Context.
- Where a list must be shown, it comes from one data source, which makes a
  new activity appear everywhere at once.
