"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { type Question } from "./quiz-data";
import { availableQuestions, filterQuestions, getMissedIds, normalizeAnswer, restartSelectedHistory, scoreRound, type QuizFilters, type QuizResult } from "./quiz-logic";
import { QUIZ_CONFIG, type QuizId } from "./quiz-config";

type Result = QuizResult;
type Filters = QuizFilters;

const presentOnlyHistory = (items: Result[], questions: Question[]) => items.flatMap((result) => {
  const currentIds = new Set(questions.map((question) => question.id));
  const kept = result.questionIds.map((id, index) => ({ id, index })).filter(({ id }) => currentIds.has(id));
  if (!kept.length) return [];
  const questionIds = kept.map(({ id }) => id);
  const answers = kept.map(({ index }) => result.answers[index] ?? "");
  const missedIds = result.missedIds.filter((id) => currentIds.has(id));
  const score = questionIds.length - missedIds.length;
  return [{ ...result, questionIds, answers, missedIds, score, percent: Math.round((score / questionIds.length) * 100), tense: "present" as const }];
});

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);
const normalize = normalizeAnswer;
const PRONOUNS = ["me", "te", "le", "nos", "les"];

const answerChoicesFor = (question: Question, forms: Record<string, [string, string]>) => {
  if (question.infinitive === "ser / estar") return shuffle([question.answer, question.objectPronoun].filter(Boolean));
  const choices = new Set<string>([question.answer]);
  const verbForms = forms[question.infinitive] ?? [question.verbAnswer, question.verbAnswer];
  choices.add(`${question.objectPronoun} ${verbForms.find((form) => form !== question.verbAnswer) ?? question.verbAnswer}`);
  PRONOUNS.filter((pronoun) => pronoun !== question.objectPronoun).forEach((pronoun) => choices.add(`${pronoun} ${question.verbAnswer}`));
  return shuffle([...choices].slice(0, 4));
};

const mergeHistory = (local: Result[], remote: Result[]) => {
  const unique = new Map<string, Result>();
  [...remote, ...local].forEach((item) => unique.set(`${item.date}|${item.mode ?? "regular"}|${item.questionIds.join(",")}`, item));
  return [...unique.values()].sort((a, b) => a.date.localeCompare(b.date));
};

const quizIdFromLocation = (): QuizId =>
  typeof window !== "undefined" && new URLSearchParams(window.location.search).get("quiz") === "ser-estar" ? "ser-estar" : "gustar";

