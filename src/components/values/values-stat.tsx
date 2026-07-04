"use client";

import { useSyncExternalStore } from "react";

import { getServerSnapshot } from "@/lib/local-store";
import { getValues, subscribeValues } from "@/lib/values/store";

/** Live one-line stat for the dashboard's Values Compass card. */
export function ValuesStat() {
  const values = useSyncExternalStore(
    subscribeValues,
    getValues,
    getServerSnapshot,
  );

  let text = "…";
  if (values !== null) {
    if (values.length === 0) {
      text = "NOT SORTED YET";
    } else {
      const top = [...values].sort((a, b) => a.rank - b.rank)[0];
      text = `${values.length} VALUES · 01 ${top.value_name.toUpperCase()}`;
    }
  }

  return (
    <span className="measure truncate text-xs text-dimension">{text}</span>
  );
}
