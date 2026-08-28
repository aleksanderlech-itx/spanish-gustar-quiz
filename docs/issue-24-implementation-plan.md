# Issue #24 implementation plan

## Goal

Implement the content changes requested in issue #24:

1. Export all quiz and flashcard content for review.
2. Review and improve sentence quality.
3. Replace generic flashcard examples with meaningful examples.
4. Add English translations for flashcard example sentences.
5. Normalize each quiz to about 150 training entries.

## Stage 1: Content export and audit

Create a repeatable export script rather than a one-off manual export.

Generate CSV files, preferably under `exports/`:

- `quiz-gustar.csv`
- `quiz-ser-estar.csv`
- `quiz-preterite-imperfect.csv`
- `flashcards.csv`
- optionally `all-content.csv` as a combined review file

The review format should contain enough context to edit content safely, for example:

`type | topic | spanish | english | answer/form | explanation/example | status`

Use the export to establish the exact current question counts and identify weak, duplicated or incomplete content before editing the source datasets.

## Stage 2: Review and clean Spanish content

Audit all three quiz datasets and the flashcard content for:

- grammatical correctness
- natural Spanish rather than technically correct but artificial phrases
- natural English translations
- duplicate and near-duplicate questions
- consistent punctuation and capitalization
- whether the intended grammatical distinction is actually clear
- usefulness for approximately A2-B1 learners
- unnecessary ambiguity or dependence on missing context

Keep the Spanish broadly region-neutral and preserve existing application behaviour such as the `vos` setting.

## Stage 3: Improve all 500 flashcards

The current flashcard system contains manually authored examples for selected verbs and generates generic fallback examples for the rest, including patterns such as `Voy a <verb> hoy.` and `Voy a <verb> eso hoy.`.

Replace this with explicit content for every flashcard.

Extend the flashcard data model to include:

```ts
{
  rank: 123,
  spanish: "resolver",
  english: "to solve",
  example: "Tenemos que resolver este problema.",
  exampleEnglish: "We have to solve this problem."
}
```

Requirements:

- all 500 verbs have a meaningful Spanish example
- all 500 examples have a natural English translation
- examples demonstrate realistic use of the verb
- examples remain reasonably short and suitable for flashcards
- remove the generic `buildExample()` fallback once the dataset is complete

## Stage 4: Display example translations in flashcards

Update `FlashcardVerb` with an `exampleEnglish` field.

The revealed flashcard should display, in this order:

1. Spanish verb
2. English meaning
3. Spanish example sentence
4. English translation of the example

The English example translation should be visually secondary to the Spanish sentence but clearly readable.

Example:

**resolver**  
to solve

*Tenemos que resolver este problema.*  
*We have to solve this problem.*

Preserve the existing Leitner behaviour, speech button, reveal interaction and progress storage.

## Stage 5: Normalize quiz datasets

Target exactly 150 high-quality entries in each quiz dataset:

| Quiz | Target |
| --- | ---: |
| Gustar-style verbs | 150 |
| Ser vs Estar | 150 |
| Preterite vs Imperfect | 150 |
| Total | 450 |

Treat 150 as a content requirement rather than a runtime sampling limit. Each underlying dataset should actually contain 150 reviewed questions.

Balance each dataset across the concepts it teaches rather than reaching the target through repetitive variants.

For example, Ser vs Estar should cover identity, origin, defining characteristics, material/time, location, conditions, changing states and other relevant distinctions in reasonable proportions.

Preterite vs Imperfect should balance completed events, sequences, starts/changes, habits, ongoing/background actions, descriptions and interruptions.

Gustar-style content should maintain useful variation across verbs, pronouns, singular/plural agreement and sentence structures.

## Stage 6: Automated content validation

Extend the existing test suite with content-quality checks.

Validate that:

- each quiz contains exactly 150 questions
- flashcards contain exactly 500 verbs
- every flashcard has Spanish and English verb text
- every flashcard has a Spanish example
- every flashcard has an English example translation
- IDs/keys that must be unique remain unique
- duplicate Spanish/example combinations are rejected
- generic placeholder patterns such as `Voy a ... eso hoy.` do not remain
- required quiz fields are populated
- existing quiz, flashcard and rendered-HTML tests continue to pass

## Stage 7: Final verification

Run the complete test and production build suite.

Regenerate the CSV exports from the final source content and review them as the final content snapshot.

Verify the flashcard UI on desktop and mobile, including:

- front/reveal interaction
- English example translation readability
- audio button
- Again / Knew it actions
- Leitner progression
- completion state

Verify representative questions from all three quizzes and confirm that existing progress, settings, backup and mistake-notebook behaviour remains unaffected.

## Implementation workflow

Implement on a dedicated branch such as:

`content/issue-24`

Recommended execution order:

1. Export and audit
2. Flashcard data and translations
3. Flashcard UI
4. Quiz content expansion and cleanup
5. Validation tests
6. Full build and regression testing
7. Regenerate final review exports
8. Deploy branch to staging for review
9. Merge into `main` after approval

Keeping these stages separate makes the large content change easier to review and prevents hundreds of content edits from being mixed with unrelated application changes.