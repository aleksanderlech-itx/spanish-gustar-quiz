"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { TRANSLATIONS } from "./translations";
import { COMPLEX_QUESTION_SEEDS } from "./complex-questions";
import { availableQuestions, filterQuestions, getMissedIds, normalizeAnswer, restartSelectedHistory, ruleForTense, scoreRound, type QuizFilters, type QuizResult } from "./quiz-logic";

type Question = {
  id: number;
  before: string;
  after: string;
  infinitive: string;
  answer: string;
  verbAnswer: string;
  objectPronoun: string;
  explanation: string;
  translations: { en: string; pl: string };
  subjectNumber: "singular" | "plural";
  isActivity: boolean;
  indirectObject: string;
  tense: "present";
  level: "basic" | "intermediate" | "advanced";
};

type Result = QuizResult;
type Filters = QuizFilters;

const forms: Record<string, [string, string]> = {
  gustar: ["gusta", "gustan"],
  encantar: ["encanta", "encantan"],
  interesar: ["interesa", "interesan"],
  molestar: ["molesta", "molestan"],
  importar: ["importa", "importan"],
  faltar: ["falta", "faltan"],
  quedar: ["queda", "quedan"],
  doler: ["duele", "duelen"],
  parecer: ["parece", "parecen"],
};

