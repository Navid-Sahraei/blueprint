import Link from "next/link";

import { thisWeekCard, type Tone } from "@/lib/dashboard/module-stats";
import type { AllModuleData } from "@/lib/dashboard/use-all-data";
import type { Method } from "@/lib/methods";
import { cn } from "@/lib/utils";

const TONE_TEXT: Record<Tone, string> = {
  default: "text-foreground",
  accent: "text-accent",
  warning: "text-destructive",
};

export function ThisWeekBand({
  methods,
  data,
}: {
  methods: Method[];
  data: AllModuleData;
}) {
  if (methods.length === 0) return null;

  return (
    <section>
      <h2 className="label-technical mb-3">This week</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {methods.map((method) => {
          const card = thisWeekCard(method.slug, data);
          return (
            <Link
              key={method.slug}
              href={method.route}
              className="corner-marks border border-border bg-card p-4 transition-colors hover:border-primary"
            >
              <p className="label-technical truncate">{method.name}</p>
              <p
                className={cn(
                  "measure mt-1.5 text-sm font-medium",
                  TONE_TEXT[card.tone],
                )}
              >
                {card.text}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
