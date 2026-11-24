# 0014. One footer, shared by every page

- Status: Accepted
- Date: 2026-11-23
- Source: PR #174 (issue #72 review)

## Context

The site had two footers. Every page showed a one-line footer from the layout
(About, Notes, Content sources, Ko-fi, Privacy, Cookie settings). The grammar
quiz pages and Flashcards added a second footer of link columns, each with a
different, hand-written list: grammar pages listed the other quizzes and
Flashcards, Flashcards listed the grammar quizzes. Sentence Builder had
neither list, and appeared in no one's. The owner decided the footer must be
the same on every page.

## Decision

1. One footer, `app/site-footer.tsx`, rendered once by `app/layout.tsx`. No
   page renders a footer of its own.
2. It lists every activity from `ACTIVITY_REGISTRY`, in registry order, on
   every page, the current one included. A new activity appears there without
   a footer change.
3. Beside the activities: How to use, Notes on Spanish grammar, About, Content
   sources and the Ko-fi link. Below: the site note, Privacy and Cookie
   settings.
4. The two footers are merged: the one-line footer's links live in the shared
   footer, not twice.

A call to action at the end of an article (Notes, About, How to use: "Ready to
practise?") is page content, not a footer, and stays.

## Consequences

- Pages are consistent, and no activity is missing from a hand-written list.
- The footer is longer on every page, including round screens, where it sits
  below the round.
- Changing a footer link changes it everywhere; a page cannot add its own.
  `tests/site-footer.test.mjs` checks both.
