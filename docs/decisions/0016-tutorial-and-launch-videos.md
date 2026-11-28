# 0016. Tutorial videos and activity launch posts

- Status: Accepted
- Date: 2026-11-23
- Source: issue #20 (tutorial videos), issue #65 (roadmap and launch posts),
  `docs/code-and-roadmap-review-2026-11.md` (sections Q and R1), PR #103

## Context

The project makes two kinds of video in `tutorial-videos/`, rendered with
Remotion. Four tutorials explain the app (issue #20) and play on `/how-to-use`
and on social media. A 35-second grammar lesson announces each new activity
from the roadmap (issue #65) on Instagram and Facebook. How they were made and
published was written only in `tutorial-videos/README.md` and
`tutorial-videos/SOCIAL-POSTS.md`, with no record of why. The November review
found four open questions: 50 MB of zip files committed to git, Cycle 4 shipping
nine days before its planned posts, no posts planned after Cycle 4, and an exact
sentence count in the captions.

## Decision

### Tutorial videos

1. The tutorial captions come only from the steps in `app/tutorials.ts`. The
   clips, the How to use page and the welcome tutorial therefore say the same
   thing. Each step has one scene; `tests/tutorials.test.mjs` fails if the
   counts differ.
2. Changing a tutorial step means re-rendering and committing the updated clips
   and posters in `public/tutorials/` in the same PR.
3. The phone mockups use the app's light-theme tokens, fonts and brand mark.
4. Each tutorial is rendered in three formats: `-reel` (1080x1920, 9:16) for
   Reels and Stories, `-feed` (1080x1350, 4:5) for feed posts, and `-app`
   (720x900) for the player on `/how-to-use`.

### Activity launch posts

5. Every new activity gets a 35-second grammar lesson, rendered as a Reel
   (9:16) and a feed post (4:5).
6. The PR that adds an activity also adds its lesson slides in
   `tutorial-videos/src/lessons/content.ts`, and its titles, captions and two
   dated rows in `tutorial-videos/SOCIAL-POSTS.md`.
7. The Reel goes out on the planned release Monday and the feed post on the
   Thursday after, both at 12:00 Europe/Madrid on Instagram and Facebook. The
   feed post carries a quiz question; the comment answering it is pinned a day
   after posting.
8. A post goes out only once its activity is live on spanish-quizz.es: its
   issue is closed and the production deploy has run. If a release is late,
   its two posts move by the same number of days, and later cycles keep their
   dates unless they are late too. If a release is early, the posts keep their
   planned dates.
9. Captions follow the project rules: "about 150" sentences, never an exact
   count (rule 6), and no membership wording for Ko-fi (rule 9).

### Both

10. Every clip uses "Old School Salsa 03" by vjgalaxy (Pixabay Content
    License) at 56% volume, fading out over the last 1.5 seconds. Each caption
    credits the track.
11. Rendered files are not committed, except the in-app clips and posters in
    `public/tutorials/`. The upload bundles (all tutorial clips, all launch
    clips) are attached to a GitHub release, not committed to the repository.

## Consequences

- One place to edit tutorial text; the test catches a step without a scene.
- Every activity PR is larger: it carries the lesson and the post copy as
  well as the content and its Notes entry.
- The social calendar never runs ahead of production, at the cost of posts
  going out later than an early release could allow. Cycle 4 (present
  continuous, live on 7 Nov) kept its 16 and 19 Nov dates.
- The zip files in `tutorial-videos/exports/` must move to a GitHub release
  and the README must point there. Until that is done they stay in git.
- The lesson end card in `tutorial-videos/src/lessons/Lesson.tsx` still says
  "150 practice sentences". Fixing it means re-rendering the launch clips.
- The captions were changed to "about 150" in the PR that adds this record,
  which supersedes PR #103.
