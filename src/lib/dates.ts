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

export function currentYear(d: Date = new Date()): number {
  return d.getFullYear();
}

/** e.g. "2026-07" */
export function currentMonth(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Shift a quarter label by `delta` quarters, e.g. shiftQuarter("2026-Q1", -1) → "2025-Q4". */
export function shiftQuarter(quarter: string, delta: number): string {
  const [year, q] = quarter.split("-Q").map(Number);
  const index = year * 4 + (q - 1) + delta;
  return `${Math.floor(index / 4)}-Q${(index % 4) + 1}`;
}

/** The 7 ISO dates of the week starting at `mondayISO`. */
export function weekDates(mondayISO: string): string[] {
  const start = new Date(`${mondayISO}T00:00:00`);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return todayISO(d);
  });
}

/** Whole days from `from` until an ISO date — negative once it has passed. */
export function daysUntil(iso: string, from: Date = new Date()): number {
  const target = new Date(`${iso}T00:00:00`);
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  return Math.round((target.getTime() - start.getTime()) / 86_400_000);
}

/** Whole days from an ISO date to `to` (0 on the same day). */
export function daysBetween(fromISO: string, to: Date = new Date()): number {
  const from = new Date(`${fromISO}T00:00:00`);
  const end = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.max(0, Math.round((end.getTime() - from.getTime()) / 86_400_000));
}
