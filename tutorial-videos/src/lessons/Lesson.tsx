import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { FPS, loadFonts, T } from "../theme";
import { Enter, Mark, useSpring } from "../ui";
import { LESSONS, type Lesson, type Line, type Slide } from "./content";

loadFonts();

export type LessonFormat = "reel" | "feed";
export const LESSON_FORMATS: Record<LessonFormat, { width: number; height: number }> = {
  reel: { width: 1080, height: 1920 }, // Instagram/FB Reels and Stories, 9:16
  feed: { width: 1080, height: 1350 }, // Instagram/FB feed posts, 4:5
};

/** The editorial card corners from docs/design-system-gpt, doubled for 1080px video. */
const EDITORIAL = "36px 52px 28px 52px";
const LINE_SOFT = "#D6C9B8";
const SEGMENT = "#E8DED1";

const INTRO = 105;
const OUTRO = 120;
const FADE = 10;

/** Long enough to read the slide at a relaxed pace. */
const slideFrames = (slide: Slide) => {
  switch (slide.kind) {
    case "table": return 6 * FPS;
    case "list": return 5.5 * FPS;
    case "examples": return (2.2 + slide.lines.length * 1.6) * FPS;
    case "contrast": return (2.4 + slide.pairs.length * 1.8) * FPS;
    case "quiz": return 7 * FPS;
  }
};

const timeline = (lesson: Lesson) => {
  let at = INTRO;
  const slides = lesson.slides.map((slide) => {
    const entry = { slide, from: at, frames: Math.round(slideFrames(slide)) };
    at += entry.frames;
    return entry;
  });
  return { slides, outroFrom: at, total: at + OUTRO };
};

export const lessonById = (id: string) => {
  const lesson = LESSONS.find((l) => l.id === id);
  if (!lesson) throw new Error(`Unknown lesson ${id}`);
  return lesson;
};
export const lessonDuration = (id: string) => timeline(lessonById(id)).total;

/** Spanish text with *marked* parts set in teal. */
const Es = ({ text, color = T.primary }: { text: string; color?: string }) => (
  <>
    {text.split(/(\*[^*]+\*)/).map((part, i) =>
      part.startsWith("*") ? <span key={i} style={{ color }}>{part.slice(1, -1)}</span> : <span key={i}>{part}</span>,
    )}
  </>
);

const Eyebrow = ({ children, s }: { children: ReactNode; s: number }) => (
  <div style={{ fontFamily: T.body, fontSize: 30 * s, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: T.primary }}>{children}</div>
);

const Title = ({ children, s }: { children: ReactNode; s: number }) => (
  <div style={{ marginTop: 10 * s, fontFamily: T.display, fontSize: 68 * s, fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.015em", color: T.ink }}>{children}</div>
);

const Card = ({ children, s, style }: { children: ReactNode; s: number; style?: CSSProperties }) => (
  <div style={{ padding: 44 * s, border: `2px solid ${LINE_SOFT}`, borderRadius: EDITORIAL, background: T.surface, boxShadow: "0 8px 28px rgb(15 23 42 / 8%)", ...style }}>{children}</div>
);

const TableSlide = ({ slide, s }: { slide: Extract<Slide, { kind: "table" }>; s: number }) => (
  <>
    <Enter><Eyebrow s={s}>{slide.eyebrow}</Eyebrow><Title s={s}>{slide.title}</Title></Enter>
    <Enter delay={6} style={{ marginTop: 40 * s }}>
      <Card s={s} style={{ padding: `${20 * s}px ${44 * s}px` }}>
        {slide.rows.map(([person, form], i) => (
          <Enter key={person} delay={10 + i * 6} distance={16}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 24, padding: `${18 * s}px 0`, borderTop: i ? `2px solid ${LINE_SOFT}` : "none" }}>
              <span style={{ fontFamily: T.body, fontSize: 34 * s, color: T.muted }}>{person}</span>
              <span style={{ fontFamily: T.display, fontSize: 50 * s, fontWeight: 600, color: T.ink }}><Es text={form} /></span>
            </div>
          </Enter>
        ))}
      </Card>
    </Enter>
    <Enter delay={52} style={{ marginTop: 32 * s, fontFamily: T.body, fontSize: 36 * s, fontWeight: 600, color: T.muted }}>{slide.note}</Enter>
  </>
);

