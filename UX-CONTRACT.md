# Spanish Quiz Studio UX Contract

This contract records the observable behavior shared by the grammar quizzes and flashcards.

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | Native select in `app/page.tsx` | `DESIGN.md` and this contract | Native | Keyboard and narrow viewport |
| Form | Quiz form in `app/page.tsx` | This contract | Grammar answer form | Unit tests and production build |

## Navigation and progress

- The quiz library is the common entry point. Opening a quiz preserves its own progress namespace.
- Grammar answers are saved at round submission. Flashcard recall is saved immediately after each assessment.
- Flashcards marked `Still learning` are prioritized in the next round, followed by unseen cards and then remembered cards.
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
