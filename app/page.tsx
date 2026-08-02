"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Question = {
  id: number;
  before: string;
  after: string;
  infinitive: string;
  answer: string;
  explanation: string;
};

type Result = {
  date: string;
  score: number;
  percent: number;
  questionIds: number[];
  answers: string[];
  missedIds: number[];
};

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
  }))
);

const STORAGE_KEY = "gustar-quiz-progress-v1";

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);
const normalize = (value: string) => value.trim().toLocaleLowerCase("es");

export default function Home() {
  const [history, setHistory] = useState<Result[]>([]);
  const [round, setRound] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[]>(Array(5).fill(""));
  const [checked, setChecked] = useState(false);
  const [practiceMissed, setPracticeMissed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const usedIds = useMemo(() => new Set(history.flatMap((item) => item.questionIds)), [history]);
  const missedIds = useMemo(() => {
    const latest = new Map<number, boolean>();
    history.forEach((item) => item.questionIds.forEach((id) => latest.set(id, item.missedIds.includes(id))));
    return [...latest].filter(([, missed]) => missed).map(([id]) => id);
  }, [history]);

  const startRound = (missedOnly = practiceMissed, sourceHistory = history) => {
    const sourceUsed = new Set(sourceHistory.flatMap((item) => item.questionIds));
    let pool = missedOnly ? QUESTIONS.filter((q) => missedIds.includes(q.id)) : QUESTIONS.filter((q) => !sourceUsed.has(q.id));
    if (pool.length < 5 && !missedOnly) pool = QUESTIONS;
    if (pool.length === 0) pool = QUESTIONS;
    setRound(shuffle(pool).slice(0, 5));
    setAnswers(Array(5).fill(""));
    setChecked(false);
    setTimeout(() => inputs.current[0]?.focus(), 0);
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const initial = saved ? (JSON.parse(saved) as Result[]) : [];
    const used = new Set(initial.flatMap((item) => item.questionIds));
    const pool = QUESTIONS.filter((q) => !used.has(q.id));
    queueMicrotask(() => {
      setHistory(initial);
      setRound(shuffle(pool.length >= 5 ? pool : QUESTIONS).slice(0, 5));
      setHydrated(true);
    });
  }, []);

  const correct = checked ? round.filter((q, i) => normalize(answers[i]) === q.answer).length : 0;
  const average = history.length ? Math.round(history.reduce((sum, r) => sum + r.percent, 0) / history.length) : 0;
  const best = history.length ? Math.max(...history.map((r) => r.percent)) : 0;
  const completedUnique = usedIds.size;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (checked || answers.some((answer) => !answer.trim())) return;
    const missed = round.filter((q, i) => normalize(answers[i]) !== q.answer).map((q) => q.id);
    const score = 5 - missed.length;
    const result: Result = { date: new Date().toISOString(), score, percent: score * 20, questionIds: round.map((q) => q.id), answers, missedIds: missed };
    const next = [...history, result];
    setHistory(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setChecked(true);
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
    setPracticeMissed(false);
    startRound(false, []);
  };

  if (!hydrated || round.length < 5) return <main className="loading">Preparing your quiz…</main>;

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">Present tense practice</p>
        <h1>Spanish verbs that work like <em>gustar</em></h1>
        <div className="round-meta">Round {history.length + (checked ? 0 : 1)} <span>·</span> 5 questions</div>
        <div className="progress" aria-label={`${completedUnique} of 150 sentences completed`}><span style={{ width: `${Math.max(3, (completedUnique / 150) * 100)}%` }} /></div>
      </header>

      <section className="rule-card">
        <span className="rule-mark" />
        <div><strong>The verb agrees with the thing, not the person.</strong><p>One thing or an activity uses the singular. Several things use the plural.</p></div>
        <div className="examples"><span>Me <b>gusta</b> viajar.</span><span>Me <b>gustan</b> los viajes.</span></div>
      </section>

      {checked && <section className="result-card" aria-live="polite">
        <div className="score-ring"><strong>{correct * 20}%</strong><span>{correct}/5 correct</span></div>
        <div><p className="result-label">Round complete</p><h2>{correct === 5 ? "Excellent work." : correct >= 4 ? "Very good." : correct >= 3 ? "Good start." : "Keep practising."}</h2><p>Review any corrections below, then continue with five new sentences.</p></div>
      </section>}

      <form onSubmit={submit}>
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
                  onKeyDown={(event) => { if (event.key === "Enter" && index < 4) { event.preventDefault(); inputs.current[index + 1]?.focus(); } }}
                  aria-invalid={isWrong || undefined}
                />
                <span>{question.after}</span>
                {isWrong && <p className="feedback"><strong>Correct: {question.answer}.</strong> {question.explanation}</p>}
                {isCorrect && <p className="feedback">Correct.</p>}
              </div>
              <span className="verb-chip">{question.infinitive}</span>
            </article>;
          })}
        </div>

        <div className="action-bar">
          <div className="action-copy">{checked ? "Your result has been saved on this device." : answers.filter(Boolean).length === 5 ? "Ready to check." : `${answers.filter((a) => a.trim()).length} of 5 answered`}</div>
          {!checked ? <button className="primary" disabled={answers.some((answer) => !answer.trim())}>Check answers</button> : <button type="button" className="primary" onClick={() => startRound()}>Next 5 sentences</button>}
        </div>
      </form>

      <section className="stats">
        <div className="stats-heading"><div><p className="eyebrow">Your progress</p><h2>Practice history</h2></div><button className="text-button" onClick={reset}>Reset progress</button></div>
        <div className="stat-grid"><div><strong>{history.length}</strong><span>Rounds completed</span></div><div><strong>{average}%</strong><span>Average score</span></div><div><strong>{best}%</strong><span>Best score</span></div><div><strong>{completedUnique}/150</strong><span>Sentences seen</span></div></div>
        <div className="practice-row"><div><strong>Incorrect-answer practice</strong><span>{missedIds.length ? `${missedIds.length} sentence${missedIds.length === 1 ? "" : "s"} ready to review` : "No missed sentences waiting"}</span></div><button type="button" className="secondary" disabled={!missedIds.length} onClick={() => { setPracticeMissed(true); startRound(true); }}>Practise missed answers</button></div>
      </section>
      <footer>150 present-tense sentences · Progress stays in this browser</footer>
    </main>
  );
}
