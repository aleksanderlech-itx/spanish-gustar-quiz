Use `ProgressBar` for completion within a deck or a round.

```jsx
<ProgressBar value={7} max={10} label="Round progress" valueLabel="7 / 10" />
<ProgressBar value={80} fill="var(--state-correct)" height="12px" />
```

Never round the caps, never gradient the fill.
