// Synthesises the royalty-free background loop used under the tutorial clips:
// a soft Cmaj7–Am7–Fmaj7–G6 progression at 84 BPM with a pad, a plucked
// arpeggio, a quiet kick and a shaker. Writes public/music.m4a via ffmpeg.
import { writeFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const RATE = 44100;
const BPM = 84;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const CHORDS = [
  [48, 52, 55, 59], // Cmaj7
  [45, 48, 52, 55], // Am7
  [41, 45, 48, 52], // Fmaj7
  [43, 47, 50, 52], // G6
];
const BARS = 12; // ~34s, longer than any clip; the clips fade it out at their end.
const length = Math.ceil(BARS * BAR * RATE);
const left = new Float32Array(length);
const right = new Float32Array(length);
const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);

let seed = 7;
const noise = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 2 ** 31 - 1;
};

const add = (start, seconds, pan, fn) => {
  const from = Math.floor(start * RATE);
  const to = Math.min(length, from + Math.floor(seconds * RATE));
  for (let i = from; i < to; i += 1) {
    const value = fn((i - from) / RATE);
    left[i] += value * (1 - pan);
    right[i] += value * pan;
  }
};

for (let bar = 0; bar < BARS; bar += 1) {
  const chord = CHORDS[bar % CHORDS.length];
  const start = bar * BAR;

  // Pad: detuned sines with slow attack and release.
  chord.forEach((note, n) => {
    const f = hz(note + 12);
    add(start, BAR + 0.6, n % 2 ? 0.35 : 0.65, (t) => {
      const env = Math.min(1, t / 0.8) * Math.min(1, (BAR + 0.6 - t) / 0.8);
      return 0.045 * env * (Math.sin(2 * Math.PI * f * t) + 0.6 * Math.sin(2 * Math.PI * f * 1.003 * t));
    });
  });

  // Bass on the root.
  add(start, BAR, 0.5, (t) => {
    const env = Math.min(1, t / 0.05) * Math.exp(-t * 0.9);
    return 0.14 * env * Math.sin(2 * Math.PI * hz(chord[0] - 12) * t);
  });

  // Plucked arpeggio in eighth notes.
  for (let step = 0; step < 8; step += 1) {
    const note = chord[[0, 1, 2, 3, 2, 1, 2, 3][step]] + 24;
    const f = hz(note);
    add(start + step * (BEAT / 2), 1.2, step % 2 ? 0.3 : 0.7, (t) => {
      const env = Math.exp(-t * 5) * Math.min(1, t / 0.004);
      return 0.07 * env * (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(4 * Math.PI * f * t));
    });
  }

  // Soft kick on beats 1 and 3, shaker on the off-beats; both drop out in the first bar.
  if (bar === 0) continue;
  [0, 2].forEach((beat) => add(start + beat * BEAT, 0.4, 0.5, (t) => {
    const f = 40 + 50 * Math.exp(-t * 30);
    return 0.35 * Math.exp(-t * 9) * Math.sin(2 * Math.PI * f * t);
  }));
  for (let beat = 0; beat < 4; beat += 1) {
    let last = 0;
    add(start + beat * BEAT + BEAT / 2, 0.12, 0.6, (t) => {
      const raw = noise();
      const high = raw - last; // crude high-pass so it hisses instead of rumbling
      last = raw;
      return 0.05 * Math.exp(-t * 40) * high;
    });
  }
}

// Fade in/out and normalise to -3 dBFS.
const fade = 1.5 * RATE;
let peak = 0;
for (let i = 0; i < length; i += 1) {
  const g = Math.min(1, i / (0.3 * RATE), (length - i) / fade);
  left[i] *= g;
  right[i] *= g;
  peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
}
const gain = 0.708 / peak;

const data = Buffer.alloc(length * 4);
for (let i = 0; i < length; i += 1) {
  data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, left[i] * gain)) * 32767), i * 4);
  data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, right[i] * gain)) * 32767), i * 4 + 2);
}
const header = Buffer.alloc(44);
header.write("RIFF", 0);
header.writeUInt32LE(36 + data.length, 4);
header.write("WAVEfmt ", 8);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(2, 22);
header.writeUInt32LE(RATE, 24);
header.writeUInt32LE(RATE * 4, 28);
header.writeUInt16LE(4, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(data.length, 40);

const wav = join(tmpdir(), "tutorial-music.wav");
writeFileSync(wav, Buffer.concat([header, data]));
mkdirSync(new URL("../public/", import.meta.url), { recursive: true });
const out = new URL("../public/music.m4a", import.meta.url).pathname;
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", wav, "-c:a", "aac", "-b:a", "128k", out]);
console.log(`Wrote ${out} (${(length / RATE).toFixed(1)}s)`);
