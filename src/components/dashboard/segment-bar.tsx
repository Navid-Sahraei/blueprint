import { cn } from "@/lib/utils";

/** A row of measurement-style segments — the shape fits habits, adventures, reviews. */
export function SegmentBar({
  total,
  filled,
  partial = 0,
}: {
  total: number;
  filled: number;
  partial?: number;
}) {
  return (
    <div className="flex gap-1" role="img" aria-label={`${filled} of ${total} filled`}>
      {Array.from({ length: total }, (_, i) => {
        const state = i < filled ? "full" : i < filled + partial ? "partial" : "empty";
        return (
          <div
            key={i}
            className={cn(
              "h-2 flex-1",
              state === "full" && "bg-primary",
              state === "partial" && "bg-accent",
              state === "empty" && "bg-muted",
            )}
          />
        );
      })}
    </div>
  );
}

export function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="h-2 w-full bg-muted" aria-hidden>
      <div
        className="h-full bg-accent"
        style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
      />
    </div>
  );
}
