# Spanish Editorial Learning implementation handoff

## Authority

The [reference](reference.html), [tokens](tokens.json), [foundations](foundations.md) and [components](components.md) define the approved **light** appearance. They do not supply app data or handlers. The [approved dark palette](dark-preview.md) is also implemented. [Root DESIGN.md](../../DESIGN.md) maps both themes to the current runtime. [UX-CONTRACT.md](../../UX-CONTRACT.md), current source and tests govern behavior.

The package was authored against an earlier snapshot. The current application already has a drawer, logo component, dedicated round/results/topic-detail screen components and device-local progress. Do not restore removed synchronization or sign-in, add sample totals, or create duplicate navigation.

## Current source map

| Owner | Responsibility |
|---|---|
| `app/layout.tsx` | Stylesheet order and pre-paint theme handling |
| `app/quiz-layout-fix.css` | Shared semantic tokens and both current theme palettes |
| `app/editorial-polish.css` and `app/activity-chrome.css` | Screen-level visual treatment after the base layers |
| `app/quiz-selector.tsx`, `app/topic-detail.tsx` | Library and Practice options |
| `app/round.tsx`, `app/results.tsx` | Quiz, immediate feedback and results |
| `app/flashcards.tsx` | Reveal, speech, visible recall labels and four-box scheduling |
| `app/drawer.tsx`, `app/logo.tsx` | Menu behavior and fixed-color three-block brand mark |

Inspect all stylesheet imports in `app/layout.tsx` and reconcile specificity in their existing order. Runtime colors belong in `app/quiz-layout-fix.css`. The older `design-system/` tokens are historical and should not be copied over the approved target.

## Visual and behavior boundary

Use Fraunces for learning display text and Karla for controls and supporting text. Target exercise content max 640px and library max 1120px, with a library grid from 768px where cards fit. Preserve natural scrolling, 44px targets, focus indication, keyboard-safe actions, reduced motion and theme persistence. Keep the logo's fixed `#00625D` / `#C4553F` / `#F2A81D` fills and `#2C2B29` stroke in both themes.

Retain all six activities, IDs and URLs, supported filters, saved options, Choose/Type grading, immediate answer feedback, round-end history writes, skip behavior, chart/help, saved historical mistakes, backups and local storage. Four Leitner boxes use due-first ordering and immediate recall persistence. Recall buttons show a symbol plus “Again” / “Got it”, gated by reveal. Perfect current rounds do not erase historical mistake practice.

## Verification

Use the [review checklist](review.md) with real app data. Run `npm run lint`, `npx tsc --noEmit` and `npm test` in the repository's supported Node/Bash environment. Inspect desktop/mobile light and dark views; the static specimen is not regression coverage.

## Maintaining the reference

`sample-source.html` is the editable specimen. If it changes, run `node docs/design-system-gpt/build-reference.mjs` and inspect all five direct reference views. The outer frame, selectors, fixed counts and demo handlers never become product UI.
