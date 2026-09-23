Use `Button` for any tappable action — checking an answer, advancing a round, opening a deck.

```jsx
<Button variant="primary" size="lg" fullWidth>Check answer</Button>
<Button variant="secondary">Back to library</Button>
<Button variant="ghost">Skip this one</Button>
<Button disabled>Reveal first</Button>
```

- One primary button per screen. Secondary sits beside it; ghost is for opting out.
- `disabled` drops the ink offset — the shadow is the affordance.
- Labels are sentence case, verb-first, no terminal period.
