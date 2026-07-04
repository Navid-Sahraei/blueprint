/**
 * Habit Foundry data shapes. Field names mirror the `habits` and
 * `habit_weekly_reviews` tables in supabase/migrations/0001_init.sql so the
 * localStorage store can be swapped for Supabase queries one-to-one.
 */

export type HabitStatus = "backlog" | "installing" | "automatic" | "dropped";

export interface HabitFields {
  title: string;
  tiny_version: string;
  anchor: string;
  implementation_intention: string;
  identity_line: string;
}

export interface Habit extends HabitFields {
  id: string;
  status: HabitStatus;
  quarter: string | null;
  start_date: string | null; // ISO date, set when the install begins
  created_at: string;
  updated_at: string;
}

export interface HabitWeeklyReview {
  id: string;
  habit_id: string;
  week_of: string; // ISO date of the Monday of the reviewed week
  days_completed: number; // 0–7
  friction_note: string;
  adjustment_note: string;
  created_at: string;
}

/** Median days to automaticity in Lally et al. (2010); range was 18–254. */
export const MEDIAN_DAYS_TO_AUTOMATIC = 66;
