"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { TRANSLATIONS } from "./translations";

type Question = {
  id: number;
  before: string;
  after: string;
  infinitive: string;
  answer: string;
  explanation: string;
  translation: string;
  tense: "present" | "past" | "future";
  level: "basic" | "intermediate" | "advanced";
};

type Result = {
  date: string;
  score: number;
  percent: number;
  questionIds: number[];
  answers: string[];
  missedIds: number[];
  mode?: "regular" | "review";
  tense?: Question["tense"];
};

type Filters = { tense: "all" | Question["tense"]; level: "all" | Question["level"]; verb: "all" | string };

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
  rows.map(([before, after, number, subject], index) => ({
    id: Object.entries(banks).slice(0, Object.keys(banks).indexOf(infinitive)).reduce((n, [, r]) => n + r.length, 0) + index + 1,
    before,
    after,
    infinitive,
    answer: forms[infinitive][number === "s" ? 0 : 1],
    explanation: `${subject.charAt(0).toUpperCase() + subject.slice(1)} ${number === "s" ? "is singular (or an infinitive activity)" : "is plural"}, so use “${forms[infinitive][number === "s" ? 0 : 1]}”.`,
    translation: TRANSLATIONS[Object.entries(banks).slice(0, Object.keys(banks).indexOf(infinitive)).reduce((n, [, r]) => n + r.length, 0) + index],
    tense: "present",
    level: (index < Math.ceil(rows.length / 3) ? "basic" : index < Math.ceil((rows.length * 2) / 3) ? "intermediate" : "advanced") as Question["level"],
  }))
);

const tenseForms: Record<"past" | "future", Record<string, [string, string]>> = {
  past: {
    gustar: ["gustó", "gustaron"], encantar: ["encantó", "encantaron"], interesar: ["interesó", "interesaron"],
    molestar: ["molestó", "molestaron"], importar: ["importó", "importaron"], faltar: ["faltó", "faltaron"],
    quedar: ["quedó", "quedaron"], doler: ["dolió", "dolieron"], parecer: ["pareció", "parecieron"],
  },
  future: {
    gustar: ["gustará", "gustarán"], encantar: ["encantará", "encantarán"], interesar: ["interesará", "interesarán"],
    molestar: ["molestará", "molestarán"], importar: ["importará", "importarán"], faltar: ["faltará", "faltarán"],
    quedar: ["quedará", "quedarán"], doler: ["dolerá", "dolerán"], parecer: ["parecerá", "parecerán"],
  },
};

const tenseTranslations = {
  past: [
    "Yesterday, Marta liked Colombian coffee.", "Yesterday, I liked rock concerts.", "Yesterday, I loved this band.", "Yesterday, Elena loved local markets.",
    "Yesterday, I was interested in Spanish history.", "Yesterday, Daniel was interested in languages.", "Yesterday, the street noise bothered me.", "Yesterday, bright lights bothered Sara.",
    "Yesterday, the quality of the service mattered to me.", "Yesterday, small details mattered to Luis.", "Yesterday, I was missing a ticket to Madrid.", "Yesterday, Clara was missing two documents.",
    "Yesterday, I had one week of holiday left.", "Yesterday, Raúl had three questions left.", "Yesterday, my back hurt.", "Yesterday, Carmen's knees hurt.",
    "Yesterday, this idea seemed interesting to me.", "Yesterday, these hotels seemed expensive to Laura.",
  ],
  future: [
    "Tomorrow, Marta will like Colombian coffee.", "Tomorrow, I will like rock concerts.", "Tomorrow, I will love this band.", "Tomorrow, Elena will love local markets.",
    "Tomorrow, I will be interested in Spanish history.", "Tomorrow, Daniel will be interested in languages.", "Tomorrow, the street noise will bother me.", "Tomorrow, bright lights will bother Sara.",
    "Tomorrow, the quality of the service will matter to me.", "Tomorrow, small details will matter to Luis.", "Tomorrow, I will be missing a ticket to Madrid.", "Tomorrow, Clara will be missing two documents.",
    "Tomorrow, I will have one week of holiday left.", "Tomorrow, Raúl will have three questions left.", "Tomorrow, my back will hurt.", "Tomorrow, Carmen's knees will hurt.",
    "Tomorrow, this idea will seem interesting to me.", "Tomorrow, these hotels will seem expensive to Laura.",
  ],
};

