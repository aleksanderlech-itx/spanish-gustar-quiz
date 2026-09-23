Use `Card` for any grouped block — decks, question prompts, results, quiet supporting panels.

```jsx
<Card shape={1} elevated>
  <h3>Ser vs estar</h3>
</Card>
<Card shape={2} tone="panel">Weak areas</Card>
```

- Increment `shape` down a list so adjacent radii differ.
- `elevated` belongs to the active exercise only; supporting panels stay flat.
