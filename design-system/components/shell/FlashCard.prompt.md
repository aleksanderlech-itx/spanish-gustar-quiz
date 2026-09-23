Use `FlashCard` as the single elevated surface in a flashcard session.

```jsx
<FlashCard term="llegar" meta="Box 1 · due now" onReveal={reveal} />
<FlashCard revealed term="llegar" meaning="to arrive"
  example="El tren va a llegar tarde." exampleEnglish="The train is going to arrive late." meta="Box 1 · due now" />
```

Pair it with a footer: a teal Reveal button before reveal, then the icon-only ✖ / ✔ (Not OK / OK) buttons.
