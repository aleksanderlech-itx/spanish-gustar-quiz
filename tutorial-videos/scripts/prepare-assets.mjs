// Copies the app's fonts and brand mark into this project's public/ folder, so the
// clips use exactly what the app ships without committing a second copy.
import { cpSync, mkdirSync } from "node:fs";

const app = new URL("../../public/", import.meta.url);
const here = new URL("../public/", import.meta.url);
mkdirSync(new URL("fonts/", here), { recursive: true });
mkdirSync(new URL("brand/", here), { recursive: true });
for (const file of ["fraunces-latin.woff2", "karla-latin.woff2"]) cpSync(new URL(`fonts/${file}`, app), new URL(`fonts/${file}`, here));
cpSync(new URL("brand/mark.svg", app), new URL("brand/mark.svg", here));
console.log("Copied fonts and brand mark from the app.");
