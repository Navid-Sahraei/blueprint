"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import type { KeyResult } from "@/lib/okrs/types";
import { krProgress } from "@/lib/okrs/types";
import { getDraft, replaceDraft } from "@/lib/woop/store";
import { freshWoopDraft } from "@/lib/woop/types";

function formatValue(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export function KeyResultRow({
  kr,
  onUpdate,
  onRemove,
}: {
  kr: KeyResult;
  onUpdate: (patch: Partial<KeyResult>) => void;
  onRemove: () => void;
}) {
  const router = useRouter();
  const barPct = Math.round(krProgress(kr) * 100);

  function startWoop() {
    if (
      getDraft() !== null &&
      !window.confirm("Replace your in-progress WOOP draft?")
    ) {
      return;
    }
    replaceDraft({ ...freshWoopDraft(), linked_key_result_id: kr.id });
    router.push("/app/woop");
  }
  const realPct =
    kr.target_value > 0
      ? Math.round((kr.current_value / kr.target_value) * 100)
      : 0;

  function setCurrent(value: number) {
    onUpdate({
      current_value: Math.max(0, Math.round(value * 100) / 100),
    });
  }

  return (
    <li className="border border-border bg-background p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-medium">{kr.kr_text}</p>
        <p className="measure text-xs text-dimension">
          {formatValue(kr.current_value)} / {formatValue(kr.target_value)}
          {kr.unit ? ` ${kr.unit.toUpperCase()}` : ""} · {realPct}%
        </p>
      </div>

      <div className="mt-3 h-1.5 w-full bg-muted" aria-hidden>
        <div className="h-full bg-accent" style={{ width: `${barPct}%` }} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={barPct}
          aria-label={`Progress on ${kr.kr_text}, percent`}
          onChange={(e) =>
            setCurrent((Number(e.target.value) / 100) * kr.target_value)
          }
          className="h-2 min-w-32 flex-1"
        />
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            step="any"
            value={kr.current_value}
            aria-label={`Current value for ${kr.kr_text}`}
            onChange={(e) => setCurrent(Number(e.target.value) || 0)}
            className="h-8 w-24 rounded-sm border border-input bg-paper-raised px-2 text-sm"
          />
          <span className="text-xs text-muted-foreground">
            of {formatValue(kr.target_value)} {kr.unit}
          </span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          title="Plan around this key result's obstacle in WOOP"
          onClick={startWoop}
        >
          If-then plan →
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            if (window.confirm(`Remove key result “${kr.kr_text}”?`)) {
              onRemove();
            }
          }}
        >
          Remove
        </Button>
      </div>
    </li>
  );
}
