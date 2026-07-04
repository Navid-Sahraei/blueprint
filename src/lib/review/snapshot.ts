import { daysUntil } from "@/lib/dates";
import { getAdventures } from "@/lib/adventures/store";
import { getSessions as getDeepWorkSessions } from "@/lib/deepwork/store";
import { getHabits } from "@/lib/habits/store";
import { getCandidates } from "@/lib/misogi/store";
import { isActive as isMisogiActive } from "@/lib/misogi/types";
import { getKeyResults, getObjectives } from "@/lib/okrs/store";
import { objectiveProgress } from "@/lib/okrs/types";
import {
  getSessions as getPracticeSessions,
  getSkills as getPracticeSkills,
} from "@/lib/practice/store";
import { getValues } from "@/lib/values/store";
import { getEntries as getWoopEntries } from "@/lib/woop/store";
import type { PeriodType, QuarterSlice, SummarySnapshot } from "./types";

function periodRange(type: PeriodType, label: string): [Date, Date] {
  if (type === "annual") {
    const year = Number(label);
    return [new Date(year, 0, 1), new Date(year + 1, 0, 1)];
  }
  const [yearStr, qStr] = label.split("-Q");
  const year = Number(yearStr);
  const q = Number(qStr);
  const startMonth = (q - 1) * 3;
  return [new Date(year, startMonth, 1), new Date(year, startMonth + 3, 1)];
}

function quartersInPeriod(type: PeriodType, label: string): string[] {
  if (type === "quarterly") return [label];
  const year = Number(label);
  return [1, 2, 3, 4].map((q) => `${year}-Q${q}`);
}

function inRange(dateISO: string | null, start: Date, end: Date): boolean {
  if (!dateISO) return false;
  const d = new Date(`${dateISO}T00:00:00`);
  return d >= start && d < end;
}

export function buildSummarySnapshot(
  periodType: PeriodType,
  periodLabel: string,
): SummarySnapshot {
  const [start, end] = periodRange(periodType, periodLabel);
  const quarterLabels = quartersInPeriod(periodType, periodLabel);

  // Values
  const values = getValues();
  const sortedValues = [...values].sort((a, b) => a.rank - b.rank);

  // Goals + Habits, sliced per quarter in the period
  const objectives = getObjectives();
  const keyResults = getKeyResults();
  const habits = getHabits();
  const quarters: QuarterSlice[] = quarterLabels.map((label) => {
    const objective = objectives.find((o) => o.quarter === label) ?? null;
    const progressPct = objective
      ? Math.round(
          objectiveProgress(
            keyResults.filter((kr) => kr.objective_id === objective.id),
          ) * 100,
        )
      : null;
    const habit = habits.find((h) => h.quarter === label) ?? null;
    return {
      label,
      objectiveText: objective?.objective_text ?? null,
      progressPct,
      habitTitle: habit?.title ?? null,
      habitStatus: habit?.status ?? null,
    };
  });

  // Misogi
  const misogiCandidates = getCandidates();
  const active = misogiCandidates.find(isMisogiActive) ?? null;
  const doneInPeriod = misogiCandidates.filter(
    (c) => c.status === "done" && inRange(c.event_date, start, end),
  ).length;
  const failedWorthItInPeriod = misogiCandidates.filter(
    (c) => c.status === "failed_worth_it" && inRange(c.event_date, start, end),
  ).length;

  // Adventures
  const adventures = getAdventures();
  const doneAdventures = adventures.filter(
    (a) => a.status === "done" && inRange(a.target_date, start, end),
  ).length;
  const upcoming = adventures
    .filter(
      (a) =>
        (a.status === "scheduled" || a.status === "booked") && a.target_date,
    )
    .sort((a, b) => a.target_date!.localeCompare(b.target_date!))[0];

  // WOOP
  const woopCount = getWoopEntries().length;

  // Deep Work
  const deepWorkMinutes = getDeepWorkSessions()
    .filter((s) => s.actual_duration !== null && inRange(s.date, start, end))
    .reduce((sum, s) => sum + (s.actual_duration ?? 0), 0);

  // Practice
  const practiceSkill = getPracticeSkills().find((s) => s.is_active) ?? null;
  const sessionsInPeriod = practiceSkill
    ? getPracticeSessions().filter(
        (s) => s.skill_id === practiceSkill.id && inRange(s.date, start, end),
      ).length
    : 0;

  return {
    periodType,
    periodLabel,
    generatedAt: new Date().toISOString(),
    values: {
      count: sortedValues.length,
      top: sortedValues[0]?.value_name ?? null,
    },
    quarters,
    misogi: {
      activeTitle: active?.title ?? null,
      daysUntil: active?.event_date ? daysUntil(active.event_date) : null,
      doneInPeriod,
      failedWorthItInPeriod,
    },
    adventures: {
      doneInPeriod: doneAdventures,
      upcomingTitle: upcoming?.title ?? null,
    },
    woop: { totalCount: woopCount },
    deepWorkHours: Math.round((deepWorkMinutes / 60) * 10) / 10,
    practice: {
      activeSkillName: practiceSkill?.skill_name ?? null,
      sessionsInPeriod,
    },
  };
}
