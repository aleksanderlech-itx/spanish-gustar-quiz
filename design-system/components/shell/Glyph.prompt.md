Use `Glyph` anywhere an icon is needed — the system has no icon font and no drawn SVGs.

```jsx
<Glyph name="correct" color="var(--state-correct)" />
<Button variant="secondary" aria-label="OK"><Glyph name="correct" size="24px" color="var(--state-correct)" /></Button>
```

Glyphs are decorative by default (`aria-hidden`); always keep the adjacent text label.
