import type { Metadata } from "next";
import type { ComponentType } from "react";
import Link from "next/link";

import { AdventureStat } from "@/components/adventures/adventure-stat";
import { DeepWorkStat } from "@/components/deepwork/deep-work-stat";
import { GratitudeStat } from "@/components/gratitude/gratitude-stat";
import { HabitFoundryStat } from "@/components/habits/habit-stat";
import { OdysseyStat } from "@/components/lifedesign/odyssey-stat";
import { MisogiStat } from "@/components/misogi/misogi-stat";
import { PracticeStat } from "@/components/practice/practice-stat";
import { ReviewStat } from "@/components/review/review-stat";
import { OkrStat } from "@/components/okrs/okr-stat";
import { ValuesStat } from "@/components/values/values-stat";
import { WoopStat } from "@/components/woop/woop-stat";
import { Badge } from "@/components/ui/badge";
import { LAYERS, methodsByLayer } from "@/lib/methods";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard" };

/** Every module's interior route and live dashboard stat. */
const MODULES: Record<string, { href: string; Stat: ComponentType }> = {
  "values-compass": { href: "/app/values", Stat: ValuesStat },
  "odyssey-plan": { href: "/app/life-design", Stat: OdysseyStat },
  "habit-foundry": { href: "/app/habits", Stat: HabitFoundryStat },
  "annual-okrs": { href: "/app/goals", Stat: OkrStat },
  misogi: { href: "/app/misogi", Stat: MisogiStat },
  "adventure-ledger": { href: "/app/adventures", Stat: AdventureStat },
  "deep-work": { href: "/app/deep-work", Stat: DeepWorkStat },
  woop: { href: "/app/woop", Stat: WoopStat },
  "deliberate-practice": { href: "/app/practice", Stat: PracticeStat },
  "annual-review": { href: "/app/review", Stat: ReviewStat },
  gratitude: { href: "/app/gratitude", Stat: GratitudeStat },
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  const year = new Date().getFullYear();

  return (
    <div className="blueprint-grid min-h-full">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="label-technical mb-2">
          {user?.email ?? "Local draft — data saved in this browser"}
        </p>
        <h1 className="draft-in font-mono text-3xl font-semibold text-primary">
          {year} — this year at a glance
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Ten methods in five layers. Open any module — its card keeps the
          live stat: days to your misogi, this quarter&apos;s habit, your
          next adventure.
        </p>

        <div className="mt-10 space-y-10">
          {LAYERS.map((layer) => (
            <section key={layer.id}>
              <div className="flex items-baseline gap-3 pb-3">
                <span className="measure text-xs text-dimension">
                  LAYER {String(layer.id).padStart(2, "0")}
                </span>
                <h2 className="font-mono text-base font-semibold text-primary">
                  {layer.name}
                </h2>
                <span className="hidden text-sm text-muted-foreground sm:inline">
                  {layer.question}
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {methodsByLayer(layer.id).map((method) => {
                  const mod = MODULES[method.slug] ?? {
                    href: `/methods/${method.slug}`,
                    Stat: null,
                  };
                  return (
                    <Link
                      key={method.slug}
                      href={mod.href}
                      className="corner-marks group flex flex-col border border-border bg-card p-5 transition-colors hover:border-primary"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-medium group-hover:text-primary">
                          {method.name}
                        </h3>
                        <Badge
                          variant={method.freeTier ? "outline" : "secondary"}
                        >
                          {method.freeTier ? "Free" : "Pro"}
                        </Badge>
                      </div>
                      <p className="mt-2 flex-1 text-sm text-muted-foreground">
                        {method.tagline}
                      </p>
                      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
                        {mod.Stat && <mod.Stat />}
                        <span className="shrink-0 text-sm text-primary underline-offset-4 group-hover:underline">
                          Open →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
