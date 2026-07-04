"use client";

import { mondayOfWeek } from "@/lib/dates";
import type { DeepWorkSession } from "@/lib/deepwork/types";

const WEEKS_SHOWN = 6;

function weeksAgoMonday(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n * 7);
  return mondayOfWeek(d);
}

/** Sum of actual_duration hours for sessions whose date falls in [monday, monday+6]. */
function hoursForWeek(sessions: DeepWorkSession[], monday: string): number {
  const start = new Date(`${monday}T00:00:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  const minutes = sessions
    .filter((s) => s.actual_duration !== null)
    .filter((s) => {
      const d = new Date(`${s.date}T00:00:00`);
      return d >= start && d < end;
    })
    .reduce((sum, s) => sum + (s.actual_duration ?? 0), 0);
  return minutes / 60;
}

export function WeeklyTrend({ sessions }: { sessions: DeepWorkSession[] }) {
  const weeks = Array.from({ length: WEEKS_SHOWN }, (_, i) => {
    const monday = weeksAgoMonday(WEEKS_SHOWN - 1 - i);
    return { monday, hours: hoursForWeek(sessions, monday) };
  });
  const max = Math.max(1, ...weeks.map((w) => w.hours));

  return (
    <div>
      <div className="flex items-end gap-3" style={{ height: 120 }}>
        {weeks.map((w, i) => (
          <div key={w.monday} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="measure text-[10px] text-dimension">
              {w.hours > 0 ? w.hours.toFixed(1) : ""}
            </span>
            <div
              className={i === weeks.length - 1 ? "w-full bg-accent" : "w-full bg-primary"}
              style={{ height: `${Math.max(2, (w.hours / max) * 90)}px` }}
            />
            <span className="measure text-[10px] text-dimension">
              {w.monday.slice(5)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
