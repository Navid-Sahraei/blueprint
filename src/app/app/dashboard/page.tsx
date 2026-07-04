import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { LAYERS, methodsByLayer } from "@/lib/methods";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const user = supabase
    ? (await supabase.auth.getUser()).data.user
    : null;

  const year = new Date().getFullYear();

  return (
    <div className="blueprint-grid min-h-full">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="label-technical mb-2">
          {user?.email ?? "Drafting mode — Supabase not connected"}
        </p>
        <h1 className="font-mono text-3xl font-semibold text-primary">
          {year} — this year at a glance
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Activate the modules you want to run this year. Each one becomes a
          live card here with its most relevant stat — days to your misogi,
          this quarter&apos;s habit, your next adventure.
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
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {methodsByLayer(layer.id).map((method) => (
                  <div
                    key={method.slug}
                    className="corner-marks flex flex-col border border-border bg-card p-5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-medium">{method.name}</h3>
                      <Badge variant={method.freeTier ? "outline" : "secondary"}>
                        {method.freeTier ? "Free" : "Pro"}
                      </Badge>
                    </div>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">
                      {method.tagline}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <span className="measure text-xs text-dimension">
                        MODULE IN DESIGN
                      </span>
                      <Link
                        href={`/methods/${method.slug}`}
                        className="text-sm text-primary underline-offset-4 hover:underline"
                      >
                        About →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
