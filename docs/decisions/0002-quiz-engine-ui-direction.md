# 0002. Quiz engine UI direction

- Status: Accepted
- Date: 2026-08-11
- Source: decided before the repository recorded decisions. The record was
  added to the repo in [#46](https://github.com/aleksanderlech-itx/spanish-gustar-quiz/pull/46)
  as `docs/design-decisions/DESIGN_DECISION_QUIZ_UI.md`.

## Context

The app is a reusable quiz engine, not a page for only one grammar topic. The
design must support different Spanish lessons while keeping the active
question visually dominant.

## Decision

Use the Citrus Graph theme and the redesigned quiz-engine layout as the
product direction for the Spanish quiz app.

### Theme

- Main light theme: Citrus Graph
- Dark theme: Harbor Night
- Typeface: Atkinson Hyperlegible
- Primary action color: teal `#1d5c73`
- Primary dark-mode action color: warm blue `#56b6f7`
- Success/progress color: lime `#bfd52f`
- Dark-mode success color: cyan-green `#5fe0c5`

### Layout direction

The question section is the main focus of the page. It should be the only
strongly elevated card. Topic setup, progress, and review queue are supporting
sections and should stay flatter, quieter, and lower contrast.

The app is mobile first. The header stays compact, with the app title treated
as context rather than the main headline. The quiz sentence should stay
readable but not oversized.

### Required UI elements

- Compact app header
- Dark-mode switch in the header
- Topic selector
- Round filters
- Solid progress bar, no gradient
- Question card with sentence-building slots
- `Choose` / `Type` answer mode switch
- Typed-answer input
- Multiple-choice answer grid
- Rule feedback panel
- Back / Next controls with moderate font weight
- Progress summary
- Weak areas
- Review queue

### Reference artifacts

- `outputs/quiz-engine-redesign.html`
- `outputs/quiz-engine-theme-previews.html`

These files were never committed to the repository.

## Consequences

- Every new topic reuses the same layout and theme instead of a topic-specific
  design.
- Only the question card is strongly elevated. New supporting sections stay
  flat and low contrast.
- Atkinson Hyperlegible improves readability for language-learning content,
  especially sentence comparisons and short answer choices.
