// Renders the grammar mini-lessons that announce each new activity (src/lessons/).
//
//   npm run render:lessons                    → out/lessons/<id>-reel.mp4 and <id>-feed.mp4 for every lesson
//   npm run render:lessons -- reflexive-verbs → only the lessons whose id is listed
//   npm run render:lessons -- --stills        → out/lessons/stills/*.png, a frame per slide, for checking layout
//
// Set REMOTION_BROWSER to a Chrome/Chromium binary to skip Remotion's own download.
import { mkdirSync } from "node:fs";
import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia, renderStill } from "@remotion/renderer";

const args = process.argv.slice(2);
const stills = args.includes("--stills");
const only = args.filter((arg) => !arg.startsWith("--"));
const browserExecutable = process.env.REMOTION_BROWSER || null;

const out = new URL("../out/lessons/", import.meta.url).pathname;
mkdirSync(`${out}stills`, { recursive: true });

console.log("Bundling…");
const serveUrl = await bundle({ entryPoint: new URL("../src/index.ts", import.meta.url).pathname });
const compositions = (await getCompositions(serveUrl, { browserExecutable }))
  .filter((c) => c.id.startsWith("lesson-"))
  .filter((c) => only.length === 0 || only.includes(c.defaultProps.lesson));

for (const composition of compositions) {
  const name = composition.id.replace(/^lesson-/, "");
  if (stills) {
    const frames = [];
    for (let f = 60; f < composition.durationInFrames; f += 75) frames.push(f);
    for (const frame of frames) {
      await renderStill({ composition, serveUrl, frame, output: `${out}stills/${name}-${String(frame).padStart(4, "0")}.png`, browserExecutable });
    }
    console.log(`Stills: ${name} (${frames.length})`);
    continue;
  }
  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation: `${out}${name}.mp4`,
    browserExecutable,
    crf: 20,
    onProgress: ({ progress }) => process.stdout.write(`\r${name} ${Math.round(progress * 100)}%`),
  });
  process.stdout.write("\n");
}
console.log("Done.");
