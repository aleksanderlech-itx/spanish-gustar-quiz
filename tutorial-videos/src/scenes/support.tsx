import { interpolate, useCurrentFrame } from "remotion";
import { T } from "../theme";
import { AppHeader, Card, Enter, Eyebrow, Tap, useSpring } from "../ui";
import { TOPICS } from "./features";

const Check = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.success} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5l5 5L20 7" /></svg>
);

/** Step 1: every topic and the deck, free, with no account. */
export const FreeScene = () => {
  const badge = useSpring(70, 12);
  return (
    <>
      <AppHeader />
      <div style={{ display: "grid", gap: 8, padding: "20px 16px 0" }}>
        <Eyebrow color={T.primary}>Everything included</Eyebrow>
        {[...TOPICS, "Spanish Verb Flashcards"].map((title, i) => (
          <Enter key={title} delay={6 + i * 6}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", border: `1px solid ${T.line}`, borderRadius: 12, background: T.surface, fontWeight: 700 }}>
              {title} <Check />
            </div>
          </Enter>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 18, transform: `scale(${badge})` }}>
        {["Free", "No account", "On your device"].map((label) => (
          <span key={label} style={{ padding: "8px 14px", borderRadius: 999, background: T.ink, color: T.surface, fontWeight: 700, fontSize: 14 }}>{label}</span>
        ))}
      </div>
    </>
  );
};

/** Step 2: progress lives on the device; a backup file carries it elsewhere. */
export const DeviceScene = () => {
  const frame = useCurrentFrame();
  const travel = interpolate(frame, [50, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arrived = useSpring(90);
  return (
    <>
      <AppHeader />
      <div style={{ padding: "22px 16px 0", display: "grid", gap: 14 }}>
        <Enter delay={2}>
          <Eyebrow color={T.primary}>Your progress</Eyebrow>
          <div style={{ marginTop: 6, fontFamily: T.display, fontSize: 26, fontWeight: 600, lineHeight: 1.15 }}>Stays in this browser, on this device.</div>
        </Enter>
        <Enter delay={14}>
          <Card>
            <div style={{ fontWeight: 700 }}>Backup &amp; restore</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
              <div style={{ display: "grid", height: 44, placeItems: "center", border: `1px solid ${T.primary}`, borderRadius: 10, background: T.primary, color: T.surface, fontWeight: 700, fontSize: 14 }}>Download backup</div>
              <div style={{ display: "grid", height: 44, placeItems: "center", border: `1px solid ${T.control}`, borderRadius: 10, fontWeight: 700, fontSize: 14 }}>Import backup</div>
            </div>
          </Card>
        </Enter>
        <div style={{ position: "relative", height: 230 }}>
          <div style={{ position: "absolute", left: 10, top: 40, width: 110, height: 170, border: `3px solid ${T.ink}`, borderRadius: 18, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700 }}>This phone</div>
          <div style={{ position: "absolute", right: 10, top: 40, width: 130, height: 170, border: `3px solid ${T.ink}`, borderRadius: 12, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700, background: arrived > 0.5 ? T.successSoft : "transparent" }}>New laptop</div>
          <div
            style={{
              position: "absolute",
              top: 95,
              left: 50 + travel * 175,
              opacity: frame >= 46 ? 1 : 0,
              padding: "8px 10px",
              borderRadius: 8,
              background: T.sunSoft,
              border: `1px solid ${T.gold}`,
              fontSize: 11,
              fontWeight: 700,
              boxShadow: "0 6px 12px rgb(15 23 42 / 12%)",
            }}
          >
            backup.json
          </div>
        </div>
      </div>
      <Tap x={113} y={322} at={44} />
    </>
  );
};

/** Step 3: the support prompt and its Ko-fi button. */
export const KofiScene = () => {
  const frame = useCurrentFrame();
  const pressed = interpolate(frame, [70, 74, 82], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const heart = useSpring(78, 10);
  return (
    <>
      <AppHeader />
      <div style={{ display: "grid", justifyItems: "center", gap: 16, padding: "36px 16px 0", textAlign: "center" }}>
        <Enter delay={2}>
          <Eyebrow color={T.primary}>Round complete</Eyebrow>
          <div style={{ marginTop: 6, fontFamily: T.display, fontSize: 48, fontWeight: 600 }}>90%</div>
        </Enter>
        <Enter delay={20} style={{ width: "100%" }}>
          <Card style={{ display: "grid", justifyItems: "center", gap: 14 }}>
            <div style={{ fontSize: 17, lineHeight: 1.4 }}>If you liked it, consider supporting this project.</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 12, background: "#29ABE0", color: "#FFFFFF", fontWeight: 800, fontSize: 16, transform: `scale(${1 - pressed * 0.06})` }}>
              <svg width="26" height="22" viewBox="0 0 26 22" fill="none"><path d="M2 3h16v8a8 8 0 0 1-8 8h0a8 8 0 0 1-8-8V3Z" fill="#FFFFFF" /><path d="M18 6h2.5a3.5 3.5 0 0 1 0 7H18" stroke="#FFFFFF" strokeWidth="2.5" /><path d="M10 13.5s-3.5-2.2-3.5-4.3A1.8 1.8 0 0 1 10 8.4a1.8 1.8 0 0 1 3.5.8c0 2.1-3.5 4.3-3.5 4.3Z" fill="#FF5E5B" /></svg>
              Support on Ko-fi
            </div>
          </Card>
        </Enter>
        <div style={{ fontSize: 40, color: T.clay, opacity: heart, transform: `translateY(${(1 - heart) * 20}px) scale(${heart})` }}>♥</div>
        <Enter delay={90} style={{ fontSize: 15, color: T.muted }}>Also in the menu, any time.</Enter>
      </div>
      <Tap x={195} y={376} at={72} />
    </>
  );
};
