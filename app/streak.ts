import { isQuizReinstated, isRepeatDue, readAllCompletions, repeatDueDate } from "./quiz-completion.ts";
import { ACTIVITY_REGISTRY, type ActivityId } from "./activity-registry.ts";

const STREAK_KEY = "spanish-quiz-streak-v2";
/** The banked day counter. Stored rather than recomputed so later rule or activity changes never rewrite it.
 * v2 counts calendar days; v1 used a 24h window and is dropped, so every device re-seeds once from the ledger. */
export const STREAK_COUNTER_KEY = "spanish-quiz-streak-counter-v2";
const LEGACY_COUNTER_KEY = "spanish-quiz-streak-counter-v1";
const FLASHCARD_DAYS_KEY = "spanish-flashcards-active-days-v1";
/** dayKey -> the activities that day required when it was completed. Locks a completed day, so an
 * activity that appears on the board afterwards (new, repeat due, shown again) only counts from the next day. */
const COMPLETED_DAYS_KEY = "spanish-quiz-completed-days-v1";
const DAY_LETTERS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

/** Every activity the daily streak tracks, in registry order — sourced from the
 * activity registry so a newly registered activity is required for the streak too. */
export const ACTIVITY_IDS: readonly ActivityId[] = ACTIVITY_REGISTRY.map((entry) => entry.id);
export type { ActivityId };

/** dayKey -> activities completed that day. The daily goal is reaching every activity, not just one. */
export type Records = Map<string, Set<ActivityId>>;

const pad = (value: number) => String(value).padStart(2, "0");

export const dayKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const previousDayKey = (date: Date) => {
  const previous = new Date(date);
  previous.setDate(previous.getDate() - 1);
  return dayKey(previous);
};

const isActivityId = (value: unknown): value is ActivityId => (ACTIVITY_IDS as readonly string[]).includes(value as string);

/**
 * A quiz that's been fully completed is exempt from the daily goal for every day from
 * its completion date up to (not including) the day its monthly repeat becomes due —
 * at which point it's required again like any other activity.
 */
const isExemptOn = (activity: ActivityId, day: string, completions: Record<string, string>) => {
  const completedAt = completions[activity];
  if (!completedAt) return false;
  if (day < dayKey(new Date(completedAt))) return false;
  return day < dayKey(repeatDueDate(completedAt));
};

const INTRODUCED_ON = new Map(ACTIVITY_REGISTRY.map((entry) => [entry.id, entry.introducedOn]));

/** An activity added later is only required from the day it went live, so past days stay complete. */
const existedOn = (activity: ActivityId, day: string) => {
  const introducedOn = INTRODUCED_ON.get(activity);
  return !introducedOn || day >= introducedOn;
};

type CompletedDays = Record<string, ActivityId[]>;

const readCompletedDays = (): CompletedDays => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(COMPLETED_DAYS_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : {};
    const days: CompletedDays = {};
    if (parsed && typeof parsed === "object") {
      for (const [day, activities] of Object.entries(parsed as Record<string, unknown>)) {
        if (Array.isArray(activities)) days[day] = activities.filter(isActivityId);
      }
    }
    return days;
  } catch {
    return {};
  }
};

const lockCompletedDay = (day: string, required: ActivityId[]) => {
  const days = readCompletedDays();
  if (days[day]) return;
  days[day] = required;
  try {
    window.localStorage.setItem(COMPLETED_DAYS_KEY, JSON.stringify(days));
  } catch {
    // Storage can be unavailable (private mode, quota); the day just won't be locked this session.
  }
};

/** What the daily goal is judged against: the completion dates, the current moment, and the locked days. */
type GoalContext = { completions: Record<string, string>; now: Date; locked: CompletedDays };

const goalContext = (now: Date, completions = readAllCompletions()): GoalContext =>
  ({ completions, now, locked: readCompletedDays() });