export default function Home() {
  const [quizId, setQuizId] = useState<QuizId>(quizIdFromLocation);
  const quiz = QUIZ_CONFIG[quizId];
  const { questions, forms, storageKey, filterKey } = quiz;
  const answerLabel = quizId === "ser-estar" ? "enter the missing verb" : "enter the missing object pronoun and verb";
  const [history, setHistory] = useState<Result[]>([]);
  const [round, setRound] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[]>(Array(5).fill(""));
  const [checked, setChecked] = useState(false);
  const [practiceMissed, setPracticeMissed] = useState(false);
  const [shownExplanations, setShownExplanations] = useState<Set<number>>(new Set());
  const [hydrated, setHydrated] = useState(false);
  const [filters, setFilters] = useState<Filters>({ level: "all", verb: "all" });
  const [cycleComplete, setCycleComplete] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [syncState, setSyncState] = useState<"checking" | "signed-out" | "synced" | "saving" | "error">("checking");
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [answerMode, setAnswerMode] = useState<"choose" | "type">("type");
  const [darkMode, setDarkMode] = useState(false);
  const importRef = useRef<HTMLInputElement | null>(null);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const activeQuestionCard = useRef<HTMLElement | null>(null);
  const [choiceSets, setChoiceSets] = useState<Record<number, string[]>>({});

  const switchQuiz = (nextQuizId: QuizId) => {
    if (nextQuizId === quizId) return;
    window.history.pushState(null, "", nextQuizId === "ser-estar" ? "/?quiz=ser-estar" : "/?quiz=gustar");
    setQuizId(nextQuizId);
    setHydrated(false);
  };

  const regularHistory = useMemo(() => history.filter((item) => item.mode !== "review"), [history]);
  const reviewHistory = useMemo(() => history.filter((item) => item.mode === "review"), [history]);
  const filteredQuestions = useMemo(() => filterQuestions(questions, filters), [questions, filters]);
  const usedIds = useMemo(() => new Set(regularHistory.flatMap((item) => item.questionIds)), [regularHistory]);
  const missedIds = useMemo(() => getMissedIds(history), [history]);
  const filteredMissedIds = useMemo(() => {
    const selected = new Set(filteredQuestions.map((question) => question.id));
    return missedIds.filter((id) => selected.has(id));
  }, [filteredQuestions, missedIds]);
  const rule = quiz.rule;

  const startRound = (missedOnly = practiceMissed, sourceHistory = history, sourceQuestions = filteredQuestions) => {
    let pool = availableQuestions(sourceQuestions, sourceHistory, missedOnly);
    if (missedOnly && pool.length === 0) {
      missedOnly = false;
      setPracticeMissed(false);
      pool = availableQuestions(sourceQuestions, sourceHistory, false);
    }
    if (!missedOnly && pool.length === 0) { setCycleComplete(true); return; }
    setCycleComplete(false);
    const selected = shuffle(pool).slice(0, 5);
    setRound(selected);
    setAnswers(Array(selected.length).fill(""));
    setChoiceSets(Object.fromEntries(selected.map((question) => [question.id, answerChoicesFor(question, forms)])));
    setActiveQuestion(0);
    setShownExplanations(new Set());
    setChecked(false);
    setTimeout(() => inputs.current[0]?.focus(), 0);
  };

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    const initial = saved ? (JSON.parse(saved) as Result[]) : [];
    const savedFilters = localStorage.getItem(filterKey);
    const storedFilters = savedFilters ? JSON.parse(savedFilters) as Partial<Filters> : {};
    const initialFilters: Filters = { level: storedFilters.level ?? "all", verb: storedFilters.verb ?? "all" };
    const initialise = async () => {
      let merged = presentOnlyHistory(initial, questions);
      try {
        const response = await fetch("/api/progress", { cache: "no-store" });
        if (response.status === 401) setSyncState("signed-out");
        else if (response.ok) {
          const data = await response.json() as { progress?: { history?: Result[] } | null };
          merged = presentOnlyHistory(mergeHistory(initial, data.progress?.history ?? []), questions);
          localStorage.setItem(storageKey, JSON.stringify(merged));
          setSyncState("synced");
          if (merged.length !== (data.progress?.history?.length ?? 0)) {
            await fetch("/api/progress", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ history: merged, filters: initialFilters }) });
          }
        } else setSyncState("error");
      } catch { setSyncState("error"); }
      const initialQuestions = filterQuestions(questions, initialFilters);
      const used = new Set(merged.filter((item) => item.mode !== "review").flatMap((item) => item.questionIds));
      const pool = initialQuestions.filter((q) => !used.has(q.id));
      const selected = shuffle(pool.length ? pool : initialQuestions).slice(0, 5);
      setHistory(merged); setFilters(initialFilters);
      setRound(selected); setChoiceSets(Object.fromEntries(selected.map((question) => [question.id, answerChoicesFor(question, forms)]))); setActiveQuestion(0); setHydrated(true);
    };
    void initialise();
  }, [filterKey, forms, questions, storageKey]);

  useEffect(() => {
    const syncQuizFromUrl = () => {
      const nextQuizId = quizIdFromLocation();
      setQuizId((currentQuizId) => {
        if (currentQuizId === nextQuizId) return currentQuizId;
        setHydrated(false);
        return nextQuizId;
      });
    };

    window.addEventListener("popstate", syncQuizFromUrl);
    return () => window.removeEventListener("popstate", syncQuizFromUrl);
  }, []);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const scrollQuestionToTop = () => {
      if (document.activeElement?.tagName !== "INPUT") return;
      activeQuestionCard.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    };

    const keepActionsAboveKeyboard = () => {
      const keyboardInset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      document.documentElement.style.setProperty("--keyboard-inset", `${keyboardInset}px`);
      if (keyboardInset > 100) window.requestAnimationFrame(scrollQuestionToTop);
    };

    keepActionsAboveKeyboard();
    viewport.addEventListener("resize", keepActionsAboveKeyboard);
    viewport.addEventListener("scroll", keepActionsAboveKeyboard);
    return () => {
      viewport.removeEventListener("resize", keepActionsAboveKeyboard);
      viewport.removeEventListener("scroll", keepActionsAboveKeyboard);
      document.documentElement.style.removeProperty("--keyboard-inset");
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    return () => document.body.classList.remove("dark");
  }, [darkMode]);

  const persistProgress = async (nextHistory: Result[], nextFilters = filters) => {
    localStorage.setItem(storageKey, JSON.stringify(nextHistory));
    if (syncState !== "synced" && syncState !== "saving") return;
    setSyncState("saving");
    try {
      const response = await fetch("/api/progress", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ history: nextHistory, filters: nextFilters }) });
      setSyncState(response.ok ? "synced" : response.status === 401 ? "signed-out" : "error");
    } catch { setSyncState("error"); }
  };

  const correct = checked ? round.filter((q, i) => normalize(answers[i]) === q.answer).length : 0;
  const average = regularHistory.length ? Math.round(regularHistory.reduce((sum, r) => sum + r.percent, 0) / regularHistory.length) : 0;
  const best = regularHistory.length ? Math.max(...regularHistory.map((r) => r.percent)) : 0;
  const completedUnique = usedIds.size;
  const filteredSeen = filteredQuestions.filter((q) => usedIds.has(q.id)).length;
  const weakAreas = useMemo(() => {
    const totals = new Map<string, { attempts: number; misses: number }>();
    const record = (key: string, missed: boolean) => { const value = totals.get(key) ?? { attempts: 0, misses: 0 }; value.attempts += 1; if (missed) value.misses += 1; totals.set(key, value); };
    regularHistory.forEach((result) => result.questionIds.forEach((id) => {
      const question = questions.find((q) => q.id === id); if (!question) return;
      const missed = result.missedIds.includes(id);
      record(`Verb: ${question.infinitive}`, missed);
      record(`Tense: ${question.tense}`, missed);
      record(`Agreement: ${question.subjectNumber}`, missed);
      record(question.isActivity ? "Subject: infinitive activity" : "Subject: noun", missed);
      record(`Pronoun: ${question.indirectObject}`, missed);
    }));
    return [...totals].filter(([, value]) => value.misses).sort((a, b) => (b[1].misses / b[1].attempts) - (a[1].misses / a[1].attempts)).slice(0, 6);
  }, [questions, regularHistory]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (checked || answers.some((answer) => !answer.trim())) return;
    const { missedIds: missed, score, percent } = scoreRound(round, answers);
    const result: Result = { date: new Date().toISOString(), score, percent, questionIds: round.map((q) => q.id), answers, missedIds: missed, mode: practiceMissed ? "review" : "regular", tense: round[0]?.tense };
    const next = [...history, result];
    setHistory(next);
    void persistProgress(next);
    setChecked(true);
  };

  const speakCurrentQuestion = () => {
    if (!("speechSynthesis" in window) || !round[activeQuestion]) return;
    window.speechSynthesis.cancel();
    const question = round[activeQuestion];
    const text = `${question.before} ${checked ? question.answer : "espacio"} ${question.after}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const reset = () => {
    if (!window.confirm("Delete all quiz history and missed answers? This cannot be undone.")) return;
    localStorage.removeItem(storageKey);
    setHistory([]);
    void persistProgress([]);
    setPracticeMissed(false);
    startRound(false, []);
  };

  const applyFilters = (next: Filters) => {
    setFilters(next);
    localStorage.setItem(filterKey, JSON.stringify(next));
    if (syncState === "synced") void persistProgress(history, next);
    setPracticeMissed(false);
    const nextQuestions = filterQuestions(questions, next);
    startRound(false, history, nextQuestions);
  };

  const restartCycle = () => {
    const retained = restartSelectedHistory(history, new Set(filteredQuestions.map((question) => question.id)));
    setHistory(retained);
    void persistProgress(retained);
    setCycleComplete(false);
    startRound(false, retained);
  };

  const exportProgress = () => {
    const blob = new Blob([JSON.stringify({ version: 1, history, filters }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url; link.download = quiz.backupName; link.click(); URL.revokeObjectURL(url);
  };

  const importProgress = async (file?: File) => {
    if (!file) return;
    try {
      const data = JSON.parse(await file.text()) as { history?: Result[]; filters?: Filters };
      if (!Array.isArray(data.history)) throw new Error();
      const importedHistory = presentOnlyHistory(data.history, questions);
      setHistory(importedHistory); void persistProgress(importedHistory, data.filters ?? filters);
      if (data.filters) { setFilters(data.filters); localStorage.setItem(filterKey, JSON.stringify(data.filters)); }
      startRound(false, importedHistory, data.filters ? filterQuestions(questions, data.filters) : questions);
    } catch { window.alert(`This is not a valid ${quiz.title} progress file.`); }
  };

  if (!hydrated || round.length === 0) return <main className="loading">Preparing your quiz…</main>;

  const roundPercent = checked ? Math.round((correct / round.length) * 100) : 0;
  const currentAnswered = Boolean(answers[activeQuestion]?.trim());
  const canGoForward = checked || currentAnswered;
  const isLastQuestion = activeQuestion === round.length - 1;

  return (
    <main className="app-shell">
      <header className="hero">
        <div className="hero-topline">
          <div className="brand">
            <span className="brand-mark">ES</span>
            <div>
              <p className="brand-title">Spanish Quiz Studio</p>
              <p className="brand-subtitle">Reusable practice engine</p>
            </div>
          </div>
          <div className="header-actions">
            <button type="button" className="mode-switch" aria-pressed={darkMode} onClick={() => setDarkMode((value) => !value)}>
              Dark
              <span className="switch-track" aria-hidden="true"><span /></span>
            </button>
            <details className="quiz-switch">
              <summary aria-label="Switch quiz" title="Switch quiz">
                <span className="quiz-icon" aria-hidden="true"><span /><span /></span>
              </summary>
              <nav aria-label="Other quizzes">
                <button type="button" aria-current={quizId === "gustar" ? "page" : undefined} onClick={() => switchQuiz("gustar")}>Gustar</button>
                <button type="button" aria-current={quizId === "ser-estar" ? "page" : undefined} onClick={() => switchQuiz("ser-estar")}>Ser vs Estar</button>
              </nav>
            </details>
            <button type="button" className="listen-button" onClick={speakCurrentQuestion} aria-label="Listen to the current Spanish sentence"><span className="listen-icon" aria-hidden="true" />{isSpeaking ? "Playing" : "Listen"}</button>
          </div>
        </div>
        <p className="eyebrow">{quiz.eyebrow}</p>
        <h1>{quiz.heading}</h1>
        <p className="hero-copy">{quiz.copy}</p>
        <div className="round-meta">{practiceMissed ? "Missed-answer practice" : `Round ${regularHistory.length + (checked ? 0 : 1)}`} <span>·</span> {round.length} question{round.length === 1 ? "" : "s"}</div>
        <div className="set-progress"><span>{filteredSeen} of {filteredQuestions.length} selected sentences completed</span><div className="progress"><span style={{ width: `${Math.max(3, (filteredSeen / Math.max(1, filteredQuestions.length)) * 100)}%` }} /></div></div>
      </header>

      <details className="filters" aria-label="Practice options">
        <summary><strong>Filters</strong><span>{filteredQuestions.length} sentences selected</span></summary>
        <div className="filter-fields">
          <label>Difficulty<select value={filters.level} onChange={(event) => applyFilters({ ...filters, level: event.target.value as Filters["level"] })}><option value="all">All levels</option><option value="basic">Basic</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label>
          <label>Verb<select value={filters.verb} onChange={(event) => applyFilters({ ...filters, verb: event.target.value })}><option value="all">All verbs</option>{Object.keys(forms).map((verb) => <option value={verb} key={verb}>{verb}</option>)}</select></label>
        </div>
      </details>

      {cycleComplete && <section className="completion-card" aria-live="polite"><p className="eyebrow">Set completed</p><h2>You completed all {filteredQuestions.length} selected sentences.</h2><p>Your results are saved. Restart this set or review the answers you missed.</p><div><button type="button" className="primary" onClick={restartCycle}>Restart selected set</button><button type="button" className="secondary" disabled={!filteredMissedIds.length} onClick={() => { setPracticeMissed(true); setCycleComplete(false); startRound(true); }}>Practise filtered missed answers</button></div></section>}

      {!cycleComplete && checked && <section className="result-card" aria-live="polite">
        <div className="score-ring"><strong>{roundPercent}%</strong><span>{correct}/{round.length} correct</span></div>
        <div><p className="result-label">{practiceMissed ? "Review complete" : "Round complete"}</p><h2>{roundPercent === 100 ? "Excellent work." : roundPercent >= 80 ? "Very good." : roundPercent >= 60 ? "Good start." : "Keep practising."}</h2><p>{practiceMissed ? "Correct answers leave your missed list. Any remaining mistakes stay ready for another review." : "Review any corrections below, then continue with new sentences."}</p></div>
      </section>}

      {!cycleComplete && <form onSubmit={submit} className="quiz-form">
        <div className="question-progress" role="progressbar" aria-valuemin={1} aria-valuemax={round.length} aria-valuenow={activeQuestion + 1} aria-label={`Question ${activeQuestion + 1} of ${round.length}`}>
          <strong>{checked ? "Review" : "Question"} {activeQuestion + 1} of {round.length}</strong>
          <div>{round.map((question, index) => <span key={question.id} className={`${index === activeQuestion ? "active" : ""} ${answers[index]?.trim() ? "answered" : ""} ${checked && normalize(answers[index]) === question.answer ? "correct" : ""} ${checked && normalize(answers[index]) !== question.answer ? "wrong" : ""}`} />)}</div>
        </div>
        <div className="answer-mode" aria-label="Answer mode">
          <button type="button" className={answerMode === "choose" ? "active" : ""} onClick={() => setAnswerMode("choose")}>Choose</button>
          <button type="button" className={answerMode === "type" ? "active" : ""} onClick={() => setAnswerMode("type")}>Type</button>
        </div>
        <div className="questions">
          {round.map((question, index) => {
            const isCorrect = checked && normalize(answers[index]) === question.answer;
            const isWrong = checked && !isCorrect;
            const answerChoices = choiceSets[question.id] ?? answerChoicesFor(question, forms);
            return <article ref={index === activeQuestion ? activeQuestionCard : undefined} hidden={index !== activeQuestion} aria-hidden={index !== activeQuestion} className={`question-card ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`} key={question.id}>
              <span className="number">{index + 1}</span>
              <div className="sentence-wrap">
                <label htmlFor={`answer-${index}`}><span className="sr-only">Question {index + 1}, {answerLabel}</span><span>{question.before} </span></label>
                {answerMode === "type" && <input
                    id={`answer-${index}`}
                    ref={(node) => { inputs.current[index] = node; }}
                    value={answers[index]}
                    disabled={checked}
                    autoComplete="off"
                    spellCheck={false}
                    onChange={(event) => setAnswers((current) => current.map((value, i) => i === index ? event.target.value : value))}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !checked && index < round.length - 1 && answers[index]?.trim()) {
                        event.preventDefault();
                        setActiveQuestion(index + 1);
                        setTimeout(() => inputs.current[index + 1]?.focus(), 0);
                      }
                    }}
                    aria-invalid={isWrong || undefined}
                    placeholder={quizId === "ser-estar" ? "ser / estar" : "pronoun + verb"}
                  />}
                {answerMode === "choose" && <span className={`answer-slot ${answers[index] ? "filled" : ""} ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}>{answers[index] || (quizId === "ser-estar" ? "ser / estar" : "pronoun + verb")}</span>}
                <span>{question.after}</span>
                {isWrong && <p className="feedback"><strong>Correct: {question.answer}.</strong></p>}
                {isCorrect && <p className="feedback">Correct.</p>}
                <div className="verb-row">
                  <span className="verb-chip">{question.infinitive}</span>
                </div>
                {answerMode === "choose" && <div className="choice-grid" aria-label={`Answer choices for question ${index + 1}`}>
                  {answerChoices.map((choice) => {
                    const selected = answers[index] === choice;
                    const correctChoice = checked && choice === question.answer;
                    const wrongChoice = checked && selected && choice !== question.answer;
                    return <button
                      type="button"
                      key={choice}
                      className={`${selected ? "selected" : ""} ${correctChoice ? "correct" : ""} ${wrongChoice ? "wrong" : ""}`}
                      disabled={checked}
                      onClick={() => setAnswers((current) => current.map((value, i) => i === index ? choice : value))}
                    >
                      {choice}
                    </button>;
                  })}
                </div>}
                <div className="translation-control">
                  <p className="translation-text" lang="en">{question.translations.en}</p>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={shownExplanations.has(question.id)}
                    className="translation-switch"
                    onClick={() => setShownExplanations((current) => {
                      const next = new Set(current);
                      if (next.has(question.id)) next.delete(question.id); else next.add(question.id);
                      return next;
                    })}
                  >
                    <span className="switch-track"><span /></span>
                    {shownExplanations.has(question.id) ? "Hide explanation" : "Show explanation"}
                  </button>
                  {shownExplanations.has(question.id) && <p className="explanation-text">{question.explanation}</p>}
                </div>
              </div>
            </article>;
          })}
        </div>

        <div className="action-bar">
          <button type="button" className="back-button" disabled={activeQuestion === 0} onClick={() => setActiveQuestion((index) => Math.max(0, index - 1))}>Back</button>
          <div className="action-copy">{checked ? `${correct} of ${round.length} correct` : `${answers.filter((answer) => answer.trim()).length} of ${round.length} answered`}</div>
          {!checked && !isLastQuestion && <button type="button" className="primary" disabled={!canGoForward} onClick={() => { setActiveQuestion((index) => Math.min(round.length - 1, index + 1)); setTimeout(() => inputs.current[activeQuestion + 1]?.focus(), 0); }}>Next</button>}
          {!checked && isLastQuestion && <button className="primary" disabled={!currentAnswered || answers.some((answer) => !answer.trim())}>Check answers</button>}
          {checked && !isLastQuestion && <button type="button" className="primary" onClick={() => setActiveQuestion((index) => Math.min(round.length - 1, index + 1))}>Next answer</button>}
          {checked && isLastQuestion && <button type="button" className="primary" onClick={() => startRound()}>{practiceMissed && filteredMissedIds.length ? "Continue missed practice" : "Next selected sentences"}</button>}
        </div>
      </form>}

      <section className="rule-card">
        <span className="rule-mark" />
        <div><strong>{rule.title}</strong><p>{rule.body}</p></div>
        <div className="examples"><span>{rule.singular}</span><span>{rule.plural}</span></div>
      </section>

      <section className="stats">
        <div className="stats-heading"><div><p className="eyebrow">Your progress</p><h2>Practice history</h2></div><button className="text-button" onClick={reset}>Reset progress</button></div>
        <div className="stat-grid"><div><strong>{regularHistory.length}</strong><span>Regular rounds</span></div><div><strong>{average}%</strong><span>Regular average</span></div><div><strong>{best}%</strong><span>Regular best</span></div><div><strong>{completedUnique}/{questions.length}</strong><span>Sentences seen</span></div></div>
        <div className="review-summary"><span><strong>{reviewHistory.length}</strong> review rounds</span><span><strong>{missedIds.length}</strong> answers still to master</span></div>
        <div className={`practice-row ${practiceMissed ? "active-practice" : ""}`}><div><strong>Incorrect-answer practice</strong><span>{filteredMissedIds.length ? `${filteredMissedIds.length} missed sentence${filteredMissedIds.length === 1 ? "" : "s"} match the selected filters` : missedIds.length ? `No missed answers match these filters (${missedIds.length} saved overall)` : "No missed sentences waiting"}</span></div><button type="button" className="secondary" disabled={!filteredMissedIds.length || practiceMissed} onClick={() => { setPracticeMissed(true); startRound(true); }}>{practiceMissed ? "Practising missed answers" : "Practise filtered missed answers"}</button></div>
        <div className="insights"><div><strong>Weak areas</strong>{weakAreas.length ? weakAreas.map(([area, value]) => <span key={area}>{area}: {Math.round((value.misses / value.attempts) * 100)}% missed ({value.misses}/{value.attempts})</span>) : <span>No recurring mistakes yet.</span>}</div><div className="data-actions"><strong>Progress synchronization</strong><span>{syncState === "signed-out" ? "Sign in with ChatGPT to keep progress synchronized across your devices." : syncState === "saving" ? "Saving your latest progress…" : syncState === "synced" ? "Progress is synchronized automatically across signed-in devices." : syncState === "checking" ? "Checking synchronization…" : "Synchronization is temporarily unavailable. Your progress is still saved in this browser."}</span><div>{syncState === "signed-out" && <a className="text-button" href="/signin-with-chatgpt?return_to=%2F">Sign in with ChatGPT</a>}<button type="button" className="text-button" onClick={exportProgress}>Download backup</button><button type="button" className="text-button" onClick={() => importRef.current?.click()}>Import backup</button><input className="sr-only" ref={importRef} type="file" accept="application/json" onChange={(event) => importProgress(event.target.files?.[0])} /></div></div></div>
        <button type="button" className="history-toggle" onClick={() => setShowHistory((value) => !value)}>{showHistory ? "Hide detailed history" : "Show detailed history"}</button>
        {showHistory && <div className="history-list">{[...history].reverse().map((result, index) => <article key={`${result.date}-${index}`}><div><strong>{result.mode === "review" ? "Review" : "Regular round"} · {result.percent}%</strong><span>{new Date(result.date).toLocaleString()}</span></div><ul>{result.questionIds.map((id, questionIndex) => { const question = questions.find((q) => q.id === id); if (!question) return null; const missed = result.missedIds.includes(id); return <li className={missed ? "missed" : ""} key={id}><span>{question.before} <b>{question.answer}</b> {question.after}</span><small>Your answer: {result.answers[questionIndex] || "No answer"}</small></li>; })}</ul></article>)}</div>}
      </section>
      <footer>{questions.length} original present-tense sentences · English translations · {syncState === "synced" ? "Progress synchronized" : "Progress saved in this browser"}{quiz.sources.length > 0 && <span className="sources"> · Sources: {quiz.sources.map((source, index) => <span key={source.href}>{index > 0 && ", "}<a href={source.href} target="_blank" rel="noreferrer">{source.label}</a></span>)}</span>}</footer>
    </main>
  );
}
