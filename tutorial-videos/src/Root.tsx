import { Composition } from "remotion";
import { TUTORIALS } from "../../app/tutorials.ts";
import { durationFor, FORMATS, FPS, TutorialVideo, type Format } from "./Tutorial";

export const RemotionRoot = () => (
  <>
    {TUTORIALS.flatMap((tutorial) => (Object.keys(FORMATS) as Format[]).map((format) => (
      <Composition
        key={`${tutorial.id}-${format}`}
        id={`${tutorial.id}-${format}`}
        component={TutorialVideo}
        durationInFrames={durationFor(tutorial.id)}
        fps={FPS}
        width={FORMATS[format].width}
        height={FORMATS[format].height}
        defaultProps={{ id: tutorial.id, format }}
      />
    )))}
  </>
);
