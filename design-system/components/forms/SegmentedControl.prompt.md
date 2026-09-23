Use `SegmentedControl` for 2–3 exclusive modes shown side by side.

```jsx
<SegmentedControl options={["Choose","Type"]} value={mode} onChange={setMode} />
```

Keep labels to one word. Four or more options belong in a `Select`.
