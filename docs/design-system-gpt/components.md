# Components and screen recipes

Adapt existing logic through reusable visual primitives. Names below describe responsibilities, not a new public API or framework.

## Shared components

| Component | Anatomy | States and constraints |
|---|---|---|
| AppHeader | Live three-block mark, Fraunces “Spanish Quizzes” wordmark, Karla context, quiet divider | Wrap; preserve real back/menu navigation |
| MenuDrawer | Mobile menu trigger, same mark and wordmark, streak/accuracy summary, stacked navigation and accordion rows | Opens over a dimmed page; close button, Escape and backdrop dismiss; focus moves in and returns to trigger; one section expands at a time |
| PrimaryAction | Teal, white label, optional arrow | Default/hover/focus/pressed/disabled/busy; 44px minimum |
| SecondaryAction | Surface, control outline, Ink | Same keyboard and busy behavior |
| EditorialSurface | Asymmetric corners, Surface fill, 20px padding | Featured topic, question, flashcard, score |
| TopicRow | Outline icon, title, count, bar, level badge | Named destination; zero/completed/unavailable states |
| LevelBadge | Gold fill, Ink label, 8px corners | Difficulty stays neutral, never error-colored |
| ProgressMeter | Teal fill, quiet 6px track, count | Shared data source for fill and accessible value |
| AnswerOption | Native radio in full-width row | Selected is distinct from graded correct/incorrect |
| AnswerInput | Existing typed-answer field | Labels, validation, accent/IME support, preserved input |
| FeedbackPanel | Outcome label and explanation | Success/error pair, polite announcement, persists until advance |
| FlashcardSurface | Term, reveal, meaning/example, recall actions | Unrevealed → revealed → assessed |
| ScoreSummary | Large fraction and accuracy | Real totals, explicit empty result, no divide-by-zero |
| ReviewArea | Outcome icon, grammar area, mistake action | Active-topic content and correct pluralization |
| PracticeOptions | Disclosure and single-choice controls | Supported options only, empty-filter recovery |

All controls need long-copy wrapping and visible focus. Use links for navigation, buttons for actions. Preserve values on failure.

## Menu drawer

The drawer mirrors the mobile menu inspected on the live staging application on 24 September 2026. From top to bottom: Spanish Quizzes title and Close menu; streak and weekly accuracy; Progress & history; Weekly recap with New badge; Mistake notebook with count; Backup & restore; Settings; How to use; Notes; Help build more quizzes; theme control. Progress, recap, mistakes, backup and settings open one panel at a time. Keep actual user values, available actions and destinations when implementing this system.

In the reference HTML, progress counts are illustrative. Backup/import/reset controls are disabled because the specimen has no stored data. The Light theme control is shown but disabled because this light-only specimen does not define a dark design. How to use, Notes and support links lead to their verified staging destinations in a new tab. Production keeps the application's real functions and theme behavior.

The reference drawer sits within the sample phone frame. Production mobile layout should own the viewport, allow internal scrolling for long menu content, dim the page, block background focus, support Close menu, Escape and backdrop dismissal, and restore focus to Open menu. At wide widths, follow the application's established navigation pattern instead of forcing a phone drawer.

## Library

Header → featured learning surface → All topics → topic rows. The featured surface contains an eyebrow, editorial headline, supporting copy, topic title, progress/accuracy, and Continue practice. Exact promotional copy is optional; hierarchy is not.

Rows place Clay outline icons in 44 × 52px warm blocks to the left of each topic name, count, and progress bar, with status badges on the right. The reference maps Ser vs estar to a landmark, Gustar to a heart, Por vs para to a signpost, and Preterite vs imperfect to an open book. The two current activities absent from the four-row specimen use a checkmark for Object Pronouns and fanned cards for Flashcards. Bind real availability, URLs, and per-topic progress. New learners see zero progress and a start action. Do not copy fixture counts.

## Quiz

Topic and position → completed-question bar → instruction/difficulty → Spanish prompt → answer controls → help → feedback → next action.

“Question 7 of 10” in the specimen means six completed questions and a 60% bar. Keep current-question position distinct from completed count.

The specimen's local Check answer demonstrates feedback only. Preserve current grading/submission timing, Choose/Type modes, help/chart access, persistence, and next-question behavior. Prevent duplicate advancement and manage focus. Do not copy demo handlers into the app.

## Flashcards

Title/count → centered Spanish term → reveal → English meaning and Spanish example → Again / Got it. Recall stays disabled until reveal. Each recall action uses a visible label and symbol. Preserve existing speech with an accessible control and no autoplay.

The fixed specimen count and repeated card are illustrative. Retain actual due-first ordering, session size, four Leitner boxes, intervals, migrations, and immediate assessment persistence. Returning to topics never deletes saved progress.

## Results

Topic eyebrow → Round complete → score/accuracy → successful areas → review areas → mistake action → Back to topics. Use active-topic categories and real round data.

The specimen's 8/10 is not calculated from its single sample question. Keep historical mistake practice when saved misses remain, even after a perfect round. Preserve existing review/history functions and provide a useful next action.

## Practice options

Topic → short context → disclosure → round length → answer mode → difficulty → supported verb filters → start action. Single-choice filters can appear as segments or radios; use only the choices supported by the current topic.

The specimen summarizes selections only. Production must start a genuinely configured round using actual topic capabilities. Do not require every topic to expose 5/10/20, A1/A2/B1, or verb filtering. Explain empty filters and prevent empty rounds. No standalone settings or results route is mandated: these are view compositions within current flows.

## Required production states

| State | Contract |
|---|---|
| Loading | Stable geometry and honest status, no invented progress |
| Failure | Specific message, applicable retry, retained answers/settings |
| Empty | Explain absence and supported recovery |
| Storage unavailable | Explain unavailable device-local progress without suggesting a sync state |
| Busy | Prevent duplicate operations without shifting controls |
| Long text/zoom | Wrap and grow, never hide learning content |
| Reveal/navigation | Never leave focus on hidden controls |
| Reduced motion | No essential meaning depends on animation |

These are acceptance requirements, not a claim that the standalone sample is a complete production component library.
