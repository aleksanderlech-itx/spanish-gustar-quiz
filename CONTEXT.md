# Spanish Quizzes

A site for practising Spanish grammar through short daily rounds across several activities.

## Language

**Activity**:
One practice unit the user can put on their Board: a topic quiz, the verb flashcard deck, or Sentence Builder.
_Avoid_: topic (when meaning flashcards too), module

**Activity type**:
The format an Activity uses: fill-in-the-blank quiz, flashcards, or sentence building. Several Activities can share one type.
_Avoid_: mode (that is the choose or type answer setting)

**Sentence Builder**:
The Activity where the learner sees an English prompt and puts shuffled Spanish Tokens in order. One Activity, its Items grouped by pattern (questions, negatives, pronouns and so on).

**Token**:
One piece a learner places in Sentence Builder: a word, or a fixed chunk such as "se lo" or "por favor". Punctuation and capital letters are never Tokens.
_Avoid_: tile, chip, word (when it may be a chunk)

**Accepted order**:
A sequence of an Item's Tokens that counts as right. Each Item has one or more; any other order is wrong, and an order that is also correct Spanish must be listed.

**Item**:
One exercise in an Activity: a sentence in a quiz, a card in flashcards, a sentence to build in Sentence Builder. Its id never changes.
_Avoid_: question (when meaning flashcards or Sentence Builder too)

**Group**:
A set of an Activity's Items that practise one thing: a verb in Gustar, a usage in Saber vs Conocer, a pattern in Sentence Builder. The learner filters by Group, and a mistake is filed under one.
_Avoid_: infinitive (most Groups are not verbs), subtopic, category

**Group label**:
The text a learner sees for a Group ("past meaning"). It can change at any time; what is stored is the Group's fixed key ("past-meaning").

**Rule**:
The grammar point a mistake is filed under in the notebook. Usually the Item's Group; in Preterite vs Imperfect it is the tense.
_Avoid_: subtopic label (the label is only how a Rule is shown)

**Board**:
The user's chosen set of Activities, shown on the home page. It always holds at least one Activity. Before the Starter Board exists, the Board is the set of Activities the user has played.
_Avoid_: dashboard, library

**Shelf**:
Every Activity that is not on the Board, whether the user never chose it or it was Finished. Shown in the drawer; on a new user's first visit also below the Board.
_Avoid_: hidden, archive, aside

**Selection**:
The act of choosing which Activities are on the Board, at any time after the first visit.
_Avoid_: setup

**Starter Board**:
A new user's first Board: Gustar, Por vs Para, Preterite vs Imperfect and Saber vs Conocer, plus any Activity already played. Made for them, not chosen.

**Finished**:
An Activity whose completion rule has been met; it moves from the Board to the Shelf. Flashcards is never Finished.
_Avoid_: done, mastered

**Repeat due**:
A Finished Activity one month or more after it was Finished. It ranks first among Suggestions and is marked on the Shelf; it does not return to the Board on its own.

**Suggestion**:
The offer to move one or more Activities from the Shelf to the Board. Made when an Activity is Finished (may include the Activity just Finished), and once for each newly released Activity (a New Suggestion).

**Daily goal**:
A round in every Activity on the Board today. Meeting it extends the streak.

## Relationships

- Every **Activity** is on exactly one of the **Board** or the **Shelf**
- A **Finished** **Activity** moves to the **Shelf** and triggers a **Suggestion**
- The **Daily goal** is defined by what is on the **Board**
- An **Activity** has one **Activity type**; **Sentence Builder** is the first **Activity** of its type
- Every **Item** belongs to one **Group**; renaming a **Group label** changes nothing a learner has stored
- A **Sentence Builder** **Item** has an English prompt, its **Tokens** and one or more **Accepted orders**; an answer is right or wrong as a whole
- Moving an **Activity** to the **Shelf** keeps its progress; adding a **Finished** **Activity** back to the **Board** starts its sentences over but keeps its past mistakes
- Playing an **Activity** from the **Shelf** is practice only; it joins the **Board** only if the user adds it
- A newly released **Activity** starts on the **Shelf** for users who already have a **Board** and is offered to them once as a New **Suggestion**
- Each time an **Activity** becomes **Finished** it triggers one **Suggestion**; declining it does not bring it back

## Example dialogue

> **Dev:** "When Ser vs Estar is **Finished** and it was the only **Activity** on the **Board**, what does the user see?"
> **Domain expert:** "A **Suggestion** they must act on: add something from the **Shelf**, possibly Ser vs Estar again, because the **Board** can't be empty."

## Flagged ambiguities

- "Hidden" was used in code for Finished quizzes and by the user for unchosen Activities: resolved, both are on the **Shelf**.
- "Topic" is used in UI copy for quizzes only; **Activity** covers quizzes and flashcards.
