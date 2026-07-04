"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Adventure } from "@/lib/adventures/types";

export function SavoringDebrief({
  adventure,
  onSave,
  onCancel,
}: {
  adventure: Adventure;
  onSave: (fields: {
    best_moment: string;
    biggest_surprise: string;
    keepsake: string;
  }) => void;
  onCancel: () => void;
}) {
  const [best, setBest] = useState("");
  const [surprise, setSurprise] = useState("");
  const [keepsake, setKeepsake] = useState("");
  const complete = best.trim() && surprise.trim();

  return (
    <section className="corner-marks border border-border bg-card p-6">
      <p className="label-technical">Savor it — {adventure.title}</p>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Anticipation and novelty are most of an experience’s payoff (Kumar,
        Killingsworth &amp; Gilovich, 2014) — this is the third part: actually
        savoring it before it fades.
      </p>

      <form
        className="mt-5 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!complete) return;
          onSave({
            best_moment: best.trim(),
            biggest_surprise: surprise.trim(),
            keepsake: keepsake.trim(),
          });
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="adv-best">Best moment</Label>
          <Input
            id="adv-best"
            autoFocus
            value={best}
            onChange={(e) => setBest(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="adv-surprise">Biggest surprise</Label>
          <Input
            id="adv-surprise"
            value={surprise}
            onChange={(e) => setSurprise(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="adv-keepsake">
            One keepsake <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="adv-keepsake"
            placeholder="A ticket stub, a photo, a phrase someone said"
            value={keepsake}
            onChange={(e) => setKeepsake(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={!complete}>
            Save and mark done
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </section>
  );
}
