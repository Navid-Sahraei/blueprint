"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CompleteForm({
  defaultMinutes,
  onSave,
  onCancel,
}: {
  defaultMinutes: number;
  onSave: (actualMinutes: number, focusRating: number) => void;
  onCancel: () => void;
}) {
  const [minutes, setMinutes] = useState(String(defaultMinutes));
  const [focus, setFocus] = useState(3);

  return (
    <form
      className="mt-2 space-y-3 border border-border bg-background p-3"
      onSubmit={(e) => {
        e.preventDefault();
        const m = Number(minutes);
        if (!Number.isFinite(m) || m <= 0) return;
        onSave(Math.round(m), focus);
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="actual-minutes">Actual minutes</Label>
          <Input
            id="actual-minutes"
            type="number"
            min={1}
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <Label htmlFor="focus-rating">Focus quality</Label>
            <span className="measure text-xs text-dimension">{focus}/5</span>
          </div>
          <input
            id="focus-rating"
            type="range"
            min={1}
            max={5}
            value={focus}
            onChange={(e) => setFocus(Number(e.target.value))}
            className="h-2 w-full"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm">
          Log it
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