const ListSlide = ({ slide, s }: { slide: Extract<Slide, { kind: "list" }>; s: number }) => (
  <>
    <Enter><Eyebrow s={s}>{slide.eyebrow}</Eyebrow><Title s={s}>{slide.title}</Title></Enter>
    <div style={{ marginTop: 40 * s, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 * s }}>
      {slide.items.map(([from, to], i) => (
        <Enter key={from} delay={8 + i * 6} distance={16}>
          <Card s={s} style={{ padding: `${26 * s}px ${32 * s}px`, borderRadius: i % 2 ? "28px 52px 36px 52px" : EDITORIAL }}>
            <div style={{ fontFamily: T.body, fontSize: 32 * s, color: T.muted }}>{from}</div>
            <div style={{ marginTop: 4 * s, fontFamily: T.display, fontSize: 54 * s, fontWeight: 600, color: T.ink }}><Es text={to} /></div>
          </Card>
        </Enter>
      ))}
    </div>
    {slide.note && <Enter delay={50} style={{ marginTop: 32 * s, fontFamily: T.body, fontSize: 36 * s, fontWeight: 600, color: T.muted }}>{slide.note}</Enter>}
  </>
);

const Sentence = ({ line, s, size = 52 }: { line: Line; s: number; size?: number }) => (
  <>
    <div style={{ display: "flex", alignItems: "baseline", gap: 18 * s, fontFamily: T.display, fontSize: size * s, fontWeight: 600, lineHeight: 1.15, color: line.wrong ? T.error : T.ink }}>
      {line.wrong && <span style={{ fontFamily: T.body, fontWeight: 800 }}>✕</span>}
      <span style={{ textDecoration: line.wrong ? `line-through ${4 * s}px` : "none" }}><Es text={line.es} /></span>
    </div>
    {line.en && <div style={{ marginTop: 8 * s, fontFamily: T.body, fontSize: 34 * s, color: T.muted }}>{line.en}</div>}
  </>
);

const ExamplesSlide = ({ slide, s }: { slide: Extract<Slide, { kind: "examples" }>; s: number }) => (
  <>
    <Enter><Eyebrow s={s}>{slide.eyebrow}</Eyebrow><Title s={s}>{slide.title}</Title></Enter>
    <div style={{ marginTop: 40 * s, display: "grid", gap: 26 * s }}>
      {slide.lines.map((line, i) => (
        <Enter key={line.es} delay={12 + i * 40} distance={20}>
          <Card s={s} style={{ padding: `${32 * s}px ${40 * s}px`, borderColor: line.wrong ? T.error : LINE_SOFT, background: line.wrong ? T.errorSoft : T.surface }}>
            {line.note && (
              <div style={{ marginBottom: 12 * s, fontFamily: T.body, fontSize: 28 * s, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: line.wrong ? T.error : T.clay }}>{line.note}</div>
            )}
            <Sentence line={line} s={s} />
          </Card>
        </Enter>
      ))}
    </div>
  </>
);

const ContrastSlide = ({ slide, s }: { slide: Extract<Slide, { kind: "contrast" }>; s: number }) => (
  <>
    <Enter><Eyebrow s={s}>{slide.eyebrow}</Eyebrow><Title s={s}>{slide.title}</Title></Enter>
    <Enter delay={8} style={{ marginTop: 36 * s, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 * s }}>
      {slide.labels.map((label) => (
        <div key={label} style={{ fontFamily: T.body, fontSize: 28 * s, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: T.clay }}>{label}</div>
      ))}
    </Enter>
    <div style={{ marginTop: 14 * s, display: "grid", gap: 22 * s }}>
      {slide.pairs.map(([a, b], i) => (
        <Enter key={a.es} delay={16 + i * 40} distance={20} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 * s }}>
          <Card s={s} style={{ padding: `${28 * s}px ${30 * s}px` }}><Sentence line={a} s={s} size={44} /></Card>
          <Card s={s} style={{ padding: `${28 * s}px ${30 * s}px`, background: T.primarySoft, borderColor: T.primary }}><Sentence line={b} s={s} size={44} /></Card>
        </Enter>
      ))}
    </div>
  </>
);

/** The option lights up 3.5s in, the moment a learner would check the answer. */
const REVEAL = 3.5 * FPS;

