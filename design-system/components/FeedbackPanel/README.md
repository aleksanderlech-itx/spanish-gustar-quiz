The outcome label and grammar explanation shown after an answer is graded. Explains the outcome. It stays until the learner moves on.

- 14px padding, `radius-panel` corners. Correct = `sage` border on `sage-soft`; wrong = `danger` border on `danger-soft`.
- Label: 12px bold uppercase with 0.1em tracking, in `sage` or `danger`. Body: 15px `ink`.
- Fades in over `motion-reveal`, with no animation under reduced motion. Announce it politely (`role="status"`).
- **Consumer provides:** the outcome and the explanation text.

Static rendition, hand-written from `app/quiz-layout-fix.css`.
