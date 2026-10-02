import { interpolate, useCurrentFrame } from "remotion";
import { T } from "../theme";
import { AppHeader, Button, Card, Chip, Enter, Eyebrow, ProgressBar, useProgress, useSpring } from "../ui";

export const TOPICS = ["Gustar Patterns", "Ser vs Estar", "Por vs Para", "Preterite vs Imperfect", "Object Pronouns", "Saber vs Conocer"];

const TopicTile = ({ title, progress = 0, due, highlight = 0 }: { title: string; progress?: number; due?: string; highlight?: number }) => (
  <div
    style={{
      display: "grid",
      gap: 8,
      padding: "12px 14px",
      border: `${1 + highlight}px solid ${highlight ? T.primary : T.line}`,
      borderRadius: 14,
      background: T.surface,
      transform: `scale(${1 + highlight * 0.03})`,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
      <span style={{ fontSize: 16, fontWeight: 700 }}>{title}</span>
      {due ? <Chip tone="teal">{due}</Chip> : <Chip>0/5 today</Chip>}
    </div>
    <ProgressBar value={progress} />
  </div>
);

const Featured = () => (
  <Card style={{ margin: "14px 16px 0" }}>
    <Eyebrow color={T.primary}>Keep learning</Eyebrow>
    <div style={{ marginTop: 8, fontFamily: T.display, fontSize: 28, fontWeight: 600, lineHeight: 1.1 }}>Make Spanish part of your day.</div>
    <div style={{ marginTop: 12, display: "flex", gap: 8 }}><Chip tone="gold">New</Chip><Chip>0/20 today</Chip></div>
    <div style={{ marginTop: 8, fontFamily: T.display, fontSize: 20, fontWeight: 600 }}>Spanish Verb Flashcards</div>
    <Button style={{ marginTop: 12, alignSelf: "start", width: 170 }}>Start practice →</Button>
  </Card>
);

/** Step 1: the board fills in — featured deck, then the six topics. */
export const BoardScene = () => (
  <>
    <AppHeader />
    <Enter delay={4}><Featured /></Enter>
    <div style={{ display: "grid", gap: 10, padding: "16px 16px 0" }}>
      <Enter delay={14}><Eyebrow>All topics</Eyebrow></Enter>
      {TOPICS.slice(0, 4).map((topic, i) => <Enter key={topic} delay={18 + i * 7}><TopicTile title={topic} /></Enter>)}
    </div>
  </>
);

/** Step 2: one tile gets practised — its bar fills and a due count appears. */
export const TileProgressScene = () => {
  const highlight = useSpring(6);
  const fill = useProgress(20, 70);
  const due = useCurrentFrame() >= 72;
  return (
    <>
      <AppHeader />
      <div style={{ display: "grid", gap: 10, padding: "20px 16px 0" }}>
        <Eyebrow>All topics</Eyebrow>
        <TopicTile title="Gustar Patterns" progress={fill * 0.6} due={due ? "3 due" : undefined} highlight={highlight} />
        {TOPICS.slice(1, 6).map((topic) => <div key={topic} style={{ opacity: 1 - highlight * 0.45 }}><TopicTile title={topic} /></div>)}
      </div>
      <Enter delay={78} style={{ margin: "18px 16px 0", textAlign: "center", fontSize: 15, color: T.muted }}>
        {Math.round(fill * 90)} of 150 questions studied
      </Enter>
    </>
  );
};

const DAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

/** Step 3: the streak strip fills day by day. */
export const StreakScene = () => {
  const frame = useCurrentFrame();
  const filled = Math.min(5, Math.max(0, Math.floor((frame - 10) / 12)));
  return (
    <>
      <AppHeader />
      <Enter delay={2}>
        <div style={{ margin: "20px 16px 0", padding: 18, border: `1px solid ${T.line}`, borderRadius: 18, background: T.sunSoft }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontFamily: T.display, fontSize: 52, fontWeight: 600, lineHeight: 1 }}>{filled}</span>
            <div>
              <div style={{ fontWeight: 700 }}>días seguidos</div>
              <div style={{ fontSize: 13, color: T.muted }}>Goal: a round in all 7 activities</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginTop: 14 }}>
            {DAYS.map((day, i) => {
              const done = i < filled;
              return (
                <div key={day} style={{ display: "grid", gap: 4, justifyItems: "center" }}>
                  <div style={{ width: "100%", height: 26, borderRadius: 6, border: done ? `1px solid ${T.primary}` : `1.5px dashed ${T.control}`, background: done ? T.primary : "transparent", transform: `scale(${done && i === filled - 1 ? 1.08 : 1})` }} />
                  <span style={{ fontSize: 11, color: T.muted }}>{day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Enter>
      <Enter delay={70} style={{ margin: "22px 16px 0" }}>
        <Card>
          <Eyebrow color={T.primary}>This week</Eyebrow>
          <div style={{ marginTop: 6, fontSize: 16 }}>5 days practised. A reminder, not a grade.</div>
        </Card>
      </Enter>
    </>
  );
};

const DRAWER_ROWS = ["Progress & history", "Weekly recap", "Mistake notebook", "Backup & restore", "Settings", "How to use", "Notes"];

/** Step 4: the menu drawer slides in from the left. */
export const DrawerScene = () => {
  const open = useSpring(10, 20);
  const frame = useCurrentFrame();
  return (
    <>
      <AppHeader />
      <div style={{ padding: "16px" }}><Featured /></div>
      <div style={{ position: "absolute", inset: 0, background: `rgb(44 43 41 / ${open * 0.45})` }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 310, padding: "44px 18px", background: T.surface, borderRight: `1px solid ${T.ink}`, transform: `translateX(${(open - 1) * 320}px)` }}>
        <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 600, marginBottom: 14 }}>Menu</div>
        {DRAWER_ROWS.map((row, i) => {
          const lit = interpolate(frame, [40 + i * 8, 48 + i * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={row} style={{ padding: "13px 4px", borderBottom: `1px solid ${T.line}`, fontSize: 16, fontWeight: 600, opacity: 0.45 + lit * 0.55 }}>
              {row}
            </div>
          );
        })}
      </div>
    </>
  );
};
