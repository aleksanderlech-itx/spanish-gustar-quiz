const STREAK_KEY = "spanish-quiz-streak-v2";
const DAY_LETTERS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

export const ACTIVITY_IDS = ["gustar", "ser-estar", "preterite-imperfect", "flashcards"] as const;
export type ActivityId = (typeof ACTIVITY_IDS)[number];

/** dayKey -> activities completed that day. The daily goal is reaching every activity, not just one. */
export type Records = Map<string, Set<ActivityId>>;

const pad = (value: number) => String(value).padStart(2, "0");

export const dayKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const isActivityId = (value: unknown): value is ActivityId => (ACTIVITY_IDS as readonly string[]).includes(value as string);

const isDayComplete = (record: Set<ActivityId> | undefined) => !!record && ACTIVITY_IDS.every((id) => record.has(id));

const readRecords = (): Records => {
  if (typeof window === "undefined") return new Map();
  try {
    const raw = window.localStorage.getItem(STREAK_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : {};
    const records: Records = new Map();
    if (parsed && typeof parsed === "object") {
      for (const [day, activities] of Object.entries(parsed as Record<string, unknown>)) {
        if (!Array.isArray(activities)) continue;
        const valid = activities.filter(isActivityId);
        if (valid.length) records.set(day, new Set(valid));
      }
    }
    return records;
  } catch {
    return new Map();
  }
};

const writeRecords = (records: Records) => {
  try {
    const obj: Record<string, ActivityId[]> = {};
    records.forEach((set, day) => { obj[day] = [...set]; });
    window.localStorage.setItem(STREAK_KEY, JSON.stringify(obj));
  } catch {
    // Storage can be unavailable (private mode, quota); the streak just won't persist this session.
  }
};

/** Marks one activity's round/session done today. Call once per completed round or flashcard session. */
export const recordActivityToday = (activity: ActivityId) => {
  if (typeof window === "undefined") return;
  mergeActivityDays([{ activity, day: dayKey(new Date()) }]);
};

/**
 * Adds activity/day pairs to the ledger without ever removing what's already there — a
 * day's recorded activities only grow. Used both for the live recordActivityToday write
 * and for backfilling the whole ledger from each quiz/flashcard's own stored history, so
 * a day that was actually completed still counts even if its live write never landed
 * (an old app version, a closed tab, storage cleared for just this key).
 */
export const mergeActivityDays = (entries: Array<{ activity: ActivityId; day: string }>) => {
  if (typeof window === "undefined" || !entries.length) return;
  const records = readRecords();
  let changed = false;
  for (const { activity, day } of entries) {
    const set = records.get(day) ?? new Set<ActivityId>();
    if (set.has(activity)) continue;
    set.add(activity);
    records.set(day, set);
    changed = true;
  }
  if (changed) writeRecords(records);
};

/** Consecutive days ending today (or yesterday, if today isn't fully done yet) where every activity was completed. */
export const currentStreak = (records: Records, today = new Date()): number => {
  const cursor = new Date(today);
  if (!isDayComplete(records.get(dayKey(cursor)))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (isDayComplete(records.get(dayKey(cursor)))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

export type WeekDay = { letter: string; status: "done" | "today" | "future"; doneCount: number; total: number };

/** Monday-start week containing `today`, for the streak panel's 7 day bars. */
export const weekBars = (records: Records, today = new Date()): WeekDay[] => {
  const mondayOffset = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);
  const todayKey = dayKey(today);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const key = dayKey(date);
    const record = records.get(key);
    const status: WeekDay["status"] = key === todayKey ? "today" : isDayComplete(record) ? "done" : "future";
    return { letter: DAY_LETTERS[index], status, doneCount: record?.size ?? 0, total: ACTIVITY_IDS.length };
  });
};

export type StreakSummary = {
  streak: number;
  completedToday: boolean;
  todayDone: number;
  todayTotal: number;
  week: WeekDay[];
};

export const readStreakSummary = (today = new Date()): StreakSummary => {
  const records = readRecords();
  const todayRecord = records.get(dayKey(today));
  return {
    streak: currentStreak(records, today),
    completedToday: isDayComplete(todayRecord),
    todayDone: todayRecord?.size ?? 0,
    todayTotal: ACTIVITY_IDS.length,
    week: weekBars(records, today),
  };
};
