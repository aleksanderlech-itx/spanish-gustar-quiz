# Foundations

## Identity

A warm Spanish study notebook: Paper surfaces, Ink text, Teal actions, Fraunces learning headings, Karla controls. The sample views use small outline topic icons rather than the original board's botanical illustrations. Decoration stays secondary to practice.

The product logo retains the live application's identity: a 24px three-block mark followed by the Fraunces wordmark “Spanish Quizzes” with an 8px gap. Its 34 × 34 SVG viewBox contains a wide top block (`x=2 y=2 width=30 height=12`) and two lower blocks (`x=2` and `x=19`, `y=18`, `width=13 height=14`). All three use a 2.5-unit Ink stroke. Keep its live brand colors `#00625D` (top), `#C4553F` (lower left), `#F2A81D` (lower right), and `#2C2B29` (stroke) even when the surrounding target palette differs. Treat the SVG as decorative when adjacent wordmark text supplies the accessible name.

## Colors

`tokens.json` is the canonical target source. Map semantic roles once into existing runtime variables. Do not import the preview stylesheet wholesale.

| Role | Value | Use |
|---|---|---|
| paper | `#F8EDE1` | Canvas |
| surface | `#FFFAF3` | Cards and controls |
| ink | `#0F172A` | Main text |
| primary / onPrimary | `#0F766E` / `#FFFFFF` | Actions and action text |
| secondaryText | `#59534B` | Supporting text |
| border | `#D6C9B8` | Decorative rules, tracks |
| controlBorder | `#807366` | Meaningful control boundaries |
| selectedSurface | `#E8F3EF` | Selected answer |
| successText / successSurface | `#166534` / `#EAF4E6` | Correct feedback |
| errorText / errorSurface | `#991B1B` / `#FDECE8` | Incorrect feedback |
| gold | `#F59E0B` | Level badges with Ink text |
| clay | `#C75A3A` | Decorative topic icons |
| segmentTrack | `#E8DED1` | Segmented-control backing |

Gold is not a focus ring. Pale border is not the sole outline for an input. Correctness needs visible text, not color alone. The old image's bright-green success fill is not part of this target.

## Typography

| Role | Family | Size / line height | Weight |
|---|---|---|---|
| Product name | Fraunces | 19px / 1.15; 18px at ≤380px | 600 |
| Page heading | Fraunces | 32px / 1.15 | 600 |
| Topic/card heading | Fraunces | 24px / 1.2 | 600 |
| Spanish question | Fraunces | 42px / 1.12; 36px at ≤380px | 600 |
| Flashcard term / score | Fraunces | 48px / 1.15 | 600 |
| Section label | Karla | 18px / 1.3 | 700 |
| Body / action | Karla | 16px / 1.5 | 400 / 600 |
| Metadata / badge | Karla | 14px / 1.5 | 400 / 700 |

Fallbacks: Fraunces → Georgia, serif; Karla → system-ui, sans-serif. Heading tracking -0.7px; question tracking -1px; eyebrow tracking 0.06em. Eyebrows are short uppercase labels. Preserve accents and punctuation, mark Spanish passages `lang="es"`, and wrap learning text naturally. Hard-coded sample line breaks are not language rules.

## Geometry

- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 48, 64px.
- Mobile gutter 16px; wide gutter at least 20px; related items 8–12px apart; sections 24px apart.
- Card padding 20px, reducing to 16px at ≤380px when necessary.
- Standard card radius 14px; editorial corners 18px 26px 14px 26px clockwise from top-left.
- Controls 10px radius; badges and selected segments 8px; progress track 6px high with pill corners.
- Minimum touch target 44px; answer rows at least 48px and grow with content.
- Active-surface shadow: `0 4px 14px rgb(15 23 42 / 8%)`. Supporting surfaces remain quiet.
- The 440px specimen frame and its 24px radius are preview scaffolding.
- Production extension: center exercise content up to 640px; library up to 1120px with a grid from 768px when cards fit. Desktop app layout is not shown by the samples.
- Use natural document scrolling. Headers wrap. No phone-sized fixed-height clipping, hidden answers, or actions covered by the mobile keyboard.

## Icons and accessible states

Use consistent 20–24px outline icons: landmark, heart, signpost, book, check, and arrow. Decorative icons are hidden from assistive technology. Icon actions need accessible names and 44px targets. Reuse maintained assets before adding dependencies.

Use semantic native controls. Target focus: 3px Teal ring, 3px separating gap, contrast checked on adjacent surfaces. The specimen uses browser defaults in places; the explicit focus contract governs production.

Provide hover, focus, pressed, disabled, and busy states. Disabled controls cannot activate; busy actions keep their dimensions. Feedback transitions may use 120ms, reveal 180ms; remove nonessential motion under reduced-motion preferences. Audio does not autoplay.

Normal text contrast ≥4.5:1; large text and meaningful non-text boundaries ≥3:1. Keep visible labels, error associations, live status updates, predictable keyboard order, and focus restoration. No essential hover-only content.

## Themes

This target defines the approved light appearance. A separate [dark proposal](dark-preview.md) exists for review and is not approved production styling. Preserve the existing functional dark theme until that proposal is approved. Do not disable the theme toggle or force light colors into dark mode.
