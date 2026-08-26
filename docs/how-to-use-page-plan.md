# How to Use Page Plan

## Scope

Add a dedicated `/how-to-use` page to Spanish Quiz Studio and link it from the drawer menu with the label `How to use`.

The page must explain the current staging experience at https://staging.spanish-quizz.es, using its visible terminology:

- `Open menu`, `Progress & history`, `Weekly recap`, `Mistake notebook`, `Backup & restore`, `Settings`, and `Light theme`.
- `Start`, `Continue`, `Round length`, `Answer mode`, `Choose`, `Type`, `Check`, `Skip`, and `Back to topic`.
- `Tap to reveal`, `Reveal`, `Again`, `Knew it`, `Back to board`, `Box 1` through `Box 5`, and `due now`.

## Current-state finding

The canonical checkout is `design/editorial-polish` and is clean. Its source still contains an older quiz shell with terms such as `Switch quiz`, `Check answers`, and `Show verb chart`, while staging exposes the newer board, drawer, and activity setup. Before implementation, reconcile the branch with the staging UX so the page and link are added to the actual current shell.

## Implementation plan

1. Confirm the current source branch and identify the components that render the staging board, drawer, quiz setup, quiz session, flashcards, and progress panels.
2. Add a route at `app/how-to-use/page.tsx`, reusing the existing page shell, typography, spacing, theme tokens, and mobile layout.
3. Add a drawer link labelled `How to use`. Close the drawer or preserve the existing navigation behavior after selection.
4. Organize the page into these sections:
   - What Spanish Quizzes is about
   - How to use grammar quizzes
   - How to use Spanish Verb Flashcards
   - What interface elements mean
   - Backup and restore
   - Mistake notebook
   - Useful practice tips
5. Add accessible heading hierarchy, keyboard-focus states, readable mobile sections, and dark-theme support.
6. Add tests confirming the route renders and the drawer contains the link.
7. Verify terminology against staging, test desktop and mobile layouts, run the applicable test suite, then deploy.

## Acceptance criteria

- `How to use` is visible and reachable from `Open menu`.
- Page explains quizzes, flashcards, interface elements, backup, restore, Mistake notebook, and useful guidance.
- Copy uses current staging labels and does not describe controls that are absent without clearly marking them as topic-specific.
- Page works in light and dark themes and remains readable on mobile.
- Existing quiz, flashcard, progress, backup, and drawer behavior remains unchanged.

## Page content

### What Spanish Quizzes is about

Spanish Quizzes helps you practise Spanish grammar and vocabulary in short, focused sessions. Choose a grammar quiz such as Spanish Gustar, Preterite vs Imperfect, or Ser vs Estar, or practise vocabulary with Spanish Verb Flashcards.

The home board shows what is due, what you have studied, and your current progress. Your progress, review history, filters, scoring, audio practice, and flashcard progress stay connected to each activity.

### Choose what to practise

Choose an activity from the home board:

- Grammar quizzes practise Spanish sentence patterns.
- Spanish Verb Flashcards practise common verbs, English meanings, and example sentences.
- `Start` begins a new activity.
- `Continue` returns to an activity with saved progress.
- The board shows what is due and how much you have studied.

### How to use grammar quizzes

Open a grammar quiz and choose a `Round length`: 5, 10, or 20 questions.

Choose an `Answer mode`:

- `Choose` gives you answer options.
- `Type` lets you enter the missing form yourself.

Read the English meaning and complete the Spanish sentence. In Type mode, use the accented-letter buttons when you need `á`, `é`, `í`, `ó`, `ú`, or `ñ`.

Use these controls:

- `Check` submits your answer.
- `Skip` moves past the question.
- The speaker button plays the Spanish sentence.
- `Verb conjugation chart` opens useful verb forms when available.
- `Back to topic` returns to the quiz setup.

After checking, read the explanation and continue to the next question. Incorrect answers can be practised again through missed-answer practice and the Mistake notebook.

### How to use Spanish Verb Flashcards

Open Spanish Verb Flashcards from the home board. Each session contains up to 20 cards.

1. Read the Spanish verb.
2. Think of its English meaning.
3. Select `Reveal`.
4. Listen to the pronunciation if useful.
5. Choose `Knew it` if you remembered the meaning, or `Again` if you need more practice.

Flashcards use five Leitner boxes:

- Box 1: every session
- Box 2: after 1 day
- Box 3: after 3 days
- Box 4: after 7 days
- Box 5: after 14 days

A correct recall moves the card forward. `Again` sends it back to Box 1. `due now` means the card is ready for review.

### What interface elements mean

#### Home screen

- `Today's board`: activities needing attention today.
- `cards due`: flashcards ready for review.
- `done` or `studied`: items already practised.
- The percentage shows progress for that activity.
- The streak and weekly practice indicators show recent consistency.

#### Drawer menu

Open the drawer with `Open menu`.

- `Progress & history`: view rounds, accuracy, and studied flashcards.
- `Weekly recap`: review recent practice activity.
- `Mistake notebook`: review rules connected to missed answers.
- `Backup & restore`: save or restore progress.
- `Settings`: access settings, including `Reset all progress`.
- `Light theme` or `Switch to dark mode`: change the appearance.

#### Activity screens

- `Question 1 of 5` or `Card 1 of 20`: current position in the session.
- The progress bar shows position within the current activity.
- `Box 1` through `Box 5`: current flashcard review interval.
- Speaker buttons play Spanish audio.

### Backup and restore

Use `Backup & restore` to protect your progress.

- Select `Download backup` to save a backup file.
- Select `Import backup`, then `Choose File`, to restore saved progress.
- Create a backup before using `Reset all progress`.
- `Reset all progress` removes saved learning progress. Use it only when you want to start over.

### Mistake notebook

The Mistake notebook collects rules connected to incorrect quiz answers. Open it regularly to review recurring weaknesses. If no mistakes have been recorded, it shows `No missed rules yet.`

### Useful practice tips

- Start with five questions when you have limited time.
- Use `Type` mode for stronger recall practice.
- Use `Choose` mode when learning a new topic.
- Listen to sentences to connect spelling with pronunciation.
- Use the conjugation chart when you are stuck, then answer the question yourself.
- Review flashcards marked `due now` before starting new cards.
- Practise missed answers instead of repeating only questions you already know.
- Download a backup before changing devices or clearing browser data.
- Use the streak and weekly practice indicators as reminders, not as a score.
