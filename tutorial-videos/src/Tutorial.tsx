import type { FC } from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { TUTORIALS, type Tutorial, type TutorialId } from "../../app/tutorials.ts";
import { FPS, loadFonts, T } from "./theme";
import { Enter, Mark, Phone, useSpring } from "./ui";
import { BoardScene, DrawerScene, StreakScene, TileProgressScene } from "./scenes/features";
import { ExplanationScene, ModesScene, ResultsScene, SetupScene } from "./scenes/round";
import { BoxesScene, DueScene, FlashcardScene, MissesScene } from "./scenes/review";
import { DeviceScene, FreeScene, KofiScene } from "./scenes/support";

loadFonts();

/** One animated phone scene per written step in app/tutorials.ts, in order. */
export const SCENES: Record<TutorialId, FC[]> = {
  features: [BoardScene, TileProgressScene, StreakScene, DrawerScene],
  "how-to-use": [SetupScene, ModesScene, ExplanationScene, ResultsScene],
  "activities-review": [FlashcardScene, BoxesScene, DueScene, MissesScene],
  support: [FreeScene, DeviceScene, KofiScene],
};

export type Format = "reel" | "feed" | "app";
export const FORMATS: Record<Format, { width: number; height: number; music: boolean }> = {
  reel: { width: 1080, height: 1920, music: true }, // Instagram/FB Reels and Stories, 9:16
  feed: { width: 1080, height: 1350, music: true }, // Instagram/FB feed posts, 4:5
  app: { width: 720, height: 900, music: true }, // the in-app player on /how-to-use, 4:5
};

const INTRO = 75;
const OUTRO = 90;
/** Long enough for the scene's animation and to read the caption at ~3 words a second. */
const stepFrames = (text: string) => Math.max(135, text.split(/\s+/).length * 10 + 45);

export const timeline = (tutorial: Tutorial) => {
  let at = INTRO;
  const steps = tutorial.steps.map((text) => {
    const step = { text, from: at, frames: stepFrames(text) };
    at += step.frames;
    return step;
  });
  return { steps, outroFrom: at, total: at + OUTRO };
};

export const tutorialById = (id: TutorialId) => {
  const tutorial = TUTORIALS.find((t) => t.id === id);
  if (!tutorial) throw new Error(`Unknown tutorial ${id}`);
  if (SCENES[id].length !== tutorial.steps.length) throw new Error(`${id}: ${SCENES[id].length} scenes for ${tutorial.steps.length} steps`);
  return tutorial;
};

const fadeIn = (frame: number, length = 8) => interpolate(frame, [0, length], [0, 1], { extrapolateRight: "clamp" });

const Caption = ({ text, index, count, size }: { text: string; index: number; count: number; size: number }) => {
  const frame = useCurrentFrame();
  const p = useSpring(0, 22);
  return (
    <div style={{ opacity: Math.min(p, fadeIn(frame, 6)), transform: `translateY(${(1 - p) * 30}px)` }}>
      <div style={{ display: "flex", gap: 10, marginBottom: size * 0.5 }}>
        {Array.from({ length: count }, (_, i) => (
          <div key={i} style={{ width: size * 1.3, height: size * 0.16, borderRadius: size, background: i <= index ? T.primary : T.line }} />
        ))}
      </div>
      <div style={{ fontFamily: T.display, fontSize: size, fontWeight: 600, lineHeight: 1.2, color: T.ink }}>{text}</div>
    </div>
  );
};

const Brand = ({ size }: { size: number }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.4, fontFamily: T.display, fontSize: size, fontWeight: 600, color: T.ink }}>
    <Mark size={size * 1.25} /> Spanish Quizzes
  </div>
);

const Intro = ({ tutorial, number, scale }: { tutorial: Tutorial; number: number; scale: number }) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [INTRO - 12, INTRO], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: 90 * scale, opacity: out }}>
      <Enter delay={0}><Brand size={40 * scale} /></Enter>
      <Enter delay={8} style={{ marginTop: 70 * scale }}>
        <div style={{ fontFamily: T.body, fontSize: 34 * scale, fontWeight: 700, letterSpacing: "0.14em", color: T.primary }}>TUTORIAL {String(number).padStart(2, "0")}</div>
      </Enter>
      <Enter delay={14}><div style={{ marginTop: 16 * scale, fontFamily: T.display, fontSize: 120 * scale, fontWeight: 600, lineHeight: 1.02, color: T.ink }}>{tutorial.title}</div></Enter>
      <Enter delay={22}><div style={{ marginTop: 30 * scale, fontFamily: T.body, fontSize: 44 * scale, lineHeight: 1.35, color: T.muted }}>{tutorial.summary}</div></Enter>
    </AbsoluteFill>
  );
};

