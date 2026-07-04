import type { Metadata } from "next";

import { OkrPlanner } from "@/components/okrs/okr-planner";

export const metadata: Metadata = { title: "Annual Goals / OKRs" };

export default function GoalsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <OkrPlanner />
    </div>
  );
}
