/**
 * Life Design / Odyssey Plan data shapes. Rows mirror the
 * life_design_plans table in 0001_init.sql — plan_text is the JSONB column.
 *
 * The structure follows Burnett & Evans (Designing Your Life, 2016): three
 * co-possible five-year paths, each with a six-word title, a milestone per
 * year, and the book's four dashboard gauges.
 */

export interface OdysseyPlanText {
  title: string; // the six-word title
  years: string[]; // five milestone slots, index 0 = year 1
  gauges: {
    resources: number; // 0–10: do I have the time/money/skill?
    liking: number; // 0–10: how much do I like it?
    confidence: number; // 0–10: can I actually pull it off?
    coherence: number; // 0–10: does it fit who I am?
  };
}

export interface LifeDesignPlan {
  id: string;
  plan_label: string; // "path-1" | "path-2" | "path-3"
  plan_text: OdysseyPlanText;
  created_at: string;
  updated_at: string;
}

export function emptyPlanText(): OdysseyPlanText {
  return {
    title: "",
    years: ["", "", "", "", ""],
    gauges: { resources: 5, liking: 5, confidence: 5, coherence: 5 },
  };
}

/** The three framings, per the spec — co-possible paths, not ranked options. */
export const PATHS: Array<{
  label: string;
  name: string;
  prompt: string;
}> = [
  {
    label: "path-1",
    name: "The one you’re already living",
    prompt:
      "Your current path, followed with full commitment for five years. Not the rut — the good version of it.",
  },
  {
    label: "path-2",
    name: "The one if that became impossible",
    prompt:
      "Tomorrow the world stops needing your current work entirely. What do you build instead?",
  },
  {
    label: "path-3",
    name: "The one if money and image didn’t matter",
    prompt:
      "Enough to live on, and nobody would laugh. What would you actually do?",
  },
];

export const GAUGES: Array<{
  key: keyof OdysseyPlanText["gauges"];
  label: string;
  hint: string;
}> = [
  { key: "resources", label: "Resources", hint: "time, money, skill" },
  { key: "liking", label: "Liking", hint: "how much it draws you" },
  { key: "confidence", label: "Confidence", hint: "can you pull it off" },
  { key: "coherence", label: "Coherence", hint: "fits who you are" },
];

/** A path counts as drafted once it has a title or any year filled in. */
export function isDrafted(text: OdysseyPlanText): boolean {
  return Boolean(text.title.trim() || text.years.some((y) => y.trim()));
}
