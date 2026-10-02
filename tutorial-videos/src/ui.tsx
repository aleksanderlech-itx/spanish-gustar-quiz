import type { CSSProperties, ReactNode } from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { T } from "./theme";

/** 0→1 spring that starts at `delay` frames into the current sequence. */
export const useSpring = (delay = 0, damping = 18) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
};

/** Fade-and-rise entrance, the motion every element in the clips uses. */
export const Enter = ({ delay = 0, distance = 24, children, style }: { delay?: number; distance?: number; children: ReactNode; style?: CSSProperties }) => {
  const p = useSpring(delay);
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * distance}px)`, ...style }}>{children}</div>;
};

/** Linear 0→1 between two frames, clamped. */
export const useProgress = (from: number, to: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, to], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

/** Width/height of the phone's screen in app CSS pixels (an iPhone-sized viewport). */
export const SCREEN = { width: 390, height: 760 };

export const Phone = ({ scale, children }: { scale: number; children: ReactNode }) => (
  <div style={{ width: (SCREEN.width + 24) * scale, height: (SCREEN.height + 24) * scale, flex: "none" }}>
    <div
      style={{
        width: SCREEN.width + 24,
        height: SCREEN.height + 24,
        padding: 12,
        borderRadius: 54,
        background: "#26221E",
        boxShadow: "0 30px 60px rgb(15 23 42 / 18%)",
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }}
    >
      <div style={{ position: "relative", width: SCREEN.width, height: SCREEN.height, overflow: "hidden", borderRadius: 42, background: T.paper, fontFamily: T.body, color: T.ink }}>
        {children}
      </div>
    </div>
  </div>
);

const SquareButton = ({ children }: { children: ReactNode }) => (
  <div style={{ display: "grid", width: 44, height: 44, placeItems: "center", border: `1px solid ${T.ink}`, borderRadius: 12, background: T.surface }}>{children}</div>
);

export const Hamburger = () => (
  <div style={{ display: "grid", gap: 4 }}>
    {[0, 1, 2].map((i) => <div key={i} style={{ width: 18, height: 2, background: T.ink }} />)}
  </div>
);

export const Mark = ({ size = 24 }: { size?: number }) => <Img src={staticFile("brand/mark.svg")} style={{ width: size, height: size }} />;

export const AppHeader = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "40px 16px 14px", borderBottom: `1px solid ${T.line}` }}>
    <SquareButton><Hamburger /></SquareButton>
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: T.display, fontSize: 19, fontWeight: 600 }}>
      <Mark /> Spanish Quizzes
    </div>
    <SquareButton>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.ink} strokeWidth="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>
    </SquareButton>
  </div>
);

export const Eyebrow = ({ children, color = T.muted }: { children: ReactNode; color?: string }) => (
  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color }}>{children}</div>
);

export const Card = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div style={{ padding: 18, border: `1px solid ${T.line}`, borderRadius: 18, background: T.surface, boxShadow: "0 4px 14px rgb(15 23 42 / 8%)", ...style }}>{children}</div>
);

export const Chip = ({ children, tone = "dashed" }: { children: ReactNode; tone?: "dashed" | "gold" | "teal" | "success" | "error" }) => {
  const tones: Record<string, CSSProperties> = {
    dashed: { border: `1.5px dashed ${T.control}`, color: T.muted, background: "transparent" },
    gold: { border: `1px solid ${T.gold}`, background: T.gold, color: T.ink },
    teal: { border: `1px solid ${T.primary}`, background: T.primarySoft, color: T.primary },
    success: { border: `1px solid ${T.success}`, background: T.successSoft, color: T.success },
    error: { border: `1px solid ${T.error}`, background: T.errorSoft, color: T.error },
  };
  return <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700, ...tones[tone] }}>{children}</span>;
};

export const Button = ({ children, variant = "primary", pressed = 0, style }: { children: ReactNode; variant?: "primary" | "secondary"; pressed?: number; style?: CSSProperties }) => (
  <div
    style={{
      display: "flex",
      minHeight: 48,
      alignItems: "center",
      justifyContent: "center",
      padding: "0 18px",
      border: `1px solid ${variant === "primary" ? T.primary : T.control}`,
      borderRadius: 10,
      background: variant === "primary" ? T.primary : T.surface,
      color: variant === "primary" ? T.surface : T.ink,
      fontWeight: 700,
      fontSize: 16,
      transform: `scale(${1 - pressed * 0.05})`,
      ...style,
    }}
  >
    {children}
  </div>
);

export const ProgressBar = ({ value, color = T.primary }: { value: number; color?: string }) => (
  <div style={{ height: 6, borderRadius: 3, background: T.line }}>
    <div style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, height: "100%", borderRadius: 3, background: color }} />
  </div>
);

/** A finger tap: a teal ring that grows and fades at (x, y) in screen pixels. */
export const Tap = ({ x, y, at }: { x: number; y: number; at: number }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < -6 || t > 18) return null;
  const grow = interpolate(t, [-6, 0, 18], [0.6, 1, 1.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = interpolate(t, [-6, 0, 18], [0, 0.9, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: x - 22,
        top: y - 22,
        width: 44,
        height: 44,
        borderRadius: "50%",
        border: `4px solid ${T.primary}`,
        background: "rgb(15 118 110 / 18%)",
        opacity,
        transform: `scale(${grow})`,
        pointerEvents: "none",
        zIndex: 10,
      }}
    />
  );
};

/** True once the sequence has reached `at`; handy for state flips after a tap. */
export const useAfter = (at: number) => useCurrentFrame() >= at;
