# Code and roadmap review, November 2026

Reviewed: `main` at `3119796` (10 Nov 2026) and the roadmap in issue #65 (last
edited 7 Nov 2026). The Xteink side project (#107) is excluded, as requested.

This file lists problems with a proposed fix for each. Nothing in the app was
changed. Each finding carries a severity and how it was established:

- **Confirmed**: reproduced by running the built app in a headless browser, or
  by running the tool named.
- **From code**: read in the source, not executed.

## Status after the review (10 Nov 2026)

Decisions taken once the review was read. The findings below are kept as
written, with a "Resolved" or "Withdrawn" line where a decision closed them.

- The High and Medium findings are issues #138 to #152, listed in issue #65.
- Present continuous (#70) is confirmed released; the launch posts keep their
  planned dates.
- The Vosotros switch (#105) is cancelled and closed as not planned.
- The roadmap visualisation is dropped; PR #118 is closed without merging.
- Cycle 6 (14 Dec) becomes a maintenance cycle with #117 as its main item.

What was run: `npm run lint` (passes), `npm test` (215 tests pass),
`npx tsc --noEmit` (fails, see G1), `npm audit` (33 advisories, see G3), and a
Playwright script against `vinext start` for the browser checks.

## Fix first

| # | Finding | Severity |
| --- | --- | --- |
| A1 | Typed answers fail on a decomposed accent, a double space or a trailing full stop | High |
| A2 | Round and Flashcards render a blank page when browser storage is blocked or holds bad data | High |
| F1 | Google Analytics and Clarity load without consent, and there is no privacy page | High |
| G1 | TypeScript is never checked: 69 errors, 5 of them real | High |
| E1 | The home page serves the Gustar topic to crawlers and paints nothing until hydration | High |
| C1 | The streak and the board tiles disagree on what counts as done today | Medium |
| A3 | Reset all progress does not remove old flashcard progress, which then comes back | Medium |
| R1 | Roadmap status is out of date and the daily goal grows with every release | Medium |

## A. Bugs

### A1. Typed answers are compared too strictly (High, Confirmed)

`normalizeAnswer` in `app/quiz-logic.ts:28` only trims and lower-cases. In Type
mode all three of these were marked wrong:

- `está` typed as `a` plus a combining accent (some mobile and macOS keyboards
  produce this form);
- `nos  encanta` with two spaces;
- `es.` with a trailing full stop.

The roadmap has carried "answer normalization and multi-part answer
validation" since Cycle 3 with no issue behind it.

Fix: normalise to NFC, collapse inner whitespace, strip leading and trailing
punctuation (`. , ; : ! ? ¡ ¿`), then compare. Add an optional
`acceptedAnswers: string[]` to `Question` for sentences with more than one
correct form. Cover with cases in `tests/quiz-logic.test.mjs`.

### A2. Blank page on blocked or corrupt storage (High, Confirmed)

- With `localStorage` throwing (cookies blocked, some private modes),
  `/gustar?play=1` and `/flashcards` render an empty page. The board and the
  topic page still work because their reads are wrapped.
- With `gustar-quiz-progress-v1` set to `{"a":1}` or to invalid JSON, the round
  page is blank and stays blank on every visit.

Causes: `readStoredHistory` in `app/round.tsx:79` parses without a `try` and
calls `.flatMap` on whatever it gets; `readStoredDifficulty` in
`app/flashcards.tsx:37` and `changeDifficulty` are unguarded;
`updateStoredProgress` (`app/stored-progress.ts`) lets a quota error escape
from `finishRound` and `recordAnswer`, so the result screen never appears.
There is no `app/error.tsx`, so any throw unmounts the page.

Fix:

1. Give `app/storage.ts` two helpers, `readJson(key, guard, fallback)` and
   `writeJson(key, value): boolean`, that never throw, and use them everywhere
   instead of ad hoc `JSON.parse`.
2. Validate shapes on read (array of results with numeric `questionIds`).
3. When a write fails, keep the round in memory, show the results and a short
   "Progress could not be saved on this device" note.
4. Add `app/error.tsx` with a "Reload" and "Back to board" action, and
   `app/not-found.tsx` (the current 404 is the bare text `Not Found`).

### A3. Reset does not clear legacy flashcard progress (Medium, Confirmed)

`readStoredProgress` in `app/flashcards.tsx:69` migrates
`spanish-flashcards-progress-v1` into the current key but never deletes it, and
`ALL_PROGRESS_KEYS` in `app/drawer.tsx:17` does not list it. After "Reset all
progress" the next visit to Flashcards migrates the old data again. Only users
who have the v1 key are affected.

Fix: remove the legacy key right after a successful migration, and add it to
the reset list.

### A4. "Streak extended" is shown when it was not (Low, From code)

`app/results.tsx:59` prints "Streak extended to N days" whenever the stored
streak is above zero. After the first round of the day, with other activities
still open, the streak has not moved.

Fix: have `recordActivityToday` return whether this round completed the day,
pass it to `Results`, and otherwise show "N-day streak. X of Y activities done
today."

### A5. Importing the same backup file twice does nothing (Low, From code)

The file input in `app/drawer.tsx:338` never clears its value, so choosing the
same file again (for example after the "not a valid backup" alert) fires no
`change` event.

Fix: set `event.target.value = ""` after reading the file.

### A6. Shuffle is biased (Low, From code)

`[...items].sort(() => Math.random() - 0.5)` is defined three times
(`app/answer-choices.ts:8`, `app/flashcards.tsx:48`,
`app/notebook-retry.ts:9`). It is not a uniform shuffle, so some sentences come
up earlier than others and the correct option is not evenly placed.

Fix: one Fisher-Yates `shuffle` in a shared module, used by all three.

### A7. Copy that does not match behaviour (Low, From code)

- `app/topic-detail.tsx:113`: "Pick from three options" appears on every topic,
  but every topic except Gustar offers two options.
- "You write the verb yourself" appears on Por vs para and Object pronouns,
  where the answer is not a verb.
- `app/quiz-config.ts` (Gustar description), `app/gustar/page.tsx` and the
  board's `library-note` promise audio in quizzes. Audio exists only in the
  flashcards and the charts (`app/speak.ts` has two importers).
- The footer link labelled "Contact" in `app/topic-detail.tsx:193` and
  `app/flashcards.tsx:295` opens Ko-fi.
- Past days that were missed are announced as "Not yet" in the week strip
  (`app/quiz-selector.tsx:334`).
- "Weekly recap" carries a permanent "New" pill (`app/drawer.tsx:295`).

Fix: derive the options text from the number of choices, say "the missing
words", either add a listen button to the answered sentence in a round or drop
the audio claim, relabel the link "Support on Ko-fi" until #80 ships, and
label missed days "Missed".

## B. Data safety

### B1. Backup import trusts the file (Medium, From code)

`importAllProgress` in `app/drawer.tsx:107` writes every recognised key without
checking its shape, without a confirmation and without looking at `version`.
Combined with A2 a damaged or hand-edited file can leave a quiz unusable until
a reset. Keys absent from the file keep their current values, so restoring an
older backup produces a mix of old and new progress.

Fix: validate each key with the same guards as A2, confirm before
overwriting ("This replaces the progress on this device"), clear keys the
backup does not contain, and reject files whose `version` is newer than the
app understands.

### B2. Backup, restore and reset cover progress only (Low, From code)

Round length, answer mode, filters and the flashcard difficulty are not in
`ALL_PROGRESS_KEYS`. A restore on a new device loses them, and a reset leaves
them. The key list is also hand-assembled in `drawer.tsx`, apart from the
registry that `CLAUDE.md` names as the source for backup and reset.

Fix: let each registry entry declare its `storageKeys` (progress, settings,
filters), build the backup list from the registry, and decide once whether
settings belong in a backup. Record the decision in `docs/decisions/`.

### B3. Flashcard progress is keyed by the Spanish text (Low, From code)

`LeitnerProgress` uses `card.spanish` as the key. Correcting the spelling of a
verb orphans its record, and the orphan still counts in "studied".

Fix: give flashcards stable numeric ids like the quizzes have, with a one-time
migration, before the Idioms activity (#51) reuses the model.

### B4. Mid-round progress is lost without warning (Low, From code)

Answers are saved only at the end of a round. The back arrow in
`app/round-question.tsx:151` leaves at once.

Fix: confirm before leaving when at least one answer is committed, or save the
partial round as it stands.

## C. Rules that disagree with each other

### C1. Streak versus tile (Medium, Confirmed)

- One flashcard marks Flashcards done for the streak (the goal line counts it
  at once), while the tile shows "1/20 today" and turns to "Today" only at 20
  (`app/flashcards.tsx:168`, `app/quiz-selector.tsx:116`).
- A "Practise the misses" round counts for the streak
  (`app/round.tsx:202`), but `readDailyRoundProgress` and the streak backfill
  both ignore review rounds, so the tile still shows "0/5 today".
- A round with one answer and the rest skipped counts as the daily round.

Fix: decide the rule once and write it down: for example "a quiz counts when a
regular round is finished with at least half answered; flashcards count at 20
cards or when nothing is due". Implement it in one function used by the
streak, the tile pill and the backfill.

### C2. Different definitions of accuracy and week (Low, From code)

The drawer's average includes review rounds and the topic ring excludes them.
"This week" in the drawer is the last seven days and the week strip starts on
Monday.

Fix: exclude review rounds everywhere and use the Monday week in both places.

### C3. Notebook counts review misses (Low, From code)

`recordMistakes` is documented as recording regular rounds, but
`app/round.tsx:190` also calls it for review rounds, so `missCount` grows
during practice.

Fix: skip the call when `practiceMissed` is true, or update the comment and
the How to use text to match.

### C4. Progress can count sentences that no longer exist (Low, From code)

`Round` filters history to current ids (`presentOnlyHistory`), but
`readQuizProgress` does not, so a retired id still counts as completed. The
same helper also overwrites every result's `tense` with `"present"`.

Fix: filter in one shared reader and drop the `tense` override. This matters
whenever a sentence is retired from a bank.

### C5. One month later is not always one month (Low, From code)

`repeatDueDate` uses `setMonth(+1)`; a completion on 31 January is due on
3 March.

Fix: clamp to the last day of the next month, or use a fixed 30 days.

## D. Accessibility

1. **Answer feedback is silent (Medium, From code).** The "Correct" or "Not
   quite" block in `app/round-question.tsx:229` has no live region. Add
   `role="status"` to it.
2. **Focus is dropped after Check (Medium, Confirmed).** After Enter in Type
   mode the input is disabled and focus falls to `body`; a keyboard user has to
   tab back to "Next question". Move focus to the Next button on submit, and
   let Enter advance.
3. **The chart overlay is a dialog in name only (Medium, From code).**
   `round-chart-overlay` has `aria-modal` but no focus trap and no Escape, and
   it nests a second `<main>`. Use the native `<dialog>` already used by the
   help modal.
4. **Buttons inside a button (Low, From code).** The flashcard is
   `role="button"` and contains the speaker buttons
   (`app/flashcards.tsx:225`). Make the card a plain container and keep
   "Reveal" as the control.
5. **Speech fails silently (Low, From code).** Where no Spanish voice or no
   speech support exists the speaker buttons do nothing. Hide them when
   `speechSynthesis` is missing. Also guard
   `speechSynthesis.addEventListener` in `app/speak.ts:13`: older Safari does
   not provide it on that object, and `vite.config.ts` explicitly targets
   Safari 11. This one needs a check on a real old device.

## E. SEO and performance

### E1. The home page is the Gustar topic for crawlers (High, Confirmed)

`app/page.tsx` is a client component that still renders `TopicDetail` for the
old `?quiz=` scheme, and the board (`QuizSelector` in the layout) returns
`null` until it has read storage. The HTML served for `/` therefore has
`<h1>Gustar patterns</h1>`, no board, no list of activities and no JSON-LD.
Users see nothing of the board until JavaScript has run.

Fix: render the board on the server with empty progress (the tiles and links
are static, only the numbers need the client), make it the content of
`app/page.tsx`, and remove the legacy `?quiz=` branches, which `proxy.ts`
already redirects. Add `WebSite` and `ItemList` JSON-LD for the home page.

### E2. Every page downloads every sentence (Medium, Confirmed)

The shared chunk that carries the header is 556 KB (149 KB gzipped) because
the drawer imports `QUIZ_CONFIG`, which imports all question banks. `/about`
and the Notes pay for it too. All HTML is sent with
`cache-control: no-store`, since the layout reads headers and cookies.

Fix: split metadata (titles, slugs, storage keys, counts) from the question
banks, load a bank with a dynamic `import()` when a round or topic opens, and
load the drawer's history panel on first open. This also prepares the registry
work in H1.

### E3. Small items (Low)

- `<meta name="codex-preview" content="development">` is in production HTML
  (`app/layout.tsx:46`). Remove it.
- `proxy.ts` repeats the quiz id list (`isQuizId`, line 8) and the Notes paths
  (`SITEMAP_PATHS`). `quiz-config.ts` and `notes-posts.ts` already export both.
  A new activity that forgets these lines is missing from the sitemap with no
  failing test. Import them.
- The Ko-fi button image is hot-linked from `storage.ko-fi.com` with no width,
  which shifts layout and calls a third party on every results screen. Ship a
  local SVG.
- `KofiButton` links to `ko-fi.com/M3O325HG20` while `SITE_CONFIG.kofiUrl` is
  `ko-fi.com/spanishquizzes/`. Use the config value in both.
- The flashcard total is written as a literal in five places. Use
  `FLASHCARD_VERBS.length`.

## F. Privacy and security

### F1. Analytics without consent or a privacy page (High, Confirmed)

Google Analytics and Microsoft Clarity (session recording) load for every
production visitor (`app/analytics-scripts.tsx`). There is no consent prompt
and no privacy or cookie page anywhere in `app/`. The site is on a `.es`
domain and addresses EU learners, so GDPR and the Spanish cookie rules apply.
This is a legal exposure, and the audience is the kind that notices.

Fix, in order of effort:

1. Publish a privacy page (what is stored in the browser, which third parties
   are called, how to delete data) and link it in the footer.
2. Either gate both scripts behind an explicit opt-in, or replace them with a
   cookieless analytics product and drop Clarity.
3. Record the choice in `docs/decisions/`.

This is a legal question as much as a technical one; confirm the final wording
with someone qualified.

### F2. No security headers (Low, Confirmed)

Responses carry no `Content-Security-Policy`, `X-Content-Type-Options`,
`Referrer-Policy` or `frame-ancestors`. The app has no accounts, so the risk is
low, but `proxy.ts` already touches every response.

Fix: add the four headers in `proxy.ts`, with a CSP that allows only the
analytics hosts that survive F1.

## G. Tooling and CI

### G1. Types are never checked (High, Confirmed)

`npx tsc --noEmit` reports 69 errors and no script or workflow runs it:

- 61 are `TS5097`: `.ts` import suffixes without `allowImportingTsExtensions`.
- 5 are real `TS2322` errors in the data files (`ser-estar`, `por-para`,
  `preterite-imperfect`, `object-pronouns`, `saber-conocer`): `subjectNumber`
  and similar fields are widened to `string`.
- 3 are template leftovers (`vite.config.ts` reads `d1` and `r2` that
  `.openai/hosting.json` does not have; `worker/index.ts` uses `Fetcher`
  without Workers types).

Fix: set `allowImportingTsExtensions`, add `as const` or explicit types in the
five data files, add `@cloudflare/workers-types`, then add
`"typecheck": "tsc --noEmit"` and run it in `ci.yml`.

### G2. Workflows (Medium, From code)

- `deploy-production.yml` deploys whichever ref is picked in the "Run
  workflow" form. Add `if: github.ref == 'refs/heads/main'`.
- Every PR push runs the full build and test twice (`ci.yml` and
  `pr-preview.yml`). Make the preview job depend on the CI job, or reuse its
  build artefact.
- No check after a production deploy. Add a step that requests `/`,
  `/robots.txt` and one quiz URL and fails on a non-200.
- Actions are pinned to tags. Pin to commit SHAs.

### G3. Dependencies (Medium, Confirmed)

`npm audit` reports 33 advisories (1 critical in `next`, 18 high, including
`vite`, `ws` and `zod`). Most sit in build tooling, but `next` is a runtime
dependency. There is no Dependabot or Renovate configuration.

Fix: update `next`, `vite`, `wrangler` and `@cloudflare/vite-plugin` in one
PR, verify on the preview, then add a weekly grouped update configuration.

### G4. Tests do not exercise the browser (Medium, From code)

The suite covers logic and content well. A2, D2 and C1 were all found by
driving the real page, which no test does.

Fix: a small Playwright smoke suite in CI: finish one round in each mode, one
flashcard session, a backup and restore round trip, storage blocked, and test
mode isolation. PR #126 (isolation tests for every quiz) has been open since
18 October and predates the two newest activities; rebase and merge it or
close it.

## H. Architecture

### H1. Adding an activity means editing many files by hand (Medium, From code)

The roadmap's own rule says to extend the registry instead of adding
conditionals. In practice each new quiz adds a branch or an entry in:

- `app/answer-choices.ts:13` (one long `||` chain),
- `app/notebook.ts` (`ruleLabelFor` and `quizIdForRule`),
- `app/verb-chart.tsx` (`blocksFor` and the `infinitives` line),
- `app/quiz-selector.tsx` (icon paths),
- `proxy.ts` (id list and sitemap),
- `app/topic-detail.tsx:139` (a Por vs para special case),
- plus the page file, explanations file, Notes page and tests.

`ActivityType` has two values, and a "fill-in-blank" activity is assumed
almost everywhere.

Fix: move these into the config entry: `choices(question)`,
`ruleLabel(question)`, `chart`, `icon`, `storageKeys`. Add a test that fails
when a registered activity lacks any of them. Do this before Sentence Builder
(#72), which is the first activity that is not fill-in-the-blank.

### H2. The question type is shaped for Gustar (Medium, From code)

Every activity reuses `Question` from `app/quiz-data.ts`. For most of them
`objectPronoun` holds the wrong option, `infinitive` holds a usage group, and
`subjectNumber`, `isActivity` and `indirectObject` are filler. This is the
source of the five type errors in G1 and of the special cases in
`app/history.ts:45`.

Fix: a small base type (`id`, `before`, `after`, `answer`, `distractors`,
`group`, `level`, `explanation`, `translation`, `cue`) with Gustar extending
it. `translations.pl` is not displayed anywhere and
`app/polish-translations.ts` is imported by nothing; remove both or schedule
the feature.

### H3. Stylesheets are layered patches (Low, From code)

Seven global stylesheets load on every page, including
`quiz-layout-fix.css` (about 3,000 lines) and `issue-5-design.css`, whose
names describe when they were written, not what they style. The CSS bundle is
110 KB.

Fix: fold them into per-screen files (board, round, flashcards, drawer) one
screen at a time, deleting rules the later layers override.

## I. Repository hygiene

1. `README.md` describes Cloudflare Pages, says the project "does not use
   `wrangler.jsonc`" and documents ChatGPT sign-in. The app is a Worker
   deployed by `wrangler`, and nothing imports `app/chatgpt-auth.ts`. Rewrite
   the README around `docs/deployment.md`.
2. Template leftovers to delete: `app/chatgpt-auth.ts`, `public/file.svg`,
   `public/globe.svg`, `public/window.svg`, `.vinext/fonts/geist*`,
   `premium-ui.json`, `TEMPLATE-HANDOVER.md` (check each for a remaining
   reader first), and `"displayName": "Spanish Gustar Quiz"` in
   `package.json`.
3. `tutorial-videos/exports/` holds 50 MB of zip files in git. Move them to a
   release asset or storage bucket.
4. `app/is-production-host.ts` and four files under `docs/` still describe a
   staging site that `CLAUDE.md` says does not exist. Mark the old plans as
   historical or delete them.
5. Branches with no pull request: `claude/issue-51-excel-export-gnxeyl` and
   `codex/design-system-gpt`. Rule 4 in `CLAUDE.md` says to delete abandoned
   branches.
6. `tutorial-videos/SOCIAL-POSTS.md:152` states an exact sentence count, which
   project rule 6 forbids. PR #103 fixes it and is still open.

## R. Roadmap (issue #65)

### R1. Status is out of date (Medium)

- #70 Present continuous is listed as "in progress, no PR yet". It was merged
  in #136 and the issue closed on 7 Nov, nine days before its planned release.
  Cycle 4 is finished.
- The launch Reel and feed post are still dated 16 and 19 Nov. Decide whether
  they move forward or Cycle 5 starts early.
- The issue links `docs/roadmap.html`, which is not on `main`; it lives only
  in PR #118.
- Whether #136 has been deployed to production is not recorded anywhere I can
  read. `introducedOn` is set to 7 Nov; if the deploy happened later, correct
  the date.

Fix: update the issue, and add "deployed to production on" as a column in the
release table so the roadmap separates merged from live.

Resolved: issue #65 is updated. The release is confirmed, the launch posts
keep their dates, and the visualisation link is removed with PR #118 closed.

### R2. The daily goal grows with every release (Medium)

The streak requires a round in every activity on the board, and every release
on the plan adds one more. A learner with fifteen minutes cannot
keep a streak, and each launch makes it harder. The fix on the roadmap is #117
(customisable board), which is unscheduled.

Fix: schedule #117 before Cycle 6, or as a stopgap cap the daily goal (for
example any three activities) and record the rule in `docs/decisions/`.

Resolved: #117 is the main item of Cycle 6, now a maintenance cycle.

### R3. Cycle 5 is overloaded (Medium)

Sentence Builder is a new interaction, a new storage shape and the first test
of the registry beyond fill-in-the-blank, and the same cycle carries #96 and
#104. H1 and H2 show the shared model is not ready for a second activity type.

Fix: use the nine days gained from Cycle 4 for H1, H2, A1 and A2. Keep #96 in
Cycle 5 and move #104 to a later maintenance half.

### R4. Vosotros switch needs a design record first (Medium)

Withdrawn: #105 is cancelled, so no decision record is needed. C4 stands on
its own as a low-severity finding.

#105 replaces sentences when the switch is off. That changes each bank's
total, which feeds completion ("every sentence in the full set"),
`isCompletionUnearned`, the progress ring and the notebook. C4 shows retired
ids are already handled inconsistently.

Fix: write the decision record before the build: how ids are allocated for
replacement sentences, what "complete" means when the set changes, and what
happens to progress on a sentence that is switched out.

### R5. Maintenance without issues does not get done (Low)

"Answer normalization" has been carried through two cycles as a bullet. The
"ongoing maintenance without dedicated issue" list has no owner and no way to
be closed.

Fix: turn the High and Medium findings in this file into issues and place
them in specific cycles. Proposed placement:

| When | Items |
| --- | --- |
| Now, before Cycle 5 | A1, A2, A3, G1, F1 step 1 (privacy page) |
| Cycle 5 maintenance half | C1, D1, D2, D3, E3, G2, H1 |
| Cycle 6 maintenance half | E1, E2, F1 step 2, G3, G4, B1, B2 |
| When a sentence is next retired | C4 |
| Before #51 Idioms | B3 |

### R6. Pull requests waiting for a decision (Low)

#90 (since 2 Oct), #99 (draft, 3 Oct), #103 (4 Oct), #118 (13 Oct) and #126
(18 Oct). Each drifts further from `main` with every release.

Fix: merge or close each one this week. #126 and #103 are small and useful.

Partly resolved: #118 is closed. #90, #99, #103 and #126 are still open.

### R7. Gaps in the plan (Low)

- No measure of success. Analytics is installed, but the roadmap states no
  target (returning learners, rounds per visit, completion of a new activity).
  Pick two numbers and review them at each release.
- No feedback channel. #80 (contact form) is unscheduled and "Contact" points
  to Ko-fi. A mailto link is enough to start.
- The release rule does not mention the production deploy, a post-deploy
  check, or setting `introducedOn` to the real go-live date.
- Cycles 7 and 8 release on 28 Dec and 11 Jan. Plan a pause or accept a slip
  now instead of at the time.
- The subjunctive activities (#71, #73) are the hardest content to keep
  correct under rule 13 (wrong in every region). Give them a review week.
- Launch videos are planned only to Cycle 4.
