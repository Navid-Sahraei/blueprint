/**
 * Review data shapes. `Review` mirrors the `reviews` table in
 * 0001_init.sql. `SummarySnapshot` is the JSON stored in
 * `summary_snapshot` — a point-in-time pull from every other module,
 * frozen at generation time rather than recomputed on every view.
 */

export type PeriodType = "quarterly" | "annual";

export interface QuarterSlice {
  label: string; // "2026-Q3"
  objectiveText: string | null;
  progressPct: number | null;
  habitTitle: string | null;
  habitStatus: string | null;
}

export interface SummarySnapshot {
  periodType: PeriodType;
  periodLabel: string;
  generatedAt: string;
  values: { count: number; top: string | null };
  quarters: QuarterSlice[];
  misogi: {
    activeTitle: string | null;
    daysUntil: number | null;
    doneInPeriod: number;
    failedWorthItInPeriod: number;
  };
  adventures: { doneInPeriod: number; upcomingTitle: string | null };
  woop: { totalCount: number };
  deepWorkHours: number;
  practice: { activeSkillName: string | null; sessionsInPeriod: number };
}

/** The three guided prompts, composed into the single reflection_text column. */
export interface ReflectionAnswers {
  worked: string;
  didnt: string;
  change: string;
}

export interface Review {
  id: string;
  period_type: PeriodType;
  period_label: string;
  summary_snapshot: SummarySnapshot;
  /** Composed from ReflectionAnswers — matches the schema's single text column. */
  reflection_text: string;
  created_at: string;
  updated_at: string;
}

const LABELS: Record<keyof ReflectionAnswers, string> = {
  worked: "What worked",
  didnt: "What didn't",
  change: "One change for next time",
};

export function composeReflection(answers: ReflectionAnswers): string {
  return (Object.keys(LABELS) as Array<keyof ReflectionAnswers>)
    .map((key) => `${LABELS[key]}: ${answers[key].trim()}`)
    .join("\n\n");
}

export function parseReflection(text: string): ReflectionAnswers {
  const answers: ReflectionAnswers = { worked: "", didnt: "", change: "" };
  for (const key of Object.keys(LABELS) as Array<keyof ReflectionAnswers>) {
    const prefix = `${LABELS[key]}: `;
    const start = text.indexOf(prefix);
    if (start === -1) continue;
    const rest = text.slice(start + prefix.length);
    const nextLabelIndex = Math.min(
      ...Object.values(LABELS)
        .map((l) => rest.indexOf(`\n\n${l}: `))
        .filter((i) => i !== -1),
      rest.length,
    );
    answers[key] = rest.slice(0, nextLabelIndex).trim();
  }
  return answers;
}
