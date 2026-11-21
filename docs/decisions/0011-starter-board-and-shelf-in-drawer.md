# 0011. New users start with a starter Board; the Shelf lives in the drawer

- Status: Accepted
- Date: 2026-11-21
- Source: review of PR #169 (issue #117); amends rules 2 and 4 of [0008](0008-user-chosen-board.md)

## Context

Decision 0008 showed a new user the Selection screen before the Board, and
put the Shelf in a collapsed section at the bottom of the Board. On review of
the preview, the owner preferred that a new user starts practising at once,
with a sensible set already chosen, and that the Shelf has one permanent home.

## Decision

1. A new user does not see the Selection screen first. Their first Board is
   the starter Board: Gustar, Por vs Para, Preterite vs Imperfect and Saber vs
   Conocer, plus any activity they already played through a link.
2. In that first browser session, the Shelf shows below the Board, expanded.
   From the next session on, the Shelf is only in the drawer.
3. The Shelf is the first row of the drawer menu ("On your shelf"), with each
   activity's status, "Add to board" and "Edit your activities". It is no
   longer under Settings.
4. The welcome tutorial is not offered on the first visit; it is offered from
   the next visit on.
5. `/activities` stays the place to change the whole choice.

Everything else in 0008 stands.

## Consequences

- The starter set is fixed in `STARTER_BOARD` (`app/board-state.ts`). A newly
  released activity is not added to it by default; changing the starter set
  is a decision of its own.
- A new user meets a daily goal of four activities without choosing it; the
  expanded Shelf on the first visit shows what else exists.
