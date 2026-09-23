# Spanish Quizzes Design System

**Warm paper, hard edges, bright Spanish light.**

Spanish Quizzes is a mobile-first Spanish learning
app: grammar quizzes — gustar, ser vs estar, preterite vs imperfect, por vs para — in Choose or Type
mode, plus a spaced-repetition flashcard deck on a four-box Leitner ladder. The product is one
surface, a phone-first web app.

The visual identity is **Editorial Boutique**: teal and terracotta on
warm paper, Fraunces over Karla, 2px ink borders and solid 4px offsets instead of soft shadows.
The accent range is widened with sun gold and sage so progress reads at a glance in both themes.
Light and dark are equal citizens.

## Sources and ownership

This folder is the one design system for `aleksanderlech-itx/spanish-gustar-quiz` (branch `main`).
It is derived from the repo and does not introduce values of its own:

- **Colour tokens** mirror `app/quiz-layout-fix.css` (`:root` and `:root[data-theme="dark"]`),
  which stays the runtime source of truth for the live app. `tokens/colors.css` repeats those values
  name for name, including the legacy aliases (`--primary-dark`, `--success`, `--accent`,
  `--paper-white`, `--quiz-surface`, `--footer`, `--hard-shadow`).
- **Type, spacing and shape** come from `docs/design.md` and `DESIGN.md`.
- **Behaviour** (Leitner boxes, recall buttons, round flow, drawer) comes from `UX-CONTRACT.md`.
- **Brand mark** is `public/brand/` and `app/logo.tsx`, copied to `assets/brand/`.

If a value changes in the repo, change it in `app/quiz-layout-fix.css` first, then here. `github.md`
records the last sync and which files map to what.

### Adding this folder to the repo

Commit it as `design-system/` at the repo root, so its `readme.md`, `styles.css` and `SKILL.md`
don't collide with the repo's own `README.md` and app files. Leave out the generated indexes `_ds_manifest.json` and `_adherence.oxlintrc.json`; keep `_ds_bundle.js`,
which the preview pages need in order to render. Nothing in `app/` imports this
folder, so the live app is unaffected. Point `DESIGN.md` and `docs/design.md` at `design-system/`
so there is one reference.

## Content fundamentals

**Voice.** Plain, warm, unhurried. It sounds like a good tutor who does not fuss: *"Buenos días,
Alek." / "3 cards due today." / "Best round yet on ser vs estar."* Short declaratives. No
exclamation marks, no cheerleading, no gamified hype.

**Person.** Second person for instructions to the learner (*"Type the verb"*, *"Tap to reveal"*),
first person only inside Spanish example sentences (*"Perdí el hilo de la conversación."*). The app
never refers to itself as "we".

**Casing.** Sentence case everywhere — screen titles, buttons, chips. Uppercase is reserved for
eyebrows, metadata labels and state words (`CORRECT`, `WRONG`, `WEAK AREAS`) with wide tracking.
Never all-caps a sentence.

**Punctuation.** Buttons and labels take no terminal period. Full sentences of body copy do:
*"Round complete."*, *"The soup is cold — right now."* Em dashes are used sparingly for an
after-thought clause. Middle dots separate metadata: *"Box 2 · due in 1 day"*, *"62% · 18 of 29
questions"*.

**Numbers.** Digits always, with the unit spelled out: *"7 / 10"*, *"12 days in a row"*, *"24
cards"*, *"9 of 38 questions"*. Percentages are whole numbers.

