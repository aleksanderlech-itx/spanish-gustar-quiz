# Manual Test Plan: Spanish Quizzes

Last updated: 2026-11-23 (Sentence Builder, #72). Target: production (https://spanish-quizz.es). Testing there is harmless: progress lives only in the tester's own browser, and test mode (`?test=1`) is isolated from real data.

Project rules and decisions: `docs/decisions/README.md` in the repo. This plan covers the app as of main at PR #130, including test mode (PR #121), the mistake notebook with retry mode (PR #124), reflexive verbs, the present perfect (#69), the present continuous (#70), the daily goal and day-complete dialog, and Notes for every activity.

## Handover for the tester

**What the app is.** Spanish Quizzes (spanish-quizz.es) is a free Spanish grammar practice app: fill-in-the-blank quizzes per grammar topic, verb flashcards (Leitner boxes), an explanation for every answer, a mistake notebook with retry, a daily goal and streak, backup and restore, and short grammar notes.

**You do not need to read Spanish.** Open any page with `?test=1` (for example `https://spanish-quizz.es/?test=1`). Test mode keeps your progress separate from real data and shows the right answer: choice questions highlight the correct option, typed answers are prefilled, and the flashcard "Got it" button is marked. Test mode only affects your own browser tab.

**Ground rules**

- Test on production, https://spanish-quizz.es. Your progress stays in your own browser. Prefer test mode: normal-mode visits count in site analytics, test mode visits do not. Use normal mode only for `N` and `B` cases.
- Use test mode for every case marked `T` or `B`. Cases marked `N` need normal mode (no `?test=1`); they check that test mode and retry practice do not leak into real progress, or they only read UI and copy.
- Do not hard-code the list of activities. The home board is the source: test every activity tile on the board plus the flashcards tile, and record the list you saw in the run log.
- Record URL, build or commit SHA if known, date, device and browser before you start.
- Report every problem in the bug log (section 13) with steps, actual result and expected result. A screenshot or screen recording helps.
- Questions about scope: ask Aleksander. Do not assume.

**Mode column legend:** `T` test mode, `N` normal mode, `B` both (run in each, compare).

## 0. Setup

- Devices: iOS mobile (Safari), Android mobile (Chrome), Windows desktop (Chrome and Edge).
- Open two tabs on the same browser profile: Tab A normal, Tab B test mode (`?test=1`). Section 2 and section 4 isolation checks need both.
- Baseline before any normal-mode run: menu > Backup & restore > Download backup (or export localStorage in DevTools). Keep the file.
- Fresh profile: private window or cleared site data.
- Before each normal-mode run, note: board state, streak, weekly accuracy and rounds (Weekly recap), due counts, mistake notebook count.
- Run log: number and names of activities on the board, URL, build or commit SHA if known, date, tester.

## 1. Smoke (every build)

| # | Mode | Step | Expected |
|---|------|------|----------|
| 1.1 | B | Load home | No console errors. Board, streak card and week strip render |
| 1.2 | N | Load home in a fresh profile | Welcome tutorial modal appears. Closes with its button and with Escape. Focus returns to the page. Videos play, or a poster with written steps shows when there is no video |
| 1.3 | B | Open the menu (drawer) | Streak card, Progress & history, Weekly recap, Mistake notebook with count, Backup & restore and Settings render. Closes with the close button and Escape |
| 1.4 | T | Start one round in every activity on the board | Each loads and finishes |
| 1.5 | T | Open flashcards, an explanation, a translation and a conjugation chart | No broken views |
| 1.6 | B | Footer links: About, Notes, Content sources, "Help build more quizzes" (Ko-fi). Menu links: How to use, Notes | Pages open without errors. Content sources jumps to that section of About. Ko-fi opens in a new tab |

## 2. Test mode

| # | Mode | Step | Expected |
|---|------|------|----------|
| 2.1 | T | Open `/?test=1` | A small "Test" chip is fixed on screen and does not shift the layout. Browser tab title starts with "[Test] " |
| 2.2 | T | Navigate between board, an activity, flashcards, Notes. Refresh | `?test=1` stays in the URL, mode and chip stay on every page |
| 2.3 | N | Open a new tab on the same site without `?test=1` | Normal mode: no chip, no title prefix, real progress visible |
| 2.4 | T | Open an activity never opened in test mode | Answer mode starts on Choose. After switching to Type and reloading, Type is kept (saved choice wins) |
| 2.5 | B | Choice question | Test: the correct option is highlighted by color only, no label, readable in light and dark. Normal: no highlight |
| 2.6 | B | Typed question | Test: the answer field is prefilled with the correct answer. Normal: empty |
| 2.7 | B | Flashcards | Test: the "Got it" button is marked. Normal: no mark |
| 2.8 | T | Finish a full round in every activity using only the hints | Round completes, results show 100 percent |
| 2.9 | B | Isolation, test to real. Note Tab A values, finish rounds and a notebook retry in Tab B, reload Tab A | Daily goal, streak, accuracy, history, notebook, flashcard progress, settings and due counts in Tab A are unchanged |
| 2.10 | B | Isolation, real to test. Open test mode on a profile that has real progress | Test session starts empty. Real progress is not shown |
| 2.11 | T | Chip menu > Exit test mode | `?test=1` removed, normal mode. Re-enter with `?test=1`: test data is still there |
| 2.12 | T | Chip menu > Reset test data. First cancel, then confirm | Prompt reads "Delete all test progress? Your real progress is not affected." Cancel keeps data. Confirm clears test data only. Real progress intact |
| 2.13 | T | Menu > Backup & restore > Download backup, then Settings > Reset all progress | Backup file name is `spanish-quiz-studio-test-backup.json` and holds test data only. Reset shows a test-specific confirmation and clears test data only |
| 2.14 | T | DevTools network tab on load and during a round | No analytics scripts or events, and no cookie bar. Compare with 10a.3 in normal mode |
| 2.15 | T | DevTools > Application > Cookies | The only cookie is `spanish-quiz-theme` (the theme, shared with normal mode, see 2.17). Test mode adds no other cookie |
| 2.16 | T | Block site storage in the browser, open `?test=1` | Chip reads "Test (not kept)" and its tooltip says test mode ends if you leave the page. Mode holds only while `?test=1` stays in the URL |
| 2.17 | B | Switch theme (light or dark) in test mode | Same theme in normal mode. Theme is the one setting shared between modes |

## 3. Quiz regression

| # | Mode | Step | Expected |
|---|------|------|----------|
| 3.1 | T | Rounds of 5, 10, 20 | Correct question count |
| 3.2 | T | Basic, Intermediate, Advanced | Difficulty applies |
| 3.3 | T | Choice and typed answers | Both accept. Accents handled |
| 3.4 | T | Finish a round with correct answers | Daily goal, streak and accuracy update |
| 3.5 | T | Reload page | Values persist |
| 3.6 | N | Due queue. Record the count before and after a normal round | Behavior is consistent between rounds. The count is a baseline, not a fixed target |
| 3.7 | T | Progress & history | Round appears with correct result. A "Practise the misses" round is labeled "(review)" |
| 3.8 | T | Weekly recap | Rounds and accuracy consistent with rounds played |
| 3.9 | T | Results screen after a round with misses | Score shown. "Practise the misses" and "Back to board" work. A line links to this topic's mistakes. The Ko-fi support prompt shows a tips-only message |
| 3.10 | T | Open the verb chart during a question, then close it | The round in progress is not lost |
| 3.11 | T | Explanation after each answer | Shown, English, matches the sentence |
| 3.12 | T | Present perfect: open the topic, filter by each usage group, play a round in Choose and in Type | Every group has questions. Choose shows two options. Type accepts the answer with accents (leído, habéis) |
| 3.13 | T | Present perfect: open the perfect chart from the topic and during a question | One shared chart: haber in six persons, regular participles, irregular participles, word order. Title reads Present Perfect |
| 3.14 | T | Por vs para: during a question, tap "Stuck? Open the usage examples", then close it | Two blocks, Por looks back (cause or motive, duration, exchange or price, means, movement through a place) and Para looks ahead (purpose, recipient, deadline, destination), one Spanish example sentence per usage, each plays audio. No "por / por" table. Title reads Por vs Para. The round in progress is not lost |
| 3.15 | T | Present continuous: open the topic, filter by each usage group, play a round in Choose and in Type | Every group has questions. Choose shows two options. Type accepts the answer with accents (estáis, leyéndolo) |
| 3.16 | T | Present continuous: open the continuous chart from the topic and during a question | One shared chart: estar in six persons, regular gerunds, irregular gerunds, pronouns. Title reads Present Continuous |
| 3.17 | T | Present continuous with `?test=1`: finish a round using only the hints, then open the topic in a new tab without the parameter | The correct option is highlighted (Choose) or prefilled (Type). Real progress for the topic is unchanged |

## 4. Mistake notebook and retry mode

Retry practice must never change the daily goal, streak, accuracy, weekly recap, history or due counts. Only the notebook entry changes.

| # | Mode | Step | Expected |
|---|------|------|----------|
| 4.1 | T | Miss one sentence on purpose (choose a non-highlighted option) | Menu > Mistake notebook count rises by one. The entry sits under that activity's group with its subtopic chip |
| 4.2 | T | Miss the same sentence again | No duplicate entry. The entry's miss count increases |
| 4.3 | T | Open Mistake notebook in the menu | Per activity: "<Activity>: mistakes (n)" with a Retry link and one chip per subtopic. The note says retries are practice only and do not count toward today's goal. With no entries: "No missed rules yet." |
| 4.4 | T | Click the group Retry link | Opens that activity's mistakes screen. Entries show miss and retry counts. A subtopic chip row with counts appears when there is more than one subtopic, plus "All (n)" |
| 4.5 | T | Click a subtopic chip | List narrows to that subtopic. The retry draws only from it |
| 4.6 | T | Check the start button | Reads "Retry N sentences" where N does not exceed the topic's round length setting (5, 10 or 20). Change the setting and recheck. With nothing to retry it reads "No sentences to retry" and is disabled |
| 4.7 | T | Answer a retry question wrong | "Not quite" with the right answer, a "You answered ..." line, the subtopic rule and the sentence explanation. No sentence is repeated twice |
| 4.8 | T | Answer a retry question correctly | Correct confirmation. The entry stays. Its retried and correct counts increase |
| 4.9 | T | Finish a retry session | "Retry complete" with "x of y correct". "Retry again" and "Review entries" work. Leaving everything unanswered shows "Retry skipped" |
| 4.10 | B | Isolation. Normal mode, real data: note goal, streak, weekly recap, history, due counts, board tile progress. Run a retry session with right and wrong answers. Compare | Nothing changes except the entry's retry counts. In test mode do the same against test data |
| 4.11 | T | Dismiss an entry | Only that entry leaves. The menu count drops by one. The control has an accessible name |
| 4.12 | T | Retry one entry correctly three times | The entry is still in the notebook. Only Dismiss removes it |
| 4.13 | N | Optional: import an older backup that has rule-only entries, then retry | The session fills with sentences from the entry's subtopic, no sentence repeats |
| 4.14 | T | Reload and reopen the notebook | Entries and counts persist |
| 4.15 | T | Backup, Reset all progress, Import backup | Notebook entries and counts restored |
| 4.16 | T | Block storage, then miss a question | Quizzes keep working. No crash. The miss may not be saved |

Known behavior: the notebook keeps the newest 500 entries by last miss. Covered by automated tests, not checked by hand.

## 5. Daily goal, streak and board

| # | Mode | Step | Expected |
|---|------|------|----------|
| 5.1 | T | Board ordering | The activity in progress is pinned first, full width. Activities whose daily round is done move to the end. The rest go by due count, highest first |
| 5.2 | T | Reach today's round target in one activity | Its tile shows "Today" done. Other tiles are unaffected |
| 5.3 | T | Complete today's round in every activity | The "¡Día completado!" dialog appears once, right after the round that completes the day. It shows activities done out of total and the streak in days. "¡Vamos!", Escape and a click outside all close it. It does not reappear on reload |
| 5.4 | N | Trigger 5.3 while the welcome tutorial is open | The dialogs never stack. The day dialog waits until the tutorial closes |
| 5.5 | T | Do a second round on the same day | Streak counts the day once. Week strip marks the day |
| 5.6 | T | Complete the day, then add an activity to the board from the shelf | The completed day stays complete. The added activity counts from the next day |
| 5.7 | T | Menu > On your shelf | Every activity not on the board is listed with "Not started", "In progress", "Finished" ("Done <date> · repeat from <date>") or "Repeat due". "Add to board" moves it to the board. With nothing on the shelf: "Every activity is on your board." "Edit your activities" opens the Selection screen. Behavior matches the How to use page |
| 5.8 | T | Reload after each step above | Values persist |
| 5.9 | T | Streak panel with one activity on the board | Reads "Goal: a round in your 1 activity"; with more, "Goal: a round in all N activities". N matches the tiles on the board |

## 5a. Choosing activities (Board and Shelf)

Terms: the board holds the activities the user chose; every other activity is on the shelf. A new user starts with the starter board. For 5a.1 to 5a.3, start each from a fresh test session: open `/?test=1`, then chip menu > Reset test data and confirm. The page reloads, and that reload is the new user's first visit, so stay in that tab. A new tab already counts as the next session.

| # | Mode | Step | Expected |
|---|------|------|----------|
| 5a.1 | T | Fresh session (see above): the reloaded `/` | The board opens directly with Gustar, Por vs Para, Preterite vs Imperfect and Saber vs Conocer, under a "Welcome! We picked some activities to start" dialog with one "Got it" button. "Got it" (or Escape) closes it, scrolls to "On your shelf" below the board, expanded and listing the other activities as "Not started", and a band of colour travels around its border for about six seconds (a still highlighted border with reduced motion). No welcome tutorial. The streak goal counts four activities |
| 5a.1b | T | Reload the page in the same tab | No welcome dialog again. The shelf is still expanded below the board |
| 5a.2 | T | In the same tab, open a topic and come back to `/`; then open `/` in a new tab | Same tab: the shelf section is still below the board. New tab: it is gone from the board, and the welcome tutorial is offered |
| 5a.3 | T | Open `/present-perfect?test=1`, chip menu > Reset test data, play one round there, then open `/` in the same tab | The board holds the four starter activities plus that one. That round counts for today's goal |
| 5a.3b | T | Menu | "On your shelf (N)" is the first row. Expanded: every activity not on the board with its status and "Add to board", then "Edit your activities". Settings holds only "Reset all progress" |
| 5a.4 | T | Menu > Your activities (or "Your activities" in the desktop sidebar) | `/activities` opens ticked to match the board. Saving with nothing ticked is not possible. "Save" returns to the board with the new choice |
| 5a.5 | T | Menu > On your shelf, press "Add to board" on one row, close the menu | It moves to the board and counts toward today's goal (unless today is already complete) |
| 5a.6 | T | Finish every sentence of a topic that is on the board (test mode hints make this quick), then return to the board | The topic left the board. A dialog "You finished <topic>" offers up to three activities, unticked, with "Add to board", "Not now" and "See all activities". The finished topic is listed last, only if fewer than three others exist |
| 5a.7 | T | Answer 5a.6 with "Not now", reload | The dialog does not come back. The finished topic is on the shelf as "Finished" |
| 5a.8 | T | Add the finished topic back to the board, open it | It starts its sentences over. Its mistakes are still in the notebook and its mistakes tile still shows |
| 5a.9 | T | Make the board hold one topic and finish it | The dialog says the board is empty, has no "Not now", and Escape does not close it. Adding one activity closes it |
| 5a.10 | T | With a topic on the shelf, open its link and finish a round | Results say it is on your shelf and the round was practice only, with "Add to your board". Pressing it confirms the topic is on your board |
| 5a.11 | N | Open `/activities` and view the page source | `<meta name="robots" content="noindex, nofollow">` is present. `/sitemap.xml` and `/llms.txt` do not list `/activities` |
| 5a.12 | B | Isolation: make Board changes in test mode, then open a tab without `?test=1` | The real board and shelf are unchanged |
| 5a.13 | N | Existing user (real progress from before this release): open `/` | The board shows what it showed before the release: every activity except finished topics that were neither repeat due nor added back from Settings. No starter board is applied. The shelf is not shown below the board |

## 5b. Sentence Builder

Sentence Builder starts on the shelf for existing users and is not part of the starter board. Add it from Menu > On your shelf first, or open `/sentence-builder` directly.

| # | Mode | Step | Expected |
|---|------|------|----------|
| 5b.1 | B | Existing board (real or test data from before this release): open `/` | A one-time dialog offers Sentence Builder as New, unticked. "Not now" leaves it on the shelf and the dialog does not return |
| 5b.2 | T | Open `/sentence-builder` | Progress ring "0 of N sentences", round length 5, 10 or 20, filters Difficulty and Pattern (questions, negatives, prepositions, object pronouns, ser and estar, present and past, connectors), the selected count updates, a link "Spanish word order, explained" |
| 5b.3 | T | Start a round | English prompt, an empty answer line "Tap the words below in order", the words below as buttons. In test mode the next correct word is outlined in green (colour only, readable in light and dark). Normal mode: no outline |
| 5b.4 | T | Tap words; tap a placed word; Undo; Reset; Backspace on a keyboard | A tapped word moves to the end of the line and keeps its slot empty in the pool. A tapped placed word goes back. Undo removes the last, Reset clears all, Backspace undoes. Check stays disabled ("Place all N words") until every word is placed |
| 5b.5 | T | Build a sentence in the wrong order and Check | "Not quite", the line turns red, misplaced words are marked, "Yours" shows your sentence above "Correct", then the explanation and a speaker button that reads the sentence |
| 5b.6 | T | Follow the hints and Check | "Correct". Capitals and punctuation (¿ ? ¡ ! .) are added automatically |
| 5b.7 | T | Find an Item with two accepted orders (for example "Ayer estuve en Boston" / "Estuve en Boston ayer") and build the second order | Counted as correct |
| 5b.8 | T | Finish a round | Results screen as for quizzes. The miss appears in the mistake notebook and as a "Sentence Builder: mistakes" tile under Mistakes to retry; retrying it does not change progress or the daily goal |
| 5b.9 | T | With Sentence Builder on the board, finish a round | The day counts it like a quiz round; the tile shows "x/y today" |
| 5b.10 | T | Keyboard only: Tab through the words, Enter or Space to place, Backspace to undo, Enter on Check | Every step works; a screen reader announces "Placed: word. n of m." |
| 5b.11 | B | Isolation: play in test mode, then open a tab without `?test=1` | Real Sentence Builder progress, notebook and streak are unchanged |
| 5b.12 | N | Open `exports/sentence-builder.csv` in the repo | One row per sentence with every accepted order. Owner sample check before release: read about 20 rows and confirm the Spanish is natural and no other correct order is missing |
| 5b.13 | N | Open `/notes/spanish-word-order` | The article loads, is listed on `/notes`, and links to Sentence Builder |

## 6. Flashcards

| # | Mode | Step | Expected |
|---|------|------|----------|
| 6.1 | T | Start a flashcard round, reveal a card, press Got it and the other recall buttons | Card records the answer. Boxes run from 1 to 4. Due copy reads "due now", "due in 1 day", "due in 3 days" or "due in 7 days" |
| 6.2 | T | Use the difficulty filters | Each filter changes the pool without errors |
| 6.3 | T | Reload | Progress and box counts persist |
| 6.4 | T | Finish today's flashcard round | Flashcards count toward the daily goal and streak like any other activity |
| 6.5 | T | Read 10 example sentences | Short, neutral standard Spanish. No regional forms unless it is the point |

## 7. Backup, restore, reset

| # | Mode | Step | Expected |
|---|------|------|----------|
| 7.1 | N | Menu > Backup & restore > Download backup | File `spanish-quiz-studio-backup.json` downloads |
| 7.2 | N | Settings > Reset all progress, confirm | Prompt reads "Delete all progress and settings on this device?" Board, streak, notebook, flashcards, history, quiz settings (round length, answer mode, filters) and flashcard difficulty are cleared. Flashcard progress does not come back after a reload |
| 7.3 | N | Import backup with the file from 7.1. First cancel the prompt, then import again and confirm | Prompt reads "This replaces the progress on this device." Cancel changes nothing. Confirm restores streak, completed days, flashcards, notebook, topic settings, filters, flashcard difficulty, history and completions, matching the values you noted |
| 7.4 | N | Import a non-JSON file, a JSON file from another source, and a backup with one value edited to the wrong type (for example a quiz history set to `{}`) | Each shows "This backup file is damaged or not a Spanish Quizzes backup. Nothing was changed." No existing data changes, no crash |
| 7.5 | N | Edit a backup file's `version` to `99` and import it | Shows "This file is from a newer version of Spanish Quizzes. Reload the page to update, then try again." Nothing changes |
| 7.6 | N | Make progress in a quiz that is not in an older backup file, then import that file and confirm | The newer quiz's progress is cleared: the device matches the backup exactly, not a mix |
| 7.7 | N | Import the same file twice in a row | The second import shows the prompt again (choosing the same file is not ignored) |
| 7.8 | T | Import a backup while in test mode | Prompt reads "This replaces the test progress in this tab. Your real progress is not affected." Only test data changes. Real data untouched |

## 8. Storage resilience

| # | Mode | Step | Expected |
|---|------|------|----------|
| 8.1 | B | Private window | Quizzes work, no errors |
| 8.2 | B | Storage blocked (browser setting) | Quizzes work, no crash |
| 8.3 | B | Clear site data mid-session | No crash, app resets cleanly |
| 8.4 | B | Corrupt a localStorage value by hand | App loads, quizzes work |
| 8.5 | B | Two tabs open, answer in both | No lost progress on write |

## 9. Explanation quality spot check (about 20 items)

Pick across every activity on the board and the flashcards, including retry explanations (4.7).

For each: cue word named, one-line rule, contrast when useful, max 2 sentences and about 200 characters, English only, no regional forms ("Creés", "pollera") unless it is the point, not just "Use X".

Also verify the named examples: Nuria, médico, aviso, "Usted conoce", gustar niña pequeña, refrán, and ser vs estar "La mesa ... de madera" (explanation names de madera and material).

## 10. Content, Notes and pages

| # | Mode | Step | Expected |
|---|------|------|----------|
| 10.1 | N | Open Notes | There is an article for every activity on the board, including the newest. Each opens, links to its quiz topic and has no broken links |
| 10.2 | N | Read the home page, About, How to use and Notes intro | No fixed topic count and no hand-written topic list. Sentences per topic are described as "about 150" |
| 10.3 | N | Compare How to use and About with the live app | They describe current features: round lengths, Choose and Type, mistake notebook retry, backup, streak |
| 10.4 | N | Play each tutorial on How to use and from the welcome modal | Plays, or shows the poster and steps. The steps match the current UI |
| 10.5 | N | Search About, results screen, footer, Notes for Ko-fi wording | Tips only. No membership, tiers, member-only content or perks anywhere |
| 10.6 | N | View page source on the home page, each activity, Notes and an article | Unique title and description per page. Canonical points to the page's own URL |
| 10.7 | N | Open `/robots.txt`, `/llms.txt` and `/llms-full.txt` | All three load and are not empty. No need to check their content |
| 10.8 | N | View the page source of `/` (not the inspector), or open `/` with JavaScript turned off | One `<h1>Spanish Quizzes</h1>`, a link to every activity on the board, and `WebSite` and `ItemList` JSON-LD. No "Gustar patterns" heading and no `codex-preview` meta. With JavaScript, the empty frame is replaced by the board and only one heading is visible. `/?quiz=ser-estar` still redirects to `/ser-vs-estar` |

## 10a. Privacy and analytics consent

Normal mode, fresh profile (private window). Analytics only ever load on the production host; on a preview the bar works but no analytics request is made.

| # | Mode | Step | Expected |
|---|------|------|----------|
| 10a.1 | N | Open `/` on a fresh profile | The first-visit welcome dialog shows first. After "Got it", the cookie bar appears at the bottom: text naming Google Analytics and Microsoft Clarity, a "Privacy" link, and "Reject" and "Accept" in the same style. It does not block the page |
| 10a.2 | N | DevTools network tab before choosing | No request to googletagmanager.com, google-analytics.com or clarity.ms. No `_ga` or `_clck` cookie |
| 10a.3 | N | Production only: "Accept" | The bar closes. Requests to googletagmanager.com and clarity.ms start without a reload. Reload: no bar |
| 10a.4 | N | Footer "Cookie settings", then "Reject" | The bar reopens. After Reject the page reloads, the `_ga*`, `_gid` and `_clck`/`_clsk` cookies for this site are gone, and no analytics request is made |
| 10a.5 | N | Fresh profile: "Reject" | No analytics request now or after reloads. The bar does not come back |
| 10a.6 | N | Settings > Reset all progress | The analytics choice is kept: the bar does not reappear |
| 10a.7 | N | Open `/privacy` | Names Aleksander Lech and spanish-quizzes@proton.me. Lists browser storage, the theme cookie, Google Analytics and Microsoft Clarity (after consent), Cloudflare, the Ko-fi button image, how to delete data, rights and the AEPD. Both "Cookie settings" buttons reopen the bar |
| 10a.8 | N | Footer on every page type (board, topic, round, Notes, About) | "Privacy" and "Cookie settings" are present and work |
| 10a.9 | N | `/sitemap.xml` and `/llms.txt` on production | Both list `/privacy` |
| 10a.10 | T | Any page with `?test=1` | No cookie bar, no analytics requests |

## 11. Copy and UI

- No em dashes or en dashes anywhere in UI, explanations or Notes.
- No emoticons. Professional tone.
- Spanish text has correct accents and punctuation.
- Teal brand color intact.
- Touch targets usable on phone. No horizontal scroll at 360 px width. The test chip does not cover controls.
- Dialogs, the drawer and the chip menu work by keyboard, trap focus where modal, and close with Escape.
- Dark mode and light mode both readable, including the test mode highlight.

## 12. Cross-browser pass

Run sections 1 to 5, 7 and 8 on each device in section 0. Run section 2 on iOS Safari, where storage restrictions are strictest. Log any difference.

## 13. Bug log

Severity: 1 loses or corrupts progress, or blocks use. 2 major wrong behavior. 3 minor. 4 cosmetic.

| ID | Device/browser | Mode | Section/step | Actual | Expected | Severity | Status |
|----|----------------|------|--------------|--------|----------|----------|--------|

## 14. Exit criteria

- Sections 1 to 8 pass with no severity 1 or 2 bugs open.
- Isolation checks 2.9, 2.10 and 4.10 pass on every device.
- Section 9 spot check signed off by Aleksander.
- Section 10 content checks pass.
- Any fix release to production only after explicit greenlight from Aleksander. The tester never deploys.
