# Codex implementation brief

## Ready-to-use task

> Implement Spanish Editorial Learning using `docs/design-system-gpt` as the visual target. Read its README, tokens, foundations, components, and checklist; inspect all five views in `reference.html`. Adapt the existing application through maintained styling and components. Preserve topic configuration, grading, persistence, synchronization, routing, flashcard reveal/assessment order, and Leitner scheduling. Specimen data and local handlers are demonstration-only. Verify responsive layouts, keyboard operation, contrast, empty/error states, and existing dark-theme behavior. Reconcile root design documentation with the actual result. Commit meaningful units on the authorized branch. Do not push, merge, or deploy unless requested.

This is a future task brief. Packaging it does not start implementation.

## Read order and authority

Inspect workspace instructions, branch, dirty files, and canonical location first. Read this folder as the target, then root `DESIGN.md`, `docs/design-system.md`, `UX-CONTRACT.md`, and actual source as current-state evidence. Preserve verified business behavior; report conflicts between documented and runtime behavior before changing it.

## Source map

| Owner | Work |
|---|---|
| `app/layout.tsx` | Fraunces/Karla font loading and CSS import tracing |
| `app/globals.css` | Structural styles, controls, accessibility, responsive rules |
| `app/issue-5-design.css` | Intermediate visual overrides; adapt or consolidate deliberately |
| `app/quiz-layout-fix.css` | Final palette/layout and dark styles |
| `app/quiz-selector.tsx` | Library, topic rows, real studied counts and URLs |
| `app/page.tsx` | Quiz, filters, feedback/results, help, history and synchronization |
| `app/flashcards.tsx` | Flashcard, speech, reveal, recall, completion |
| `app/quiz-config.ts`, `app/quiz-logic.ts`, data modules | Preserve IDs, supported filters, evaluation and namespaces |

Cascade: globals → issue-5-design → quiz-layout-fix. Inspect specificity and source order; do not solve this by adding a fourth blanket override sheet. No separate topic-detail/results/settings routes exist in this snapshot; use current composition unless a future task requests routing changes.

The reference drawer was modeled on the current [staging application](https://staging.spanish-quizz.es/). This checkout does not contain that drawer. When implementing, inspect the current canonical checkout and deployed navigation again; reconcile source drift before adding a duplicate menu. Preserve real progress, backup, reset, help links and theme functions rather than adopting the specimen's disabled placeholders.

## Live product logo

Use the staging application's three-block mark and “Spanish Quizzes” wordmark in both the application header and mobile drawer. The mark is 24px with an SVG `viewBox="0 0 34 34"`. Draw three rectangles: top `x=2 y=2 width=30 height=12 fill=#00625D`; lower left `x=2 y=18 width=13 height=14 fill=#C4553F`; lower right `x=19 y=18 width=13 height=14 fill=#F2A81D`. Give each rectangle a `#2C2B29` stroke of `2.5`. Set the wordmark in Fraunces 600 at `19px / 1.15`, or 18px at widths ≤380px, with an 8px gap from the mark. Hide the SVG from assistive technology when the adjacent wordmark supplies the name.

Keep these live brand colors even where the surrounding target palette differs. Use [foundations.md](foundations.md) for typography and composition, and [tokens.json](tokens.json) for the brand values. The staging/source drift noted above also applies to this logo: inspect the current application before implementing, then reuse its logo component if present rather than duplicating it.

## Token mapping

The JSON is a custom handoff schema with CSS-ready values. Map roles once: `color.paper` → existing `--paper`, `color.primary` → `--primary`, `color.secondaryText` → secondary-text variable, `color.border` → `--line`. Map by semantics, not just spelling: controlBorder is stronger than decorative border; feedback foreground/background pairs are separate.

Load actual Fraunces 400/600 and Karla 400/600/700 faces through maintained font delivery. Reuse existing behavior owners and extract shared visual primitives only where useful. Do not import the specimen wrapper or event handlers into production.

## Implementation units

1. Establish token/font mapping and update representative controls and exercise surfaces. Verify light and existing dark behavior.
2. Apply library/topic/options hierarchy around supported configuration.
3. Apply quiz, feedback, flashcard, and results patterns around existing state transitions.
4. Run meaningful regression checks and the scenario checklist.
5. Update root DESIGN.md and the implementation snapshot to describe the result, recording intentional deviations.

Preserve quiz IDs, storage keys, backup formats, sync, save timing, and Leitner migration. Do not rename user data to match presentation labels.

## Verification

Recheck package scripts before running. Inspected 24 September 2026:

```text
npm run lint
npx tsc --noEmit
npm test
```

`npm test` runs the build and Node tests. The build already includes artifact validation; do not repeat it without a reason. Node ≥22.13.0, Bash, and GNU timeout are prerequisites for the maintained scripts. On Windows use the supported Bash environment for POSIX scripts, including development startup. Report blocked checks accurately.

Exercise `review.md` scenarios in a real browser. No deploy or release is included.

## Maintaining samples

`sample-source.html` is the editable conversation fragment. Run `node docs/design-system-gpt/build-reference.mjs` after edits to regenerate the direct `reference.html` and verify all five views. `samples.html` is the earlier conversation export and can be regenerated with the installed visualize skill's `scripts/render.py` if needed. The optional host Tweak helper is guarded in the fragment and removed from the direct reference. Neither specimen nor renderer becomes an application dependency. Keep tokens authoritative; preview CSS duplicates a subset for presentation.
