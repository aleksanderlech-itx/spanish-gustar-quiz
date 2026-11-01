import { appStorage, isTestMode } from "./storage.ts";

export type AnswerMode = "choose" | "type";
export type RoundLength = 5 | 10 | 20;
export type TopicSettings = { roundLength: RoundLength; mode: AnswerMode };

export const DEFAULT_SETTINGS: TopicSettings = { roundLength: 5, mode: "type" };

const settingsKey = (quizId: string) => `${quizId}-topic-settings-v1`;

/** Defaults for a topic with nothing saved. Test mode starts in choice mode, where the correct option is
 * highlighted for testers who do not read Spanish; normal mode keeps typed answers. */
const defaultSettings = (): TopicSettings => (isTestMode() ? { ...DEFAULT_SETTINGS, mode: "choose" } : DEFAULT_SETTINGS);

/** Per-topic round length and answer mode, set from the topic detail screen. */
export const readTopicSettings = (quizId: string): TopicSettings => {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = appStorage.getItem(settingsKey(quizId));
    if (!raw) return defaultSettings();
    const parsed = JSON.parse(raw) as Partial<TopicSettings>;
    const roundLength: RoundLength = parsed.roundLength === 10 || parsed.roundLength === 20 ? parsed.roundLength : 5;
    const mode: AnswerMode = parsed.mode === "choose" || parsed.mode === "type" ? parsed.mode : defaultSettings().mode;
    return { roundLength, mode };
  } catch {
    return defaultSettings();
  }
};

export const writeTopicSettings = (quizId: string, settings: TopicSettings) => {
  if (typeof window === "undefined") return;
  try {
    appStorage.setItem(settingsKey(quizId), JSON.stringify(settings));
  } catch {
    // Storage can be unavailable (private mode, quota); the picker just won't persist this session.
  }
};
