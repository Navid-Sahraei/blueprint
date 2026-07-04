"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { PROMPTS } from "@/lib/adventures/prompts";
import { TYPE_LABEL, type AdventureType } from "@/lib/adventures/types";
import { cn } from "@/lib/utils";

const TYPES = Object.keys(TYPE_LABEL) as AdventureType[];

function randomIndex(exclude: number, length: number): number {
  if (length <= 1) return 0;
  let i = Math.floor(Math.random() * length);
  while (i === exclude) i = Math.floor(Math.random() * length);
  return i;
}

export function IdeaPrompts({
  onUse,
}: {
  onUse: (title: string, type: AdventureType) => void;
}) {
  const [type, setType] = useState<AdventureType>("nature");
  const [index, setIndex] = useState(0);
  const prompt = PROMPTS[type][index];

  function pickType(next: AdventureType) {
    setType(next);
    setIndex(0);
  }

  return (
    <section className="corner-marks border border-border bg-card p-6">
      <p className="label-technical">Need an idea?</p>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Five categories, so the ledger doesn’t turn into six versions of the
        same weekend.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => pickType(t)}
            className={cn(
              "border px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors",
              t === type
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:border-primary",
            )}
          >
            {TYPE_LABEL[t]}
          </button>
        ))}
      </div>

      <div className="mt-5 border border-border bg-background p-5">
        <p className="text-sm">{prompt}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => onUse(prompt, type)}
        >
          Add this as an idea
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIndex((i) => randomIndex(i, PROMPTS[type].length))}
        >
          Another idea
        </Button>
      </div>
    </section>
  );
}
