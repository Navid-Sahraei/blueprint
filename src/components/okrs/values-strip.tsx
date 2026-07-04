"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import { getServerSnapshot } from "@/lib/local-store";
import { getValues, subscribeValues } from "@/lib/values/store";

/**
 * The compass, surfaced where goals are written — the Values module's
 * stated purpose is that later goals get checked against it.
 */
export function ValuesStrip() {
  const values = useSyncExternalStore(
    subscribeValues,
    getValues,
    getServerSnapshot,
  );

  if (values === null) return null;

  return (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border border-border bg-card px-4 py-2.5">
      <span className="label-technical">Compass</span>
      {values.length === 0 ? (
        <span className="text-xs text-muted-foreground">
          No compass yet — an objective that serves no value is someone
          else&rsquo;s goal.{" "}
          <Link
            href="/app/values"
            className="text-primary underline-offset-4 hover:underline"
          >
            Sort your values →
          </Link>
        </span>
      ) : (
        <>
          {[...values]
            .sort((a, b) => a.rank - b.rank)
            .map((v) => (
              <span
                key={v.id}
                className="measure text-xs text-primary"
                title={v.personal_definition}
              >
                {String(v.rank).padStart(2, "0")}{" "}
                {v.value_name.toUpperCase()}
              </span>
            ))}
          <span className="text-xs text-muted-foreground">
            — every objective should answer to one of these.
          </span>
        </>
      )}
    </div>
  );
}
