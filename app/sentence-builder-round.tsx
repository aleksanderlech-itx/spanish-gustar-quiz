"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { SENTENCE_BUILDER_GROUPS, SENTENCE_BUILDER_ITEMS, type SentenceBuilderItem } from "./sentence-builder-data";
import {
  SENTENCE_BUILDER_FILTER_KEY, SENTENCE_BUILDER_ID, SENTENCE_BUILDER_PATH, SENTENCE_BUILDER_STORAGE_KEY, sentenceBuilderGroupLabel, sentenceBuilderRuleKey, sentenceBuilderRuleLabel,
} from "./sentence-builder-config";
import {
  isAccepted, isComplete, misplacedPositions, nextHintIndex, place, reset, sentenceFor, shuffledPool, tokensOf, undo, unplace,
  type Placement,
} from "./sentence-builder-logic";
import { availableQuestions, clearRegularHistory, getMissedIds, type QuizResult } from "./quiz-logic";
import { readQuizFilters } from "./quiz-filters";
import { readTopicSettings } from "./topic-settings";
import { updateStoredProgress } from "./stored-progress";
import { recordActivityToday } from "./streak";
import { markQuizCompleted, readQuizCompletion, repeatDueDate } from "./quiz-completion";
import { moveFinishedToShelf } from "./board-state";
import { readNotebookEntries, recordItemMistakes, recordRetry } from "./notebook";
import { mistakesPath, ruleKeyFromParam } from "./notebook-retry";
import { appStorage, isTestMode } from "./storage";
import { speak } from "./speak";
import Results from "./results";
import SiteHeader from "./site-header";
import HelpButton from "./help-modal";
import { SkipLink } from "./activity-chrome";

const LEVEL_BADGE = { basic: "Basic", intermediate: "Intermediate", advanced: "Advanced" } as const;

type Mode = "regular" | "review" | "retry";
/** One Item in a round: the Item, the pool's order on screen and, for a notebook retry, its entry. */
type RoundItem = { item: SentenceBuilderItem; pool: number[]; entryId?: string };
type Answer = { order: string[]; correct: boolean };

const readHistory = (): QuizResult[] => {
  try {
    const raw = appStorage.getItem(SENTENCE_BUILDER_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? (parsed as QuizResult[]) : [];
  } catch {
    return [];
  }
};

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);
const toRound = (items: SentenceBuilderItem[]): RoundItem[] => items.map((item) => ({ item, pool: shuffledPool(item) }));

const filteredItems = () => {
  const filters = readQuizFilters(SENTENCE_BUILDER_FILTER_KEY, SENTENCE_BUILDER_GROUPS);
  return SENTENCE_BUILDER_ITEMS.filter((item) =>
    (filters.level === "all" || item.level === filters.level) && (filters.verb === "all" || item.group === filters.verb));
};

/**
 * A Sentence Builder round (decision 0013): the English prompt, an answer line and a pool of Tokens. Tap a
 * Token to place it, tap a placed one to return it, Undo or Reset, then Check. Right or wrong as a whole.
 * `retryRule` set: a mistake notebook retry, which only records on the notebook entries.
 */
