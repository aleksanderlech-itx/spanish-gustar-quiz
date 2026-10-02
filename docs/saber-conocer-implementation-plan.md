# Saber vs Conocer quiz — implementation plan

New fill-in-the-blank activity at `/saber-vs-conocer`, built on the same pattern
as ser/estar, por/para and object pronouns (`af3a76a`, `6c21443`, `a167275`).

## Decisions

| Topic | Decision |
| --- | --- |
| Tenses | Mostly present, plus a past group for meaning shifts (supe = found out, conocí = met; sabía/conocía = knew) |
| Second filter | "Usage" category (like object pronouns' "Pronoun type") |
| Reference | Real six-pronoun conjugation chart for saber and conocer per covered tense, also reachable from "Stuck?" mid-round |
| Notes post | Separate PR later |

## Stage 1 — Question bank (`app/saber-conocer-data.ts`)

- 150 questions, IDs `6001 + index` (`tests/content-quality.test.mjs` enforces 150).
- Seed row shape as ser/estar: `[before, after, answer, alternateAnswer, en, level, explanation]`
  plus the usage category, stored in `infinitive` so the existing filter scopes by it.
  The alternate is the other verb in the same person and tense (sé / conozco).
- `tense` is `present`, `preterite` or `imperfect`, so the chart can scope to it.
- Usage categories (≈ count):
  - Facts — saber + information, que/si/question word (~30)
  - Skills — saber + infinitive (~20)
  - People — conocer + personal a (~25)
  - Places — conocer + place (~20)
  - Familiarity — conocer + a work, a field, a thing (~20)
  - Past meaning shift — supe/conocí vs sabía/conocía (~35)
- Levels spread across basic / intermediate / advanced.
- Export `SABER_CONOCER_QUESTIONS`, `SABER_CONOCER_FORMS`, `SABER_CONOCER_USAGES`,
  `SABER_CONOCER_CONJUGATIONS`.
- Ten representative questions go to review before the full bank is written
  (TEMPLATE-HANDOVER.md).
- Tests: new `tests/saber-conocer-data.test.mjs`; add the bank to `content-quality.test.mjs`.

## Stage 2 — Register the activity

- `app/quiz-config.ts`: `"saber-conocer"` id, slug `saber-vs-conocer`, config entry
  (A1–B1, `saber-conocer-quiz-progress-v1`, `saber-conocer-quiz-filters-v1`,
  `spanish-saber-conocer-quiz-progress.json`, rule card,
  `filterLabel: { label: "Usage", all: "All usages" }`).
- `app/quiz-content.ts`: explainer paragraphs, examples, FAQ.
- `app/saber-vs-conocer/page.tsx`: route, metadata, Quiz + FAQ JSON-LD.
- Hardcoded touchpoints:
  - `proxy.ts` `isQuizId`
  - `app/round.tsx` `answerChoicesFor` → two options (answer + alternate)
  - `app/notebook.ts` `ruleLabelFor` → `Saber vs conocer: <usage>`
  - `app/verb-chart.tsx` `blocksFor` → saber and conocer paradigms for the question's tense
  - `app/quiz-selector.tsx` `TOPIC_ICON_PATHS` → new icon
- Derived automatically: activity registry, streak, llms.txt, sitemap, board.

## Stage 3 — Copy and docs

- `README.md`, `app/about/page.tsx` quiz lists; `UX-CONTRACT.md` chart section.
- `tests/notebook.test.mjs`: new rule label; `tests/verb-chart.test.mjs`: chart blocks.

## Stage 4 — Verify and ship

- `npm run lint`, `npm test`.
- PR into `main`; share PR link and preview link.
- No production deploy without an explicit greenlight.
