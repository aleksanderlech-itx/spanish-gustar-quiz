# Spanish Quizzes

A site for practising Spanish grammar through short daily rounds across several activities.

## Language

**Activity**:
One practice unit the user can put on their Board: a topic quiz or the verb flashcard deck.
_Avoid_: topic (when meaning flashcards too), module

**Board**:
The user's chosen set of Activities, shown on the home page. Always holds at least one Activity.
_Avoid_: dashboard, library

**Shelf**:
Every Activity that is not on the Board, whether the user never chose it or it was Finished.
_Avoid_: hidden, archive, aside

**Selection**:
The act of choosing which Activities are on the Board, on first visit or at any later time.
_Avoid_: setup (when meaning later edits)

**Finished**:
An Activity whose completion rule has been met; it moves from the Board to the Shelf. Flashcards is never Finished.
_Avoid_: done, mastered

**Repeat due**:
A Finished Activity one month or more after it was Finished. It ranks first among suggestions; it does not return to the Board on its own.

**Suggestion**:
The offer, made when an Activity is Finished, to move one or more Activities from the Shelf to the Board. May include the Activity just Finished.

**Daily goal**:
A round in every Activity on the Board today. Meeting it extends the streak.

## Relationships

- Every **Activity** is on exactly one of the **Board** or the **Shelf**
- A **Finished** **Activity** moves to the **Shelf** and triggers a **Suggestion**
- The **Daily goal** is defined by what is on the **Board**

## Example dialogue

> **Dev:** "When Ser vs Estar is **Finished** and it was the only **Activity** on the **Board**, what does the user see?"
> **Domain expert:** "A **Suggestion** they must act on: add something from the **Shelf**, possibly Ser vs Estar again, because the **Board** can't be empty."

## Flagged ambiguities

- "Hidden" was used in code for Finished quizzes and by the user for unchosen Activities: resolved, both are on the **Shelf**.
- "Topic" is used in UI copy for quizzes only; **Activity** covers quizzes and flashcards.