const TENSE_QUESTIONS: Question[] = (["past", "future"] as const).flatMap((tense, tenseIndex) =>
  Object.keys(forms).flatMap((infinitive, verbIndex) => ([0, 1] as const).map((numberIndex) => {
    const source = QUESTIONS.filter((q) => q.infinitive === infinitive)[numberIndex];
    const answer = tenseForms[tense][infinitive][numberIndex];
    const marker = tense === "past" ? "Ayer" : "Mañana";
    return {
      ...source,
      id: 151 + tenseIndex * 18 + verbIndex * 2 + numberIndex,
      before: `${marker}, ${source.before.charAt(0).toLocaleLowerCase("es")}${source.before.slice(1)}`,
      answer,
      tense,
      level: "advanced",
      explanation: `${source.explanation.split(", so use")[0]}, so the ${tense === "past" ? "simple past" : "simple future"} form is “${answer}”.`,
      translation: tenseTranslations[tense][verbIndex * 2 + numberIndex],
    };
  }))
);

const ALL_QUESTIONS = [...QUESTIONS, ...TENSE_QUESTIONS];

const STORAGE_KEY = "gustar-quiz-progress-v1";
const FILTER_KEY = "gustar-quiz-filters-v1";

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);
const normalize = (value: string) => value.trim().toLocaleLowerCase("es");
const getMissedIds = (items: Result[]) => {
  const latest = new Map<number, boolean>();
  items.forEach((item) => item.questionIds.forEach((id) => latest.set(id, item.missedIds.includes(id))));
  return [...latest].filter(([, missed]) => missed).map(([id]) => id);
};

