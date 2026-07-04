"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/** A running clock since `startedAt`. Re-renders every second. */
export function SessionTimer({
  startedAt,
  onStop,
}: {
  startedAt: number;
  onStop: (elapsedMinutes: number) => void;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const elapsedSeconds = Math.floor((now - startedAt) / 1000);

  return (
    <div className="flex items-center gap-3 border border-accent bg-secondary/50 px-3 py-2">
      <span className="measure text-lg text-accent" aria-live="polite">
        {formatElapsed(elapsedSeconds)}
      </span>
      <Button
        size="sm"
        variant="accent"
        onClick={() => onStop(Math.max(1, Math.round(elapsedSeconds / 60)))}
      >
        Stop
      </Button>
    </div>
  );
}
