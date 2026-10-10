# Explanation quality spec

Every quiz explanation teaches the rule from the sentence the learner just saw.
The target reader is a post-beginner (roughly A2 to B1): the version that teaches
the rule fastest, with the least noise, wins.

## Shape

1. **Cue.** The word or context in this sentence that decides the answer.
2. **Rule.** The grammar rule, in one line.
3. **Contrast.** Why the nearest wrong option fails. Only when it helps.

Good: "Cuando llegaban sets a repeated background scene in the past, so imperfect
preparaba. The preterite would present it as one finished event."

Bad: "Use “preparaba”, the imperfect form of “preparar”, in this past-tense
context." It repeats the answer and never says what in the sentence decides it.

## Rules

- English only.
- At most 2 sentences and 200 characters.
- Do not open by restating the answer ("Use “X”...").
- No em dashes or en dashes.
- Every item outside Por vs Para carries a `cue` field: a word or phrase copied
  from the sentence (outside the blank) that the explanation names verbatim.
  Por vs Para keeps its per-sentence explanations from #109 and is exempt from
  the cue check.

## Enforcement

`tests/explanation-quality.test.mjs` applies these rules to every quiz item,
using `scripts/explanation-lint.mjs`. Items that fail today are listed in
`tests/explanation-quality-baseline.json`. The test fails when an item outside
the list fails, or when a listed item starts passing and the list was not
shortened. The list must be empty before the explanation work is merged.

Refresh the list after fixing items:

```
node --experimental-strip-types scripts/explanation-lint.mjs --write-baseline
```
