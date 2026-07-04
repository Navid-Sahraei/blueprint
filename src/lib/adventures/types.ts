/**
 * Adventure Ledger data shapes. Mirrors the `adventures` table in
 * supabase/migrations/0001_init.sql plus the keepsake column added in
 * 0002_adventure_keepsake.sql.
 */

export type AdventureStatus = "idea" | "scheduled" | "booked" | "done";
export type AdventureType = "nature" | "skill" | "place" | "people" | "solo";

export interface Adventure {
  id: string;
  title: string;
  status: AdventureStatus;
  target_date: string | null;
  type: AdventureType | null;
  budget: number | null;
  companions: string;
  best_moment: string;
  biggest_surprise: string;
  keepsake: string;
  created_at: string;
  updated_at: string;
}

/** Kevin's Rule: roughly one small adventure every two months. */
export const YEARLY_TARGET = 6;

export const TYPE_LABEL: Record<AdventureType, string> = {
  nature: "Nature",
  skill: "Skill",
  place: "Place",
  people: "People",
  solo: "Solo",
};