const banks: Record<string, Array<[string, string, "s" | "p", string]>> = {
  gustar: [
    ["A Marta le", "el café colombiano.", "s", "el café colombiano"], ["Me", "los conciertos de rock.", "p", "los conciertos"], ["¿Te", "viajar en tren?", "s", "the activity viajar"], ["Nos", "esta canción española.", "s", "esta canción"], ["A mis padres les", "las ciudades pequeñas.", "p", "las ciudades"], ["No le", "levantarse temprano.", "s", "the activity levantarse"], ["A Juan le", "la comida picante.", "s", "la comida"], ["¿A ustedes les", "estos ejercicios?", "p", "estos ejercicios"], ["Les", "caminar por la montaña.", "s", "the activity caminar"], ["A mí me", "las películas antiguas.", "p", "las películas"], ["A Laura le", "bailar salsa.", "s", "the activity bailar"], ["No nos", "los hoteles grandes.", "p", "los hoteles"], ["¿Le", "esta chaqueta azul?", "s", "esta chaqueta"], ["A los niños les", "los cuentos cortos.", "p", "los cuentos"], ["Te", "cocinar para tus amigos.", "s", "the activity cocinar"], ["Me", "la música en directo.", "s", "la música"], ["A Pedro y Ana les", "las rutas en bicicleta.", "p", "las rutas"], ["Nos", "aprender idiomas.", "s", "the activity aprender"], ["¿Les", "el nuevo restaurante?", "s", "el restaurante"], ["No te", "estas botas negras.", "p", "estas botas"], ["A usted le", "leer antes de dormir.", "s", "the activity leer"], ["Me", "los domingos tranquilos.", "p", "los domingos"], ["A Carlos le", "la cerveza checa.", "s", "la cerveza"], ["Nos", "las excursiones largas.", "p", "las excursiones"], ["¿Te", "trabajar desde casa?", "s", "the activity trabajar"], ["A ellas les", "este barrio.", "s", "este barrio"], ["No me", "los vuelos nocturnos.", "p", "los vuelos"], ["A Pablo le", "nadar en el mar.", "s", "the activity nadar"], ["¿A ustedes les", "la paella?", "s", "la paella"], ["Les", "estas fotografías.", "p", "estas fotografías"], ["A nosotros nos", "salir los viernes.", "s", "the activity salir"], ["Te", "el clima de España.", "s", "el clima"], ["A Sofía le", "los libros de historia.", "p", "los libros"], ["Me", "conducir por carreteras tranquilas.", "s", "the activity conducir"], ["¿Le", "las clases de español?", "p", "las clases"]
  ],
  encantar: [
    ["Me", "esta banda.", "s", "esta banda"], ["A Elena le", "los mercados locales.", "p", "los mercados"], ["Nos", "viajar sin prisa.", "s", "the activity viajar"], ["¿Te", "estas tapas?", "p", "estas tapas"], ["A los niños les", "el chocolate.", "s", "el chocolate"], ["Le", "bailar flamenco.", "s", "the activity bailar"], ["A ustedes les", "las playas del norte.", "p", "las playas"], ["A mí me", "la guitarra eléctrica.", "s", "la guitarra"], ["Les", "hacer senderismo.", "s", "the activity hacer"], ["¿Nos", "los pueblos blancos?", "p", "los pueblos"], ["A Julia le", "esta novela.", "s", "esta novela"], ["Te", "los desayunos largos.", "p", "los desayunos"], ["A mis amigos les", "cocinar juntos.", "s", "the activity cocinar"], ["Me", "las montañas.", "p", "las montañas"], ["A usted le", "el arte moderno.", "s", "el arte"], ["Nos", "escuchar música en vivo.", "s", "the activity escuchar"], ["¿Les", "estas vistas?", "p", "estas vistas"], ["A Roberto le", "la arquitectura antigua.", "s", "la arquitectura"], ["A ustedes les", "los viajes en bicicleta.", "p", "los viajes"], ["Te", "aprender palabras nuevas.", "s", "the activity aprender"]
  ],
  interesar: [
    ["Me", "la historia de España.", "s", "la historia"], ["A Daniel le", "los idiomas.", "p", "los idiomas"], ["Nos", "aprender sobre otras culturas.", "s", "the activity aprender"], ["¿Te", "estas noticias?", "p", "estas noticias"], ["A ellos les", "el ciclismo.", "s", "el ciclismo"], ["No le", "hablar de política.", "s", "the activity hablar"], ["A ustedes les", "los museos pequeños.", "p", "los museos"], ["A mí me", "la tecnología.", "s", "la tecnología"], ["Les", "conocer gente nueva.", "s", "the activity conocer"], ["¿Nos", "estos cursos?", "p", "estos cursos"], ["A Paula le", "la fotografía.", "s", "la fotografía"], ["Te", "los documentales.", "p", "los documentales"], ["A mis compañeros les", "mejorar su español.", "s", "the activity mejorar"], ["Me", "las rutas históricas.", "p", "las rutas"], ["A usted le", "el proyecto nuevo.", "s", "el proyecto"], ["Nos", "entender la gramática.", "s", "the activity entender"], ["¿Les", "estas propuestas?", "p", "estas propuestas"], ["A Tomás le", "la economía.", "s", "la economía"], ["A ustedes les", "los deportes de montaña.", "p", "los deportes"], ["Te", "leer en español.", "s", "the activity leer"]
  ],
  molestar: [
    ["Me", "el ruido de la calle.", "s", "el ruido"], ["A Sara le", "las luces fuertes.", "p", "las luces"], ["Nos", "esperar mucho tiempo.", "s", "the activity esperar"], ["¿Te", "estos comentarios?", "p", "estos comentarios"], ["A ellos les", "el humo.", "s", "el humo"], ["No le", "trabajar los sábados.", "s", "the activity trabajar"], ["A ustedes les", "los precios altos.", "p", "los precios"], ["A mí me", "la música demasiado alta.", "s", "la música"], ["Les", "levantarse tan temprano.", "s", "the activity levantarse"], ["¿Nos", "estas interrupciones?", "p", "estas interrupciones"], ["A David le", "el frío.", "s", "el frío"], ["Te", "los vuelos con escalas.", "p", "los vuelos"], ["A mis vecinos les", "oír al perro por la noche.", "s", "the activity oír"], ["Me", "las habitaciones oscuras.", "p", "las habitaciones"], ["A usted le", "este olor.", "s", "este olor"]
  ],
  importar: [
    ["Me", "la calidad del servicio.", "s", "la calidad"], ["A Luis le", "los pequeños detalles.", "p", "los detalles"], ["Nos", "llegar a tiempo.", "s", "the activity llegar"], ["¿Te", "estas diferencias?", "p", "estas diferencias"], ["A ellos les", "el resultado final.", "s", "el resultado"], ["No le", "trabajar solo.", "s", "the activity trabajar"], ["A ustedes les", "los horarios flexibles.", "p", "los horarios"], ["A mí me", "la opinión de mi familia.", "s", "la opinión"], ["Les", "mantenerse activos.", "s", "the activity mantenerse"], ["¿Nos", "estos cambios?", "p", "estos cambios"], ["A Eva le", "el medio ambiente.", "s", "el medio ambiente"], ["Te", "las condiciones del viaje.", "p", "las condiciones"], ["A mis colegas les", "terminar bien el proyecto.", "s", "the activity terminar"], ["Me", "las respuestas claras.", "p", "las respuestas"], ["A usted le", "esta decisión.", "s", "esta decisión"]
  ],
  faltar: [
    ["Me", "un billete para Madrid.", "s", "un billete"], ["A Clara le", "dos documentos.", "p", "dos documentos"], ["Nos", "terminar el último ejercicio.", "s", "the activity terminar"], ["¿Te", "estas páginas?", "p", "estas páginas"], ["A ellos les", "un poco de tiempo.", "s", "un poco de tiempo"], ["Le", "practicar más.", "s", "the activity practicar"], ["A ustedes les", "las entradas para el concierto.", "p", "las entradas"], ["A mí me", "una buena mochila.", "s", "una mochila"], ["Les", "visitar dos ciudades.", "s", "the activity visitar"], ["¿Nos", "algunas sillas?", "p", "algunas sillas"]
  ],
  quedar: [
    ["Me", "una semana de vacaciones.", "s", "una semana"], ["A Raúl le", "tres preguntas.", "p", "tres preguntas"], ["Nos", "reservar el hotel.", "s", "the activity reservar"], ["¿Te", "bien estos pantalones?", "p", "estos pantalones"], ["A ellos les", "poco dinero.", "s", "poco dinero"], ["Le", "preparar la cena.", "s", "the activity preparar"], ["A ustedes les", "dos días libres.", "p", "dos días"], ["A mí me", "bien esta camisa.", "s", "esta camisa"], ["Les", "recorrer diez kilómetros.", "s", "the activity recorrer"], ["¿Nos", "suficientes botellas de agua?", "p", "suficientes botellas"]
  ],
  doler: [
    ["Me", "la espalda.", "s", "la espalda"], ["A Carmen le", "las rodillas.", "p", "las rodillas"], ["Nos", "caminar con estas botas.", "s", "the activity caminar"], ["¿Te", "los hombros?", "p", "los hombros"], ["A ellos les", "la cabeza.", "s", "la cabeza"], ["Le", "subir escaleras.", "s", "the activity subir"], ["A ustedes les", "los pies.", "p", "los pies"], ["A mí me", "el brazo derecho.", "s", "el brazo"], ["Les", "hacer este movimiento.", "s", "the activity hacer"], ["¿Nos", "las piernas después de correr?", "p", "las piernas"], ["A Andrés le", "la garganta.", "s", "la garganta"], ["Te", "los dedos.", "p", "los dedos"], ["A mis amigos les", "dormir en el suelo.", "s", "the activity dormir"], ["Me", "las muñecas.", "p", "las muñecas"], ["A usted le", "el cuello.", "s", "el cuello"]
  ],
  parecer: [
    ["Me", "interesante esta idea.", "s", "esta idea"], ["A Laura le", "caros estos hoteles.", "p", "estos hoteles"], ["Nos", "útil practicar cada día.", "s", "the activity practicar"], ["¿Te", "claras estas instrucciones?", "p", "estas instrucciones"], ["A ellos les", "buena la propuesta.", "s", "la propuesta"], ["Le", "difícil conducir de noche.", "s", "the activity conducir"], ["A ustedes les", "largos los ejercicios.", "p", "los ejercicios"], ["A mí me", "perfecta esta solución.", "s", "esta solución"], ["Les", "mejor salir temprano.", "s", "the activity salir"], ["¿Nos", "correctas estas respuestas?", "p", "estas respuestas"]
  ]
};

