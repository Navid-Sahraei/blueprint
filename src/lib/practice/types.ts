/**
 * Deliberate Practice data shapes. Mirrors practice_skill and
 * practice_sessions in 0001_init.sql, plus practice_monthly_reflections
 * added in 0003_practice_monthly_reflection.sql.
 *
 * Deliberately no hours-accumulated total anywhere in this module — see
 * practice-module.tsx for why.
 */

export interface PracticeSkill {
  id: string;
  skill_name: string;
  start_date: string;
  feedback_source_description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PracticeSession {
  id: string;
  skill_id: string;
  date: string;
  duration_minutes: number;
  sub_skill_focus: string;
  feedback_notes: string;
  difficulty_rating: number; // 1–5, relative to current level
  created_at: string;
  updated_at: string;
}

export interface MonthlyReflection {
  id: string;
  skill_id: string;
  month_label: string; // e.g. "2026-07"
  what_changed: string;
  created_at: string;
  updated_at: string;
}
