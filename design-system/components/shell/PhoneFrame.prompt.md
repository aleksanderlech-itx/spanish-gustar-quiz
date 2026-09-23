Use `PhoneFrame` when showing a Spanish Quizzes screen inside a wider layout (spec pages, kits, slides).

```jsx
<PhoneFrame height={620}>
  <AppHeader title="Spanish Quizzes" badge={12} />
  {/* screen body */}
</PhoneFrame>
```

It is presentation chrome only — never ship it inside the app itself.
