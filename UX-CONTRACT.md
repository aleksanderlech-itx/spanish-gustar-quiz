# Spanish Quiz Studio UX Contract

This contract records the observable behavior shared by the grammar quizzes and flashcards.

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Round (Choose / Type) | `app/round.tsx` | `DESIGN.md` and this contract | Choose, Type | Unit tests and production build |
| Results | `app/results.tsx` | `DESIGN.md` and this contract | — | Unit tests and production build |

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
  `normalizeAnswer`, in both modes. Type mode's "Stuck? Open the conjugation chart" opens
  `app/verb-chart.tsx` in a new tab (scoped to the current question's verb), rather than navigating
  away and losing the in-progress round, which is not yet saved to history. The in-round quiz
  switcher is not present — switching quizzes now happens from the board (confirmed intentional,
  matches the design's nav graph).
- The round screen's height uses `100dvh` (falling back to `100vh` on browsers that don't support
  it — declared in that order so `dvh` actually wins where supported) with a `visualViewport`
  fallback in Type mode: a measured `--keyboard-inset` lifts the footer above the on-screen
  keyboard on iOS Safari versions where `dvh` doesn't fully react to it.
- The verb conjugation chart (`app/verb-chart.tsx`) only shows a real six-pronoun paradigm for
  preterite/imperfect verbs, where that data exists. Gustar-pattern verbs are impersonal (they never
  conjugate for "yo, tú..."), so they get a singular/plural block instead. The ser/estar quiz compares
  two different verbs rather than conjugating one, so its chart lists "ser" and "estar" directly. A
  regularity badge ("regular" / "irregular" / "spelling change") shows only for preterite/imperfect
  verbs (`PRETERITE_IMPERFECT_REGULARITY` in `app/preterite-imperfect-data.ts`), scoped strictly to
  that verb's behavior in those two tenses specifically — a verb irregular elsewhere (e.g. salir's
  present-tense "salgo") can still show "regular" here. No badge is guessed for gustar or ser/estar;
  there's no classification data that applies to them.
  `app/speak.ts` centralizes speechSynthesis use (`es-ES`, rate 0.9, prefers a Spanish voice,
  cancels before speaking); tapping a row speaks it and highlights only that row until it ends,
  "Play all" queues the block's rows in order.
- The drawer (`app/drawer.tsx`, opened from the board's hamburger button) now hosts progress &
  history, weekly recap, the mistake notebook, backup & restore, and reset progress — each row
  expands in place to a real, live panel rather than linking to a separate screen. Backup, restore,
  and reset all act on every quiz's and the flashcards' storage keys together, not one at a time.
- The "Progress & history" panel also lists recent rounds (newest first, capped to 15, merged
  across all three quizzes) and a global weak-areas breakdown (`app/history.ts`), the same
  Verb/Tense/Agreement/Subject/Pronoun categorization the old per-quiz app used. Agreement/Subject/
  Pronoun are only recorded for gustar — those fields are constant or repurposed to hold the tense
  for ser/estar and preterite/imperfect, so recording them there would produce misleading
  always-0%-or-100% entries now that weak areas are merged across quizzes.
- Level/verb filters live on the topic detail screen (`app/quiz-filters.ts`, reusing each quiz's
  pre-redesign `filterKey` and `{level, verb}` shape) and scope the round's question pool —
  including "Practise the misses". The topic summary card's accuracy/due numbers stay scoped to
  the whole question bank regardless of the active filter.
- The drawer traps Tab focus within itself while open, moves focus into itself on open, closes on
  Escape or a scrim tap, and returns focus to the hamburger button on close. Its slide-in animation
  is dropped under `prefers-reduced-motion`. Body scroll is locked while it's open.
- After a round, missed questions are recorded to a per-rule mistake notebook (`app/notebook.ts`,
  one entry per grammar point such as "Ser vs estar" or "Gustar pattern: doler") and shown as chips
  on the results screen. "Practise the misses" restarts a round scoped to every currently-missed
  question across the topic's history, not just this round's misses.
- The results screen asks "Did you enjoy this round?" at most once per browser session, and not
  again for a user who answered within the last 7 days (`app/enjoyment.ts`). The Ko-fi panel shows
  only after a positive answer; a negative answer leads to a feedback confirmation with no network
  call (feedback submission is a later phase).
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
