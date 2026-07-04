import type { Habit, HabitWeeklyReview } from "./types";

/**
 * Local-first store: rows live in this browser's localStorage while the app
 * runs without accounts, fronted by an in-memory cache so components can
 * subscribe via useSyncExternalStore. To move to Supabase, replace the
 * read/write internals — the row shapes already match 0001_init.sql.
 */

const HABITS_KEY = "blueprint.habits";
const REVIEWS_KEY = "blueprint.habit_reviews";

type Listener = () => void;
const listeners = new Set<Listener>();

let habitsCache: Habit[] | null = null;
let reviewsCache: HabitWeeklyReview[] | null = null;

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, rows: T[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(rows));
}

function emit(): void {
  for (const listener of listeners) listener();
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getHabits(): Habit[] {
  if (habitsCache === null) habitsCache = read<Habit>(HABITS_KEY);
  return habitsCache;
}

export function getReviews(): HabitWeeklyReview[] {
  if (reviewsCache === null)
    reviewsCache = read<HabitWeeklyReview>(REVIEWS_KEY);
  return reviewsCache;
}

export function replaceHabits(rows: Habit[]): void {
  habitsCache = rows;
  write(HABITS_KEY, rows);
  emit();
}

export function replaceReviews(rows: HabitWeeklyReview[]): void {
  reviewsCache = rows;
  write(REVIEWS_KEY, rows);
  emit();
}

/** Server snapshot: no data during SSR; components render their loading state. */
export function getServerSnapshot(): null {
  return null;
}
