# Tutorial videos

Renders the four short tutorials from issue #20 with [Remotion](https://www.remotion.dev/):
What's in the app, Play a round, Review what's due and Support the project.

The captions come straight from the steps in `../app/tutorials.ts`, so the clips, the How to Use
page and the welcome modal always say the same thing. Each step has one animated phone scene in
`src/scenes/`. The mockups use the app's light-theme tokens (`src/theme.ts`), fonts and brand mark.

## Formats

| Composition | Size | Use | Sound |
|---|---|---|---|
| `<id>-reel` | 1080×1920 (9:16) | Instagram/Facebook Reels and Stories | Music |
| `<id>-feed` | 1080×1350 (4:5) | Instagram/Facebook feed posts | Music |
| `<id>-app` | 720×900 (4:5) | The player on `/how-to-use` | Music |

`<id>` is one of `features`, `how-to-use`, `activities-review`, `support`.

## Commands

This folder has its own dependencies, separate from the app.

```sh
cd tutorial-videos
npm ci
npm run studio            # preview and scrub the clips in the browser
npm run render            # render every clip to out/; copies the app clips and posters to ../public/tutorials/
npm run render -- support # render only the listed tutorials
npm run render -- --app   # render only the in-app clips and posters
npm run render -- --stills  # a few PNG frames per clip in out/stills/, for checking layout
```

Rendering needs Chrome. Remotion downloads its own unless `REMOTION_BROWSER` points to a
Chrome or Chromium binary, for example
`REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`.

Renders are written to `out/`, which is not committed. Two copies are:

- the app clips and their posters, under `../public/tutorials/`
- `exports/spanish-quizzes-tutorials.zip`, all 12 clips (reel, feed and app) for uploading to Instagram or
  Facebook. It's a snapshot: after re-rendering, rebuild it with
  `cd out && zip -0 ../exports/spanish-quizzes-tutorials.zip *-reel.mp4 *-feed.mp4 *-app.mp4`.
  It stays out of `../public/` because Cloudflare Workers rejects static files over 25 MiB.

## Activity launch lessons

`src/lessons/` holds a 35-second grammar mini-lesson for each new activity in the roadmap
(issue #65), as `lesson-<id>-reel` (9:16) and `lesson-<id>-feed` (4:5). The slides live in
`src/lessons/content.ts`; the post titles, captions and hashtags are in
[SOCIAL-POSTS.md](SOCIAL-POSTS.md).

```sh
npm run render:lessons                     # out/lessons/<id>-reel.mp4 and <id>-feed.mp4
npm run render:lessons -- reflexive-verbs  # only the listed lessons
npm run render:lessons -- --stills         # PNG frames in out/lessons/stills/
```

`npm run render` skips the lessons. `exports/activity-launch-videos.zip` holds all six clips for upload; rebuild it after re-rendering with
`zip -0 -j exports/activity-launch-videos.zip out/lessons/*.mp4`.

## Changing a tutorial

1. Edit the step text in `../app/tutorials.ts`.
2. If you add or remove a step, add or remove its scene in `SCENES` in `src/Tutorial.tsx`. The app
   test `tests/tutorials.test.mjs` fails if the counts differ.
3. Run `npm run render` and commit the updated files in `../public/tutorials/`.

## Music

`public/music.mp3` is ["Old School Salsa 03"](https://pixabay.com/music/salsa-old-school-salsa-03-499570/) by
vjgalaxy, from Pixabay, used under the [Pixabay Content License](https://pixabay.com/service/license-summary/).
That licence lets you use it in videos without crediting the artist, though a credit in the post is welcome.

Each clip plays the track from its start, at 56% volume, and fades it out over the last 1.5 seconds.
To use a different track, replace the file and keep the name.
