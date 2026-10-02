import type { ReactNode } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { T } from "../theme";
import { AppHeader, Button, Card, Chip, Enter, Eyebrow, ProgressBar, Tap, useAfter, useProgress, useSpring } from "../ui";

const Segmented = ({ options, active }: { options: string[]; active: number }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap: 6 }}>
    {options.map((option, i) => (
      <div
        key={option}
        style={{
          display: "grid",
          height: 44,
          placeItems: "center",
          border: `1px solid ${i === active ? T.primary : T.control}`,
          borderRadius: 10,
          background: i === active ? T.primarySoft : T.surface,
          color: i === active ? T.primary : T.ink,
          fontWeight: 700,
        }}
      >
        {option}
      </div>
    ))}
  </div>
);

/** Step 1: pick a topic and a round length, then start. */
export const SetupScene = () => {
  const length = useAfter(40) ? 1 : 0;
  const pressed = useAfter(84) ? 1 : 0;
  return (
    <>
      <AppHeader />
      <div style={{ display: "grid", gap: 16, padding: "22px 16px 0" }}>
        <Enter delay={2}>
          <Eyebrow color={T.primary}>Topic</Eyebrow>
          <div style={{ marginTop: 6, fontFamily: T.display, fontSize: 34, fontWeight: 600 }}>Gustar Patterns</div>
          <div style={{ marginTop: 4, color: T.muted }}>Gustar and verbs like it, in context.</div>
        </Enter>
        <Enter delay={10}>
          <div style={{ marginBottom: 8, fontWeight: 700 }}>Round length</div>
          <Segmented options={["5", "10", "20"]} active={length} />
        </Enter>
        <Enter delay={18}>
          <div style={{ marginBottom: 8, fontWeight: 700 }}>Answer mode</div>
          <Segmented options={["Choose", "Type"]} active={0} />
        </Enter>
        <Enter delay={26}><Button pressed={pressed * 0.6} style={{ marginTop: 10 }}>Start</Button></Enter>
      </div>
      <Tap x={195} y={278} at={40} />
      <Tap x={195} y={472} at={84} />
    </>
  );
};

const Question = ({ before, after, blank, hint }: { before: string; after: string; blank: ReactNode; hint: string }) => (
  <Card>
    <div style={{ display: "flex", justifyContent: "space-between" }}><Eyebrow>Gustar patterns</Eyebrow><Chip tone="gold">A2</Chip></div>
    <div style={{ marginTop: 10, fontFamily: T.display, fontSize: 32, fontWeight: 700, lineHeight: 1.15 }}>
      {before} {blank} {after}
    </div>
    <div style={{ marginTop: 8, fontSize: 15, color: T.muted }}>{hint}</div>
  </Card>
);

const Blank = ({ text }: { text: string }) => (
  <span style={{ display: "inline-block", minWidth: 90, borderBottom: `3px solid ${T.gold}`, color: text ? T.primary : T.muted, textAlign: "center" }}>{text || "?"}</span>
);

const RoundTop = ({ n }: { n: number }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 16px 12px" }}>
    <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 4 }}>
      {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ height: 6, borderRadius: 3, background: i < n ? T.primary : T.line }} />)}
    </div>
    <span style={{ fontSize: 13, fontWeight: 700, color: T.muted }}>Question {n} of 10</span>
  </div>
);

