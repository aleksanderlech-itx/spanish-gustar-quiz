A warm Spanish study notebook. Practice is the hero: paper surfaces, ink text, one teal action per screen, Fraunces for the Spanish you are learning, Karla for everything you tap. Decoration never competes with the question.

## Content fundamentals

- **Voice:** a calm, encouraging tutor. Short sentences, second person ("Pick the verb that matches the subject."). No exclamation-mark hype, no emoji in UI copy.
- **Casing:** sentence case for headings and buttons ("Continue practice", "Back to topics", "Round complete"). Eyebrows are short UPPERCASE labels ("TODAY'S PRACTICE").
- **Spanish is content, English is chrome.** Mark Spanish passages `lang="es"`. Keep accents and inverted punctuation (¿ ¡). Let prompts wrap naturally and never hard-code line breaks.
- **Outcomes are words, not just colour.** Feedback says "Correct" or "Not quite" and then explains the grammar. Recall buttons always pair a symbol with a visible label ("Again", "Got it").
- **Honest numbers.** Show real counts ("Question 7 of 10", "8 / 10"). A new learner sees zero progress and a start action, never invented totals.

## Color

- Put every screen on `paper`. Cards and controls sit on `surface`. Recessed areas such as the mistake notebook and the accent-key row use `panel`.
- Main text is `ink`. Supporting text, counts and eyebrows use `muted`. Both pass 4.5:1 on `paper`, `surface`, `panel` and every `*-soft` wash in both themes.
- **One teal job:** `primary` fills the main action, progress bars and the focus ring. Put `primary-ink` text on it. The selected answer or segment uses the `primary-soft` wash with `ink` text, plus a `primary` edge in dark.
- **Gold is for level, not attention.** `sun` fills level badges and progress pills with `sun-ink` text. It also underlines the blank in a prompt. Never use it as a focus colour or an error.
- **Clay is decorative.** `clay` draws the topic outline icons and prose eyebrows. It never signals state.
- **States come in pairs:** correct = `sage` border and label on `sage-soft`; wrong = `danger` border and label on `danger-soft`. Body text inside them stays `ink`. The pair also differs in lightness, and the label always carries the word.
- `line` is for decorative hairlines and tracks only (below 3:1). Any control boundary that carries meaning uses `border-ink` (3:1+).
- The logo keeps its fixed `brand-teal`, `brand-clay`, `brand-sun` and `brand-stroke` colours in both themes. Use them nowhere else.

## Type

- **Fraunces** (`display`, weight 600) for learning content: `heading` 32px, `question` 42px (36px at ≤380px), `score-term` 48px, `card-title` 24px, `meaning` 21px and the `brand` wordmark at 19px.
- **Karla** (`body`) for controls and reading: `body` 16/1.5, `action` 16 semibold for buttons and answer options, `section` 18 bold, `metadata` 14 in `muted`, `badge` 14 bold, `eyebrow` 12 bold uppercase with 0.08em tracking.
- Fallbacks are Georgia and system-ui. Keep heading tracking at −0.7px and question tracking at −1px.

## Shape, spacing and depth

- Spacing steps are 4, 8, 12, 16, 20, 24, 32, 48 and 64px (`space-*`). Card padding is `space-5` (20px), or 16px at ≤380px. Related items sit 8–12px apart and sections 24px apart. The mobile gutter is 16px.
- **Editorial corners** mark the one surface that matters on a screen (featured tile, question card, flashcard, score card): `18px 26px 14px 26px`, clockwise from top-left (`radius-editorial-a` / `-b`). Everything else uses `radius-card` 14px. Controls use `radius-control` 10px, badges and selected segments `radius-segment` 8px, and tracks and chips `radius-pill`.
- Only the active surface gets `shadow-active`. Supporting panels stay flat.
- Touch targets are at least `target-min` 44px, and answer rows and main actions at least 48px. They grow with long text.
- Exercises centre in `exercise-max` 640px. The library is capped at `library-max` 1120px and becomes a grid from 768px.

## States and motion

- Focus: a 3px solid `focus-ring` outline at 3px offset on every focusable control, in both themes.
- Disabled primary: `panel` fill, `muted` label, `line` border. Busy actions keep their size.
- Pressed: translateY(1px). Hover on primary mixes 12% `ink` into the teal.
- Feedback uses `motion-feedback` 120ms. Reveals use `motion-reveal` 180ms ease-out. Under `prefers-reduced-motion`, remove every nonessential transition. Audio never autoplays.

## Iconography

- 20–24px outline icons on a 24-unit grid, 1.8 stroke (2 for flashcards and the theme toggle), round caps and joins. They are drawn inline so they take `currentColor`.
- Topic icons sit in `clay` inside a 44 × 52px `paper` block (`panel` in dark) with `radius-panel` corners: landmark = Ser vs estar, heart = Gustar, signpost = Por vs para, open book = Preterite vs imperfect, check = Object pronouns, bulb = Saber vs conocer, fanned cards = Flashcards.
- The only emoji in the UI is the 🔊 glyph on the speak button. The menu trigger is three drawn bars.
- Decorative icons get `aria-hidden`. Icon-only buttons need an accessible name and a 44px target.
- The SVG files in **Icons** are drawn in their light-theme ink (clay `#c75a3a`, or ink `#0f172a` for sun and moon), because `<img>` cannot inherit colour. Inline them in code.

## Logo

The mark is three outlined blocks: a wide teal top, a clay lower-left and a sun lower-right. Set it at 24px beside the Fraunces wordmark "Spanish Quizzes" with an 8px gap. The mark is decorative when the wordmark sits beside it. In dark theme, put it on a `#fffaf3` backing with a 4px spread and 2px corners. Never recolour it.

## Not synced

Built from `app/quiz-layout-fix.css` and `docs/design-system-gpt` at main@68f4d66. Component previews are static renditions with no React bundle. The menu drawer, streak panel, verb chart and help dialog are not included. Runtime-only aliases (`--hard-shadow`, `--soft-shadow`, `--quiz-surface`, `--key` and others that only repoint to a token above) were not imported.
