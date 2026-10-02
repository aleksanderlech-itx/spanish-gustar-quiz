// Renders every tutorial in every format.
//
//   npm run render                 → out/<id>-<format>.mp4 for all clips, then copies
//                                    the app versions and their posters into ../public/tutorials/
//   npm run render -- features     → only the tutorials whose id is listed
//   npm run render -- --stills     → out/stills/*.png, a few frames per step, for checking layout
//
// Set REMOTION_BROWSER to a Chrome/Chromium binary to skip Remotion's own download.
import { copyFileSync, mkdirSync } from "node:fs";
import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia, renderStill } from "@remotion/renderer";

const args = process.argv.slice(2);
const stills = args.includes("--stills");
const only = args.filter((arg) => !arg.startsWith("--"));
const browserExecutable = process.env.REMOTION_BROWSER || null;

const out = new URL("../out/", import.meta.url).pathname;
const appPublic = new URL("../../public/tutorials/", import.meta.url).pathname;
mkdirSync(`${out}stills`, { recursive: true });

console.log("Bundling…");
const serveUrl = await bundle({ entryPoint: new URL("../src/index.ts", import.meta.url).pathname });
const compositions = (await getCompositions(serveUrl, { browserExecutable }))
  .filter((c) => only.length === 0 || only.includes(c.defaultProps.id));

/** The poster frame: 2s into the first step, once its scene has settled (the intro is 75 frames). */
const posterFrame = () => 75 + 60;

for (const composition of compositions) {
  const { id } = composition;
  if (stills) {
    if (composition.defaultProps.format === "app") continue;
    const frames = [40, posterFrame()];
    for (let f = 260; f < composition.durationInFrames; f += 60) frames.push(f);
    for (const frame of frames) {
      await renderStill({ composition, serveUrl, frame, output: `${out}stills/${id}-${String(frame).padStart(4, "0")}.png`, browserExecutable });
    }
    console.log(`Stills: ${id} (${frames.length})`);
    continue;
  }

  const app = composition.defaultProps.format === "app";
  const output = `${out}${id}.mp4`;
  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation: output,
    browserExecutable,
    muted: app,
    // The in-app clips are small and silent; the social ones keep full quality.
    crf: app ? 28 : 18,
    onProgress: ({ progress }) => process.stdout.write(`\r${id} ${Math.round(progress * 100)}%`),
  });
  process.stdout.write("\n");

  if (app) {
    const tutorialId = composition.defaultProps.id;
    mkdirSync(appPublic, { recursive: true });
    copyFileSync(output, `${appPublic}${tutorialId}.mp4`);
    await renderStill({ composition, serveUrl, frame: posterFrame(), output: `${appPublic}${tutorialId}-poster.jpg`, imageFormat: "jpeg", jpegQuality: 82, browserExecutable });
  }
}
console.log("Done.");
