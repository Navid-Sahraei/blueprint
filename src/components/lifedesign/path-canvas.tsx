"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GAUGES, type OdysseyPlanText } from "@/lib/lifedesign/types";

const TITLE_PLACEHOLDERS = [
  "The craft compounds into a company",
  "New trade learned from the ground",
  "The quiet workshop by the sea",
];

export function PathCanvas({
  index,
  name,
  prompt,
  text,
  onChange,
}: {
  index: number;
  name: string;
  prompt: string;
  text: OdysseyPlanText;
  onChange: (patch: Partial<OdysseyPlanText>) => void;
}) {
  function setYear(i: number, value: string) {
    const years = [...text.years];
    years[i] = value;
    onChange({ years });
  }

  return (
    <section className="corner-marks flex flex-col border border-border bg-card p-5">
      <p className="measure text-xs text-dimension">
        PATH {String(index + 1).padStart(2, "0")}
      </p>
      <h2 className="mt-1 font-mono text-lg font-semibold text-primary">
        {name}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">{prompt}</p>

      <div className="mt-4 space-y-1.5">
        <Label htmlFor={`title-${index}`}>Six-word title</Label>
        <Input
          id={`title-${index}`}
          placeholder={TITLE_PLACEHOLDERS[index] ?? ""}
          value={text.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </div>

      <div className="mt-4 space-y-2.5">
        {text.years.map((year, i) => (
          <div key={i} className="flex items-baseline gap-3">
            <span className="measure w-8 shrink-0 pt-2 text-xs text-dimension">
              Y{i + 1}
            </span>
            <Input
              aria-label={`${name} — year ${i + 1} milestone`}
              placeholder={i === 0 ? "What happens first?" : ""}
              value={year}
              onChange={(e) => setYear(i, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-3 border-t border-border pt-4">
        {GAUGES.map((g) => (
          <div key={g.key}>
            <div className="flex items-baseline justify-between">
              <label
                htmlFor={`${g.key}-${index}`}
                className="text-xs font-medium"
              >
                {g.label}{" "}
                <span className="font-normal text-muted-foreground">
                  ({g.hint})
                </span>
              </label>
              <span className="measure text-xs text-dimension">
                {text.gauges[g.key]}/10
              </span>
            </div>
            <input
              id={`${g.key}-${index}`}
              type="range"
              min={0}
              max={10}
              value={text.gauges[g.key]}
              onChange={(e) =>
                onChange({
                  gauges: { ...text.gauges, [g.key]: Number(e.target.value) },
                })
              }
              className="mt-1 h-2 w-full"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