export default function SentenceBuilderRound({ retry = false, retryRule = null }: { retry?: boolean; retryRule?: string | null }) {
  const [hydrated, setHydrated] = useState(false);
  const [mode, setMode] = useState<Mode>(retry ? "retry" : "regular");
  const [round, setRound] = useState<RoundItem[]>([]);
  const [index, setIndex] = useState(0);
  const [placed, setPlaced] = useState<Placement>([]);
  const [answers, setAnswers] = useState<Array<Answer | null>>([]);
  const [checked, setChecked] = useState<Answer | null>(null);
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [finished, setFinished] = useState<QuizResult | null>(null);
  const [state, setState] = useState<"round" | "filtered-done" | "set-done" | "no-mistakes">("round");
  const [announcement, setAnnouncement] = useState("");
  const [testMode, setTestMode] = useState(false);
  const checkRef = useRef<HTMLButtonElement | null>(null);

  const startRound = useCallback((nextMode: Mode, stored: QuizResult[]) => {
    const settings = readTopicSettings(SENTENCE_BUILDER_ID);
    let items: RoundItem[] = [];
    if (nextMode === "retry") {
      const entries = readNotebookEntries().filter((entry) => entry.quizId === SENTENCE_BUILDER_ID && (!retryRule || entry.rule === ruleKeyFromParam(SENTENCE_BUILDER_ID, retryRule)));
      items = shuffle(entries).slice(0, settings.roundLength).flatMap((entry) => {
        const item = SENTENCE_BUILDER_ITEMS.find((candidate) => candidate.id === entry.questionId);
        return item ? [{ item, pool: shuffledPool(item), entryId: entry.id }] : [];
      });
      setState(items.length ? "round" : "no-mistakes");
    } else {
      const pool = availableQuestions(filteredItems(), stored, nextMode === "review");
      items = toRound(shuffle(pool).slice(0, settings.roundLength));
      if (!items.length) {
        const fullSetDone = availableQuestions(SENTENCE_BUILDER_ITEMS, stored, false).length === 0;
        setState(fullSetDone ? "set-done" : "filtered-done");
      } else {
        setState("round");
      }
    }
    setMode(nextMode);
    setRound(items);
    setIndex(0);
    setPlaced([]);
    setAnswers(items.map(() => null));
    setChecked(null);
    setFinished(null);
  }, [retryRule]);

  useEffect(() => {
    // Browser storage is unavailable during the server render.
    const stored = readHistory();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistory(stored);
    setTestMode(isTestMode());
    startRound(retry ? "retry" : "regular", stored);
    setHydrated(true);
  }, [retry, startRound]);

  const current = round[index];
  const item = current?.item;
  const order = item ? tokensOf(item, placed) : [];
  const hint = testMode && item && !checked ? nextHintIndex(item, placed) : null;

  const announce = (text: string) => setAnnouncement(text);
  const placeToken = (tokenIndex: number) => {
    if (!item || checked) return;
    const next = place(placed, tokenIndex);
    setPlaced(next);
    announce(`Placed: ${item.tokens[tokenIndex]}. ${next.length} of ${item.tokens.length}.`);
    if (isComplete(item, next)) window.setTimeout(() => checkRef.current?.focus(), 0);
  };
  const returnToken = (tokenIndex: number) => {
    if (!item || checked) return;
    setPlaced(unplace(placed, tokenIndex));
    announce(`Returned: ${item.tokens[tokenIndex]}.`);
  };
  const undoLast = () => {
    if (!item || checked || !placed.length) return;
    announce(`Removed: ${item.tokens[placed[placed.length - 1]]}.`);
    setPlaced(undo(placed));
  };
  const resetLine = () => {
    if (!item || checked) return;
    setPlaced(reset());
    announce("Answer line cleared.");
  };

  const check = () => {
    if (!item || checked || !isComplete(item, placed)) return;
    const answer = { order, correct: isAccepted(item, order) };
    setChecked(answer);
    setAnswers((list) => list.map((value, i) => (i === index ? answer : value)));
    announce(answer.correct ? "Correct." : `Not quite. The sentence is: ${item.spanish}`);
    if (mode === "retry" && current.entryId) recordRetry(current.entryId, answer.correct);
  };

  const finishRound = (final: Array<Answer | null>) => {
    if (mode === "retry") {
      setFinished({ date: new Date().toISOString(), score: final.filter((a) => a?.correct).length, percent: 0, questionIds: [], answers: [], missedIds: [] });
      return;
    }
    const committed = round.flatMap((entry, i) => (final[i] ? [{ item: entry.item, answer: final[i] as Answer }] : []));
    const misses = committed.filter(({ answer }) => !answer.correct);
    const score = committed.length - misses.length;
    const result: QuizResult = {
      date: new Date().toISOString(),
      score,
      percent: committed.length ? Math.round((score / committed.length) * 100) : 0,
      questionIds: committed.map(({ item: done }) => done.id),
      answers: committed.map(({ item: done, answer }) => sentenceFor(done, answer.order)),
      missedIds: misses.map(({ item: missed }) => missed.id),
      mode: mode === "review" ? "review" : "regular",
    };
    if (committed.length) {
      const next = updateStoredProgress(SENTENCE_BUILDER_STORAGE_KEY, readHistory, (stored) => [...stored, result]);
      setHistory(next);
      if (mode === "regular") {
        recordItemMistakes(SENTENCE_BUILDER_ID, misses.map(({ item: missed, answer }) => ({
          id: missed.id, rule: sentenceBuilderRuleKey(missed), answer: sentenceFor(missed, answer.order),
        })));
        recordActivityToday(SENTENCE_BUILDER_ID);
      }
      // Finished once every Item has been attempted, and, after practising misses, none is left missed.
      const setExhausted = availableQuestions(SENTENCE_BUILDER_ITEMS, next, false).length === 0;
      if (setExhausted && (mode !== "review" || getMissedIds(next).length === 0)) {
        markQuizCompleted(SENTENCE_BUILDER_ID);
        moveFinishedToShelf(SENTENCE_BUILDER_ID);
      }
    }
    setFinished(result);
  };

  const goNext = () => {
    const final = answers.map((value, i) => (i === index ? checked ?? value : value));
    if (index + 1 >= round.length) {
      finishRound(final);
      return;
    }
    setIndex(index + 1);
    setPlaced([]);
    setChecked(null);
    setAnnouncement("");
  };

  const misplaced = useMemo(() => (item && checked && !checked.correct ? new Set(misplacedPositions(item, checked.order)) : new Set<number>()), [item, checked]);

  if (!hydrated) return <main className="loading">Preparing your round…</main>;

  const backHref = mode === "retry" ? mistakesPath(SENTENCE_BUILDER_ID) : SENTENCE_BUILDER_PATH;

  if (finished && mode === "retry") {
    return (
      <main className="app-shell results-screen">
        <SiteHeader />
        <p className="eyebrow-clay">Retry complete</p>
        <h1 className="results-heading">{finished.score} of {round.length} correct</h1>
        <p>Retries are practice only. They don&apos;t change your progress or today&apos;s goal.</p>
        <div className="results-actions">
          <button type="button" className="primary" onClick={() => startRound("retry", history)}>Retry again</button>
          <Link className="secondary" href="/">Back to board</Link>
        </div>
      </main>
    );
  }

  if (finished) {
    return (
      <Results
        quizId={SENTENCE_BUILDER_ID}
        result={finished}
        missedRuleLabels={round.filter((entry) => finished.missedIds.includes(entry.item.id)).map((entry) => sentenceBuilderRuleLabel(sentenceBuilderRuleKey(entry.item)))}
        hasMissedOverall={getMissedIds(history).length > 0}
        onPractiseMisses={() => startRound("review", history)}
        standalone
      />
    );
  }

  if (state === "no-mistakes") {
    return (
      <main className="app-shell">
        <SiteHeader />
        <section className="completion-card">
          <p className="eyebrow">Nothing to retry</p>
          <h2>There are no Sentence Builder mistakes{retryRule ? " in this group" : ""} in your notebook.</h2>
          <div><Link className="primary" href="/">Back to board</Link></div>
        </section>
      </main>
    );
  }

  if (state === "filtered-done") {
    return (
      <main className="app-shell">
        <SiteHeader />
        <section className="completion-card" aria-live="polite">
          <p className="eyebrow">Filtered sentences done</p>
          <h2>You&apos;ve built every sentence that matches your filters.</h2>
          <p>Change the filters to keep going. Sentence Builder counts as finished once every sentence is done.</p>
          <div>
            {getMissedIds(history).length > 0 && <button type="button" className="secondary" onClick={() => startRound("review", history)}>Practise the misses</button>}
            <Link className="primary" href={SENTENCE_BUILDER_PATH}>Back to Sentence Builder</Link>
          </div>
        </section>
      </main>
    );
  }

  if (state === "set-done") {
    const completedAt = readQuizCompletion(SENTENCE_BUILDER_ID);
    const dueDate = completedAt ? repeatDueDate(completedAt) : null;
    const redo = () => {
      const kept = updateStoredProgress(SENTENCE_BUILDER_STORAGE_KEY, readHistory, clearRegularHistory);
      setHistory(kept);
      startRound("regular", kept);
    };
    return (
      <main className="app-shell">
        <SiteHeader />
        <section className="completion-card" aria-live="polite">
          <p className="eyebrow">Set completed</p>
          <h2>You&apos;ve built every Sentence Builder sentence.</h2>
          <p>
            Your results are saved. It has moved to your shelf, so it isn&apos;t part of today&apos;s goal
            {dueDate ? `. It will be suggested for a repeat from ${dueDate.toLocaleDateString()}, and you can redo it any time.` : "."}
          </p>
          <div>
            {getMissedIds(history).length > 0 && <button type="button" className="primary" onClick={() => startRound("review", history)}>Practise the misses</button>}
            <button type="button" className="secondary" onClick={redo}>Redo the whole set</button>
            <Link className="secondary" href={SENTENCE_BUILDER_PATH}>Back to Sentence Builder</Link>
          </div>
        </section>
      </main>
    );
  }

  if (!item) return null;

  const total = round.length;
  const complete = isComplete(item, placed);
  const builtSentence = sentenceFor(item, order);

  return (
    <>
      <SkipLink targetId="sentence-builder-round" label="Skip to the sentence" />
      <main
        id="sentence-builder-round"
        className="round-shell sb-round"
        onKeyDown={(event) => {
          if (event.key === "Backspace" && !checked && !(event.target instanceof HTMLInputElement)) {
            event.preventDefault();
            undoLast();
          }
        }}
      >
        <SiteHeader />
        <header className="round-header">
          <Link className="round-back" href={backHref} aria-label="Back to Sentence Builder"><span aria-hidden="true">←</span></Link>
          <div className="round-steps" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={index} aria-label="Completed sentences">
            {round.map((entry, i) => (
              <span key={entry.item.id} className={`round-step ${i < index ? "round-step-past" : ""} ${i === index ? "round-step-current" : ""}`} />
            ))}
          </div>
          <span className="round-counter">Sentence {index + 1} of {total}</span>
          <HelpButton topic="sentence-builder" />
        </header>

        <section className="round-question-card">
          <div className="round-question-top">
            <p className="eyebrow-clay">{mode === "retry" ? "Mistakes retry" : mode === "review" ? "Practising misses" : `Sentence Builder · ${sentenceBuilderGroupLabel(item.group)}`}</p>
            <span className="round-level-badge">{LEVEL_BADGE[item.level]}</span>
          </div>
          <p className="sb-prompt" lang="en">{item.english}</p>
          <div className={`sb-line${checked ? (checked.correct ? " sb-line-correct" : " sb-line-wrong") : ""}`} aria-label="Your sentence" lang="es">
            {placed.length === 0 && <span className="sb-line-placeholder">Tap the words below in order</span>}
            {placed.map((tokenIndex, position) => (
              <button
                type="button"
                key={tokenIndex}
                className={`sb-token sb-token-placed${misplaced.has(position) ? " sb-token-misplaced" : ""}`}
                disabled={!!checked}
                aria-label={`${item.tokens[tokenIndex]}, placed ${position + 1}. Tap to return it.`}
                onClick={() => returnToken(tokenIndex)}
              >
                {item.tokens[tokenIndex]}
              </button>
            ))}
          </div>
          {!checked && complete && <p className="sb-preview" lang="es">{builtSentence}</p>}
        </section>

        <section className="round-answer-area">
          {!checked && (
            <div className="sb-pool" role="group" aria-label="Words to place" lang="es">
              {current.pool.map((tokenIndex) => {
                const used = placed.includes(tokenIndex);
                return (
                  <button
                    type="button"
                    key={tokenIndex}
                    className={`sb-token${used ? " sb-token-used" : ""}${hint === tokenIndex ? " sb-token-test-hint" : ""}`}
                    disabled={used}
                    aria-hidden={used}
                    tabIndex={used ? -1 : 0}
                    onClick={() => placeToken(tokenIndex)}
                  >
                    {item.tokens[tokenIndex]}
                  </button>
                );
              })}
            </div>
          )}
          {!checked && (
            <div className="sb-tools">
              <button type="button" className="secondary" onClick={undoLast} disabled={!placed.length}>Undo</button>
              <button type="button" className="secondary" onClick={resetLine} disabled={!placed.length}>Reset</button>
            </div>
          )}

          {checked && (
            <div className={`round-explain ${checked.correct ? "round-explain-correct" : "round-explain-wrong"}`}>
              <span className={`round-explain-label ${checked.correct ? "round-explain-label-correct" : "round-explain-label-wrong"}`}>
                {checked.correct ? "Correct" : "Not quite"}
              </span>
              {!checked.correct && <p className="sb-yours" lang="es"><span>Yours:</span> {builtSentence}</p>}
              <p className="sb-correct" lang="es">
                <span>{checked.correct ? "Sentence:" : "Correct:"}</span> {checked.correct ? builtSentence : item.spanish}
                <button type="button" className="sb-speak" aria-label={`Listen to ${item.spanish}`} onClick={() => speak(item.spanish)}>🔊</button>
              </p>
              <p className="round-explain-body">{item.explanation}</p>
            </div>
          )}
          <p className="sr-only" aria-live="polite">{announcement}</p>
        </section>

        <footer className="round-footer">
          {!checked && <button type="button" className="round-skip" onClick={goNext}>Skip</button>}
          {checked ? (
            <button type="button" className="round-next" onClick={goNext} autoFocus>{index + 1 >= total ? "See results" : "Next sentence"}</button>
          ) : (
            <button type="button" ref={checkRef} className="round-next" disabled={!complete} onClick={check}>
              {complete ? "Check" : `Place all ${item.tokens.length} words`}
            </button>
          )}
        </footer>
      </main>
    </>
  );
}
