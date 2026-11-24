# 0015. Design brief: what is fixed and what is open

- Status: Accepted
- Date: 2026-11-24
- Source: design brief session, 24 Nov 2026; `docs/design-brief.md`

## Context

A UX/UI designer is joining the project. The repository held three design
references written at different times (`DESIGN.md` with
`docs/design-system-gpt/`, the historical `design-system/`, and
`docs/design.md`), and open PR #90 proposed replacing `design-system/` with a
fourth. Project rule 4 ("border radius reduced by 50% relative to the current
design") had no fixed base, so nobody could tell what it required. The
designer needs to know which principles hold and where she has room to
create.

## Decision

1. The designer owns UX, UI and the design system (tokens and components
   developers build from). Her brief is `docs/design-brief.md`.
2. Fixed principles: mobile first; light and dark as equals; accessibility
   (44px targets, visible focus, reduced motion, natural wrapping of Spanish);
   the active exercise is the only strongly emphasised surface in a round; no
   accounts; test-mode hints in every interface; one shared footer; Ko-fi for
   tips only; no analytics before consent.
3. Everything else is open. The approved "Spanish Editorial Learning" look is
   a starting point; she may propose a new direction with reasons.
4. Project rule 4 (radius) is removed. Radius and shape are hers to define;
   the values in `DESIGN.md` apply until her system replaces them.
5. Voice is open. Project rules 2 (no em or en dashes) and 3 (professional
   tone, no emoticons) stay in force until a new decision record changes
   them.
6. PR #90 is closed without merging, so she inherits one approved reference
   rather than another competing one.
7. Priorities, in order: round screen, Board/Shelf/drawer, first visit,
   results and progress, Sentence Builder, new Activity types.

## Consequences

- A change to a fixed principle, or to rules 2 or 3, needs a new decision
  record before it ships.
- When the designer's system lands, `DESIGN.md` and the brief are updated to
  point at it, and the historical references can be retired.
- Rule 4 keeps its number in the Project rules list, marked removed, so
  references to later rule numbers stay valid.
