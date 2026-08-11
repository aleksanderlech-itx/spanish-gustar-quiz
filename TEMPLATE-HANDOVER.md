# Reusable quiz template handover

This project is now split into three layers:

| Layer | Files | What to change |
| --- | --- | --- |
| Quiz content | `app/quiz-data.ts`, `app/translations.ts`, `app/complex-questions.ts` | Questions, accepted answers, translations, explanations, levels and filter values |
| Quiz logic | `app/quiz-logic.ts` | Scoring, answer normalization, filters, missed-answer practice and set restarts |
| Interface | `app/page.tsx`, `app/globals.css` | Layout, navigation, audio, explanation switch, mobile keyboard handling and presentation |

The current Spanish Gustar Quiz remains a working example of the template. Its question content is no longer embedded in the interface component.

## Use it in another ChatGPT Project

1. Add the reusable source package to the new ChatGPT Project.
2. Start a new chat and describe the new subject, learner level, number of questions and answer format.
3. Ask ChatGPT to change only the content layer unless the new quiz genuinely needs different behaviour.
4. Review a representative sample of questions before generating the complete bank.
5. Ask ChatGPT to run the existing tests, add content-specific tests and publish under a new site name. State clearly that the original Gustar Quiz must not be modified.

Suggested starting prompt:

> Create a new public quiz from the attached reusable quiz template.
>
> Quiz name: [name]
> Subject: [subject]
> Learner level: [level]
> Number of questions: [number]
> Answer format: [what the learner types]
> Translation language: English
> Explanation: available through the existing switch
>
> Preserve the template's design, mobile layout, navigation, scoring, filters, audio behaviour, translations, explanations, progress history and keyboard handling. Replace the quiz content in the data layer. Do not modify or replace the Spanish Gustar Quiz. Show me ten representative questions for review before generating the full bank, then test and publish it under a new site name.

## Content structure

Each finished question delivered to the interface has:

- `id`: stable unique number
- `before` and `after`: sentence text around the answer field
- `answer`: complete normalized accepted answer
- `infinitive`: label and verb-filter value
- `translations.en`: permanently visible translation
- `explanation`: optional explanation text
- `level`: `basic`, `intermediate` or `advanced`
- `subjectNumber`, `objectPronoun`, `verbAnswer` and `isActivity`: learning-analysis metadata

For this Gustar quiz, the compact rows in `QUESTION_BANKS` generate the final answers from `VERB_FORMS`. Advanced sentences are stored in `app/complex-questions.ts`. English translations for the compact rows are stored in the same group order in `app/translations.ts`.

For a quiz with a different answer model, replace the content builder in `app/quiz-data.ts` so it still exports `ALL_QUESTIONS` with the same finished shape. The interface and scoring logic can then remain unchanged.

## Important reuse rules

- Give every question a stable, unique `id`. Changing IDs resets the connection to saved history.
- Keep the accepted `answer` in lowercase unless you intentionally extend `normalizeAnswer`.
- Preserve `ALL_QUESTIONS` and `VERB_FORMS` exports because the interface uses them.
- Keep translations and explanations non-empty.
- Change the local-storage keys and exported backup filename for a new quiz so browser progress cannot collide with another quiz.
- Update the title, headings, footer text and accessible answer-field label for the new subject.
- Publish as a separate site with a new slug and URL.

## Verification checklist

- Content tests pass and all question IDs are unique.
- Correct answers score correctly after trimming and case normalization.
- English translation is always visible.
- Explanation can be shown and hidden independently.
- Listen reads the Spanish sentence and does not reveal the answer before checking.
- Back, Next and Check answers work with keyboard and touch.
- On mobile, the action bar remains above the device keyboard.
- Filters, missed-answer practice, history, backup import/export and synchronization still work.