const QUESTIONS: Question[] = Object.entries(banks).flatMap(([infinitive, rows]) =>
  rows.map(([before, after, number, subject], index) => {
    const pronounMatch = before.match(/\b(me|te|le|nos|les)\b/i);
    const objectPronoun = pronounMatch?.[1]?.toLocaleLowerCase("es") ?? "";
    const promptBefore = pronounMatch
      ? `${before.slice(0, pronounMatch.index)}${before.slice((pronounMatch.index ?? 0) + pronounMatch[0].length)}`.trimEnd()
      : before;
    const verbAnswer = forms[infinitive][number === "s" ? 0 : 1];
    return {
    id: Object.entries(banks).slice(0, Object.keys(banks).indexOf(infinitive)).reduce((n, [, r]) => n + r.length, 0) + index + 1,
    before: promptBefore,
    after,
    infinitive,
    answer: `${objectPronoun} ${verbAnswer}`,
    verbAnswer,
    objectPronoun,
    explanation: `Use “${objectPronoun}” as the indirect object pronoun. ${subject.charAt(0).toUpperCase() + subject.slice(1)} ${number === "s" ? "is singular (or an infinitive activity)" : "is plural"}, so the verb is “${verbAnswer}”.`,
    translations: {
      en: TRANSLATIONS[Object.entries(banks).slice(0, Object.keys(banks).indexOf(infinitive)).reduce((n, [, r]) => n + r.length, 0) + index],
      pl: "",
    },
    subjectNumber: number === "s" ? "singular" : "plural",
    isActivity: subject.startsWith("the activity"),
    indirectObject: objectPronoun,
    tense: "present",
    level: (index < Math.ceil(rows.length / 3) ? "basic" : index < Math.ceil((rows.length * 2) / 3) ? "intermediate" : "advanced") as Question["level"],
    };
  })
);

