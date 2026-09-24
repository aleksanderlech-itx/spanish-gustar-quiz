# Acceptance and verification

## Package verification

Check JSON parsing, internal links, source/export presence, token/document agreement, and absence of runtime changes. Open the direct `reference.html` at desktop and narrow widths; exercise quiz feedback, reveal gating, topic navigation, and settings summary. This is specimen evidence, not production regression coverage.

Direct reference verified on 24 September 2026: quiz correct-answer feedback appeared; flashcard recall was disabled before reveal and enabled afterward; settings summarized the selected five-question option. At 320px, document scroll width stayed within the viewport. The direct page contains its own icons and works without the conversation iframe wrapper. Fraunces and Karla load from Google Fonts when online; fallback stacks apply offline.

Drawer verified against the [live staging application](https://staging.spanish-quizz.es/) on 24 September 2026 at a 390px viewport. The reference reproduces its menu labels, ordering, summary, accordion sections, links and theme-control placement. Browser checks confirmed single-section expansion, Escape dismissal, disabled data actions, and no horizontal overflow at 390px. Live staging and this repository checkout differ; this is a design reference, not a claim that the checkout currently has a drawer.

Export verified 24 September 2026: all five views opened; correct-answer feedback appeared; recall was disabled before reveal and enabled afterward; results rendered; settings produced the selected-session summary. Export appearance was inspected in a browser. JSON, local links, and specimen JavaScript syntax checks passed. Application lint/build/tests were not run because application code is unchanged.

## Known specimen limits

No backend, durable progress, synchronization, full quiz engine, actual mistake queue, or Leitner implementation. Fixed totals do not update from the single sample question. Browser-default focus and hover filtering are illustrative; the explicit foundation contract governs production. No dark palette, desktop shell, or full loading/error gallery is supplied. Fonts/icons require network access.

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
- Preserve supported topics/options, grading, submission, recall gating, Leitner scheduling, migrations, storage and synchronization.
- Verify radios, checkboxes, disclosures, speech, reveal, overlays and navigation with keyboard only. Check labels, announcements and focus restoration.
- Test 320/360/380/390px, 767/768px, existing 819/820/821px boundaries, desktop, 200% zoom and open mobile keyboard. No horizontal page overflow or hidden controls.
- Exercise correct/wrong/empty answers, empty filters, zero progress, perfect results, mistake review, unavailable audio and sync failure.
- Preserve functional dark mode; verify contrast before adopting any new dark mapping.
- Respect reduced motion and stable layout during font loading and feedback.
- Run lint, typecheck, tests/build; report actual outcomes.
- Reconcile root visual docs only when the new UI is implemented. Document deviations explicitly.
