# 0008. The Board is chosen by the user

- Status: Accepted
- Date: 2026-11-21
- Source: design session on branch `claude/gifted-clarke-v47c3w`; replaces the specs in issue #117 and PR #99

## Context

Every activity appeared on the home page board for every user, and the daily
goal required a round in each one. As activities were added, a new user faced
the full list and a daily goal that grew with every release. A finished quiz
left the board and came back by itself one month later, whether or not the user
wanted it back.

## Decision

1. The user chooses which activities are on the Board. Every other activity is
   on the Shelf. Terms are defined in `CONTEXT.md`.
2. A new user who opens the home page sees the Selection screen first: nothing
   ticked, a "Use all" shortcut, at least one activity required. A new user who
   arrives through an activity link plays it straight away; that activity is
   ticked when the Selection screen first appears. Until the first Selection,
   the Board is the set of activities the user has played.
3. Existing users keep their current board as their Selection.
4. The Board always holds at least one activity once chosen. The user can
   change it at any time from the Selection screen at `/activities` (also the
   first-visit screen; `noindex`, not in the sitemap or `llms.txt`), from the
   Board's Shelf section, or from the drawer. Tiles have no remove control.
5. A finished activity moves to the Shelf. On the next visit to the Board the
   user gets one Suggestion: up to three Shelf activities, multi-select,
   ranked repeat due, never started, started, finished, with the activity just
   finished last. Declining is final for that event, except when the Board
   would be empty.
6. A finished activity no longer returns to the Board on its own. One month
   after it was finished it is repeat due: it ranks first among suggestions
   and carries a "Repeat due" mark on the Shelf. There is no prompt.
7. Moving an activity to the Shelf keeps its progress. Adding a finished
   activity back resets its regular rounds and its completion date, and keeps
   its past mistakes, so it can show what is due straight away.
8. Playing a Shelf activity through a link is practice only; its results
   screen offers "Add to your Board".
9. The daily goal is a round in every activity on the Board. A day already
   completed stays completed when the Board changes.
10. A newly released activity starts on the Shelf for users who already have a
    Board. The first time they open the Board after the release they get a
    one-time New Suggestion for it, unticked. Declining leaves it on the Shelf.
11. The Board choice is included in backup, restore and reset. A reset shows
    the Selection screen again. Test mode keeps its own Board choice and starts
    at the Selection screen.
12. Mistakes to retry tiles still appear for Shelf activities.

13. Implementation (PR for #117): the Board lives in `spanish-quiz-board-v1`
    (`app/board-state.ts`). Schema 2 (decision 0010) derives an existing
    user's Board from what their board showed and removes the
    `spanish-quiz-reinstated-v1` key; a device with no progress gets no Board
    and its user sees the Selection screen. The welcome tutorial is not offered
    on the visit that shows the first-visit Selection screen. A day with an
    empty Board (its last activity just finished) counts once a round was
    played that day.

## Consequences

- Scheduled for roadmap Cycle 6 (issue #65), after #160, #161 and #141, which
  change the same stored data.
- The backup key list must also gain the completions, locked days, streak
  ledger and flashcard days keys it misses today (found in PR #99).

- The daily goal is as large as the user makes it, so new releases never
  raise it without the user's consent.
- The one-month automatic return and the "show on main screen" setting are
  replaced; existing reinstated choices become Board membership.
- Every new activity must appear on the Selection screen and the Shelf, and
  must not be added to existing users' Boards by default.
