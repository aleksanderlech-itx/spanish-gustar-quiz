Use `AnswerOption` for each choice in a Choose-mode round.

```jsx
<AnswerOption onClick={() => commit("fui")}>fui</AnswerOption>
<AnswerOption state="correct" disabled>fui</AnswerOption>
<AnswerOption state="wrong" disabled>iba</AnswerOption>
<AnswerOption state="other" disabled>voy</AnswerOption>
```

Stack them with a 10px gap. A tap commits; further taps are ignored.
