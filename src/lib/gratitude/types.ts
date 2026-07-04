/** Mirrors the `gratitude_entries` table in 0001_init.sql. */
export interface GratitudeEntry {
  id: string;
  week_of: string; // ISO date, Monday of the week
  entry_1: string;
  entry_2: string;
  entry_3: string;
  created_at: string;
  updated_at: string;
}
