"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QUIZ_CONFIG, quizPath, type QuizId } from "./quiz-config";
import { normalizeAnswer, sentenceParts } from "./quiz-logic";
import { readTopicSettings, type AnswerMode } from "./topic-settings";
import { answerChoicesFor } from "./answer-choices";
import { dismissEntry, readNotebookEntries, recordRetry, type NotebookEntry } from "./notebook";
import { buildRetrySession, mistakesTitle, retryExplanation, type RetryItem } from "./notebook-retry";
import RoundQuestion from "./round-question";
import SiteHeader from "./site-header";

// The temporary mistakes activity for one quiz: shown while that quiz has notebook entries.
// Practice only. Its one write is the notebook (recordRetry, dismissEntry); it never imports or
// calls quiz history, the streak, completion or daily goal code, so nothing here counts toward them.

const times = (n: number) => `${n} time${n === 1 ? "" : "s"}`;

const PRACTICE_NOTE = "Practice only: retries do not count toward today's goal, your streak, accuracy or due counts.";

type Phase = "overview" | "round" | "done";

export default function MistakesActivity({ quizId, initialRule = null }: { quizId: QuizId; initialRule?: string | null }) {
  const quiz = QUIZ_CONFIG[quizId];
  const title = mistakesTitle(quizId);

  const [hydrated, setHydrated] = useState(false);
  const [entries, setEntries] = useState<NotebookEntry[]>([]);
  const [rule, setRule] = useState<string | null>(initialRule);
  const [roundLength, setRoundLength] = useState(5);
  const [phase, setPhase] = useState<Phase>("overview");
  const [items, setItems] = useState<RetryItem[]>([]);
  const [choiceSets, setChoiceSets] = useState<Record<number, string[]>>({});
  const [mode, setMode] = useState<AnswerMode>("type");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<string | null>>([]);
  const [submitted, setSubmitted] = useState<boolean[]>([]);

  const reload = () => setEntries(readNotebookEntries().filter((entry) => entry.quizId === quizId));

  useEffect(() => {
    // The notebook lives only in this device's browser storage, which isn't readable until the client mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    reload();
    setRoundLength(readTopicSettings(quizId).roundLength);
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  if (!hydrated) return <main className="loading">Preparing your mistakes…</main>;

  const rules = [...new Set(entries.map((entry) => entry.rule))];
  const activeRule = rule && rules.includes(rule) ? rule : null;
  const listed = activeRule ? entries.filter((entry) => entry.rule === activeRule) : entries;
  const preview = buildRetrySession(quizId, entries, quiz.questions, roundLength, activeRule);

  const start = () => {
    const settings = readTopicSettings(quizId);
    const session = buildRetrySession(quizId, readNotebookEntries(), quiz.questions, settings.roundLength, activeRule);
    if (!session.length) return;
    setMode(settings.mode);
    setItems(session);
    setChoiceSets(Object.fromEntries(session.map((item) => [item.question.id, answerChoicesFor(item.question, quiz.forms)])));
    setAnswers(Array(session.length).fill(null));
    setSubmitted(Array(session.length).fill(false));
    setIndex(0);
    setPhase("round");
  };

  const dismiss = (entryId: string) => {
    dismissEntry(entryId);
    reload();
  };

  if (phase === "round" && items[index]) {
    const { question, entryId } = items[index];
    const isSubmitted = submitted[index];
    const isLast = index === items.length - 1;

    const commit = (answer: string) => {
      if (isSubmitted) return;
      setAnswers((current) => current.map((value, i) => (i === index ? answer : value)));
      setSubmitted((current) => current.map((value, i) => (i === index ? true : value)));
      recordRetry(entryId, normalizeAnswer(answer) === normalizeAnswer(question.answer));
    };

    const goNext = () => {
      if (isLast) {
        reload();
        setPhase("done");
        return;
      }
      setIndex((current) => current + 1);
    };

    const skip = () => {
      if (!isSubmitted) setSubmitted((current) => current.map((value, i) => (i === index ? true : value)));
      goNext();
    };

    return (
      <RoundQuestion
        quizId={quizId}
        standalone
        question={question}
        index={index}
        stepKeys={items.map((item) => item.question.id)}
        mode={mode}
        choices={choiceSets[question.id] ?? answerChoicesFor(question, quiz.forms)}
        picked={answers[index]}
        isSubmitted={isSubmitted}
        backHref={quizPath(quizId)}
        backLabel="Back to topic"
        eyebrow={title}
        onCommit={commit}
        onNext={goNext}
        onSkip={skip}
        feedback={(isCorrect) => {
          if (isCorrect) {
            return <p className="round-explain-body">Counted on this mistake. It stays in your notebook until you dismiss it.</p>;
          }
          const explanation = retryExplanation(quizId, question, answers[index] ?? "");
          return (
            <>
              <p className="round-explain-body">{explanation.summary}</p>
              <p className="round-explain-body">{explanation.rule}</p>
              {explanation.sentence && <p className="round-explain-body">{explanation.sentence}</p>}
            </>
          );
        }}
      />
    );
  }

  if (phase === "done") {
    const answered = items.filter((_, i) => answers[i] !== null).length;
    const correct = items.filter((item, i) => answers[i] !== null && normalizeAnswer(answers[i] as string) === normalizeAnswer(item.question.answer)).length;
    return (
      <main className="app-shell mistakes-shell">
        <SiteHeader />
        <p className="eyebrow-clay">Retry complete</p>
        <h1 className="results-heading">{answered ? `${correct} of ${answered} correct` : "Retry skipped"}</h1>
        <p className="mistakes-note">{PRACTICE_NOTE}</p>
        <p className="mistakes-note">Entries stay in the notebook until you dismiss them.</p>
        <div className="mistakes-actions">
          {entries.length > 0 && <button type="button" className="primary mistakes-button" onClick={start}>Retry again</button>}
          <button type="button" className="secondary mistakes-button" onClick={() => setPhase("overview")}>Review entries</button>
          <Link className="secondary mistakes-button" href="/">Back to board</Link>
        </div>
      </main>
    );
  }

  const byId = new Map(quiz.questions.map((question) => [question.id, question]));

  return (
    <main className="app-shell mistakes-shell">
      <SiteHeader />
      <header className="mistakes-header">
        <Link className="topic-back" href="/" aria-label="Back to board"><span aria-hidden="true">←</span></Link>
        <p className="eyebrow-clay">Temporary activity</p>
        <h1>{title}</h1>
        <p className="mistakes-note">{PRACTICE_NOTE}</p>
      </header>

      {entries.length === 0 ? (
        <section className="mistakes-card">
          <p>No mistakes left in {quiz.title.replace(" Quiz", "")}. This activity disappears from the board until you miss a sentence again.</p>
          <div className="mistakes-actions">
            <Link className="primary mistakes-button" href={quizPath(quizId)}>Back to topic</Link>
            <Link className="secondary mistakes-button" href="/">Back to board</Link>
          </div>
        </section>
      ) : (
        <>
          {rules.length > 1 && (
            <div className="mistakes-chip-row" role="group" aria-label="Subtopic">
              <button type="button" className="mistakes-chip" aria-pressed={!activeRule} onClick={() => setRule(null)}>All ({entries.length})</button>
              {rules.map((label) => (
                <button type="button" key={label} className="mistakes-chip" aria-pressed={activeRule === label} onClick={() => setRule(label)}>
                  {label} ({entries.filter((entry) => entry.rule === label).length})
                </button>
              ))}
            </div>
          )}

          <ul className="mistakes-list">
            {listed.map((entry) => {
              const question = entry.questionId !== undefined ? byId.get(entry.questionId) : undefined;
              const sentence = question ? sentenceParts(question) : null;
              return (
                <li key={entry.id} className="mistakes-entry">
                  <div className="mistakes-entry-body">
                    <p className="mistakes-entry-rule">{entry.rule}</p>
                    {sentence ? (
                      <p className="mistakes-entry-sentence" lang="es">{sentence.before}<strong>{sentence.answer}</strong>{sentence.after}</p>
                    ) : (
                      <p className="mistakes-entry-sentence">Missed before the notebook kept sentences. Retries use sentences from this subtopic.</p>
                    )}
                    {entry.wrongAnswer && <p className="mistakes-entry-meta">You answered <span lang="es">{entry.wrongAnswer}</span></p>}
                    <p className="mistakes-entry-meta">
                      Missed {times(entry.missCount)} · Retried {times(entry.retryCount)}{entry.retryCount ? `, ${entry.retryCorrectCount} correct` : ""}
                    </p>
                  </div>
                  <button type="button" className="mistakes-dismiss" onClick={() => dismiss(entry.id)} aria-label={`Dismiss ${entry.rule}${sentence ? `: ${question?.before} ${question?.answer} ${question?.after}` : ""}`}>
                    Dismiss
                  </button>
                </li>
              );
            })}
          </ul>

          <footer className="topic-detail-footer">
            {preview.length ? (
              <button type="button" className="primary topic-start mistakes-start" onClick={start}>
                Retry {preview.length} {preview.length === 1 ? "sentence" : "sentences"}
              </button>
            ) : (
              <span className="primary topic-start topic-start-disabled mistakes-start" aria-disabled="true">No sentences to retry</span>
            )}
          </footer>
        </>
      )}
    </main>
  );
}
