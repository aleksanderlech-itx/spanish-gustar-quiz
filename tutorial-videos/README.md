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
| `<id>-app` | 720×900 (4:5) | The player on `/how-to-use` | None |

`<id>` is one of `features`, `how-to-use`, `activities-review`, `support`.

## Commands

This folder has its own dependencies, separate from the app.

```sh
cd tutorial-videos
npm ci
npm run studio            # preview and scrub the clips in the browser
npm run render            # render every clip to out/; copies the app clips and posters to ../public/tutorials/
npm run render -- support # render only the listed tutorials
npm run render -- --stills  # a few PNG frames per clip in out/stills/, for checking layout
npm run music             # regenerate public/music.m4a
```

Rendering needs Chrome. Remotion downloads its own unless `REMOTION_BROWSER` points to a
Chrome or Chromium binary, for example
`REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`.

The social clips are written to `out/` and not committed. Upload them from there. Only the small app
clips and their posters are committed, under `../public/tutorials/`.

## Changing a tutorial

1. Edit the step text in `../app/tutorials.ts`.
2. If you add or remove a step, add or remove its scene in `SCENES` in `src/Tutorial.tsx`. The app
   test `tests/tutorials.test.mjs` fails if the counts differ.
3. Run `npm run render` and commit the updated files in `../public/tutorials/`.

## Music

`public/music.m4a` is synthesised by `scripts/make-music.mjs`: a soft 84 BPM progression with a pad,
a plucked arpeggio, a kick and a shaker. It is generated entirely from code, with no third-party
samples. To use a different track, replace the file and keep the name.
