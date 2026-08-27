export type AnswerMode = "choose" | "type";
export type RoundLength = 5 | 10 | 20;
export type TopicSettings = { roundLength: RoundLength; mode: AnswerMode };

const DEFAULT_SETTINGS: TopicSettings = { roundLength: 5, mode: "type" };

const settingsKey = (quizId: string) => `${quizId}-topic-settings-v1`;

/** Per-topic round length and answer mode, set from the topic detail screen. */
export const readTopicSettings = (quizId: string): TopicSettings => {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(settingsKey(quizId));
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<TopicSettings>;
    const roundLength: RoundLength = parsed.roundLength === 10 || parsed.roundLength === 20 ? parsed.roundLength : 5;
    const mode: AnswerMode = parsed.mode === "choose" ? "choose" : "type";
    return { roundLength, mode };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const writeTopicSettings = (quizId: string, settings: TopicSettings) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(settingsKey(quizId), JSON.stringify(settings));
  } catch {
    // Storage can be unavailable (private mode, quota); the picker just won't persist this session.
  }
};
