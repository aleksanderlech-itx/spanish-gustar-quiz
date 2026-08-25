# Spanish Quiz Studio UX Contract

This contract records the observable behavior shared by the grammar quizzes and flashcards.

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Round (Choose / Type) | `app/round.tsx` | `DESIGN.md` and this contract | Choose, Type | Unit tests and production build |

## Navigation and progress

- Board home (`app/quiz-selector.tsx`) is the common entry point. Tiles route to topic detail
  (`app/topic-detail.tsx`) for grammar quizzes, or straight into flashcards for the deck — decks have
  no detail screen. Topic detail's "Start round" opens the round (`app/round.tsx`). Opening a quiz
  preserves its own progress namespace.
- In a round, each answer is scored and saved to history the moment the round finishes (its last
  question), not per question — but the learner sees correct/incorrect feedback immediately after
  picking, not only at the end. A tap commits an answer; further taps on that question are ignored.
  Skip moves on without recording an answer for that question, so it stays available for a future
  round. Flashcard recall is saved immediately after each assessment.
- Round length (5/10/20) and answer mode (Choose/Type) are set per topic on the topic detail screen
  and persist there (`app/topic-settings.ts`); they are not yet editable mid-round.
- Type mode uses a real text input (`autoCapitalize="none" autoCorrect="off" spellCheck={false}
  lang="es"`) with an accent row (`á é í ó ú ñ`) that inserts at the input's caret position, not the
  end. Checking is a no-op on empty/whitespace input. Answer comparison always goes through
  `normalizeAnswer`, in both modes. The "Stuck? Open the conjugation chart" affordance and the
  in-round quiz switcher are not present yet — the chart screen ships in a later update.
- Level/verb filters, backup & restore, detailed history, weak-area insights, and "reset progress"
  are temporarily unreachable in the UI — they move into the Drawer in a later update. The
  underlying data and sync logic are unaffected; only their entry points are pending.
- Flashcards use five Leitner boxes. Correct recall advances one box, up to Box 5; incorrect recall returns the card to Box 1.
- Box intervals are immediate, 1 day, 3 days, 7 days, and 14 days. A session contains due cards first, then unseen cards, up to 20 cards.
- Existing binary flashcard progress migrates automatically: remembered cards enter Box 2 and cards still being learned enter Box 1.
- Returning to the library never deletes or resets progress.

## Interaction

- A flashcard must reveal its English meaning and Spanish example before recall can be assessed.
- Recall actions use a symbol and a visible text label. They remain disabled before reveal.
- All primary touch targets have a minimum height of 44px and a visible keyboard focus state.
- The active exercise is the only strongly elevated surface. Supporting progress panels remain visually quieter.

## Feedback and recovery

- Local progress remains usable when cross-device synchronization is unavailable.
- Invalid or unavailable stored flashcard data falls back to a new round without blocking the learner.
- Reduced-motion preferences remove nonessential state transitions.
