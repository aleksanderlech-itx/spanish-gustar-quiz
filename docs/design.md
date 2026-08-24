---
name: Editorial Boutique
colors:
  surface: '#fdf9f3'
  surface-dim: '#ddd9d4'
  surface-bright: '#fdf9f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3ed'
  surface-container: '#f1ede7'
  surface-container-high: '#ebe8e2'
  surface-container-highest: '#e6e2dc'
  on-surface: '#1c1c18'
  on-surface-variant: '#3f4948'
  inverse-surface: '#31302d'
  inverse-on-surface: '#f4f0ea'
  outline: '#6f7978'
  outline-variant: '#bec9c7'
  surface-tint: '#0f6a65'
  primary: '#00625d'
  on-primary: '#ffffff'
  primary-container: '#2a7b76'
  on-primary-container: '#c5fff9'
  inverse-primary: '#87d4ce'
  secondary: '#a23d2e'
  on-secondary: '#ffffff'
  secondary-container: '#fe826d'
  on-secondary-container: '#731a0f'
  tertiary: '#83472d'
  on-tertiary: '#ffffff'
  tertiary-container: '#a05f43'
  on-tertiary-container: '#fff2ed'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a3f0ea'
  primary-fixed-dim: '#87d4ce'
  on-primary-fixed: '#00201e'
  on-primary-fixed-variant: '#00504c'
  secondary-fixed: '#ffdad4'
  secondary-fixed-dim: '#ffb4a7'
  on-secondary-fixed: '#400100'
  on-secondary-fixed-variant: '#832619'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb597'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#6f371f'
  background: '#fdf9f3'
  on-background: '#1c1c18'
  surface-variant: '#e6e2dc'
  text-ink: '#2C2B29'
  mustard: '#E3A735'
  sage: '#869D7A'
  muted-ink: '#9C978D'
  paper-white: '#FFFDF9'
typography:
  display-lg:
    fontFamily: Fraunces
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Fraunces
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-lg-mobile:
    fontFamily: Fraunces
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  title-md:
    fontFamily: Fraunces
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Karla
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Karla
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Karla
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  button-text:
    fontFamily: Fraunces
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  margin-page: 24px
  gutter-grid: 16px
  padding-card: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

This design system is an "anti-aesthetic" to traditional gamified educational software. It prioritizes a tactile, boutique, and editorial feel, moving away from clinical digital interfaces toward the warmth of a physical art journal or independent magazine. 

The visual language is defined by **Editorial Neo-Brutalism**: a mix of sophisticated serif typography, organic/irregular shapes, and high-contrast linework. It rejects soft gradients and standard Gaussian shadows in favor of hard-edged depth and physical metaphors like paper grain and ink. The goal is to evoke a sense of intellectual curiosity and artisanal quality, making the act of learning feel like an aesthetic pursuit.

## Colors

The palette is "earthy-bright," using a warm, off-white "Papyrus" base to simulate natural paper. 

- **Primary & Secondary:** Teal and Terracotta serve as the main functional colors for vocabulary and grammar distinctions.
- **Backgrounds:** Use `#F4F0EA` for the global canvas and `#FFFDF9` for elevated surface elements like cards and buttons to create subtle contrast.
- **Ink:** All text and structural borders use a deep charcoal-black (`#2C2B29`) rather than true black to maintain the printed aesthetic.
- **Accents:** Mustard and Sage provide additional categorization for cultural notes and status feedback (e.g., "Correct" states).
- **Texture:** Apply a grain/noise overlay across the entire UI at 40% opacity using a `multiply` blend mode to break digital smoothness.

## Typography

The system utilizes a high-contrast pairing of **Fraunces** (a soft, organic serif with tilted axes) and **Karla** (a quirky, grotesque sans-serif).

- **Fraunces** is reserved for display moments, main headings, and primary interactive button labels. Its irregular, "hand-cut" feel reinforces the boutique brand.
- **Karla** handles all functional body text, reading articles, and metadata labels.
- For reading-heavy sections (like "Culture Reads"), use `body-lg` with a relaxed line height to ensure maximum legibility against the textured background.
- UI labels should frequently use `label-caps` with slight letter spacing to create a clear "system" feel amidst the more organic headings.

## Layout & Spacing

This design system uses a **fixed-width container** on desktop and a **fluid grid** on mobile, inspired by editorial layouts.

- **Grid:** A 2-column layout is used for dashboard tiles. Interior quiz layouts follow a centered vertical stack.
- **Structure:** Content is organized into "Sections" with clear header areas (occupying roughly the top 30% of the screen) and interaction areas below.
- **Breakpoints:**
  - **Mobile (<600px):** Single column for text, 2-column for dashboard tiles. 24px side margins.
  - **Tablet/Desktop (>600px):** Max-width content area of 800px to maintain reading line-lengths. 
- **Consistency:** Use an 8px base rhythm for vertical spacing between related elements, while larger editorial sections should be separated by 32px or more to create "breathable" whitespace.

## Elevation & Depth

In accordance with the "anti-aesthetic" philosophy, **standard soft shadows are strictly prohibited.** Depth is conveyed through structural linework and solid offsets.

- **Hard-Line Shadows:** Instead of blurs, use solid color offsets. Elements like cards and buttons should have a `4px 4px 0px #2C2B29` solid shadow.
- **Tonal Layering:** The primary background (`#F4F0EA`) acts as the base canvas. Interactive elements or specific content blocks use the "Paper White" (`#FFFDF9`) surface to sit "above" the canvas.
- **Active States:** Depth is interactive. On click/press, an element should "flatten" by reducing its offset to zero and translating `2px` on both the X and Y axes, simulating a physical press onto the paper surface.
- **Borders:** All primary containers must use a `2px solid #2C2B29` border to define their shape clearly against the textured background.

## Shapes

The shape language is "Intentionally Imperfect." While based on a `0.5rem` (8px) base radius, components should embrace asymmetry to feel hand-crafted.

- **Organic Radii:** For primary interactive tiles and flashcards, use alternating border-radius values (e.g., `16px 24px 12px 32px`) to avoid perfect geometric symmetry.
- **Wobbly Lines:** Dividers, progress bar containers, and decorative underlines should use "hand-drawn" SVG paths rather than perfectly straight CSS borders where possible.
- **Tooltips/Speech Bubbles:** Use raw, angled corners and hand-drawn "tails" rather than smooth vector curves.

## Components

- **Buttons:** 
  - **Primary:** `2px` black border, "Paper White" background, solid black shadow. Text in Fraunces.
  - **Ghost/Tertiary:** No border, Fraunces text, underscored with a "wobbly" hand-drawn line in a brand accent color.
- **Cards/Tiles:** Use the "Organic Radii" approach. Each tile in a grid should have a slightly different corner radius configuration than its neighbor to maintain the editorial feel.
- **Progress Bars:** A `2px` black border container with a hand-drawn fill effect using Terracotta or Sage. Avoid rounded caps on the inner progress bar; use flat or slightly angled edges.
- **Input Fields/Blanks:** For "fill-in-the-blank" questions, use a simple wobbly underline rather than a boxed input field to keep the text flow natural.
- **Chips:** Smaller, pill-shaped tags with `1px` borders and Karla typography for categorization.
- **Feedback States:**
  - **Correct:** Sage background, element "shaky" animation.
  - **Incorrect:** Terracotta background, strike-through text effect.
- **Flashcards:** Large-format cards (80% screen height) using 3D `rotateY` transforms for flips, maintaining the 2px border and paper grain texture.