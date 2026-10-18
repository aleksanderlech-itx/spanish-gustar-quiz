# Manual Test Plan: Spanish Quizzes

Last updated: 2026-10-18. Target: production (https://spanish-quizz.es). Testing there is harmless: progress lives only in the tester's own browser, and test mode (`?test=1`) is isolated from real data.

Project rules and decisions: `docs/decisions/README.md` in the repo. This plan covers the app as of main at PR #130, including test mode (PR #121), the mistake notebook with retry mode (PR #124), reflexive verbs, the daily goal and day-complete dialog, and Notes for every activity.

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
| 2.14 | T | DevTools network tab on load and during a round | No analytics scripts or events. In normal mode on production the analytics scripts load shortly after page load, so compare the two |
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
| 5.6 | N | Optional, needs date control: day is completed, then a new activity appears | A completed day stays locked. The new activity counts from the next day |
| 5.7 | T | Settings > Finished activities | Each completed topic shows "Done <date> · repeat from <date>", or "Repeat due" once that date passes. "Add to main screen" puts the topic back on the board, "Remove from main screen" takes it off again. With nothing finished: "No finished activities yet." Behavior matches the How to use page |
| 5.8 | T | Reload after each step above | Values persist |

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
| 7.2 | N | Settings > Reset all progress, confirm | Board, streak, notebook, flashcards and history are cleared |
| 7.3 | N | Import backup with the file from 7.1 | Streak, completed days, flashcards, notebook, topic settings, history and completions are restored and match the values you noted |
| 7.4 | N | Import a non-JSON file and a JSON file from another source | A clear error or a safe ignore. No existing data lost, no crash |
| 7.5 | T | Import a backup while in test mode | Only test data changes. Real data untouched |

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

Also verify the named examples: Nuria, médico, aviso, "Usted conoce", gustar niña pequeña, refrán, falda/pollera.

## 10. Content, Notes and pages

| # | Mode | Step | Expected |
|---|------|------|----------|
| 10.1 | N | Open Notes | There is an article for every activity on the board, including the newest. Each opens, links to its quiz topic and has no broken links |
| 10.2 | N | Read the home page, About, How to use and Notes intro | No fixed topic count and no hand-written topic list. Sentences per topic are described as "about 150" |
| 10.3 | N | Compare How to use and About with the live app | They describe current features: round lengths, Choose and Type, mistake notebook retry, backup, streak |
| 10.4 | N | Play each tutorial on How to use and from the welcome modal | Plays, or shows the poster and steps. The steps match the current UI |
| 10.5 | N | Search About, results screen, footer, Notes for Ko-fi wording | Tips only. No membership, tiers, member-only content or perks anywhere |
| 10.6 | N | View page source on the home page, each activity, Notes and an article | Unique title and description per page. Canonical points to the page's own URL |
| 10.7 | N | Open `/robots.txt`, `/llms.txt` and `/llms-full.txt` | All three load as plain text. `/llms.txt` lists every activity on the board plus flashcards and Notes, and links to `/llms-full.txt`. `/llms-full.txt` has a section per activity with its rule and sample questions. Neither lists an activity that is not on the board or misses one that is |

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