/** Mirrors isQuizHiddenFromBoard: a finished quiz is off the board until its repeat is due or it's shown again. */
const isOnBoard = (activity: ActivityId, ctx: GoalContext) => {
  if (activity === "flashcards") return true;
  const completedAt = ctx.completions[activity];
  return !completedAt || isRepeatDue(completedAt, ctx.now) || isQuizReinstated(activity);
};

/**
 * A locked (already completed) day keeps the requirement it was completed against. Today
 * requires exactly what's on the board — the same visibility rule the board uses. Past
 * unlocked days fall back to the completion-date exemption, since the board's past state isn't stored.
 */
const requiredActivitiesOn = (day: string, ctx: GoalContext): ActivityId[] => {
  const locked = ctx.locked[day];
  if (locked) return locked;
  const live = ACTIVITY_IDS.filter((id) => existedOn(id, day));
  if (day === dayKey(ctx.now)) return live.filter((id) => isOnBoard(id, ctx));
  return live.filter((id) => !isExemptOn(id, day, ctx.completions));
};

const isDayComplete = (record: Set<ActivityId> | undefined, day: string, ctx: GoalContext) =>
  !!ctx.locked[day] || (!!record && requiredActivitiesOn(day, ctx).every((id) => record.has(id)));

/** Locks today once it's complete, so its requirement can't grow afterwards. */
const lockTodayIfComplete = (records: Records, ctx: GoalContext) => {
  const today = dayKey(ctx.now);
  if (ctx.locked[today] || !isDayComplete(records.get(today), today, ctx)) return;
  const required = requiredActivitiesOn(today, ctx);
  lockCompletedDay(today, required);
  ctx.locked = { ...ctx.locked, [today]: required };
};

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

/**
 * The day counter: `count` consecutive completed calendar days, the latest being `lastCompletedDay`.
 * Any time of day counts. Once a whole calendar day passes without a completed day, the
 * counter drops to 0 and the next completed day starts again at 1.
 */
type StreakCounter = { count: number; lastCompletedDay: string | null };

const readStoredCounter = (): StreakCounter | null => {
  try {
    const raw = window.localStorage.getItem(STREAK_COUNTER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StreakCounter>;
    if (typeof parsed?.count !== "number") return null;
    return {
      count: parsed.count,
      lastCompletedDay: typeof parsed.lastCompletedDay === "string" ? parsed.lastCompletedDay : null,
    };
  } catch {
    return null;
  }
};

const writeCounter = (counter: StreakCounter) => {
  try {
    window.localStorage.setItem(STREAK_COUNTER_KEY, JSON.stringify(counter));
  } catch {
    // Storage can be unavailable (private mode, quota); the counter just won't persist this session.
  }
};

/** Still running while the last completed day is today or yesterday. */
const isAlive = (counter: StreakCounter, now: Date) =>
  counter.lastCompletedDay === dayKey(now) || counter.lastCompletedDay === previousDayKey(now);

/** One-time seed for devices without a v2 counter: take the streak the ledger shows. */
const seedCounter = (records: Records, ctx: GoalContext): StreakCounter => {
  const count = streakFrom(records, ctx);
  if (!count) return { count: 0, lastCompletedDay: null };
  const today = dayKey(ctx.now);
  return { count, lastCompletedDay: isDayComplete(records.get(today), today, ctx) ? today : previousDayKey(ctx.now) };
};

const readCounter = (records: Records, ctx: GoalContext): StreakCounter => {
  const stored = readStoredCounter();
  if (stored) return stored;
  const seeded = seedCounter(records, ctx);
  writeCounter(seeded);
  try {
    window.localStorage.removeItem(LEGACY_COUNTER_KEY);
  } catch {
    // Storage can be unavailable; the stale v1 counter is simply never read again.
  }
  return seeded;
};

/** Marks one activity's round/session done today. Call once per completed round or flashcard session. */
export const recordActivityToday = (activity: ActivityId, now = new Date()) => {
  if (typeof window === "undefined") return;
  const today = dayKey(now);
  const ctx = goalContext(now);
  // Seed from the ledger as it stood before this round, so this round's day isn't counted twice.
  const counter = readCounter(readRecords(), ctx);
  mergeActivityDays([{ activity, day: today }]);
  const alive = isAlive(counter, now);
  const records = readRecords();
  lockTodayIfComplete(records, ctx);

  if (counter.lastCompletedDay !== today && isDayComplete(records.get(today), today, ctx)) {
    writeCounter({ count: alive ? counter.count + 1 : 1, lastCompletedDay: today });
  } else if (!alive && counter.count !== 0) {
    writeCounter({ ...counter, count: 0 });
  }
};

/**
 * Flashcards has no per-round history like the grammar quizzes — each card's Leitner
 * record only keeps its own most recent `updatedAt`, so a card reviewed on multiple
 * days remembers only the latest one. That means the streak's self-heal (which
 * rebuilds days from each activity's own stored history) can only ever recover the
 * single most recent flashcards day, silently dropping earlier days if the streak
 * ledger itself is ever lost. This is flashcards' own durable day-by-day log, written
 * on every card reviewed, so the streak stays fully recoverable like the quizzes are.
 */
export const recordFlashcardDayReviewed = (day: string) => {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(FLASHCARD_DAYS_KEY);
    const days: string[] = raw ? JSON.parse(raw) : [];
    if (days.includes(day)) return;
    window.localStorage.setItem(FLASHCARD_DAYS_KEY, JSON.stringify([...days, day]));
  } catch {
    // Storage can be unavailable (private mode, quota); the day log just won't persist this session.
  }
};