/** Step 2: Choose shows options; Type asks you to write the form. */
export const ModesScene = () => {
  const frame = useCurrentFrame();
  const typeMode = frame >= 66;
  const typed = "gustan".slice(0, Math.max(0, Math.floor((frame - 80) / 4)));
  const swap = useSpring(66);
  return (
    <>
      <AppHeader />
      <RoundTop n={typeMode ? 2 : 1} />
      <div style={{ padding: "0 16px", display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Chip tone="teal">{typeMode ? "Type mode" : "Choose mode"}</Chip>
        </div>
        {!typeMode ? (
          <Enter delay={4}>
            <Question before="A Marta le" after="el café colombiano." blank={<Blank text="" />} hint="Marta likes Colombian coffee." />
            <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
              {["gusta", "gustan", "gustas"].map((option, i) => (
                <Enter key={option} delay={14 + i * 6}>
                  <div style={{ padding: "13px 16px", border: `1px solid ${T.control}`, borderRadius: 10, background: T.surface, fontSize: 17, fontWeight: 600 }}>{option}</div>
                </Enter>
              ))}
            </div>
          </Enter>
        ) : (
          <div style={{ opacity: swap, transform: `translateX(${(1 - swap) * 40}px)` }}>
            <Question before="Me" after="los conciertos de rock." blank={<Blank text={typed} />} hint="I like rock concerts." />
            <div style={{ marginTop: 12, padding: "13px 16px", border: `2px solid ${T.primary}`, borderRadius: 10, background: T.surface, fontSize: 17, color: typed ? T.ink : T.muted }}>
              {typed || "Type the missing form"}
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              {["á", "é", "í", "ó", "ú", "ñ"].map((key) => <div key={key} style={{ display: "grid", width: 44, height: 44, placeItems: "center", border: `1px solid ${T.control}`, borderRadius: 8, background: T.surface }}>{key}</div>)}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

/** Step 3: a wrong pick, the right answer, the explanation and the notebook note. */
export const ExplanationScene = () => {
  const picked = useAfter(30);
  const explain = useSpring(42);
  const toast = useSpring(80);
  return (
    <>
      <AppHeader />
      <RoundTop n={3} />
      <div style={{ padding: "0 16px", display: "grid", gap: 10 }}>
        <Question before="Me" after="las películas antiguas." blank={<Blank text={picked ? "gustan" : ""} />} hint="I like old films." />
        {[
          { text: "gusta", state: picked ? "wrong" : "idle" },
          { text: "gustan", state: picked ? "right" : "idle" },
        ].map(({ text, state }) => (
          <div
            key={text}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "13px 16px",
              border: `1px solid ${state === "right" ? T.success : state === "wrong" ? T.error : T.control}`,
              borderRadius: 10,
              background: state === "right" ? T.successSoft : state === "wrong" ? T.errorSoft : T.surface,
              fontSize: 17,
              fontWeight: 600,
            }}
          >
            <span>{text}</span>
            {state === "right" && <span style={{ fontSize: 12, letterSpacing: "0.1em", color: T.success }}>CORRECT</span>}
            {state === "wrong" && <span style={{ fontSize: 12, letterSpacing: "0.1em", color: T.error }}>WRONG</span>}
          </div>
        ))}
        <div style={{ opacity: explain, transform: `translateY(${(1 - explain) * 16}px)`, padding: 14, borderLeft: `4px solid ${T.primary}`, background: T.surface, borderRadius: 8, fontSize: 15, lineHeight: 1.45 }}>
          <b>Las películas</b> is plural, so the verb is plural: <b>gustan</b>.
        </div>
      </div>
      <div style={{ position: "absolute", left: 16, right: 16, bottom: 28, opacity: toast, transform: `translateY(${(1 - toast) * 30}px)`, padding: "12px 14px", borderRadius: 10, background: T.ink, color: T.surface, fontSize: 14, fontWeight: 600 }}>
        Saved to your mistake notebook
      </div>
      <Tap x={195} y={384} at={30} />
    </>
  );
};

/** Step 4: the results ring fills, then "Practise the misses". */
export const ResultsScene = () => {
  const frame = useCurrentFrame();
  const fill = useProgress(8, 60);
  const percent = Math.round(fill * 80);
  const r = 70;
  const c = 2 * Math.PI * r;
  const pressed = interpolate(frame, [96, 100, 106], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <AppHeader />
      <div style={{ display: "grid", justifyItems: "center", gap: 14, padding: "30px 16px 0" }}>
        <Eyebrow color={T.primary}>Round complete</Eyebrow>
        <svg width="180" height="180" viewBox="0 0 180 180">
          <circle cx="90" cy="90" r={r} fill="none" stroke={T.line} strokeWidth="12" />
          <circle cx="90" cy="90" r={r} fill="none" stroke={T.primary} strokeWidth="12" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - fill * 0.8)} transform="rotate(-90 90 90)" />
          <text x="90" y="102" textAnchor="middle" fontFamily={T.display} fontSize="40" fontWeight="600" fill={T.ink}>{percent}%</text>
        </svg>
        <div style={{ fontSize: 18, fontWeight: 700 }}>8 of 10 correct</div>
        <Enter delay={60} style={{ width: "100%" }}>
          <Card>
            <Eyebrow>Weak areas</Eyebrow>
            <div style={{ marginTop: 8 }}>Plural subjects · <span style={{ color: T.muted }}>2 misses</span></div>
            <div style={{ marginTop: 10 }}><ProgressBar value={0.4} color={T.clay} /></div>
          </Card>
        </Enter>
        <Enter delay={72} style={{ width: "100%" }}><Button pressed={pressed}>Practise the misses</Button></Enter>
      </div>
      <Tap x={195} y={612} at={100} />
    </>
  );
};
