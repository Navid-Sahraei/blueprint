"use client";

import { useSyncExternalStore } from "react";

import { getPlans, subscribePlans } from "@/lib/lifedesign/store";
import { isDrafted } from "@/lib/lifedesign/types";
import { getServerSnapshot } from "@/lib/local-store";

/** Live one-line stat for the dashboard's Odyssey Plan card. */
export function OdysseyStat() {
  const plans = useSyncExternalStore(
    subscribePlans,
    getPlans,
    getServerSnapshot,
  );

  let text = "…";
  if (plans !== null) {
    const drafted = plans.filter((p) => isDrafted(p.plan_text)).length;
    text = drafted === 0 ? "NOT DRAFTED YET" : `${drafted} / 3 PATHS DRAFTED`;
  }

  return (
    <span className="measure truncate text-xs text-dimension">{text}</span>
  );
}
