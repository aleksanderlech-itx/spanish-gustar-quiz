Use `Select` when a learner picks one of a short known list — topic, level, deck.

```jsx
<Select id="topic" label="Topic" options={["Ser vs estar","Gustar patterns","Preterite vs imperfect"]} />
```

Unlike `Input`, `Select` carries the 4px offset because it is a control you open, not a field you fill.
