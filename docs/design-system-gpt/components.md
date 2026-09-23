# Components and flows

Visual descriptions below come from the reference; interactive behavior is the proposed specification unless identified as an existing repository contract. Examples are illustrative, not live learner data.

## Shared components

| Component | Anatomy and visual treatment | Behavior and states |
|---|---|---|
| App header | Menu or back/close control; product or screen title; optional count | Name icon actions. Maintain heading hierarchy. Navigation must preserve saved progress. Confirm only when actual unsaved work would be lost. |
| Primary button | Teal solid surface, white Karla label, optional trailing arrow | Default, hover, focus, pressed, disabled, busy. At least 44px high; content wraps if necessary. One dominant action per screen. |
| Secondary button | Quiet surface, visible outline, Ink/Teal label | Same state coverage as primary. Use for `Again` or a secondary navigation action. |
| Topic card | Illustration, title, progress count, progress bar, difficulty badge | Entire destination can be a named link, avoiding nested interactive controls. Show zero-progress and unavailable states explicitly. |
| Featured topic | Editorial title, summary metrics, leaf motif, primary action | Decoration never overlaps text. Distinguish completion from accuracy. Values must come from learner data. |
| Level badge | Compact A1/A2/B1 label | Difficulty is neutral classification, not correctness. Use consistent styling for a level across all screens. |
| Progress indicator | Teal fill on quiet track with numerical text | Fill and label share the same numerator/denominator. Expose an accessible name and value; never imply progress from animation alone. |
| Question surface | Instruction, optional difficulty badge, large Spanish prompt, audio control | Long text expands the surface. Audio gets a specific name and an unavailable state. Keep supporting help outside answer labels. |
| Answer option | Full-width bordered row, radio indicator, answer text | Default, hover, focus, selected, correct, incorrect, disabled. Use a single labeled radio group. Selection is visually distinct from grading. |
| Typed answer | Labeled text input with help/error association | Proposed counterpart to the reference's `Type` option. Preserve input on error; Enter follows existing submit rules; support accents and IME composition. |
| Feedback panel | Icon, short outcome label, explanation | Success/error text plus semantic color. Announce new feedback politely. Keep explanation available until learner advances. |
| Flashcard | Tall editorial surface with centered term, audio, reveal cue | Unrevealed, revealed, assessed, complete. Reveal is keyboard operable. Audio must not trigger reveal accidentally. |
| Score summary | Large Fraunces fraction and separate accuracy label | Use real totals. If no answers were graded, show an explicit empty result rather than dividing by zero. |
| Review row | Status icon, grammar area or mistake count, optional chevron | Use success icons for mastered examples and review wording for mistakes. A chevron only appears on an actual destination. |
| Practice options | Disclosure heading, grouped segmented choices, verb checkboxes | Heading button exposes expanded state. Each choice group has a legend; single choices use radios, multi-choice verbs use checkboxes. |

## Library

Reference hierarchy: `Spanish Quizzes` header → `Your learning` → featured `Gustar patterns` → `All topics` → compact topic rows. The illustrated topics include Ser vs estar, Gustar patterns, Por vs para, and Preterite vs imperfect.

Specification: treat these as examples of reusable topic cards, not a hard-coded topic limit. A fresh learner sees zero progress and a clear start action. Keep completed counts, percentages, and accuracy distinct. A topic with no available questions needs an explanation, not a start action that fails silently.

## Quiz

Reference hierarchy: close → `7 of 10` and bar → instruction and `Me gusta el café.` → four English answers → conjugation help → correct-answer explanation → `Next question`.

Specification: unanswered → selected → graded feedback → next question. Grading timing must follow the existing quiz contract; the image does not establish whether selection or submission grades an answer. Do not add auto-grading or change round persistence during visual adoption. Distinguish selected answers with the radio state and correct/incorrect answers with explicit feedback. Disable double advancement. The next question must receive a sensible reading/focus position.

Help such as `View conjugation` is a real action or link. If it opens an overlay, support close, Escape, appropriate focus handling, and focus restoration. Typed mode uses the same feedback hierarchy and equivalent grading behavior.

## Flashcards

Reference hierarchy: close → `Flashcards` and count → centered `gustar`, audio, `Tap to reveal` → `Again` and `Got it` actions.

Correction: the image visibly presents recall controls on the unrevealed card. Existing [UX-CONTRACT.md](../../UX-CONTRACT.md) requires revealing the English meaning and Spanish example before recall can be assessed. Hide or disable assessment until reveal; retain their layout space if needed to avoid shifting the card.

Preserve the existing five-box Leitner model, immediate persistence after assessment, and due-card ordering. This visual system does not redefine scheduling or migration. Do not copy the image's `3 of 12` as a fixed session size. An empty due queue needs honest completion feedback and a supported next action.

## Results

Reference hierarchy: `Round complete!` → `8 / 10` and `80% accuracy` → `What you did well` → `Review these areas` → mistakes callout → `Practice 2 mistakes` → `Back to topics`.

Specification: score and percentage use the same graded answers. Review categories must match the practiced topic; the image's Ser/Estar categories are not content for a Gustar round. Zero mistakes removes the mistakes CTA and presents an appropriate next-practice action. Singular/plural counts must read naturally. Avoid automatic navigation or celebrations that block results. Decorative confetti is optional and absent under reduced motion.

## Topic detail and settings

Reference hierarchy: back → `Gustar patterns` and leaf motif → completion and accuracy → `Start practice` → expanded `Practice options`.

The board illustrates question counts 5/10/20, answer modes Choose/Type, levels A1/A2/B1, and verb checkboxes. These are reference examples, not proof that every combination is supported by the current engine. Future adoption must derive options from actual topic configuration.

Specification: keep selections visible and persistent according to existing settings behavior. When filters yield no questions, explain how to broaden them; do not start an empty round. If no verb is selected, show an inline correction. Keyboard arrows move among native radio choices; Space toggles checkboxes. Settings disclosures remain usable at narrow widths and with enlarged text.

## States absent from the board

- Loading: stable region with concise status; no fabricated progress or counts.
- Failure: specific error and retry action; preserve existing answers/settings.
- Offline/sync unavailable: keep local learning usable, consistent with repository behavior; distinguish local save from confirmed synchronization.
- Empty content: explain what is empty and provide a supported recovery action.
- Long content: wrap Spanish prompts, translations, labels, and feedback without hiding meaning.
- Disabled/busy: explain unavailable actions where necessary and prevent duplicate work.

These are requirements for future implementation verification, not states validated by this documentation change.