const COMPLEX_QUESTIONS: Question[] = COMPLEX_QUESTION_SEEDS.map(([before, after, infinitive, verbAnswer, subjectNumber, indirectObject, en, pl], index) => {
  const pronounMatch = before.match(/\b(me|te|le|nos|les)\b/i);
  const objectPronoun = pronounMatch?.[1]?.toLocaleLowerCase("es") ?? indirectObject;
  const promptBefore = pronounMatch
    ? `${before.slice(0, pronounMatch.index)}${before.slice((pronounMatch.index ?? 0) + pronounMatch[0].length)}`.trimEnd()
    : before;
  return {
    id: 1001 + index,
    before: promptBefore, after, infinitive, answer: `${objectPronoun} ${verbAnswer}`, verbAnswer, objectPronoun,
    explanation: `Use “${objectPronoun}” as the indirect object pronoun. ${subjectNumber === "singular" ? "The grammatical subject is a single thing, clause, or activity" : "The grammatical subject contains several things"}, so the verb is “${verbAnswer}”.`,
    translations: { en, pl }, subjectNumber, indirectObject: objectPronoun,
    isActivity: subjectNumber === "singular" && /\b(que|ar|er|ir)\b/i.test(after),
    tense: "present", level: "advanced",
  };
});

const ALL_QUESTIONS = [...QUESTIONS, ...COMPLEX_QUESTIONS];
const CURRENT_QUESTION_IDS = new Set(ALL_QUESTIONS.map((question) => question.id));

const presentOnlyHistory = (items: Result[]) => items.flatMap((result) => {
  const kept = result.questionIds.map((id, index) => ({ id, index })).filter(({ id }) => CURRENT_QUESTION_IDS.has(id));
  if (!kept.length) return [];
  const questionIds = kept.map(({ id }) => id);
  const answers = kept.map(({ index }) => result.answers[index] ?? "");
  const missedIds = result.missedIds.filter((id) => CURRENT_QUESTION_IDS.has(id));
  const score = questionIds.length - missedIds.length;
  return [{ ...result, questionIds, answers, missedIds, score, percent: Math.round((score / questionIds.length) * 100), tense: "present" as const }];
});

const STORAGE_KEY = "gustar-quiz-progress-v1";
const FILTER_KEY = "gustar-quiz-filters-v1";

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);
const normalize = normalizeAnswer;

const mergeHistory = (local: Result[], remote: Result[]) => {
  const unique = new Map<string, Result>();
  [...remote, ...local].forEach((item) => unique.set(`${item.date}|${item.mode ?? "regular"}|${item.questionIds.join(",")}`, item));
  return [...unique.values()].sort((a, b) => a.date.localeCompare(b.date));
};

