---
version: alpha
colors:
  paper: "#f8fbeb"
  surface: "#ffffff"
  ink: "#151f2d"
  primary: "#1d5c73"
  success: "#bfd52f"
  danger: "#b84d59"
typography:
  sans:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
rounded:
  DEFAULT: "8px"
spacing:
  unit: "4px"
components:
  questionCard:
    emphasis: "primary elevated learning surface"
  supportingPanel:
    emphasis: "quiet translucent surface"
---

## Overview

Spanish Quiz Studio uses the Citrus Graph light theme and Harbor Night dark theme. It is a mobile-first language-learning tool. The active exercise is the single visually elevated surface; settings and progress remain quieter.

## Colors

Teal identifies primary actions, lime identifies successful progress, and muted red identifies material still to learn. Semantic meaning is never conveyed by color alone. Runtime ownership remains in `app/globals.css`.

## Typography

Atkinson Hyperlegible supports quick comparison between Spanish prompts and English answers. Exercise text uses stronger scale and weight than interface labels.

## Layout

Keep the compact header and one-exercise-per-screen flow. Primary actions remain reachable on narrow phone screens, including when the virtual keyboard is open.

## Elevation & Depth

Only the active question or flashcard receives the strong product shadow. Supporting panels use borders and translucent fills.

## Shapes

Use the shared 8px radius for panels and controls. Circular controls are reserved for compact icon actions.

## Components

Flashcards reveal their answer in place. Assessment controls appear only after reveal and use both a symbol and a visible label. Leitner progress is presented as five compact, equally weighted boxes so review cadence is visible without competing with the active card.

## Do's and Don'ts

Do preserve the Citrus Graph identity, visible keyboard focus, readable Spanish text, and 44px minimum touch targets. Do not introduce decorative imagery, gradients on progress bars, or competing elevated cards.
