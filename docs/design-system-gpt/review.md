# Design review and adoption

## What works

- Fraunces and Karla separate learning content from interface controls without introducing multiple competing type systems.
- Paper, Ink, and Teal create a clear hierarchy across library, quiz, flashcards, results, and topic detail.
- Repeated buttons, answer rows, badges, and progress treatments can become shared components.
- Topic illustration adds recognition without requiring imagery inside exercises.
- Results point toward reviewing mistakes, giving the score a useful next step.

## Corrections captured in this specification

| Reference issue | Required treatment |
|---|---|
| Flashcard shows assessment controls while still saying `Tap to reveal` | Gate recall assessment behind reveal, preserving the repository contract. |
| Quiz says `7 of 10`, while bar appears roughly two-fifths filled and offset from the start | Use one data source for label and fill; define whether the count represents current question or completed answers. |
| B1 appears in both red and gold | Reserve Red for incorrect/error states; give difficulty a consistent neutral treatment. |
| Tiny labels and controls in the phone composition | Use the specified readable scale, 44px targets, wrapping, and zoom support. |
| Gold labeled `Focus`, and pale Muted borders | Use a contrast-safe keyboard ring and stronger borders for meaningful control boundaries. |
| Results mix Ser/Estar categories with the neighboring Gustar examples | Treat the five screens as illustrations; derive feedback from the active topic. |
| Generated texture, shadows, and device frames | Use clean reusable surfaces; omit device chrome and board presentation effects. |
| Ambiguous breakpoint captions | Mark responsive values as proposed extensions; test the actual application breakpoints on adoption. |

## Relationship to the repository

At the time of documentation, root `DESIGN.md` specifies Citrus Graph/Harbor Night, Atkinson Hyperlegible, an 8px radius, and a different palette. This reference proposes Spanish Editorial Learning, Fraunces/Karla, and 14px/asymmetric cards. Do not silently overwrite the existing contract or describe this candidate as already deployed.

The existing UX contract retains authority over per-quiz progress, round submission, flashcard reveal, Leitner scheduling, and local recovery. Reference screenshots do not authorize changing these rules.

Before later implementation, trace actual CSS import order, runtime variables, shared controls, and theme handling. Keep this folder's `tokens.json` as the candidate token source; map it once into existing runtime owners rather than adding an unrelated override layer. Root contract reconciliation and runtime changes belong in the same future adoption change.

Read-only repository inspection found existing drift:

| Concern | Current evidence | Adoption implication |
|---|---|---|
| Cascade | `app/layout.tsx` imports globals, then issue-5-design, then quiz-layout-fix CSS | Audit final computed values, not globals alone. |
| Effective light colors | `app/quiz-layout-fix.css` defines Paper `#F4F7F4`, Ink `#10222A`, Primary `#086B56`, Success `#08745A`, Danger `#A64646` | Both the root document and reference differ from effective styles. |
| Fonts | `app/layout.tsx` loads Atkinson Hyperlegible, 400/700 | Fraunces/Karla adoption requires an explicit font change. |
| Radius | `app/issue-5-design.css` defines shared radius 16px; root document says 8px | Reconcile ownership before introducing reference card shapes. |
| Themes | `app/quiz-layout-fix.css` includes a dark palette | Retain theme behavior; this light-only reference supplies no dark replacement. |
| Phone breakpoint | Existing CSS uses max-width 767px | Proposed 768px wide layout follows the existing boundary. |

Source inspection is evidence of declared styles, not a live-screen or computed-style audit. No root contract or application stylesheet was edited.

## Verification for this documentation

Validate JSON syntax, internal links, reference-image presence, exact source palette and radius transcription, and contrast of proposed text/control pairs. Check the diff contains only this folder. No application tests or deployment are needed to validate a documentation-only change, and no runtime accessibility conformance is claimed.

Verification completed on 23 September 2026: JSON parsed successfully; all local Markdown links resolved; the original PNG was opened and visually inspected. Contrast was calculated from the exact sRGB hex values using relative luminance:

| Pair | Ratio | Use |
|---|---|---|
| Ink / Paper | 15.47:1 | Normal text |
| White / Teal | 5.47:1 | Primary action text |
| Secondary text / Paper | 6.58:1 | Supporting text |
| Success text / Success surface | 6.31:1 | Correct-answer feedback |
| Error text / Error surface | 7.26:1 | Incorrect-answer feedback |
| Control border / Paper | 3.99:1 | Meaningful control outline |
| Ink / Gold | 8.31:1 | Badge text |
| White / Sage | 3.30:1 | Fails normal text; use dark success text on light success surface |
| Gold / Paper | 1.86:1 | Fails a standalone focus indicator |
| Muted / Paper | 1.41:1 | Decorative only, not a sole control boundary |

These checks validate opaque color pairs only. Gradients, texture, opacity, theme changes, and adjacent colors require fresh checks in a rendered implementation. No runtime UI was implemented or tested.

## Future adoption checklist

- Reconcile root visual contract, existing CSS, font loading, and light/dark theme ownership.
- Keep all scoring, topic configuration, progress namespaces, and spaced-repetition semantics intact.
- Verify all five flows using actual data, including zero progress, perfect score, mistakes, empty filters, and long Spanish content.
- Verify radio groups, checkboxes, disclosures, audio, reveal, overlays, focus restoration, and keyboard-only navigation.
- Check at 320px, 390px, 767px, 768px, and desktop widths; include 200% zoom and an open mobile keyboard.
- Validate computed foreground/background contrast, not just isolated palette swatches.
- Exercise loading, disabled, error, offline, reduced-motion, and both supported application themes.
- Compare screenshot results against the original board for hierarchy and tone, with documented accessibility corrections taking precedence.

Dark-theme values, final illustration assets, exact desktop composition, and unsupported practice-option combinations remain adoption decisions. The source contains no specifications for those areas.
