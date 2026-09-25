# Spanish Editorial Learning: Codex handoff

Version 1.0 · 24 September 2026 · Approved light design target; local integration is tracked separately from deployment.

This package fully replaces the previous image-derived proposal. The five sample views shown in the conversation are now the visual reference: Library, Quiz, Flashcards, Results, and Practice options. The original generated image is no longer part of the package.

## Start here

1. Open [reference.html](reference.html) in a browser and explore all five views.
2. Read [CODEX-HANDOFF.md](CODEX-HANDOFF.md) for the implementation brief and source map.
3. Use [tokens.json](tokens.json), [foundations.md](foundations.md), and [components.md](components.md) as the target specification.
4. Complete [review.md](review.md) before claiming a future implementation is finished.

## Authority

This folder defines the approved light appearance and [approved dark palette](dark-preview.md). Root [DESIGN.md](../../DESIGN.md) records the current application mapping and behavior boundaries. [docs/design.md](../design.md) and the older [design-system](../../design-system/readme.md) are historical. The dark preview remains a static reference for the palette now used by the application.

The [UX contract](../../UX-CONTRACT.md), topic configuration, scoring, persistence, and verified product behavior constrain implementation. Sample data and local demo handlers never override them. Resolve behavior conflicts before changing behavior.

Visual authority: accessibility/product constraints → tokens and component contracts → sample appearance. Incidental browser styles and fallback fonts do not override documented values.

## Files

| File | Responsibility |
|---|---|
| `CODEX-HANDOFF.md` | Ready-to-use task, migration map, execution sequence |
| `tokens.json` | Canonical target tokens in a custom JSON format, not DTCG |
| `foundations.md` | Typography, color semantics, geometry, accessibility |
| `components.md` | Shared components, five screen recipes, state contracts |
| `sample-source.html` | Editable conversation specimen |
| `reference.html` | Direct interactive reference for browsers and Codex review |
| `build-reference.mjs` | Regenerates `reference.html` from the editable specimen |
| `samples.html` | Standalone browser export of that specimen |
| `review.md` | Verification record and future acceptance checks |

## Preview boundaries

Samples contain illustrative data and transient local interactions. The header and drawer use the current staging application's three-block logo and “Spanish Quizzes” wordmark. The mobile drawer follows its labels and section order, with sample counts. Settings produce a summary, not a configured quiz. Results are fixtures, not derived from the sample question. No progress is saved or synchronized.

Sample selectors, the rounded outer preview frame, specimen footer, and “Preview” action labels are review scaffolding, not production UI. The direct reference needs network access only for Fraunces and Karla; fallback fonts keep it usable offline. Its icons and interactions are embedded. The optional conversation design-control helper remains only in the specimen source.

The specimen files are presentation references. Application integration occurs in maintained app files; deployment and merging are separate work.
