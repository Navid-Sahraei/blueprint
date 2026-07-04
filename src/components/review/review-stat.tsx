"use client";

import { useSyncExternalStore } from "react";

import { currentQuarter } from "@/lib/dates";
import { getServerSnapshot } from "@/lib/local-store";
import { getReviews, subscribeReviews } from "@/lib/review/store";

/** Live one-line stat for the dashboard's Review card. */
export function ReviewStat() {
  const reviews = useSyncExternalStore(
    subscribeReviews,
    getReviews,
    getServerSnapshot,
  );

  let text = "…";
  if (reviews !== null) {
    const quarter = currentQuarter();
    const done = reviews.some(
      (r) => r.period_type === "quarterly" && r.period_label === quarter,
    );
    text = done ? `${quarter} REVIEWED` : `${quarter} · NOT REVIEWED YET`;
  }

  return (
    <span className="measure truncate text-xs text-dimension">{text}</span>
  );
}
