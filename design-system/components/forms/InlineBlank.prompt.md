Use `InlineBlank` inside a Spanish prompt so the phrase keeps reading as a phrase.

```jsx
<div style={{fontSize:"var(--text-prompt)"}}>La sopa <InlineBlank /> fría.</div>
<div style={{fontSize:"var(--text-prompt)"}}>La sopa <InlineBlank value="está" filled /> fría.</div>
```

Never shrink the prompt to fit the blank — widen the blank or let the sentence wrap.
