"use client";

import { PathCanvas } from "@/components/lifedesign/path-canvas";
import { ModuleHeader } from "@/components/module-header";
import { PATHS } from "@/lib/lifedesign/types";
import { useOdyssey } from "@/lib/lifedesign/use-odyssey";

export function OdysseyModule() {
  const { ready, textFor, updatePath } = useOdyssey();

  return (
    <div className="space-y-10">
      <ModuleHeader
        layer="Layer 01 · Direction"
        title="Life Design / Odyssey Plan"
        meta="AUTOSAVES · SAVED IN THIS BROWSER"
      >
        Three parallel five-year versions of your life — co-possible paths,
        not ranked alternatives. Sketching all three breaks the assumption
        that there is one correct plan. From Bill Burnett &amp; Dave
        Evans&rsquo;s Designing Your Life (2016), developed at Stanford&rsquo;s
        Life Design Lab. Give each path a six-word title, a milestone per
        year, and rate it on the book&rsquo;s four gauges.
      </ModuleHeader>

      {!ready ? (
        <p className="measure text-xs text-dimension">LOADING…</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {PATHS.map((path, i) => (
            <PathCanvas
              key={path.label}
              index={i}
              name={path.name}
              prompt={path.prompt}
              text={textFor(path.label)}
              onChange={(patch) => updatePath(path.label, patch)}
            />
          ))}
        </div>
      )}

      <footer className="border-t border-border pt-6">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Honest framing: this method&rsquo;s support comes from
          design-thinking pedagogy and practitioner outcomes, not randomized
          controlled trials. Treat it as a structured brainstorming tool —
          its job is to loosen the grip of &ldquo;the one right plan,&rdquo;
          not to predict the future. The gauges (resources, liking,
          confidence, coherence) are the book&rsquo;s own dashboard.
        </p>
      </footer>
    </div>
  );
}
