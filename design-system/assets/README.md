# Assets

- `brand/mark.svg`, `brand/mark-dark.svg` — the Spanish Quizzes mark (light / dark), with 512 and 1024 PNGs.
  Copied from `public/brand/` in `aleksanderlech-itx/spanish-gustar-quiz`. The in-app version
  (`app/logo.tsx`) draws the same mark from `--primary`, `--clay` and `--sun` so it recolours with the theme.

There is no illustration or photography, and there shouldn't be: both sources forbid decorative imagery.

Fonts aren't stored here. Fraunces and Karla load from Google Fonts in `tokens/fonts.css`, just as
the live app loads them via `next/font/google`.