const Outro = ({ scale }: { scale: number }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center", gap: 30 * scale }}>
    <Enter delay={0}><Mark size={150 * scale} /></Enter>
    <Enter delay={6}><div style={{ fontFamily: T.display, fontSize: 96 * scale, fontWeight: 600, color: T.ink }}>Spanish Quizzes</div></Enter>
    <Enter delay={12}><div style={{ fontFamily: T.body, fontSize: 44 * scale, color: T.muted }}>Free Spanish grammar practice</div></Enter>
    <Enter delay={18}>
      <div style={{ padding: `${18 * scale}px ${40 * scale}px`, borderRadius: 16 * scale, background: T.primary, color: T.surface, fontFamily: T.body, fontSize: 48 * scale, fontWeight: 800 }}>spanish-quizz.es</div>
    </Enter>
  </AbsoluteFill>
);

/** The phone, its scenes and the captions for the steps, laid out for one format. */
const Steps = ({ tutorial, format }: { tutorial: Tutorial; format: Exclude<Format, "app"> }) => {
  const frame = useCurrentFrame();
  const { steps, outroFrom } = timeline(tutorial);
  const scenes = SCENES[tutorial.id];
  const enter = useSpring(INTRO - 10, 20);
  const leave = interpolate(frame, [outroFrom - 12, outroFrom], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const visible = frame >= INTRO - 12 && frame < outroFrom;
  if (!visible) return null;

  const reel = format === "reel";
  const phoneScale = reel ? 1.48 : 1.3;
  const captionSize = reel ? 58 : 42;

  const phone = (
    <Phone scale={phoneScale}>
      {steps.map((step, i) => {
        const Scene = scenes[i];
        return (
          // Each scene outlasts its step by the crossfade, so the next one fades in over it.
          <Sequence key={step.text} from={step.from} durationInFrames={step.frames + (i < steps.length - 1 ? CROSSFADE : 0)} layout="none">
            <SceneFade><Scene /></SceneFade>
          </Sequence>
        );
      })}
    </Phone>
  );
  const captions = steps.map((step, i) => (
    <Sequence key={step.text} from={step.from} durationInFrames={step.frames} layout="none">
      <Caption text={step.text} index={i} count={steps.length} size={captionSize} />
    </Sequence>
  ));

  return (
    <AbsoluteFill style={{ opacity: leave, transform: `translateY(${(1 - enter) * 120}px)` }}>
      {reel ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%", padding: "70px 80px 0" }}>
          <Brand size={34} />
          <div style={{ marginTop: 40 }}>{phone}</div>
          <div style={{ alignSelf: "stretch", marginTop: 44 }}>{captions}</div>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 50, height: "100%", padding: "0 60px" }}>
          {phone}
          <div style={{ flex: 1, display: "grid", gap: 40 }}>
            <Brand size={28} />
            <div>{captions}</div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const CROSSFADE = 10;

/** Fades a scene in on top of the previous one, which is still drawn underneath. */
const SceneFade = ({ children }: { children: React.ReactNode }) => {
  const frame = useCurrentFrame();
  return <div style={{ position: "absolute", inset: 0, background: T.paper, opacity: fadeIn(frame, CROSSFADE) }}>{children}</div>;
};

export type TutorialProps = { id: TutorialId; format: Format };

export const TutorialVideo = ({ id, format }: TutorialProps) => {
  const tutorial = tutorialById(id);
  const number = TUTORIALS.indexOf(tutorial) + 1;
  const { outroFrom, total } = timeline(tutorial);
  const { width } = useVideoConfig();
  // The app version is the feed layout, scaled down to the player's size.
  const layout: Exclude<Format, "app"> = format === "reel" ? "reel" : "feed";
  const base = FORMATS[layout];
  const shrink = width / base.width;
  const textScale = layout === "reel" ? 1 : 0.86;

  return (
    <AbsoluteFill style={{ background: T.paper }}>
      {FORMATS[format].music && (
        <Audio
          src={staticFile("music.m4a")}
          volume={(f) => 0.8 * interpolate(f, [0, 15, total - 45, total], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
      )}
      <div style={{ position: "absolute", width: base.width, height: base.height, transform: `scale(${shrink})`, transformOrigin: "top left" }}>
        <AbsoluteFill>
          <Sequence durationInFrames={INTRO}><Intro tutorial={tutorial} number={number} scale={textScale} /></Sequence>
          <Steps tutorial={tutorial} format={layout} />
          <Sequence from={outroFrom}><Outro scale={textScale} /></Sequence>
        </AbsoluteFill>
      </div>
    </AbsoluteFill>
  );
};

export const durationFor = (id: TutorialId) => timeline(tutorialById(id)).total;
export { FPS };
