/** Date helpers for quarter cadence and weekly reviews. All local-calendar. */

export function todayISO(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** e.g. "2026-Q3" */
export function currentQuarter(d: Date = new Date()): string {
  return `${d.getFullYear()}-Q${Math.floor(d.getMonth() / 3) + 1}`;
}

/** ISO date of the Monday of the week containing `d`. */
export function mondayOfWeek(d: Date = new Date()): string {
  const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return todayISO(monday);
}

/** Shift a quarter label by `delta` quarters, e.g. shiftQuarter("2026-Q1", -1) → "2025-Q4". */
export function shiftQuarter(quarter: string, delta: number): string {
  const [year, q] = quarter.split("-Q").map(Number);
  const index = year * 4 + (q - 1) + delta;
  return `${Math.floor(index / 4)}-Q${(index % 4) + 1}`;
}

/** Whole days from an ISO date to `to` (0 on the same day). */
export function daysBetween(fromISO: string, to: Date = new Date()): number {
  const from = new Date(`${fromISO}T00:00:00`);
  const end = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.max(0, Math.round((end.getTime() - from.getTime()) / 86_400_000));
}
