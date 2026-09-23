repo: aleksanderlech-itx/spanish-gustar-quiz
branch: main

## Last sync
date: 2026-09-23T08:35:32Z

### Updated in this project
- App screens rebuilt from the repo: board, drawer, topic detail, round (Choose/Type), results, flashcards
- New components from repo code: Logo, IconSquare, BoardTile; StreakStrip, FlashCard, ScoreRing, LeitnerBoxes, AnswerOption, Input, Select, SegmentedControl realigned
- Removed DeckCard and StepDots (no repo counterpart)
- Theme-specific component tokens mirror the repo's dark-mode overrides

## Screen map
| Project screen | Repo files |
|---|---|
| tokens/colors.css | app/quiz-layout-fix.css, DESIGN.md |
| tokens/typography.css, tokens/spacing.css, tokens/shape.css | docs/design.md |
| assets/brand/*, components/shell/Logo.jsx | public/brand/*, app/logo.tsx |
| components/shell/IconSquare.jsx | app/theme-icons.tsx, app/quiz-layout-fix.css (.mode-switch) |
| components/shell/BoardTile.jsx | app/quiz-selector.tsx, app/quiz-layout-fix.css (.board-tile) |
| components/progress/StreakStrip.jsx | app/quiz-selector.tsx (.streak-panel) |
| components/shell/FlashCard.jsx, components/progress/LeitnerBoxes.jsx | app/flashcards.tsx |
| components/shell/QuizHeader.jsx, components/forms/AnswerOption.jsx, components/forms/Input.jsx | app/round.tsx |
| components/forms/SegmentedControl.jsx, components/forms/Select.jsx | app/topic-detail.tsx |
| ui_kits/spanish-quizzes-app/BoardScreen.jsx | app/quiz-selector.tsx |
| ui_kits/spanish-quizzes-app/Drawer.jsx | app/drawer.tsx |
| ui_kits/spanish-quizzes-app/TopicScreen.jsx | app/topic-detail.tsx |
| ui_kits/spanish-quizzes-app/RoundScreen.jsx | app/round.tsx |
| ui_kits/spanish-quizzes-app/ResultsScreen.jsx | app/results.tsx, app/support-prompt.tsx |
| ui_kits/spanish-quizzes-app/FlashcardsScreen.jsx | app/flashcards.tsx |
| templates/quiz-app-screen/QuizAppScreen.dc.html | app/quiz-selector.tsx |
