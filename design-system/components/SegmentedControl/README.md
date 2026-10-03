Single-choice controls for practice options: answer mode and round length. Picks one value from a short set of supported options.

- Segmented: a `segment-track` with 4px padding and `radius-control`. Segments are 46px tall with `radius-segment` corners; the selected one gets a `surface` fill and a `border-ink` edge. In dark, the selected segment uses `primary-soft` with a `primary` edge.
- Picker grid: 48px `surface` buttons with `border-ink` outlines; the selected one gets `primary-soft`.
- Offer only the choices the topic supports. Explain an empty filter rather than starting an empty round.
- **Consumer provides:** the options, the selected value and the change handler. Label it with an eyebrow.

Static rendition, hand-written from `app/quiz-layout-fix.css`.
