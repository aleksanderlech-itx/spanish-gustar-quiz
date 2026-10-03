The typed-answer field for Type mode, with an accent key row. The typed answer in Type mode. It submits with Check or Enter.

- 52px tall, `paper` fill, `border-ink` outline, `radius-control`, 19px semibold Karla.
- Graded: `sage`/`sage-soft` or `danger`/`danger-soft`, as for AnswerOption.
- Accent keys are 44px squares on a `panel` row. They insert at the caret and keep the caret position.
- Keep IME and autocorrect behaviour intact, and keep the value if submission fails.
- **Consumer provides:** a visible label, the value, the submit handler and the graded state.

Static rendition, hand-written from `app/quiz-layout-fix.css`.
