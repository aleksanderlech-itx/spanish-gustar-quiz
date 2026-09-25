# Spanish Editorial Learning

The approved light appearance is in [docs/design-system-gpt](docs/design-system-gpt/README.md). Its [reference](docs/design-system-gpt/reference.html) shows Library, Quiz, Flashcards, Results and Practice options. The specimen supplies visual hierarchy, not app data or behavior. The older [design-system](design-system/readme.md) and [docs/design.md](docs/design.md) remain historical references.

## Runtime ownership

`app/quiz-layout-fix.css` owns semantic color tokens and final theme values. The stylesheet order is `globals.css`, `issue-5-design.css`, `quiz-layout-fix.css`, `editorial-polish.css`, then `activity-chrome.css`, imported by `app/layout.tsx`. Screen components keep their existing state and handlers. The light palette maps Paper `#F8EDE1`, Surface `#FFFAF3`, Ink `#0F172A`, Primary `#0F766E`, Muted `#59534B`, decorative Line `#D6C9B8`, and stronger control border `#807366`. Selected controls use `#E8F3EF`. Success uses `#166534` on `#EAF4E6`; errors use `#991B1B` on `#FDECE8`. Gold `#F59E0B` marks level badges, not keyboard focus.

The approved [dark palette](docs/design-system-gpt/dark-preview.md) now maps Paper `#1F1D1A`, Surface `#2B2824`, raised panels `#35312C`, Ink `#F8EDE1`, Primary `#8BD3C7`, and selected controls `#243E38`. Success uses `#B8E3AE` on `#253629`; errors use `#FFC1B5` on `#482B29`. Teal remains the focus color. The theme toggle, pre-paint cookie/local-storage choice, and fixed logo brand colors stay functional. The logo retains teal `#00625D`, clay `#C4553F`, sun `#F2A81D`, and ink stroke `#2C2B29` in both themes, with a cream backing in dark mode.

## Type, shape and layout

Fraunces is the display face for headings, Spanish prompts, flashcard terms and scores. Karla serves controls, answers, supporting text and metadata. The target uses a 32px page heading, 42px Spanish question (36px at 380px and below), and 48px flashcard term or score. Use the documented fallbacks when fonts cannot load.

Cards use a 14px standard radius or the editorial 18px 26px 14px 26px corners. Controls use 10px corners. The active surface may use a restrained `0 4px 14px rgb(15 23 42 / 8%)` shadow; supporting panels stay quiet. Preserve 44px touch targets, visible 3px teal focus rings with 3px offset, naturally wrapping Spanish text, and reduced-motion handling.

Center exercises in a container up to 640px. Allow the library up to 1120px and introduce its grid from 768px where content fits. Maintain natural scrolling and keyboard-safe actions. The specimen's outer phone frame, tabs, sample totals and demo controls do not appear in production.

## Product behavior

The [UX contract](UX-CONTRACT.md) owns interaction rules. The library has five grammar activities plus flashcards. Keep activity IDs, routes, supported filters, Choose and Type modes, saved preferences, grading, score/history timing, chart/help, speech, backup and reset, and device-local persistence. Choose grades immediately; Type submits through Check/Enter, preserves accent insertion and caret position. Skip does not score an answer. Results use real round data; historical mistake practice stays available whenever saved misses remain, including after a perfect round.

Flashcards reveal meaning and example before recall. Recall actions display a symbol and a visible “Again” or “Got it” label. Four Leitner boxes use immediate, 1-day, 3-day and 7-day intervals, with due cards first. Assessments persist immediately, including the existing migration from older formats. No sign-in or cross-device synchronization is part of this visual change.