**Spanish.** Spanish content is never translated in place — the prompt is Spanish, the gloss sits
underneath in muted grey. Spanish grammar topics are lower-cased in running copy (*"ser vs
estar"*) and title-cased as deck names (*"Ser vs estar"*). Weekday initials are Spanish: L M X J V
S D.

**Buttons.** Verb-first and specific to the moment: *"Check answer"*, *"Next question"*, *"See
results"*, *"Practise the 2 misses"*, *"Back to library"*, *"Skip this one"*. Never *"Submit"*, *"OK"*, *"Continue"*.

**Feedback.** Correctness is stated, not celebrated. A wrong answer gets the right answer and a
reason, not an apology. Weak areas are named as grammar concepts (*"Estar + condition"*, *"Ser +
material"*), never as a judgement of the learner.

**Emoji.** None, ever. The only marks used as marks are unicode glyphs (✓ ✕ ↺ ← → ★) set in the
body face — see Iconography.

## Visual foundations

**Colour.** Warm paper `#F5EFE4` as canvas, a lighter warm surface `#FFFCF6` for cards, near-black
warm ink `#2C2B29` for text and every border. One saturated primary — deep teal `#00625D` — plus
four accents with fixed jobs: **sun gold** `#F2A81D` for streaks and focus rings only, **clay**
`#C4553F` for secondary emphasis and section numerals, **sage** `#6E8F5E` for correctness and
mastery, **danger red** `#BA1A1A` for wrong answers and destructive resets. Each accent has a soft
wash used for chips, tinted panels and answer states. Dark theme inverts to `#141310` paper with
brightened accents; every token resolves in both. Maximum two background colours per screen.

**Type.** Two families, no exceptions. **Fraunces 600** sets display, headlines, card headings and
every button label — it is the brand's voice. **Karla 400/500/600/700** sets everything a learner
reads: prompts, answers, explanations, metadata. Monospace (`ui-monospace`) appears only in the
specimen cards to show token names. Display tracks −.02em; body never tracks. The Spanish quiz
prompt is `clamp(22px, 6.4vw, 28px)` and never drops below 21px at 380px.

**Spacing.** 4px unit. 8 inside chips and tight stacks, 16 as the grid gutter and default stack, 20
as card padding, 24 as the page margin, 32 between sections, 64 between page sections. Touch
targets: 44px minimum anywhere including with the keyboard open, 48px for standard controls, 52px
for the main action, 56px for round options, Next and Start round.

**Backgrounds.** Flat warm colour only. No images, no full-bleed photography, no illustration, no
repeating pattern, no texture, no noise, and **no gradients** — the single exception is the conic
sweep inside `ScoreRing`, which is two hard stops rather than a blend. `DESIGN.md` rules out
gradients on progress bars and decorative imagery.

**Borders.** 2px solid ink is the system's signature: every card, control, input and phone
edge. 1px hairline ink is used only on pills and chips. `--line` (a warm hairline) separates list
rows and marks "not yet reached" progress. Dashed borders mark absence: today's incomplete streak
day, an undesigned surface, a rule callout.

**Depth.** There is no blur anywhere. Elevation is a **solid ink offset**: `2px 2px 0` for a lightly
raised element, `4px 4px 0` for a card or button, `6px 6px 0` for a device shell. No inner shadows.
Exactly **one elevated surface per screen** — the active exercise. Supporting panels stay flat.
Disabled controls keep their footprint but lose the offset; the shadow is the affordance.

**Corner radii.** 4px on progress bars and small tiles, 6px on Leitner boxes and segmented
segments, 8px on buttons, inputs and answer rows, `999px` on chips and avatars, 26px on the phone
shell. Cards use four **organic radius sets** — `16 24 12 32`, `24 12 32 16`, `12 32 16 24`,
`32 16 24 12` — rotated down a list so neighbouring cards never match. That asymmetry is the most
recognisable thing about the system.

**Cards.** 2px ink border, warm surface fill, organic radius, 20px padding, offset only when
elevated. No coloured left-border accents, no floating shadows, no glass.

**Hover / press.** Hover sinks the element 2px toward its shadow (`translate(2px,2px)` with the
shadow reduced to 2px). Active flattens fully: `translate(4px,4px)`, shadow removed. Secondary
buttons additionally tint to `--primary-soft` on hover. Nothing scales, nothing lifts, nothing
changes opacity.

**Focus.** A 3px sun-gold outline offset 2px, on both themes, on every focusable control. Never
removed, never replaced by a colour change.

**Motion.** 120ms for press feedback, 180ms base, 260ms for the card flip, all on
`cubic-bezier(.2,0,.2,1)`. Transitions apply to `transform`, `box-shadow` and `background` only —
no fades of whole screens, no bounce, no spring, no parallax. A single `nudge` keyframe (a 3px
horizontal shake) marks a rejected input. `prefers-reduced-motion` zeroes the durations and drops
the flip entirely; the revealed card state must stand on its own.

**Transparency and blur.** Used once: the "not yet answered" segments of the in-round teal header
are white at 35% opacity. Nothing else is translucent. There are no backdrop filters, no scrims, no
protection gradients — a solid ink border does the separating that a gradient would elsewhere.

**Layout.** Mobile-first, one exercise per screen. The board home is the entry point: a header row
with a hamburger, the brand mark and title, and a theme toggle; then the streak panel and deck tiles.
The hamburger opens a drawer holding progress and history, the mistake notebook, backup and reset.
From 900px the board splits into a 224px left rail beside the tiles. In a round, the header is a back
square, a step strip and a counter; the footer holds Skip and Next and rises above the keyboard in
Type mode. There is no bottom tab bar.

**Progress.** Solid fills, flat caps, ink frames. Never round the caps, never gradient the fill.
Four Leitner boxes (now, 1d, 3d, 7d), always equal width. Colour never carries meaning alone:
graded answers pair their wash with a glyph *and* a written label; flashcard recall buttons are
icon-only (bold ✓ / ✕) but always carry an accessible label and stay disabled until reveal.

## Iconography

There is **no icon library, no icon font, and no SVG set** in the source — and none was added. The
app uses two devices, and both are reproduced here:

1. **Unicode marks set in Karla**, exposed through the `Glyph` component: ✓ correct, ✕ wrong,
   ↺ again, ← back, → forward, ↑ ↓, ⇄ flip, … more, ★ star. They sit at 18–22px, inherit
   `currentColor` or take a state token, are `aria-hidden`, and always keep an adjacent text label.
2. **The brand mark** in `assets/brand/`: three ink-bordered blocks, a teal bar over a clay tile and a
   sun tile. It sits at 24px before the product name in the header.

The one emoji is 🔊 on the flashcard speak button, as in the repo. The theme toggle uses the repo's own sun and
moon SVGs (`app/theme-icons.tsx`) and board tiles use its check and fanned-cards SVGs; both live in `IconSquare` and
`BoardTile`. No other emoji. No PNG icons. No decorative illustration. If a future need genuinely cannot be
met by a glyph, add a CDN set with matching 2px stroke weight and square caps
(Lucide at `stroke-width: 2` is the nearest match) and record the substitution here — but the
default answer is a unicode mark plus a label.

The brand mark lives in `assets/brand/` (`mark.svg`, `mark-dark.svg`, PNGs at 512/1024), copied from
the repo's `public/brand/`. It is three ink-bordered blocks: a teal bar over a clay tile and a sun tile.
In product the mark sits at 24px before the name in the header (`AppHeader`'s `mark` prop).

## Index

Root files:

- `readme.md` — this file: brand context, content fundamentals, visual foundations, iconography.
- `SKILL.md` — Agent Skills front matter so this folder works as a downloadable Claude Code skill.
- `styles.css` — the single entry point consumers link. `@import` lines only.
- `thumbnail.html` — homepage tile: brand mark and name on primary teal, accent swatch strip.
- `github.md` — link to the source repo, last sync, and screen map.
- `_ds_bundle.js` — generated build artifact (do not edit by hand); the component cards, UI kit and template load it to render.

Tokens (`tokens/`, all reached from `styles.css`):

- `fonts.css` — Fraunces + Karla via Google Fonts CDN, plus `--font-display` / `--font-body` / `--font-mono`.
- `colors.css` — base palette (mirrors the repo's `app/quiz-layout-fix.css`), `--key`, legacy aliases (`--success`, `--accent`, `--paper-white`), the `[data-theme="dark"]` scope, and semantic aliases (`--text-body`, `--surface-card`, `--state-correct`, `--focus-ring`, …).
- `typography.css` — display / body / label scales and the quiz-prompt clamp.
- `spacing.css` — 4px scale plus touch and control heights.
- `shape.css` — radii, the four organic radius sets, border widths, solid ink offsets, focus outline.
- `motion.css` — durations, easing, press transforms, the `qs-nudge` keyframe, reduced-motion overrides.
- `base.css` — body, link and heading resets.
- `components/interactions.css` — the shared press/hover/focus mechanics (`.qs-press`, `.qs-press-sm`, `.qs-tint-hover`, `.qs-underline`, `.qs-field`).

Components (each directory has `<Name>.jsx`, `<Name>.d.ts`, `<Name>.prompt.md` and one `@dsCard` HTML):

- `components/core/` — **Button**, **Chip**, **Card**, **StatTile**
- `components/forms/` — **Input**, **Select**, **SegmentedControl**, **AnswerOption**, **InlineBlank**
- `components/progress/` — **ProgressBar**, **ScoreRing**, **StreakStrip**, **LeitnerBoxes**
- `components/shell/` — **Logo**, **IconSquare**, **AppHeader**, **QuizHeader**, **BoardTile**, **FlashCard**, **PhoneFrame**, **Glyph**

Every family above has a counterpart in the repo's CSS (`app/quiz-layout-fix.css`). **Intentional
additions** with no single class of their own:

- **Glyph** wraps the unicode marks the app uses inline, so the set is enumerable and consistent.
- **PhoneFrame** is the device shell used to present screens here. It is presentation chrome only.
- **StatTile** is a number-plus-caption tile, factored out of the stat grids.

UI kit:

- `ui_kits/spanish-quizzes-app/` is the phone app. `index.html` is the interactive click-through:
  open a deck, answer a three-question round, and land on results. Flashcards reveals a card and
  grades it OK / Not OK. The side panel switches screens and theme. Screens: `LibraryScreen`,
  `QuizScreen`, `ResultsScreen`, `CardsScreen`, `ProgressScreen`. The board screen is also
  available as a template in `templates/quiz-app-screen/`. The screens follow the repo's tokens and rules but are not yet rebuilt one-to-one
  from `quiz-selector.tsx`, `round.tsx` and `flashcards.tsx`.

Previous versions (reference only, not part of the design system):

- `ui_kits/spanish-quizzes-app-v1/` — the app screens before the repo rebuild: bottom tab bar, teal round
  header, "You" tab, spec-based layouts. Rebuilt from earlier code for comparison; its v1-only components live
  inside that file.

Foundations (`guidelines/`) — 20 specimen cards in the Design System tab, grouped **Colors**,
**Type**, **Spacing**, **Brand**.

Not present, and why:

- **No imagery or illustration**, because `DESIGN.md` forbids decorative imagery.
- **No self-hosted font binaries** — Fraunces and Karla are loaded from the Google Fonts CDN.
