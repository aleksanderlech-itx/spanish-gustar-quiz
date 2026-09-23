Use `QuizHeader` only while a round is in progress.

```jsx
<QuizHeader current={4} total={10} onBack={leave} />
```

Answered steps fill with primary, the current step with sun, upcoming steps stay empty. Matches `.round-header` in `app/quiz-layout-fix.css`.
