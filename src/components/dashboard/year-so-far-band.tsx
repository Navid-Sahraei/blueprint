import Link from "next/link";

import { ProgressBar, SegmentBar } from "@/components/dashboard/segment-bar";
import { WeeklyTrend } from "@/components/deepwork/weekly-trend";
import { yearProgress } from "@/lib/dashboard/module-stats";
import type { AllModuleData } from "@/lib/dashboard/use-all-data";
import type { Method } from "@/lib/methods";

export function YearSoFarBand({
  methods,
  data,
  year,
}: {
  methods: Method[];
  data: AllModuleData;
  year: number;
}) {
  if (methods.length === 0) return null;

  return (
    <section>
      <h2 className="label-technical mb-3">The year so far</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {methods.map((method) => {
          const progress = yearProgress(method.slug, data, year);
          return (
            <Link
              key={method.slug}
              href={method.route}
              className="corner-marks flex flex-col border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <p className="font-medium">{method.name}</p>
              <div className="mt-4 flex-1">
                {progress.kind === "segments" && (
                  <SegmentBar
                    total={progress.total}
                    filled={progress.filled}
                    partial={progress.partial}
                  />
                )}
                {progress.kind === "bar" && (
                  <>
                    <ProgressBar pct={progress.pct} />
                    <p className="measure mt-2 text-xs text-dimension">
                      {progress.pct}%
                      {progress.caption ? ` · ${progress.caption}` : ""}
                    </p>
                  </>
                )}
                {progress.kind === "chart" && (
                  <WeeklyTrend sessions={data.deepWorkSessions} />
                )}
                {progress.kind === "text" && (
                  <p className="text-sm text-muted-foreground">
                    {progress.text}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
