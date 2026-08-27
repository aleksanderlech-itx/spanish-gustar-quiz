---
version: alpha
colors:
  paper: "#f4f0ea"
  surface: "#fffdf9"
  ink: "#2c2b29"
  primary: "#00625d"
  secondary: "#a23d2e"
  success: "#869d7a"
  danger: "#ba1a1a"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
  body:
    fontFamily: "Karla, system-ui, sans-serif"
rounded:
  DEFAULT: "8px"
spacing:
  unit: "4px"
components:
  questionCard:
    backgroundColor: "surface"
    textColor: "ink"
  supportingPanel:
    backgroundColor: "paper"
    textColor: "ink"
  primaryAction:
    backgroundColor: "primary"
    textColor: "surface"
  secondaryAction:
    backgroundColor: "secondary"
    textColor: "surface"
  successState:
    backgroundColor: "success"
    textColor: "ink"
  dangerState:
    backgroundColor: "danger"
    textColor: "surface"
---

## Runtime tokens (board/round redesign)

`app/quiz-layout-fix.css` declares the full token set on `:root` and
`:root[data-theme="dark"]`, and is the single runtime source of truth — the
`colors` block above and `docs/design.md` restate it for reference only.
Tokens added beyond the original set: `--panel`, `--panel-soft`, `--line`,
`--primary-ink`, `--primary-soft`, `--sun`, `--sun-soft`, `--clay`,
`--clay-soft`, `--sage`, `--sage-soft`, `--danger-soft`, `--shadow-col`,
`--key`. `--sun` marks streaks and the current step; `--clay` replaces the
old `--accent` role (secondary emphasis, eyebrows); `--sage` replaces the old
`--success` role. Theme is set via `data-theme="light" | "dark"` on
`<html>`, defaulted from `prefers-color-scheme` and persisted per user
choice (see `app/layout.tsx`'s pre-paint script).

---

## Overview

Spanish Quizzes uses the Editorial Boutique system from `docs/design.md`. It is a mobile-first language-learning tool. The active exercise is the single visually elevated surface; settings and progress remain quieter.

## Colors

Teal identifies primary actions, terracotta identifies secondary emphasis, sage identifies successful progress, and red identifies material still to learn. Semantic meaning is never conveyed by color alone. Runtime ownership remains in `app/quiz-layout-fix.css`.

## Typography

Fraunces carries display headings and action labels. Karla carries Spanish prompts, English answers, filters, metadata, and supporting copy.

## Layout

Keep the compact header and one-exercise-per-screen flow. Primary actions remain reachable on narrow phone screens, including when the virtual keyboard is open.

## Elevation & Depth

Only the active question or flashcard receives a hard 4px offset shadow. Supporting panels use solid paper surfaces and borders without Gaussian shadows.

## Shapes

Use the shared 8px radius for panels and controls. Circular controls are reserved for compact icon actions.

## Components

Flashcards reveal their answer in place. Assessment controls appear only after reveal and use both a symbol and a visible label. Leitner progress is presented as five compact, equally weighted boxes so review cadence is visible without competing with the active card.

## Do's and Don'ts

Do preserve the Citrus Graph identity, visible keyboard focus, readable Spanish text, and 44px minimum touch targets. Do not introduce decorative imagery, gradients on progress bars, or competing elevated cards.
