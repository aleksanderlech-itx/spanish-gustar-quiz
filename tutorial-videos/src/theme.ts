import { continueRender, delayRender, staticFile } from "remotion";

/** Light-theme tokens from app/quiz-layout-fix.css; the clips always use light. */
export const T = {
  paper: "#F8EDE1",
  surface: "#FFFAF3",
  ink: "#0F172A",
  primary: "#0F766E",
  primarySoft: "#E8F3EF",
  muted: "#59534B",
  line: "#D6C9B8",
  control: "#807366",
  success: "#166534",
  successSoft: "#EAF4E6",
  error: "#991B1B",
  errorSoft: "#FDECE8",
  gold: "#F59E0B",
  sunSoft: "#FEF3D7",
  clay: "#C4553F",
  display: "Literata, Georgia, serif",
  body: "\"Atkinson Hyperlegible Next\", Arial, sans-serif",
};

export const FPS = 30;

let fontsRequested = false;
/** Loads the app's own Literata and Atkinson Hyperlegible Next (#111) before the first frame renders. */
export const loadFonts = () => {
  if (fontsRequested) return;
  fontsRequested = true;
  const handle = delayRender("Loading fonts");
  const faces = [
    new FontFace("Literata", `url(${staticFile("fonts/literata-latin.woff2")}) format("woff2")`, { weight: "400 700" }),
    new FontFace("Atkinson Hyperlegible Next", `url(${staticFile("fonts/atkinson-hyperlegible-next-latin.woff2")}) format("woff2")`, { weight: "400 800" }),
  ];
  Promise.all(faces.map((face) => face.load()))
    .then((loaded) => loaded.forEach((face) => document.fonts.add(face)))
    .finally(() => continueRender(handle));
};
