A full-width answer row in Choose mode, with distinct selected, correct and wrong states. One choice in a Choose-mode question. Choose grades immediately.

- `surface` row, `border-ink` outline, `radius-control`, at least 48px, text in the `action` style. It grows to fit long answers.
- Selected: `primary-soft` wash (plus a `primary` edge in dark).
- Graded: correct = `sage` edge on `sage-soft`; wrong = `danger` edge on `danger-soft`; the other options fade to `panel-soft` with a `line` edge. Always add a text tag, not colour alone.
- Use a native radio or button so keyboard order stays predictable.
- **Consumer provides:** the option text (`lang="es"`) and the graded state.

Static rendition, hand-written from `app/quiz-layout-fix.css`.
