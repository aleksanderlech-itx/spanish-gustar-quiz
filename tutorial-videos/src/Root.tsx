import { Composition } from "remotion";
import { TUTORIALS } from "../../app/tutorials.ts";
import { durationFor, FORMATS, FPS, TutorialVideo, type Format } from "./Tutorial";
import { LESSONS } from "./lessons/content";
import { LESSON_FORMATS, lessonDuration, LessonVideo, type LessonFormat } from "./lessons/Lesson";

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
    {LESSONS.flatMap((lesson) => (Object.keys(LESSON_FORMATS) as LessonFormat[]).map((format) => (
      <Composition
        key={`lesson-${lesson.id}-${format}`}
        id={`lesson-${lesson.id}-${format}`}
        component={LessonVideo}
        durationInFrames={lessonDuration(lesson.id)}
        fps={FPS}
        width={LESSON_FORMATS[format].width}
        height={LESSON_FORMATS[format].height}
        defaultProps={{ lesson: lesson.id, format }}
      />
    )))}
  </>
);
