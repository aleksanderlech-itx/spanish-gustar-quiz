import { interpolate, useCurrentFrame } from "remotion";
import { T } from "../theme";
import { AppHeader, Button, Card, Chip, Enter, Eyebrow, ProgressBar, Tap, useAfter, useSpring } from "../ui";

/** Step 1: reveal a card, then mark it Got it. */
export const FlashcardScene = () => {
  const frame = useCurrentFrame();
  const flip = interpolate(frame, [28, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const revealed = flip > 0.5;
  const gotIt = useAfter(88);
  const away = useSpring(96, 22);
  return (
    <>
      <AppHeader />
      <div style={{ padding: "18px 16px 0" }}>
        <Eyebrow>Flashcard deck · Spanish</Eyebrow>
        <div style={{ marginTop: 4, fontFamily: T.display, fontSize: 28, fontWeight: 600 }}>Spanish verb flashcards</div>
      </div>
      <div style={{ position: "relative", padding: "16px", perspective: 900 }}>
        {/* The next card waits underneath and rises as the answered one swipes away. */}
        <div style={{ position: "absolute", inset: 16, display: "grid", alignContent: "center", justifyItems: "center", gap: 12, border: `1px solid ${T.line}`, borderRadius: 22, background: T.surface, opacity: away, transform: `scale(${0.94 + away * 0.06})` }}>
          <Eyebrow>Tap to reveal</Eyebrow>
          <div style={{ fontFamily: T.display, fontSize: 44, fontWeight: 600 }}>aprender</div>
          <Chip>Box 2 · due now</Chip>
        </div>
        <div
          style={{
            height: 300,
            transform: `rotateY(${(revealed ? flip - 1 : flip) * 180}deg) translateX(${away * 440}px) rotate(${away * 12}deg)`,
            border: `1px solid ${T.line}`,
            borderRadius: 22,
            background: T.surface,
            boxShadow: "0 4px 14px rgb(15 23 42 / 8%)",
            position: "relative",
            display: "grid",
            alignContent: "center",
            justifyItems: "center",
            gap: 12,
            padding: 20,
          }}
        >
          {!revealed ? (
            <>
              <Eyebrow>Tap to reveal</Eyebrow>
              <div style={{ fontFamily: T.display, fontSize: 44, fontWeight: 600 }}>arrastrar</div>
              <Chip>Box 1 · due now</Chip>
            </>
          ) : (
            <>
              <div style={{ fontFamily: T.display, fontSize: 36, fontWeight: 600 }}>arrastrar</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: T.primary }}>to drag</div>
              <div style={{ textAlign: "center", fontSize: 15, color: T.muted, lineHeight: 1.4 }}>Arrastré la maleta por la estación.<br />I dragged the suitcase through the station.</div>
            </>
          )}
        </div>
      </div>
      <div style={{ display: "grid", gap: 8, padding: "0 16px" }}>
        <Button style={{ opacity: revealed ? 0.4 : 1 }}>Reveal</Button>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Button variant="secondary" style={{ opacity: revealed ? 1 : 0.5 }}>✕ Again</Button>
          <Button pressed={gotIt && !away ? 0.6 : 0} style={{ opacity: revealed ? 1 : 0.5, background: T.success, borderColor: T.success }}>✓ Got it</Button>
        </div>
      </div>
      <Tap x={195} y={570} at={28} />
      <Tap x={293} y={626} at={88} />
    </>
  );
};

const BOX_LABELS = ["Every session", "After 1 day", "After 3 days", "After 7 days"];

