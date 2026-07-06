import type { Metadata } from "next";

import { DashboardBody } from "@/components/dashboard/dashboard-body";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <div className="blueprint-grid min-h-full">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="label-technical mb-2">
          {user?.email ?? "Local draft — data saved in this browser"}
        </p>
        <h1 className="draft-in font-mono text-3xl font-semibold text-primary">
          This year at a glance
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Eleven methods in five layers. Active methods surface here — the
          moment that matters this week, and how the year is shaping up.
        </p>

        <div className="mt-10">
          <DashboardBody />
        </div>
      </div>
    </div>
  );
}