export const readFlashcardDaysReviewed = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FLASHCARD_DAYS_KEY);
    const days = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(days) ? days.filter((day): day is string => typeof day === "string") : [];
  } catch {
    return [];
  }
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

/** Consecutive days ending today (or yesterday, if today isn't fully done yet) where every required
 * activity was completed. Ledger-based; only used to seed the stored counter. */
export const currentStreak = (records: Records, today = new Date(), completions = readAllCompletions()): number =>
  streakFrom(records, goalContext(today, completions));

const streakFrom = (records: Records, ctx: GoalContext): number => {
  const cursor = new Date(ctx.now);
  if (!isDayComplete(records.get(dayKey(cursor)), dayKey(cursor), ctx)) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (isDayComplete(records.get(dayKey(cursor)), dayKey(cursor), ctx)) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

export type WeekDay = { letter: string; status: "done" | "today" | "future"; doneCount: number; total: number };

/** Monday-start week containing `today`, for the streak panel's 7 day bars. */
export const weekBars = (records: Records, today = new Date(), completions = readAllCompletions()): WeekDay[] =>
  weekFrom(records, goalContext(today, completions));

const weekFrom = (records: Records, ctx: GoalContext): WeekDay[] => {
  const today = ctx.now;
  const mondayOffset = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);
  const todayKey = dayKey(today);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const key = dayKey(date);
    const record = records.get(key);
    const required = requiredActivitiesOn(key, ctx);
    const status: WeekDay["status"] = key === todayKey ? "today" : isDayComplete(record, key, ctx) ? "done" : "future";
    // Count only required activities, so practising an exempt (already completed) quiz doesn't fill the bar.
    const doneCount = required.filter((id) => record?.has(id)).length;
    return { letter: DAY_LETTERS[index], status, doneCount, total: required.length };
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
  const ctx = goalContext(today);
  const todayKey = dayKey(today);
  const todayRecord = records.get(todayKey);
  const counter = readCounter(records, ctx);
  lockTodayIfComplete(records, ctx);
  const requiredToday = requiredActivitiesOn(todayKey, ctx);
  return {
    streak: isAlive(counter, today) ? counter.count : 0,
    completedToday: isDayComplete(todayRecord, todayKey, ctx),
    todayDone: requiredToday.filter((id) => todayRecord?.has(id)).length,
    todayTotal: requiredToday.length,
    week: weekFrom(records, ctx),
  };
};