const QuizSlide = ({ slide, s }: { slide: Extract<Slide, { kind: "quiz" }>; s: number }) => {
  const frame = useCurrentFrame();
  const revealed = frame >= REVEAL;
  const pop = useSpring(REVEAL, 14);
  const [before, after] = slide.prompt.split("___");
  const countdown = Math.max(0, Math.ceil((REVEAL - frame) / FPS));
  return (
    <>
      <Enter><Eyebrow s={s}>Your turn</Eyebrow><Title s={s}>Fill the gap</Title></Enter>
      <Enter delay={6} style={{ marginTop: 40 * s }}>
        <Card s={s}>
          <div style={{ fontFamily: T.display, fontSize: 64 * s, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.015em", color: T.ink }}>
            {before}
            <span style={{ display: "inline-block", minWidth: 150 * s, padding: `0 ${12 * s}px`, borderBottom: `${5 * s}px solid ${revealed ? T.success : T.primary}`, color: T.success, textAlign: "center" }}>
              {revealed ? slide.answer : " "}
            </span>
            {after}
          </div>
          <div style={{ marginTop: 16 * s, fontFamily: T.body, fontSize: 36 * s, color: T.muted }}>{slide.en}</div>
        </Card>
      </Enter>
      <div style={{ marginTop: 30 * s, display: "grid", gap: 18 * s }}>
        {slide.options.map((option, i) => {
          const right = revealed && option === slide.answer;
          const faded = revealed && !right;
          return (
            <Enter key={option} delay={16 + i * 6} distance={16}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  minHeight: 112 * s,
                  padding: `0 ${36 * s}px`,
                  border: `3px solid ${right ? T.success : T.control}`,
                  borderRadius: 20,
                  background: right ? T.successSoft : T.surface,
                  opacity: faded ? 0.45 : 1,
                  transform: right ? `scale(${1 + 0.03 * Math.sin(Math.min(1, pop) * Math.PI)})` : "none",
                  fontFamily: T.body,
                  fontSize: 46 * s,
                  fontWeight: 700,
                  color: right ? T.success : T.ink,
                }}
              >
                <span>{option}</span>
                {right && <span style={{ fontSize: 30 * s, letterSpacing: "0.12em" }}>✓ CORRECT</span>}
              </div>
            </Enter>
          );
        })}
      </div>
      <div style={{ marginTop: 30 * s, minHeight: 50 * s, fontFamily: T.body, fontSize: 38 * s, fontWeight: 600, color: revealed ? T.ink : T.muted }}>
        {revealed ? <Enter>{slide.why}</Enter> : <span>Answer in {countdown}…</span>}
      </div>
    </>
  );
};

const SlideView = ({ slide, s }: { slide: Slide; s: number }) => {
  switch (slide.kind) {
    case "table": return <TableSlide slide={slide} s={s} />;
    case "list": return <ListSlide slide={slide} s={s} />;
    case "examples": return <ExamplesSlide slide={slide} s={s} />;
    case "contrast": return <ContrastSlide slide={slide} s={s} />;
    case "quiz": return <QuizSlide slide={slide} s={s} />;
  }
};

/** Fades a whole slide out over its last frames so the next one starts clean. */
const FadeOut = ({ frames, children }: { frames: number; children: ReactNode }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [frames - FADE, frames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

const Brand = ({ s }: { s: number }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14 * s, fontFamily: T.display, fontSize: 38 * s, fontWeight: 600, color: T.ink }}>
    <Mark size={46 * s} /> Spanish Quizzes
  </div>
);

