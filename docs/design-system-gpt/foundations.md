# Foundations

## Color

The following names, roles, and hex values are transcribed from the reference. Use the printed values, not colors sampled from the textured image.

| Token | Value | Reference role | Specification |
|---|---|---|---|
| Teal | `#0F766E` | Primary | Main actions, selected controls, progress |
| Sage | `#16A34A` | Correct | Success accent with a text label; not small white text background |
| Red | `#DC2626` | Incorrect | Incorrect-answer accent; do not use for topic difficulty |
| Gold | `#F59E0B` | Streak / Focus | Highlight with Ink text; never the only keyboard focus indicator |
| Clay | `#C75A3A` | Secondary | Restrained illustration/accent use, not default body text |
| Paper | `#F8EDE1` | Background | Page canvas and quiet surfaces |
| Ink | `#0F172A` | Text | Body text, display text, labels, and icon outlines |
| Muted | `#D6C9B8` | Borders / UI | Decorative separators and tracks; insufficient alone for control boundaries |

Specification extensions, also held in `tokens.json`: surface `#FFFAF3`, on-primary `#FFFFFF`, secondary text `#59534B`, success text `#166534`, error text `#991B1B`, control border `#807366`, selected surface `#E8F3EF`, success surface `#EAF4E6`, and error surface `#FDECE8`.

Use Ink on Paper/Surface, white on Teal, dark success text on success surface, and dark error text on error surface. Do not apply opacity to body text to create hierarchy. Use semantic foreground/background pairs; do not use every swatch interchangeably.

Accessibility target for future implementation: normal text at least 4.5:1, large text at least 3:1, meaningful boundaries and focus indicators at least 3:1 against adjacent colors. Gold and Muted need particular care. Every correct/incorrect state also needs an icon and text. Contrast results are recorded in [review.md](review.md).

## Typography

**Reference:** Fraunces for page titles, key moments, deck titles, and scores. Karla for UI, buttons, labels, answer options, and body text. Font sizes and weights are not supplied by the image.

**Specification:** use the following responsive scale. Preserve Spanish accents, inverted punctuation, and readable line breaks. Do not truncate exercises or answer options.

| Role | Family | Size / line height | Weight |
|---|---|---|---|
| Hero prompt / score | Fraunces | 36–48px / 1.12 | 600 |
| Page / topic heading | Fraunces | 28–36px / 1.15 | 600 |
| Card title | Fraunces | 24px / 1.2 | 600 |
| Section label | Karla | 18px / 1.3 | 700 |
| Body / answer / button | Karla | 16px / 1.5 | 400 body, 600 action |
| Metadata / badge | Karla | 14px / 1.4 | 400 metadata, 700 badge |

Fallbacks: `Fraunces, Georgia, serif` and `Karla, system-ui, sans-serif`. Font files and loading strategy are future implementation concerns; keep layout stable during loading. Support text zoom without clipping. Use tabular numerals for scores and counts where supported. UI prose is English in the reference; learning content is Spanish. Mark Spanish passages with the appropriate language in a future implementation.

## Spacing and layout

**Reference:** mobile gutter 16px, desktop gutter 20px, card padding 20–24px, section gap 24px. The board's breakpoint captions are ambiguous; they do not establish a reliable responsive rule.

**Specification:** a 4px base scale: 4, 8, 12, 16, 20, 24, 32, 48. Use 8px within related controls, 12px between answer rows, and 24px between sections. Use 20px card padding on small screens and 24px when space permits.

- Up to 767px: one column, 16px outer gutter. No sideways page scrolling at 320px.
- From 768px: 20px minimum outer gutter. Center exercises at a proposed maximum width of 640px; a topic library can expand to 1120px and use a grid.
- Those breakpoints and widths are extensions, not measurements from the image. Verify 767px and 768px when adopted.
- Use natural document scrolling. Do not copy phone frames, device status bars, or board shadows into the product.
- Long prompts wrap at spaces. Cards grow with content. Keep the primary action visible through scrolling, not by clipping content to a phone-sized frame.
- A sticky action footer, if later used, needs safe-area padding and must not cover focused controls or content when a keyboard opens.

## Shape and elevation

**Reference:** standard card radius 14px. Editorial card radii `18px 26px 14px 26px` in CSS clockwise order: top-left, top-right, bottom-right, bottom-left. Editorial cards are reserved for quiz, results, and flashcard key surfaces.

**Specification:** controls use 10px radius, badges 8px, progress tracks a full pill radius. Use a quiet 1px border. Give only the active learning surface a subtle shadow, proposed `0 4px 14px rgb(15 23 42 / 8%)`. Topic rows and settings panels remain mostly flat. Avoid stacking multiple strongly elevated panels.

## Iconography and illustration

The reference uses a leaf sprig on featured topics and simple subject illustrations: architecture, a heart, signposts, and a book. Use a consistent hand-drawn outline, limited clay/olive/gold fills, and ample blank space. Keep illustrations off answer rows and feedback copy.

Decorative art has empty alternative text. Topic labels must communicate the topic without the illustration. Functional icons such as close, back, audio, check, and chevron share one coherent stroke style. Their visible glyph may be 20–24px, but the control is at least 44 by 44px. Icon-only controls need accessible names; audio controls never autoplay.

## Motion and focus

Motion is not specified by the static board. Proposed transitions: 120ms for hover/pressed feedback and 180ms for a reveal. Avoid 3D flips that hide text or move action controls. Respect reduced motion by removing nonessential transitions and confetti.

Proposed keyboard focus: a 3px Teal outline with 3px light separation. Ensure contrast on both light surfaces and Teal actions. Do not use Gold alone as a focus ring. Disabled controls expose their disabled state and cannot activate; busy actions retain width and announce status.
