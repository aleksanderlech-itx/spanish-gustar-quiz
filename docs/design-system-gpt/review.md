# Acceptance and verification

The package checks below record the 24 September specimen inspection. They do not certify the application integration. The separate [dark palette](dark-preview.md) was approved and implemented on 25 September. Record production browser and test results separately after implementation.

## Package verification

Check JSON parsing, internal links, source/export presence, token/document agreement, and absence of runtime changes. Open the direct `reference.html` at desktop and narrow widths; exercise quiz feedback, reveal gating, topic navigation, and settings summary. This is specimen evidence, not production regression coverage.

Direct reference verified on 24 September 2026: quiz correct-answer feedback appeared; flashcard recall was disabled before reveal and enabled afterward; settings summarized the selected five-question option. At 320px, document scroll width stayed within the viewport. The direct page contains its own icons and works without the conversation iframe wrapper. Fraunces and Karla load from Google Fonts when online; fallback stacks apply offline.

Drawer verified against the [live staging application](https://staging.spanish-quizz.es/) on 24 September 2026 at a 390px viewport. The reference reproduces its menu labels, ordering, summary, accordion sections, links and theme-control placement. Browser checks confirmed single-section expansion, Escape dismissal, disabled data actions, and no horizontal overflow at 390px. This was a specimen comparison at that date. The current checkout has a real drawer; inspect it directly for production behavior.

Export verified 24 September 2026: all five views opened; correct-answer feedback appeared; recall was disabled before reveal and enabled afterward; results rendered; settings produced the selected-session summary. Export appearance was inspected in a browser. JSON, local links, and specimen JavaScript syntax checks passed. Application lint/build/tests were not run because application code is unchanged.

## Known specimen limits

The specimen has no backend, durable progress, full quiz engine, actual mistake queue, or Leitner implementation. Fixed totals do not update from the single sample question. Browser-default focus and hover filtering are illustrative; the explicit foundation contract governs production. The five-view light reference has no dark palette, desktop shell, or full loading/error gallery; the approved dark palette has its own static six-panel board. Fonts/icons in the light specimen require network access.

## Contrast baseline

Opaque sRGB pairs, calculated from target hex values:

| Pair | Ratio | Use |
|---|---|---|
| Ink / Paper | 15.47:1 | Normal text |
| White / Primary | 5.47:1 | Action text |
| Secondary text / Paper | 6.58:1 | Supporting text |
| Success text / Success surface | 6.31:1 | Feedback |
| Error text / Error surface | 7.26:1 | Feedback |
| Control border / Paper | 3.99:1 | Non-text boundary |
| Ink / Gold | 8.31:1 | Badge text |
| Gold / Paper | 1.86:1 | Fails standalone focus |
| Border / Paper | 1.41:1 | Decorative only |

Recheck actual rendered combinations, transparency, adjacent colors, and theme states.

## Future implementation acceptance

- Five screen recipes use shared tokens, typography and components.
- No specimen tabs, outer preview frame, sample footer, fixture totals, or “Preview” action labels leak into production.
- Preserve all six activities, supported options, grading, immediate feedback, recall gating, four-box scheduling, migrations, device-local storage and backup formats.
- Verify single-choice controls, disclosures, speech, reveal, overlays and navigation with keyboard only. Check labels, announcements and focus restoration.
- Test 320/360/380/390px, 767/768px, existing 819/820/821px boundaries, desktop, 200% zoom and open mobile keyboard. No horizontal page overflow or hidden controls.
- Exercise correct/wrong/empty answers, empty filters, zero progress, perfect results with saved historical misses, mistake review, unavailable audio and storage failure.
- Verify the approved dark colors, contrast, theme reload and control states in production screens.
- Respect reduced motion and stable layout during font loading and feedback.
- Run lint, typecheck, tests/build; report actual outcomes.
- Keep root visual docs aligned with implemented UI. Document intentional deviations explicitly.
