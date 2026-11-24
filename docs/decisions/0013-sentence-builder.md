# 0013. Sentence Builder: one Activity, every Token in the answer, right or wrong as a whole

- Status: Accepted
- Date: 2026-11-23
- Source: issue #72 (design session 2026-11-23)

## Context

Sentence Builder is the first Activity type that is not fill-in-the-blank or
flashcards: the learner sees an English prompt and puts shuffled Spanish
Tokens in order (terms in `CONTEXT.md`). Several choices shape its stored
progress and content and are costly to change once learners have history.

## Decision

1. **One Activity.** Sentence Builder is a single Activity on the Board, its
   Items grouped by pattern: questions, negatives, prepositions, object
   pronouns, ser/estar, present and past patterns, connectors. The group
   filter works as in the topic quizzes. The type is built so a topic could
   add its own Sentence Builder Activity later, but none does now: one tile
   keeps the daily goal small (decision 0008).
2. **Tokens.** A Token is a word, or a fixed chunk set per Item (for example
   "se lo", "por favor"). Punctuation and capital letters are never Tokens:
   the check ignores capitals, and opening and closing marks are added
   automatically. Every Token belongs in the answer; there are no distractors.
3. **Right or wrong as a whole.** An answer is right when it matches one of
   the Item's Accepted orders. Any other order that is also correct Spanish
   must be listed as an Accepted order (decision 0006 applied to word order).
   No partial credit.
4. **Content.** About 100 Items, about 14 per group, levels basic,
   intermediate and advanced as in the quizzes. Sentences follow the content
   policy (`docs/content-sources.md`): unchanged Tatoeba pairs first, original
   pairs only where none fits, all in the public manifest. Each Item has a
   permanent id (decision 0007), an English explanation and a one-line cue
   that pass the explanation lint. Automated checks confirm every Accepted
   order uses exactly the Item's Tokens; the owner checks a sample from the
   content export before release.
5. **Same rules as the topic quizzes.** Rounds of 5, 10 or 20; Finished once
   every Item has been attempted and its misses cleared, then it moves to the
   Shelf with a Suggestion; misses go to the mistake notebook with a Mistakes
   to retry tile; one round counts for the daily goal. It starts on the Shelf
   for existing users with a one-time New Suggestion (Project rule 15) and is
   not part of the starter Board (decision 0011).
6. **Interaction.** Tap a Token to place it at the end of the answer line, tap
   a placed Token to return it, Undo removes the last, Reset clears, Check is
   enabled when every Token is placed. Every Token is a button; Enter or Space
   places or returns it, Backspace undoes; each change is announced. No
   drag-and-drop. After a wrong answer, the learner's line is shown above the
   correct one with misplaced Tokens marked. After checking, a speaker button
   reads the correct sentence. Test mode highlights the next correct Token by
   colour only.
7. **Ships with** a Notes article ("Spanish word order: questions, negatives
   and pronouns"), a help modal, test mode support, a content export and the
   docs. Launch videos and posts are separate.
8. **Built after #151 and #162**, so the new type is registered through the
   activity configuration instead of new branches.

9. **Settled while building (PR for #72).** An Accepted order is correct Spanish
   for the English prompt: an order that changes the meaning (por eso at the
   end) or needs a comma to be correct is not accepted, since punctuation is
   never a Token. Items are unchanged Tatoeba rows kept in
   `app/sentence-builder-data.ts` with their attribution; the content generator
   checks each against the corpus snapshot and lists it in the manifest.
   Regional forms (vos, vosotros, gafas, enfadarse) are avoided (Project rule 5).
   `SENTENCE_BUILDER_INTRODUCED_ON` is set to the production release day.

## Consequences

- Stored progress records whole-Item results, the same shape as the quizzes.
- Adding distractors, partial credit or per-topic Sentence Builder Activities
  later is a new decision and may need a stored-data step (decision 0010).
- Content review cannot detect an unlisted valid order automatically; the
  sample check before release is part of the release rule for this Activity.
