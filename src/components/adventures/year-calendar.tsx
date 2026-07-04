"use client";

import type { Adventure } from "@/lib/adventures/types";
import { cn } from "@/lib/utils";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const STATUS_DOT: Record<string, string> = {
  scheduled: "bg-dimension",
  booked: "bg-accent",
  done: "bg-primary",
};

export function YearCalendar({
  adventures,
  year,
}: {
  adventures: Adventure[];
  year: number;
}) {
  const dated = adventures.filter(
    (a) =>
      a.target_date &&
      new Date(`${a.target_date}T00:00:00`).getFullYear() === year &&
      a.status !== "idea",
  );

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
      {MONTHS.map((label, i) => {
        const inMonth = dated.filter(
          (a) => new Date(`${a.target_date}T00:00:00`).getMonth() === i,
        );
        return (
          <div
            key={label}
            className={cn(
              "border p-3",
              inMonth.length > 0
                ? "border-border bg-background"
                : "border-dashed border-border/60",
            )}
          >
            <p className="label-technical">{label}</p>
            <div className="mt-2 space-y-1.5">
              {inMonth.map((a) => (
                <div key={a.id} className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "size-1.5 shrink-0 rounded-full",
                      STATUS_DOT[a.status],
                    )}
                    aria-hidden
                  />
                  <span className="truncate text-xs" title={a.title}>
                    {a.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