/** Segmented progress through the lesson, like the in-round step strip. */
const Steps = ({ lesson, s }: { lesson: Lesson; s: number }) => {
  const frame = useCurrentFrame();
  const { slides } = timeline(lesson);
  return (
    <div style={{ display: "flex", gap: 10 * s }}>
      {slides.map(({ from, frames }) => {
        const p = interpolate(frame, [from, from + frames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={from} style={{ flex: 1, height: 10 * s, borderRadius: 999, background: SEGMENT, overflow: "hidden" }}>
            <div style={{ width: `${p * 100}%`, height: "100%", background: T.primary }} />
          </div>
        );
      })}
    </div>
  );
};

const Intro = ({ lesson, s }: { lesson: Lesson; s: number }) => (
  <FadeOut frames={INTRO}>
    <AbsoluteFill style={{ justifyContent: "center", padding: `0 ${90 * s}px` }}>
      <Enter delay={0}>
        <span style={{ display: "inline-block", padding: `${10 * s}px ${26 * s}px`, borderRadius: 999, background: T.gold, fontFamily: T.body, fontSize: 30 * s, fontWeight: 800, letterSpacing: "0.12em", color: T.ink }}>NEW ACTIVITY</span>
      </Enter>
      <Enter delay={8}><div style={{ marginTop: 34 * s, fontFamily: T.display, fontSize: 132 * s, fontWeight: 600, lineHeight: 1, letterSpacing: "-0.02em", color: T.ink }}>{lesson.title}</div></Enter>
      <Enter delay={16}><div style={{ marginTop: 34 * s, fontFamily: T.body, fontSize: 46 * s, lineHeight: 1.35, color: T.muted }}><Es text={lesson.hook} /></div></Enter>
      <Enter delay={24} style={{ marginTop: 50 * s, width: 160 * s, height: 10 * s, borderRadius: 999, background: T.clay }}><span /></Enter>
    </AbsoluteFill>
  </FadeOut>
);

const Outro = ({ lesson, s }: { lesson: Lesson; s: number }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center", padding: `0 ${80 * s}px` }}>
    <Enter delay={0}><Mark size={150 * s} /></Enter>
    <Enter delay={6} style={{ marginTop: 40 * s }}><div style={{ fontFamily: T.display, fontSize: 92 * s, fontWeight: 600, lineHeight: 1.05, color: T.ink }}>{lesson.title}</div></Enter>
    <Enter delay={12} style={{ marginTop: 22 * s }}><div style={{ fontFamily: T.body, fontSize: 44 * s, lineHeight: 1.35, color: T.muted }}>150 practice sentences<br />Choose or Type · Free, no sign-up</div></Enter>
    <Enter delay={18} style={{ marginTop: 48 * s }}>
      <div style={{ padding: `${22 * s}px ${48 * s}px`, borderRadius: 20, background: T.primary, color: "#FFFFFF", fontFamily: T.body, fontSize: 52 * s, fontWeight: 800 }}>spanish-quizz.es</div>
    </Enter>
  </AbsoluteFill>
);

export type LessonProps = { lesson: string; format: LessonFormat };

export const LessonVideo = ({ lesson: id, format }: LessonProps) => {
  const lesson = lessonById(id);
  const { slides, outroFrom, total } = timeline(lesson);
  const reel = format === "reel";
  const s = reel ? 1.18 : 0.8;
  const frame = useCurrentFrame();
  const chrome = interpolate(frame, [INTRO - 10, INTRO, outroFrom - FADE, outroFrom], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: T.paper }}>
      <Audio
        src={staticFile("music.mp3")}
        volume={(f) => 0.56 * interpolate(f, [0, 15, total - 45, total], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      <Sequence durationInFrames={INTRO}><Intro lesson={lesson} s={s} /></Sequence>

      <AbsoluteFill style={{ padding: reel ? "110px 80px 120px" : "56px 64px 56px", opacity: chrome }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Brand s={s} />
          <span style={{ fontFamily: T.body, fontSize: 28 * s, fontWeight: 700, letterSpacing: "0.12em", color: T.muted }}>{lesson.title.toUpperCase()}</span>
        </div>
        <div style={{ marginTop: 28 * s }}><Steps lesson={lesson} s={s} /></div>
      </AbsoluteFill>

      {slides.map(({ slide, from, frames }) => (
        <Sequence key={from} from={from} durationInFrames={frames}>
          <FadeOut frames={frames}>
            <AbsoluteFill style={{ justifyContent: "center", padding: reel ? "260px 80px 160px" : "170px 64px 70px" }}>
              <SlideView slide={slide} s={s} />
            </AbsoluteFill>
          </FadeOut>
        </Sequence>
      ))}

      {reel && (
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 110, opacity: chrome }}>
          <span style={{ fontFamily: T.body, fontSize: 32, fontWeight: 700, color: T.muted }}>spanish-quizz.es</span>
        </AbsoluteFill>
      )}

      <Sequence from={outroFrom}><Outro lesson={lesson} s={s} /></Sequence>
    </AbsoluteFill>
  );
};
