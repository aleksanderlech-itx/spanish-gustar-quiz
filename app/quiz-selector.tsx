"use client";

import { useEffect, useMemo, useState } from "react";
import { QUIZ_CONFIG, type QuizId } from "./quiz-config";

type StoredResult = { questionIds?: number[] };
type QuizProgress = { completed: number; total: number; percent: number };

const QUIZ_IDS = Object.keys(QUIZ_CONFIG) as QuizId[];

const quizPath = (quizId: QuizId) =>
  quizId === "gustar" ? "/?play=1" : `/?quiz=${quizId}&play=1`;

const readProgress = (quizId: QuizId): QuizProgress => {
  const quiz = QUIZ_CONFIG[quizId];
  const total = quiz.questions.length;

  try {
    const raw = window.localStorage.getItem(quiz.storageKey);
    const history = raw ? (JSON.parse(raw) as StoredResult[]) : [];
    const completed = new Set(
      history.flatMap((result) => Array.isArray(result.questionIds) ? result.questionIds : []),
    ).size;

    return {
      completed,
      total,
      percent: total ? Math.min(100, Math.round((completed / total) * 100)) : 0,
    };
  } catch {
    return { completed: 0, total, percent: 0 };
  }
};

export default function QuizSelector() {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState<Record<QuizId, QuizProgress>>(() => ({
    gustar: { completed: 0, total: QUIZ_CONFIG.gustar.questions.length, percent: 0 },
    "ser-estar": { completed: 0, total: QUIZ_CONFIG["ser-estar"].questions.length, percent: 0 },
    "preterite-imperfect": { completed: 0, total: QUIZ_CONFIG["preterite-imperfect"].questions.length, percent: 0 },
  }));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setProgress(Object.fromEntries(QUIZ_IDS.map((id) => [id, readProgress(id)])) as Record<QuizId, QuizProgress>);
    setOpen(params.get("play") !== "1");
    setReady(true);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("quiz-library-open", ready && open);
    return () => document.body.classList.remove("quiz-library-open");
  }, [open, ready]);

  const totalCompleted = useMemo(
    () => QUIZ_IDS.reduce((sum, id) => sum + progress[id].completed, 0),
    [progress],
  );

  const totalQuestions = useMemo(
    () => QUIZ_IDS.reduce((sum, id) => sum + progress[id].total, 0),
    [progress],
  );

  if (!ready || !open) return null;

  return (
    <main className="quiz-library" aria-labelledby="quiz-library-title">
      <header className="library-header">
        <div>
          <p className="library-kicker">Spanish Quiz Studio</p>
          <h1 id="quiz-library-title">Choose what to practise</h1>
          <p className="library-intro">Short, focused rounds for the grammar points you want to improve.</p>
        </div>
        <div className="library-total" aria-label={`${totalCompleted} of ${totalQuestions} sentences completed`}>
          <strong>{totalCompleted}</strong>
          <span>sentences completed</span>
        </div>
      </header>

      <section className="quiz-card-grid" aria-label="Available quizzes">
        {QUIZ_IDS.map((id) => {
          const item = QUIZ_CONFIG[id];
          const itemProgress = progress[id];
          const hasProgress = itemProgress.completed > 0;

          return (
            <article className="quiz-library-card" key={id}>
              <div className="quiz-library-card-top">
                <div>
                  <p className="quiz-library-eyebrow">{item.eyebrow}</p>
                  <h2>{item.title.replace(" Quiz", "")}</h2>
                </div>
                <span className="quiz-count">{itemProgress.total} sentences</span>
              </div>

              <p className="quiz-library-copy">{item.copy}</p>

              <div className="quiz-library-progress">
                <div className="quiz-library-progress-copy">
                  <span>{itemProgress.completed} of {itemProgress.total} completed</span>
                  <strong>{itemProgress.percent}%</strong>
                </div>
                <div className="quiz-library-progress-track" aria-hidden="true">
                  <span style={{ width: `${itemProgress.percent}%` }} />
                </div>
              </div>

              <a className="quiz-library-start" href={quizPath(id)}>
                {hasProgress ? "Continue" : "Start"}
              </a>
            </article>
          );
        })}
      </section>

      <p className="library-note">Progress, filters, scoring, audio and review history remain attached to each quiz.</p>
    </main>
  );
}
