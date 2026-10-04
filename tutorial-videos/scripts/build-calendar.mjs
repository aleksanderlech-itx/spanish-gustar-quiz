// Builds launch-posts.ics from the publishing plan in SOCIAL-POSTS.md: one event per
// Reel or feed post, at its time in Europe/Madrid, with the title, caption and clip in
// the description and a reminder an hour before.
//
//   node scripts/build-calendar.mjs
import { readFileSync, writeFileSync } from "node:fs";

const md = readFileSync(new URL("../SOCIAL-POSTS.md", import.meta.url), "utf8");
const MONTHS = { Oct: "10", Nov: "11", Dec: "12" };

// "### Reel — Mon 19 Oct, 12:00 — `reflexive-verbs-reel.mp4`", then **Title:** and a ``` caption block.
const heading = /^### (Reel|Feed post) — \w{3} (\d{1,2}) (\w{3}), (\d{2}):(\d{2}) — `([^`]+)`$/gm;
const events = [];
for (const m of md.matchAll(heading)) {
  const [, format, day, month, hh, mm, clip] = m;
  const rest = md.slice(m.index + m[0].length);
  const title = rest.match(/\*\*Title:\*\* (.+)/)[1].trim();
  const caption = rest.match(/```\n([\s\S]*?)\n```/)[1];
  const activity = [...md.slice(0, m.index).matchAll(/^## Cycle \d+ · (.+?) · /gm)].pop()[1];
  events.push({ format, date: `2026${MONTHS[month]}${day.padStart(2, "0")}`, time: `${hh}${mm}00`, clip, title, caption, activity });
}
if (events.length === 0) throw new Error("No posts found in SOCIAL-POSTS.md");

const escape = (s) => s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
// RFC 5545 lines are at most 75 octets; continuation lines start with a space.
const fold = (line) => {
  const bytes = Buffer.from(line, "utf8");
  if (bytes.length <= 75) return line;
  const parts = [];
  let start = 0;
  while (start < bytes.length) {
    let end = Math.min(start + (start === 0 ? 75 : 74), bytes.length);
    while (end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--; // don't split a UTF-8 character
    parts.push(bytes.subarray(start, end).toString("utf8"));
    start = end;
  }
  return parts.join("\r\n ");
};

const lines = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "PRODID:-//Spanish Quizzes//Launch posts//EN",
  "CALSCALE:GREGORIAN",
  "METHOD:PUBLISH",
  "X-WR-CALNAME:Spanish Quizzes launch posts",
  "X-WR-TIMEZONE:Europe/Madrid",
  "BEGIN:VTIMEZONE",
  "TZID:Europe/Madrid",
  "BEGIN:DAYLIGHT",
  "TZOFFSETFROM:+0100",
  "TZOFFSETTO:+0200",
  "TZNAME:CEST",
  "DTSTART:19700329T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
  "END:DAYLIGHT",
  "BEGIN:STANDARD",
  "TZOFFSETFROM:+0200",
  "TZOFFSETTO:+0100",
  "TZNAME:CET",
  "DTSTART:19701025T030000",
  "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
  "END:STANDARD",
  "END:VTIMEZONE",
];
for (const e of events) {
  const end = `${e.time.slice(0, 2)}3000`; // 30 minutes
  const description = [
    `Publish on Instagram and Facebook: ${e.format}.`,
    `Only if ${e.activity.toLowerCase()} is live on spanish-quizz.es. If the release slipped, move this event by the same number of days.`,
    "",
    `Clip: ${e.clip} (tutorial-videos/exports/activity-launch-videos.zip)`,
    `Title: ${e.title}`,
    "",
    "Caption:",
    e.caption,
  ].join("\n");
  lines.push(
    "BEGIN:VEVENT",
    `UID:${e.clip.replace(".mp4", "")}-${e.date}@spanish-quizz.es`,
    "DTSTAMP:20261004T160000Z",
    `DTSTART;TZID=Europe/Madrid:${e.date}T${e.time}`,
    `DTEND;TZID=Europe/Madrid:${e.date}T${end}`,
    `SUMMARY:${escape(`Post ${e.format === "Reel" ? "Reel" : "feed post"}: ${e.activity}`)}`,
    `DESCRIPTION:${escape(description)}`,
    "URL:https://spanish-quizz.es",
    "TRANSP:TRANSPARENT",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escape(`Post the ${e.activity} ${e.format === "Reel" ? "Reel" : "feed post"} in 1 hour`)}`,
    "TRIGGER:-PT1H",
    "END:VALARM",
    "END:VEVENT",
  );
}
lines.push("END:VCALENDAR");
writeFileSync(new URL("../launch-posts.ics", import.meta.url), lines.map(fold).join("\r\n") + "\r\n");
console.log(`launch-posts.ics: ${events.length} events`);
