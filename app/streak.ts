const STREAK_KEY = "spanish-quiz-streak-v1";
const DAY_LETTERS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

const pad = (value: number) => String(value).padStart(2, "0");

export const dayKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const readDays = (): Set<string> => {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STREAK_KEY);
    const days = raw ? (JSON.parse(raw) as unknown) : [];
    return new Set(Array.isArray(days) ? days.filter((day): day is string => typeof day === "string") : []);
  } catch {
    return new Set();
  }
};

/** Marks today as a practised day. Call once per completed round or flashcard assessment. */
export const recordActivityToday = () => {
  if (typeof window === "undefined") return;
  const days = readDays();
  const today = dayKey(new Date());
  if (days.has(today)) return;
  days.add(today);
  try {
    window.localStorage.setItem(STREAK_KEY, JSON.stringify([...days]));
  } catch {
    // Storage can be unavailable (private mode, quota); the streak just won't persist this session.
  }
};

/** Consecutive practised days ending today, or ending yesterday if today is not done yet. */
export const currentStreak = (days: Set<string>, today = new Date()): number => {
  const cursor = new Date(today);
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

export type WeekDay = { letter: string; status: "done" | "today" | "future" };

/** Monday-start week containing `today`, for the streak panel's 7 day bars. */
export const weekBars = (days: Set<string>, today = new Date()): WeekDay[] => {
  const mondayOffset = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);
  const todayKey = dayKey(today);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const key = dayKey(date);
    const status: WeekDay["status"] = key === todayKey ? "today" : days.has(key) ? "done" : "future";
    return { letter: DAY_LETTERS[index], status };
  });
};

export type StreakSummary = { streak: number; completedToday: boolean; week: WeekDay[] };

export const readStreakSummary = (today = new Date()): StreakSummary => {
  const days = readDays();
  return {
    streak: currentStreak(days, today),
    completedToday: days.has(dayKey(today)),
    week: weekBars(days, today),
  };
};
