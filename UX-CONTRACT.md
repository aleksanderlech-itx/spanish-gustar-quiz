# Spanish Quiz Studio UX Contract

This contract records the observable behavior shared by the grammar quizzes and flashcards.

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | Native select in `app/page.tsx` | `DESIGN.md` and this contract | Native | Keyboard and narrow viewport |
| Form | Quiz form in `app/page.tsx` | This contract | Grammar answer form | Unit tests and production build |

## Navigation and progress

- The quiz library is the common entry point. Opening a quiz preserves its own progress namespace.
- Grammar answers are saved at round submission. Flashcard recall is saved immediately after each assessment.
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