/** Step 2: a card climbs the four boxes, then a miss drops it back to Box 1. */
export const BoxesScene = () => {
  const frame = useCurrentFrame();
  // Box index over time: 0 → 1 → 2 → 3, then back to 0 on the miss.
  const keyframes = [0, 22, 30, 48, 56, 74, 82, 104, 114];
  const positions = [0, 0, 1, 1, 2, 2, 3, 3, 0];
  const box = interpolate(frame, keyframes, positions, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const missed = frame >= 104;
  const boxWidth = (390 - 32 - 18) / 4;
  return (
    <>
      <AppHeader />
      <div style={{ padding: "22px 16px 0" }}>
        <Eyebrow color={T.primary}>Leitner boxes</Eyebrow>
        <div style={{ marginTop: 6, fontFamily: T.display, fontSize: 26, fontWeight: 600, lineHeight: 1.15 }}>Remembered cards come back less often.</div>
      </div>
      <div style={{ position: "relative", margin: "28px 16px 0", height: 250 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
          {BOX_LABELS.map((label, i) => (
            <div key={label} style={{ height: 210, padding: "10px 6px", border: `1px solid ${Math.round(box) === i ? T.primary : T.line}`, borderRadius: 12, background: Math.round(box) === i ? T.primarySoft : T.surface, textAlign: "center" }}>
              <div style={{ fontWeight: 700 }}>Box {i + 1}</div>
              <div style={{ marginTop: 4, fontSize: 11, color: T.muted }}>{label}</div>
            </div>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            top: 100,
            left: box * (boxWidth + 6) + 8,
            width: boxWidth - 16,
            height: 70,
            display: "grid",
            placeItems: "center",
            borderRadius: 10,
            border: `2px solid ${missed ? T.error : T.ink}`,
            background: missed ? T.errorSoft : T.surface,
            fontFamily: T.display,
            fontSize: 13,
            fontWeight: 700,
            boxShadow: "0 6px 12px rgb(15 23 42 / 12%)",
          }}
        >
          arrastrar
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
        {frame < 104 ? <Chip tone="success">Got it → next box</Chip> : <Chip tone="error">Again → back to Box 1</Chip>}
      </div>
    </>
  );
};

/** Step 3: due counts on the board tick up as cards and questions come due. */
export const DueScene = () => {
  const frame = useCurrentFrame();
  const count = (to: number, delay: number) => Math.round(interpolate(frame, [delay, delay + 40], [0, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const tiles = [
    { title: "Spanish Verb Flashcards", due: count(12, 14), dueSoon: true, unit: "cards" },
    { title: "Gustar Patterns", due: count(3, 24), dueSoon: true, unit: "questions" },
    { title: "Ser vs Estar", due: count(5, 34), dueSoon: true, unit: "questions" },
    { title: "Por vs Para", due: 0, dueSoon: false, unit: "questions" },
  ];
  return (
    <>
      <AppHeader />
      <div style={{ display: "grid", gap: 10, padding: "20px 16px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}><Eyebrow>Today&apos;s board</Eyebrow><span style={{ fontSize: 12, color: T.muted }}>sized by what&apos;s due</span></div>
        {tiles.map((tile, i) => (
          <Enter key={tile.title} delay={4 + i * 5}>
            <div style={{ display: "grid", gap: 8, padding: "14px", border: `1px solid ${tile.dueSoon ? T.primary : T.line}`, borderRadius: 14, background: T.surface }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700 }}>{tile.title}</span>
                {tile.dueSoon ? <Chip tone="teal">{tile.due} due</Chip> : <span style={{ fontSize: 12, color: T.muted, fontWeight: 700 }}>nothing due</span>}
              </div>
              <span style={{ fontSize: 13, color: T.muted }}>{tile.dueSoon ? `${tile.due} ${tile.unit} ready to review now` : "All caught up"}</span>
            </div>
          </Enter>
        ))}
      </div>
    </>
  );
};

/** Step 4: "Practise the misses" lines up the questions you got wrong. */
export const MissesScene = () => {
  const misses = [
    { q: "Me ___ las películas antiguas.", a: "gustan" },
    { q: "A Raúl le ___ tres preguntas.", a: "quedan" },
    { q: "¿Te ___ bien estos pantalones?", a: "quedan" },
  ];
  return (
    <>
      <AppHeader />
      <div style={{ display: "grid", gap: 12, padding: "22px 16px 0" }}>
        <Enter delay={2}>
          <Eyebrow color={T.clay}>Practise the misses</Eyebrow>
          <div style={{ marginTop: 6, fontFamily: T.display, fontSize: 28, fontWeight: 600 }}>3 questions to retry</div>
        </Enter>
        {misses.map((miss, i) => (
          <Enter key={miss.q} delay={16 + i * 12}>
            <Card style={{ padding: 14 }}>
              <div style={{ fontFamily: T.display, fontSize: 19, fontWeight: 600 }}>{miss.q}</div>
              <div style={{ marginTop: 6, fontSize: 13, color: T.muted }}>Last answer was wrong · answer: <b style={{ color: T.success }}>{miss.a}</b></div>
            </Card>
          </Enter>
        ))}
        <Enter delay={60}><ProgressBar value={0} /></Enter>
        <Enter delay={66}><Button>Start review round</Button></Enter>
      </div>
    </>
  );
};
