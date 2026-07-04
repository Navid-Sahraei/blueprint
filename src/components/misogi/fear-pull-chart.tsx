"use client";

import type { MisogiCandidate } from "@/lib/misogi/types";
import { isActive } from "@/lib/misogi/types";

const SIZE = 300;
const PAD = 34;
const PLOT = SIZE - PAD * 2;

function x(fear: number): number {
  return PAD + ((fear - 1) / 9) * PLOT;
}
function y(pull: number): number {
  return SIZE - PAD - ((pull - 1) / 9) * PLOT;
}

/**
 * Fear × Pull scatter: fear on the x-axis, pull on the y-axis. The commit
 * zone is where both run high. Candidates failing the 50% check render
 * hollow.
 */
export function FearPullChart({
  candidates,
}: {
  candidates: MisogiCandidate[];
}) {
  const gridTicks = [1, 4, 7, 10];
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label="Fear versus pull chart of misogi candidates"
      className="h-auto w-full max-w-xs"
    >
      {/* plot frame + grid */}
      <rect
        x={PAD}
        y={PAD}
        width={PLOT}
        height={PLOT}
        fill="none"
        stroke="var(--hairline)"
      />
      {gridTicks.map((t) => (
        <g key={t} stroke="var(--grid-line)">
          <line x1={x(t)} y1={PAD} x2={x(t)} y2={SIZE - PAD} />
          <line x1={PAD} y1={y(t)} x2={SIZE - PAD} y2={y(t)} />
        </g>
      ))}

      {/* commit zone: fear ≥ 6 and pull ≥ 6 */}
      <rect
        x={x(6)}
        y={PAD}
        width={SIZE - PAD - x(6)}
        height={y(6) - PAD}
        fill="rgba(196, 85, 26, 0.07)"
        stroke="var(--accent)"
        strokeDasharray="4 4"
        strokeOpacity={0.5}
      />
      <text
        x={SIZE - PAD - 6}
        y={PAD + 14}
        textAnchor="end"
        fontFamily="var(--font-mono)"
        fontSize="8"
        letterSpacing="0.14em"
        fill="var(--accent)"
      >
        COMMIT ZONE
      </text>

      {/* axis labels */}
      <text
        x={SIZE - PAD}
        y={SIZE - 10}
        textAnchor="end"
        fontFamily="var(--font-mono)"
        fontSize="9"
        letterSpacing="0.14em"
        fill="var(--dimension)"
      >
        FEAR →
      </text>
      <text
        x={10}
        y={PAD - 12}
        fontFamily="var(--font-mono)"
        fontSize="9"
        letterSpacing="0.14em"
        fill="var(--dimension)"
      >
        ↑ PULL
      </text>
      {gridTicks.map((t) => (
        <g
          key={`t-${t}`}
          fontFamily="var(--font-mono)"
          fontSize="8"
          fill="var(--dimension)"
        >
          <text x={x(t)} y={SIZE - PAD + 12} textAnchor="middle">
            {t}
          </text>
          <text x={PAD - 8} y={y(t) + 3} textAnchor="end">
            {t}
          </text>
        </g>
      ))}

      {/* candidates */}
      {candidates.map((c) => (
        <circle
          key={c.id}
          cx={x(c.fear_score)}
          cy={y(c.pull_score)}
          r={5.5}
          fill={isActive(c) ? "var(--accent)" : "var(--blueprint)"}
          fillOpacity={c.fifty_percent_check ? 1 : 0}
          stroke={isActive(c) ? "var(--accent)" : "var(--blueprint)"}
          strokeWidth={1.5}
        >
          <title>
            {c.title} — fear {c.fear_score}, pull {c.pull_score}
            {c.fifty_percent_check ? "" : " (50% rule unchecked)"}
          </title>
        </circle>
      ))}
    </svg>
  );
}