export default function Home() {
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
  const importRef = useRef<HTMLInputElement | null>(null);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const regularHistory = useMemo(() => history.filter((item) => item.mode !== "review"), [history]);
  const reviewHistory = useMemo(() => history.filter((item) => item.mode === "review"), [history]);
  const filteredQuestions = useMemo(() => filterQuestions(ALL_QUESTIONS, filters), [filters]);
  const usedIds = useMemo(() => new Set(regularHistory.flatMap((item) => item.questionIds)), [regularHistory]);
  const missedIds = useMemo(() => getMissedIds(history), [history]);
  const filteredMissedIds = useMemo(() => {
    const selected = new Set(filteredQuestions.map((question) => question.id));
    return missedIds.filter((id) => selected.has(id));
  }, [filteredQuestions, missedIds]);
  const rule = useMemo(() => ruleForTense(), []);

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
    setActiveQuestion(0);
    setShownExplanations(new Set());
    setChecked(false);
    setTimeout(() => inputs.current[0]?.focus(), 0);
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const initial = saved ? (JSON.parse(saved) as Result[]) : [];
    const savedFilters = localStorage.getItem(FILTER_KEY);
    const storedFilters = savedFilters ? JSON.parse(savedFilters) as Partial<Filters> : {};
    const initialFilters: Filters = { level: storedFilters.level ?? "all", verb: storedFilters.verb ?? "all" };
    const initialise = async () => {
      let merged = presentOnlyHistory(initial);
      try {
        const response = await fetch("/api/progress", { cache: "no-store" });
        if (response.status === 401) setSyncState("signed-out");
        else if (response.ok) {
          const data = await response.json() as { progress?: { history?: Result[] } | null };
          merged = presentOnlyHistory(mergeHistory(initial, data.progress?.history ?? []));
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          setSyncState("synced");
          if (merged.length !== (data.progress?.history?.length ?? 0)) {
            await fetch("/api/progress", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ history: merged, filters: initialFilters }) });
          }
        } else setSyncState("error");
      } catch { setSyncState("error"); }
      const initialQuestions = filterQuestions(ALL_QUESTIONS, initialFilters);
      const used = new Set(merged.filter((item) => item.mode !== "review").flatMap((item) => item.questionIds));
      const pool = initialQuestions.filter((q) => !used.has(q.id));
      setHistory(merged); setFilters(initialFilters);
      setRound(shuffle(pool.length ? pool : initialQuestions).slice(0, 5)); setActiveQuestion(0); setHydrated(true);
    };
    void initialise();
  }, []);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const keepActionsAboveKeyboard = () => {
      const keyboardInset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      document.documentElement.style.setProperty("--keyboard-inset", `${keyboardInset}px`);
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

  const persistProgress = async (nextHistory: Result[], nextFilters = filters) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHistory));
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
      const question = ALL_QUESTIONS.find((q) => q.id === id); if (!question) return;
      const missed = result.missedIds.includes(id);
      record(`Verb: ${question.infinitive}`, missed);
      record(`Tense: ${question.tense}`, missed);
      record(`Agreement: ${question.subjectNumber}`, missed);
      record(question.isActivity ? "Subject: infinitive activity" : "Subject: noun", missed);
      record(`Pronoun: ${question.indirectObject}`, missed);
    }));
    return [...totals].filter(([, value]) => value.misses).sort((a, b) => (b[1].misses / b[1].attempts) - (a[1].misses / a[1].attempts)).slice(0, 6);
  }, [regularHistory]);

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
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
    void persistProgress([]);
    setPracticeMissed(false);
    startRound(false, []);
  };

  const applyFilters = (next: Filters) => {
    setFilters(next);
    localStorage.setItem(FILTER_KEY, JSON.stringify(next));
    if (syncState === "synced") void persistProgress(history, next);
    setPracticeMissed(false);
    const nextQuestions = filterQuestions(ALL_QUESTIONS, next);
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
    const link = document.createElement("a"); link.href = url; link.download = "spanish-gustar-quiz-progress.json"; link.click(); URL.revokeObjectURL(url);
  };

  const importProgress = async (file?: File) => {
    if (!file) return;
    try {
      const data = JSON.parse(await file.text()) as { history?: Result[]; filters?: Filters };
      if (!Array.isArray(data.history)) throw new Error();
      const importedHistory = presentOnlyHistory(data.history);
      setHistory(importedHistory); void persistProgress(importedHistory, data.filters ?? filters);
      if (data.filters) { setFilters(data.filters); localStorage.setItem(FILTER_KEY, JSON.stringify(data.filters)); }
      startRound(false, importedHistory, data.filters ? filterQuestions(ALL_QUESTIONS, data.filters) : ALL_QUESTIONS);
    } catch { window.alert("This is not a valid Spanish Gustar Quiz progress file."); }
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
          <p className="eyebrow">Spanish grammar practice</p>
          <button type="button" className="listen-button" onClick={speakCurrentQuestion} aria-label="Listen to the current Spanish sentence">{isSpeaking ? "Playing…" : "Listen"}</button>
        </div>
        <h1>Spanish verbs that work like <em>gustar</em></h1>
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
        <div className="questions">
          {round.map((question, index) => {
            const isCorrect = checked && normalize(answers[index]) === question.answer;
            const isWrong = checked && !isCorrect;
            return <article hidden={index !== activeQuestion} aria-hidden={index !== activeQuestion} className={`question-card ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`} key={question.id}>
              <span className="number">{index + 1}</span>
              <div className="sentence-wrap">
                <label htmlFor={`answer-${index}`}><span className="sr-only">Question {index + 1}, enter the missing object pronoun and verb</span><span>{question.before} </span></label>
                <input
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
                  placeholder="pronoun + verb"
                />
                <span>{question.after}</span>
                {isWrong && <p className="feedback"><strong>Correct: {question.answer}.</strong></p>}
                {isCorrect && <p className="feedback">Correct.</p>}
                <div className="verb-row">
                  <span className="verb-chip">{question.infinitive}</span>
                </div>
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
        <div className="stat-grid"><div><strong>{regularHistory.length}</strong><span>Regular rounds</span></div><div><strong>{average}%</strong><span>Regular average</span></div><div><strong>{best}%</strong><span>Regular best</span></div><div><strong>{completedUnique}/{ALL_QUESTIONS.length}</strong><span>Sentences seen</span></div></div>
        <div className="review-summary"><span><strong>{reviewHistory.length}</strong> review rounds</span><span><strong>{missedIds.length}</strong> answers still to master</span></div>
        <div className={`practice-row ${practiceMissed ? "active-practice" : ""}`}><div><strong>Incorrect-answer practice</strong><span>{filteredMissedIds.length ? `${filteredMissedIds.length} missed sentence${filteredMissedIds.length === 1 ? "" : "s"} match the selected filters` : missedIds.length ? `No missed answers match these filters (${missedIds.length} saved overall)` : "No missed sentences waiting"}</span></div><button type="button" className="secondary" disabled={!filteredMissedIds.length || practiceMissed} onClick={() => { setPracticeMissed(true); startRound(true); }}>{practiceMissed ? "Practising missed answers" : "Practise filtered missed answers"}</button></div>
        <div className="insights"><div><strong>Weak areas</strong>{weakAreas.length ? weakAreas.map(([area, value]) => <span key={area}>{area}: {Math.round((value.misses / value.attempts) * 100)}% missed ({value.misses}/{value.attempts})</span>) : <span>No recurring mistakes yet.</span>}</div><div className="data-actions"><strong>Progress synchronization</strong><span>{syncState === "signed-out" ? "Sign in with ChatGPT to keep progress synchronized across your devices." : syncState === "saving" ? "Saving your latest progress…" : syncState === "synced" ? "Progress is synchronized automatically across signed-in devices." : syncState === "checking" ? "Checking synchronization…" : "Synchronization is temporarily unavailable. Your progress is still saved in this browser."}</span><div>{syncState === "signed-out" && <a className="text-button" href="/signin-with-chatgpt?return_to=%2F">Sign in with ChatGPT</a>}<button type="button" className="text-button" onClick={exportProgress}>Download backup</button><button type="button" className="text-button" onClick={() => importRef.current?.click()}>Import backup</button><input className="sr-only" ref={importRef} type="file" accept="application/json" onChange={(event) => importProgress(event.target.files?.[0])} /></div></div></div>
        <button type="button" className="history-toggle" onClick={() => setShowHistory((value) => !value)}>{showHistory ? "Hide detailed history" : "Show detailed history"}</button>
        {showHistory && <div className="history-list">{[...history].reverse().map((result, index) => <article key={`${result.date}-${index}`}><div><strong>{result.mode === "review" ? "Review" : "Regular round"} · {result.percent}%</strong><span>{new Date(result.date).toLocaleString()}</span></div><ul>{result.questionIds.map((id, questionIndex) => { const question = ALL_QUESTIONS.find((q) => q.id === id); if (!question) return null; const missed = result.missedIds.includes(id); return <li className={missed ? "missed" : ""} key={id}><span>{question.before} <b>{question.answer}</b> {question.after}</span><small>Your answer: {result.answers[questionIndex] || "No answer"}</small></li>; })}</ul></article>)}</div>}
      </section>
      <footer>{ALL_QUESTIONS.length} present-tense sentences · English translations · {syncState === "synced" ? "Progress synchronized" : "Progress saved in this browser"}</footer>
    </main>
  );
}
