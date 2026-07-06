"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { hasData } from "@/lib/dashboard/module-stats";
import { useAllModuleData } from "@/lib/dashboard/use-all-data";
import { currentYear } from "@/lib/dates";
import { METHODS } from "@/lib/methods";
import { NotYetActiveBand } from "./not-yet-active-band";
import { ThisWeekBand } from "./this-week-band";
import { YearSoFarBand } from "./year-so-far-band";

export function DashboardBody() {
  const data = useAllModuleData();
  const [year, setYear] = useState(currentYear());
  const thisYear = currentYear();

  const { active, inactive } = useMemo(() => {
    const activeSet = new Set(data.activeSlugs);
    const active = METHODS.filter(
      (m) => activeSet.has(m.slug) || hasData(m.slug, data),
    );
    const activeSlugs = new Set(active.map((m) => m.slug));
    const inactive = METHODS.filter((m) => !activeSlugs.has(m.slug));
    return { active, inactive };
  }, [data]);

  if (!data.ready) {
    return <p className="measure text-xs text-dimension">LOADING…</p>;
  }

  if (active.length === 0) {
    return (
      <div className="corner-marks border border-dashed border-border p-8 text-center">
        <p className="label-technical">No modules active yet</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Pick your stack below — activate as many or as few methods as you
          want. You can always add more later.
        </p>
        <div className="mt-8 text-left">
          <NotYetActiveBand methods={inactive} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          aria-label="Previous year"
          onClick={() => setYear((y) => y - 1)}
        >
          ‹
        </Button>
        <span className="label-technical">Viewing {year}</span>
        <Button
          size="sm"
          variant="ghost"
          aria-label="Next year"
          onClick={() => setYear((y) => y + 1)}
        >
          ›
        </Button>
        {year !== thisYear && (
          <Button size="sm" variant="ghost" onClick={() => setYear(thisYear)}>
            Jump to current year
          </Button>
        )}
      </div>

      <ThisWeekBand methods={active} data={data} />
      <YearSoFarBand methods={active} data={data} year={year} />
      <NotYetActiveBand methods={inactive} />
    </div>
  );
}
