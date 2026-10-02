The one teal action that moves the learner forward: Continue practice, Check, Next, Start. Use one per screen, as the main way forward. It is the only teal-filled control.

- Fill `primary`, label `primary-ink` in the `action` style, `radius-control` corners, at least 48px tall (54px on flashcards, 56px for "Practise mistakes" on results).
- Hover mixes 12% `ink` into the fill. Pressed moves down 1px. Disabled uses a `panel` fill with a `muted` label and a `line` border, and cannot activate.
- When busy, keep its width and height and block duplicate submits.
- An optional trailing arrow icon is decorative.
- **Consumer provides:** the label, the handler or href (a link for navigation, a button for an action), and the disabled/busy state.
- Don't put two primaries side by side. Pair one with a SecondaryAction instead (Skip + Next).

Static rendition, hand-written from `app/quiz-layout-fix.css`.