export default function Home() {
  const [history, setHistory] = useState<Result[]>([]);
  const [round, setRound] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[]>(Array(5).fill(""));
  const [checked, setChecked] = useState(false);
  const [practiceMissed, setPracticeMissed] = useState(false);
  const [shownTranslations, setShownTranslations] = useState<Set<number>>(new Set());
  const [hydrated, setHydrated] = useState(false);
  const [filters, setFilters] = useState<Filters>({ tense: "present", level: "all", verb: "all" });
  const [cycleComplete, setCycleComplete] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const importRef = useRef<HTMLInputElement | null>(null);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const regularHistory = useMemo(() => history.filter((item) => item.mode !== "review"), [history]);
  const reviewHistory = useMemo(() => history.filter((item) => item.mode === "review"), [history]);
  const filteredQuestions = useMemo(() => ALL_QUESTIONS.filter((q) =>
    (filters.tense === "all" || q.tense === filters.tense) &&
    (filters.level === "all" || q.level === filters.level) &&
    (filters.verb === "all" || q.infinitive === filters.verb)
  ), [filters]);
  const usedIds = useMemo(() => new Set(regularHistory.flatMap((item) => item.questionIds)), [regularHistory]);
  const missedIds = useMemo(() => getMissedIds(history), [history]);

  const startRound = (missedOnly = practiceMissed, sourceHistory = history, sourceQuestions = filteredQuestions) => {
    const sourceUsed = new Set(sourceHistory.filter((item) => item.mode !== "review").flatMap((item) => item.questionIds));
    const sourceMissed = getMissedIds(sourceHistory);
    if (missedOnly && sourceMissed.length === 0) {
      missedOnly = false;
      setPracticeMissed(false);
    }
    const pool = missedOnly ? ALL_QUESTIONS.filter((q) => sourceMissed.includes(q.id)) : sourceQuestions.filter((q) => !sourceUsed.has(q.id));
    if (!missedOnly && pool.length === 0) { setCycleComplete(true); return; }
    setCycleComplete(false);
    const selected = shuffle(pool).slice(0, 5);
    setRound(selected);
    setAnswers(Array(selected.length).fill(""));
    setShownTranslations(new Set());
    setChecked(false);
    setTimeout(() => inputs.current[0]?.focus(), 0);
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const initial = saved ? (JSON.parse(saved) as Result[]) : [];
    const savedFilters = localStorage.getItem(FILTER_KEY);
    const initialFilters = savedFilters ? JSON.parse(savedFilters) as Filters : { tense: "present", level: "all", verb: "all" };
    const initialQuestions = ALL_QUESTIONS.filter((q) => (initialFilters.tense === "all" || q.tense === initialFilters.tense) && (initialFilters.level === "all" || q.level === initialFilters.level) && (initialFilters.verb === "all" || q.infinitive === initialFilters.verb));
    const used = new Set(initial.filter((item) => item.mode !== "review").flatMap((item) => item.questionIds));
    const pool = initialQuestions.filter((q) => !used.has(q.id));
    queueMicrotask(() => {
      setHistory(initial);
      setFilters(initialFilters);
      setRound(shuffle(pool.length ? pool : initialQuestions).slice(0, 5));
      setHydrated(true);
    });
  }, []);

  const correct = checked ? round.filter((q, i) => normalize(answers[i]) === q.answer).length : 0;
  const average = regularHistory.length ? Math.round(regularHistory.reduce((sum, r) => sum + r.percent, 0) / regularHistory.length) : 0;
  const best = regularHistory.length ? Math.max(...regularHistory.map((r) => r.percent)) : 0;
  const completedUnique = usedIds.size;
  const filteredSeen = filteredQuestions.filter((q) => usedIds.has(q.id)).length;
  const weakVerbs = useMemo(() => {
    const totals = new Map<string, { attempts: number; misses: number }>();
    regularHistory.forEach((result) => result.questionIds.forEach((id) => {
      const question = ALL_QUESTIONS.find((q) => q.id === id); if (!question) return;
      const value = totals.get(question.infinitive) ?? { attempts: 0, misses: 0 };
      value.attempts += 1; if (result.missedIds.includes(id)) value.misses += 1; totals.set(question.infinitive, value);
    }));
    return [...totals].filter(([, value]) => value.misses).sort((a, b) => (b[1].misses / b[1].attempts) - (a[1].misses / a[1].attempts)).slice(0, 3);
  }, [regularHistory]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (checked || answers.some((answer) => !answer.trim())) return;
    const missed = round.filter((q, i) => normalize(answers[i]) !== q.answer).map((q) => q.id);
    const score = round.length - missed.length;
    const result: Result = { date: new Date().toISOString(), score, percent: Math.round((score / round.length) * 100), questionIds: round.map((q) => q.id), answers, missedIds: missed, mode: practiceMissed ? "review" : "regular", tense: round[0]?.tense };
    const next = [...history, result];
    setHistory(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setChecked(true);
  };

  const reset = () => {
    if (!window.confirm("Delete all quiz history and missed answers? This cannot be undone.")) return;
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
    setPracticeMissed(false);
    startRound(false, []);
  };

  const applyFilters = (next: Filters) => {
    setFilters(next);
    localStorage.setItem(FILTER_KEY, JSON.stringify(next));
    setPracticeMissed(false);
    const nextQuestions = ALL_QUESTIONS.filter((q) => (next.tense === "all" || q.tense === next.tense) && (next.level === "all" || q.level === next.level) && (next.verb === "all" || q.infinitive === next.verb));
    startRound(false, history, nextQuestions);
  };

  const restartCycle = () => {
    const retained = history.filter((item) => item.mode === "review");
    setHistory(retained);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(retained));
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
      setHistory(data.history); localStorage.setItem(STORAGE_KEY, JSON.stringify(data.history));
      if (data.filters) { setFilters(data.filters); localStorage.setItem(FILTER_KEY, JSON.stringify(data.filters)); }
      startRound(false, data.history, ALL_QUESTIONS.filter((q) => !data.filters || (data.filters.tense === "all" || q.tense === data.filters.tense) && (data.filters.level === "all" || q.level === data.filters.level) && (data.filters.verb === "all" || q.infinitive === data.filters.verb)));
    } catch { window.alert("This is not a valid Spanish Gustar Quiz progress file."); }
  };

  if (!hydrated || round.length === 0) return <main className="loading">Preparing your quiz…</main>;

  const roundPercent = checked ? Math.round((correct / round.length) * 100) : 0;

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">Spanish grammar practice</p>
        <h1>Spanish verbs that work like <em>gustar</em></h1>
        <div className="round-meta">{practiceMissed ? "Missed-answer practice" : `Round ${regularHistory.length + (checked ? 0 : 1)}`} <span>·</span> {round.length} question{round.length === 1 ? "" : "s"}</div>
        <div className="progress" aria-label={`${filteredSeen} of ${filteredQuestions.length} selected sentences completed`}><span style={{ width: `${Math.max(3, (filteredSeen / Math.max(1, filteredQuestions.length)) * 100)}%` }} /></div>
      </header>

      <section className="filters" aria-label="Practice options">
        <label>Tense<select value={filters.tense} onChange={(event) => applyFilters({ ...filters, tense: event.target.value as Filters["tense"] })}><option value="present">Present</option><option value="past">Simple past</option><option value="future">Simple future</option><option value="all">All tenses</option></select></label>
        <label>Difficulty<select value={filters.level} onChange={(event) => applyFilters({ ...filters, level: event.target.value as Filters["level"] })}><option value="all">All levels</option><option value="basic">Basic</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label>
        <label>Verb<select value={filters.verb} onChange={(event) => applyFilters({ ...filters, verb: event.target.value })}><option value="all">All verbs</option>{Object.keys(forms).map((verb) => <option value={verb} key={verb}>{verb}</option>)}</select></label>
        <span>{filteredQuestions.length} sentences selected</span>
      </section>

      <section className="rule-card">
        <span className="rule-mark" />
        <div><strong>The verb agrees with the thing, not the person.</strong><p>One thing or an activity uses the singular. Several things use the plural.</p></div>
        <div className="examples"><span>Me <b>gusta</b> viajar.</span><span>Me <b>gustan</b> los viajes.</span></div>
      </section>

      {cycleComplete && <section className="completion-card" aria-live="polite"><p className="eyebrow">Set completed</p><h2>You completed all {filteredQuestions.length} selected sentences.</h2><p>Your results are saved. Restart this set or review the answers you missed.</p><div><button type="button" className="primary" onClick={restartCycle}>Restart selected set</button><button type="button" className="secondary" disabled={!missedIds.length} onClick={() => { setPracticeMissed(true); setCycleComplete(false); startRound(true); }}>Practise missed answers</button></div></section>}

      {!cycleComplete && checked && <section className="result-card" aria-live="polite">
        <div className="score-ring"><strong>{roundPercent}%</strong><span>{correct}/{round.length} correct</span></div>
        <div><p className="result-label">{practiceMissed ? "Review complete" : "Round complete"}</p><h2>{roundPercent === 100 ? "Excellent work." : roundPercent >= 80 ? "Very good." : roundPercent >= 60 ? "Good start." : "Keep practising."}</h2><p>{practiceMissed ? "Correct answers leave your missed list. Any remaining mistakes stay ready for another review." : "Review any corrections below, then continue with new sentences."}</p></div>
      </section>}

      {!cycleComplete && <form onSubmit={submit}>
        <div className="questions">
          {round.map((question, index) => {
            const isCorrect = checked && normalize(answers[index]) === question.answer;
            const isWrong = checked && !isCorrect;
            return <article className={`question-card ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`} key={question.id}>
              <span className="number">{index + 1}</span>
              <div className="sentence-wrap">
                <label htmlFor={`answer-${index}`}><span className="sr-only">Question {index + 1}, form of {question.infinitive}</span><span>{question.before} </span></label>
                <input
                  id={`answer-${index}`}
                  ref={(node) => { inputs.current[index] = node; }}
                  value={answers[index]}
                  disabled={checked}
                  autoComplete="off"
                  spellCheck={false}
                  onChange={(event) => setAnswers((current) => current.map((value, i) => i === index ? event.target.value : value))}
                  onKeyDown={(event) => { if (event.key === "Enter" && index < round.length - 1) { event.preventDefault(); inputs.current[index + 1]?.focus(); } }}
                  aria-invalid={isWrong || undefined}
                />
                <span>{question.after}</span>
                {isWrong && <p className="feedback"><strong>Correct: {question.answer}.</strong> {question.explanation}</p>}
                {isCorrect && <p className="feedback">Correct.</p>}
                <div className="translation-control">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={shownTranslations.has(question.id)}
                    className="translation-switch"
                    onClick={() => setShownTranslations((current) => {
                      const next = new Set(current);
                      if (next.has(question.id)) next.delete(question.id); else next.add(question.id);
                      return next;
                    })}
                  >
                    <span className="switch-track"><span /></span>
                    {shownTranslations.has(question.id) ? "Hide translation" : "Show translation"}
                  </button>
                  {shownTranslations.has(question.id) && <p className="translation-text" lang="en">{question.translation}</p>}
                </div>
              </div>
              <span className="verb-chip">{question.infinitive}</span>
            </article>;
          })}
        </div>

        <div className="action-bar">
          <div className="action-copy">{checked ? "Your result has been saved on this device." : answers.filter(Boolean).length === round.length ? "Ready to check." : `${answers.filter((a) => a.trim()).length} of ${round.length} answered`}</div>
          {!checked ? <button className="primary" disabled={answers.some((answer) => !answer.trim())}>Check answers</button> : <button type="button" className="primary" onClick={() => startRound()}>{practiceMissed && missedIds.length ? "Continue missed practice" : "Next 5 sentences"}</button>}
        </div>
      </form>}

      <section className="stats">
        <div className="stats-heading"><div><p className="eyebrow">Your progress</p><h2>Practice history</h2></div><button className="text-button" onClick={reset}>Reset progress</button></div>
        <div className="stat-grid"><div><strong>{regularHistory.length}</strong><span>Regular rounds</span></div><div><strong>{average}%</strong><span>Regular average</span></div><div><strong>{best}%</strong><span>Regular best</span></div><div><strong>{completedUnique}/{ALL_QUESTIONS.length}</strong><span>Sentences seen</span></div></div>
        <div className="review-summary"><span><strong>{reviewHistory.length}</strong> review rounds</span><span><strong>{missedIds.length}</strong> answers still to master</span></div>
        <div className={`practice-row ${practiceMissed ? "active-practice" : ""}`}><div><strong>Incorrect-answer practice</strong><span>{missedIds.length ? `${missedIds.length} sentence${missedIds.length === 1 ? "" : "s"} ready to review` : "No missed sentences waiting"}</span></div><button type="button" className="secondary" disabled={!missedIds.length || practiceMissed} onClick={() => { setPracticeMissed(true); startRound(true); }}>{practiceMissed ? "Practising missed answers" : "Practise missed answers"}</button></div>
        <div className="insights"><div><strong>Weak areas</strong>{weakVerbs.length ? weakVerbs.map(([verb, value]) => <span key={verb}>{verb}: {value.misses} missed of {value.attempts}</span>) : <span>No recurring mistakes yet.</span>}</div><div className="data-actions"><strong>Move progress between devices</strong><span>Download a backup, then import it in another browser.</span><div><button type="button" className="text-button" onClick={exportProgress}>Download progress</button><button type="button" className="text-button" onClick={() => importRef.current?.click()}>Import progress</button><input className="sr-only" ref={importRef} type="file" accept="application/json" onChange={(event) => importProgress(event.target.files?.[0])} /></div></div></div>
        <button type="button" className="history-toggle" onClick={() => setShowHistory((value) => !value)}>{showHistory ? "Hide detailed history" : "Show detailed history"}</button>
        {showHistory && <div className="history-list">{[...history].reverse().map((result, index) => <article key={`${result.date}-${index}`}><div><strong>{result.mode === "review" ? "Review" : "Regular round"} · {result.percent}%</strong><span>{new Date(result.date).toLocaleString()}</span></div><ul>{result.questionIds.map((id, questionIndex) => { const question = ALL_QUESTIONS.find((q) => q.id === id); if (!question) return null; const missed = result.missedIds.includes(id); return <li className={missed ? "missed" : ""} key={id}><span>{question.before} <b>{question.answer}</b> {question.after}</span><small>Your answer: {result.answers[questionIndex] || "No answer"}</small></li>; })}</ul></article>)}</div>}
      </section>
      <footer>{ALL_QUESTIONS.length} sentences across present, simple past and simple future · Progress stays in this browser</footer>
    </main>
  );
}
