"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { activateModule } from "@/lib/modules/active-store";
import type { Method } from "@/lib/methods";

export function NotYetActiveBand({ methods }: { methods: Method[] }) {
  if (methods.length === 0) return null;

  return (
    <section>
      <h2 className="label-technical mb-3">Not yet active</h2>
      <p className="mb-4 max-w-2xl text-sm text-muted-foreground">
        The rest of the system, waiting. Activate a method when you&rsquo;re
        ready to run it — nothing here affects the two bands above until you
        do.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {methods.map((method) => (
          <div
            key={method.slug}
            className="flex flex-col border border-dashed border-border p-5 opacity-70 transition-opacity hover:opacity-100"
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
            <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
              <Link
                href={`/methods/${method.slug}`}
                className="text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                About
              </Link>
              <Button size="sm" onClick={() => activateModule(method.slug)}>
                Activate
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
