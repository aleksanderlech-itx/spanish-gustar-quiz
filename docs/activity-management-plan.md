# Activity management — implementation plan

Let the user choose which activities are on the board, with a new `/activities`
screen to manage them. Only activities on the board count toward the daily goal.

Mockups of the repeat prompt (dialog chosen): https://claude.ai/artifact/5p2RrV2qfQGKnadyqfZmZk

## Decisions

| Topic | Decision |
| --- | --- |
| Board | User-chosen. At least one activity must stay. Only board activities count toward the daily goal |
| Removing | Any activity, flashcards included. Unfinished ones keep their progress |
| Finishing a quiz | Removed automatically (as today). The completion card shows a notice the user acknowledges: it left the board, and bringing it back resets its regular rounds |
| Last activity finished | Completion card requires picking a replacement from off-board activities before leaving |
| Re-adding a finished quiz | Regular rounds reset (`clearRegularHistory`) and completion date cleared. Missed-practice rounds are kept, so it can show "N due" |
| New activities in the app | Start on the board (still only required from `introducedOn`) |
| Off-board activity opened by URL | Playable, doesn't count. After a finished round, a dialog asks "Add X to your board?". Yes = added (today's round counts if today isn't locked yet). No = nothing; asked again after the next finished round. Abandoned round = nothing |
| Repeat prompt | Dialog over the board, must be answered, waits for the tutorial modal to close. Due 1 month after finishing; declined → again 3 months after that answer; declined → again 6 months after that answer; declined → never. 3rd prompt's decline reads "Don't ask again". Several due → one after another, oldest first |
| Manual add of a finished quiz | Resets regular rounds and restarts the repeat cycle from its next completion |
| Management screen | New route `/activities`, linked from the board nav and drawer. Replaces the drawer's "Finished activities" block |

## Current behaviour (what changes)

- `app/quiz-completion.ts` `isQuizHiddenFromBoard`: finished quiz hidden until repeat
  due (1 month) or "reinstated" in Settings. Flashcards always on the board.
- `app/streak.ts` `isOnBoard` duplicates that rule for today's requirement.
- `app/round.tsx:284` marks completion; the "Set completed" card explains it left today's goal.
- `app/drawer.tsx` Settings → "Finished activities" toggles `spanish-quiz-reinstated-v1`.

Both duplicated rules are replaced by one board module.

## Stage 1 — Board state (`app/board-state.ts`)

- New key `spanish-quiz-board-v1`:
  ```ts
  type BoardState = {
    onBoard: ActivityId[];
    known: ActivityId[];            // activities the user has seen; anything not here is new → on board
    finishedOff: ActivityId[];      // removed because finished → reset on re-add
    repeat: Record<QuizId, { nextAskAt: string | null; declines: 0 | 1 | 2 | 3 }>;
  };
  ```
- API: `readBoard()`, `isOnBoard(id)`, `addToBoard(id)` (resets if in `finishedOff`,
  restarts the repeat cycle), `removeFromBoard(id)` (refuses the last one),
  `removeFinished(id)` (called on completion), `dueRepeats(now)`, `answerRepeat(id, yes, now)`.
- Repeat schedule: on completion `nextAskAt = completedAt + 1 month`, `declines = 0`.
  Decline → `declines + 1`; `nextAskAt = now + 3 months` (1st), `now + 6 months` (2nd), `null` (3rd).
- Migration when the key is missing: `onBoard` = what's visible today (unfinished quizzes,
  reinstated or repeat-due finished quizzes, flashcards); hidden finished quizzes go to
  `finishedOff` with `nextAskAt` from their completion date. Then remove
  `spanish-quiz-reinstated-v1`. Nobody's board or goal changes on first load.
- Pure functions take state + `now` so they're testable without `window`.
- Tests: new `tests/board-state.test.mjs` (migration, last-one guard, reset on re-add,
  repeat schedule 1 → 3 → 6 → never, new activity defaults on).

## Stage 2 — Daily goal (`app/streak.ts`)

- `requiredActivitiesOn(today)` reads `isOnBoard` from the board module. Locked days and
  past unlocked days (completion-date exemption) unchanged.
- Board changes can complete today (removing the only unfinished activity). Extract the
  counter update from `recordActivityToday` into `settleToday(now)` and call it after every
  board change, so the counter increments, not just the lock.
- `EMPTY_STREAK.todayTotal` and the "Goal: a round in all N activities" copy use the board count.
- Tests: update `tests/streak.test.mjs` (removal completes today and bumps the counter;
  added activity after lock doesn't change the locked day; off-board rounds don't count).

## Stage 3 — Board (`app/quiz-selector.tsx`)

- Filter tiles by `isOnBoard`. Keep the existing self-heal (unearned completion / backfill).
- Repeat dialog: on load, after the tutorial modal is closed, show `dueRepeats(now)` one at a
  time. "Bring it back" / "Not now" (3rd: "Don't ask again"), with "Reminder n of 3" and when
  the next ask is. Esc and outside clicks do nothing.
- "Manage activities" link in the board nav.

## Stage 4 — Round end (`app/round.tsx`, `app/flashcards.tsx`)

- On completion: `removeFinished(quizId)`; the "Set completed" card gets an acknowledge
  notice. If it was the only board activity, show the off-board list and require a pick
  before leaving.
- Off-board activity, round finished: dialog "Add X to your board?" (round results stay
  underneath).

## Stage 5 — `/activities` screen

- Route `app/activities/page.tsx`, same chrome as the topic pages.
- Two lists: On your board / Off the board. Each row: icon, title, progress, state
  (in progress, finished on date, repeat from date, won't be suggested again), Add/Remove.
- Remove disabled on the last board activity, with a hint why.
- Adding a finished quiz confirms first: "Its sentences start fresh; your misses stay."
- Remove the drawer's "Finished activities" block; link to `/activities` instead.
- Tests: `tests/drawer.test.mjs`, new rendered-HTML check for the route.

## Stage 6 — Backup, copy, docs

- Add `spanish-quiz-board-v1` to `ALL_PROGRESS_KEYS` in `app/drawer.tsx`. Note: that list
  today also misses the completions, completed-days, streak ledger and flashcard-days keys —
  add them too, so a restore keeps the board consistent with the goal.
- Update how-to-use, help modal and tutorial text that mention Settings → "Add to main screen".
- Tests: `tests/how-to-use.test.mjs`, `tests/help-modal.test.mjs`, `tests/tutorials.test.mjs`.

## Impact on existing progress

- Unchanged: quiz histories, flashcard boxes, mistake notebook, streak counter, locked days,
  ledger days (only ever grows, so a reset never removes past days).
- First load after deploy: board and goal identical to today (migration).
- Accepted by design: removing an activity done today lowers today's count; trimming the
  board to one done activity completes the day.
