import { currentQuarter, daysBetween, daysUntil, mondayOfWeek, shiftQuarter, weekDates } from "@/lib/dates";
import { isDrafted } from "@/lib/lifedesign/types";
import { isActive as isMisogiActive } from "@/lib/misogi/types";
import { objectiveProgress } from "@/lib/okrs/types";
import { YEARLY_TARGET } from "@/lib/adventures/types";
import type { AllModuleData } from "./use-all-data";

export type Tone = "default" | "accent" | "warning";

export interface ThisWeekCard {
  text: string;
  tone: Tone;
  hasData: boolean;
}

export type YearProgress =
  | { kind: "segments"; total: number; filled: number; partial?: number }
  | { kind: "bar"; pct: number; caption?: string }
  | { kind: "chart" }
  | { kind: "text"; text: string };

function yearOf(iso: string | null): number | null {
  return iso ? new Date(`${iso}T00:00:00`).getFullYear() : null;
}

function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

/** Does this method already have any saved data? Existing work is never hidden. */
export function hasData(slug: string, d: AllModuleData): boolean {
  switch (slug) {
    case "values-compass":
      return d.values.length > 0;
    case "odyssey-plan":
      return d.plans.some((p) => isDrafted(p.plan_text));
    case "annual-okrs":
      return d.objectives.length > 0;
    case "misogi":
      return d.misogiCandidates.length > 0;
    case "adventure-ledger":
      return d.adventures.length > 0;
    case "deep-work":
      return d.deepWorkSessions.length > 0;
    case "woop":
      return d.woopEntries.length > 0;
    case "habit-foundry":
      return d.habits.length > 0;
    case "deliberate-practice":
      return d.practiceSkills.length > 0;
    case "annual-review":
      return d.reviews.length > 0;
    case "gratitude":
      return d.gratitude.length > 0;
    default:
      return false;
  }
}

export function thisWeekCard(slug: string, d: AllModuleData): ThisWeekCard {
  switch (slug) {
    case "values-compass":
      return d.values.length > 0
        ? { text: plural(d.values.length, "value") + " set", tone: "default", hasData: true }
        : { text: "Not sorted yet →", tone: "default", hasData: false };

    case "odyssey-plan": {
      const drafted = d.plans.filter((p) => isDrafted(p.plan_text)).length;
      return drafted > 0
        ? { text: `${drafted}/3 paths drafted`, tone: "default", hasData: true }
        : { text: "Not started →", tone: "default", hasData: false };
    }

    case "annual-okrs": {
      const quarter = currentQuarter();
      const objective = d.objectives.find((o) => o.quarter === quarter);
      if (!objective) return { text: "No objective yet →", tone: "default", hasData: false };
      const pct = Math.round(
        objectiveProgress(d.keyResults.filter((k) => k.objective_id === objective.id)) * 100,
      );
      return { text: `${pct}% this quarter`, tone: "default", hasData: true };
    }

    case "misogi": {
      const active = d.misogiCandidates.find(isMisogiActive);
      if (active?.event_date) {
        const days = daysUntil(active.event_date);
        return days >= 0
          ? { text: `D-${days} · ${active.title}`, tone: "accent", hasData: true }
          : { text: "Event passed — debrief it →", tone: "warning", hasData: true };
      }
      const vaultCount = d.misogiCandidates.filter((c) => c.status === "candidate").length;
      return vaultCount > 0
        ? { text: `${vaultCount} in the vault`, tone: "default", hasData: true }
        : { text: "No misogi yet →", tone: "default", hasData: false };
    }

    case "adventure-ledger": {
      const upcoming = d.adventures
        .filter((a) => (a.status === "scheduled" || a.status === "booked") && a.target_date)
        .sort((a, b) => a.target_date!.localeCompare(b.target_date!))[0];
      return upcoming
        ? { text: `${upcoming.target_date} · ${upcoming.title}`, tone: "accent", hasData: true }
        : { text: "No adventures planned →", tone: "default", hasData: false };
    }

    case "deep-work": {
      const days = weekDates(mondayOfWeek());
      const minutes = d.deepWorkSessions
        .filter((s) => days.includes(s.date) && s.actual_duration !== null)
        .reduce((sum, s) => sum + (s.actual_duration ?? 0), 0);
      return { text: `${(minutes / 60).toFixed(1)} hrs protected this week`, tone: "default", hasData: minutes > 0 };
    }

    case "woop":
      return d.woopEntries.length > 0
        ? { text: `${d.woopEntries.length} plan${d.woopEntries.length === 1 ? "" : "s"} saved`, tone: "default", hasData: true }
        : { text: "No plan yet →", tone: "default", hasData: false };

    case "habit-foundry": {
      const installing = d.habits.find((h) => h.status === "installing");
      if (!installing) return { text: "No habit installing →", tone: "default", hasData: d.habits.length > 0 };
      const day = installing.start_date ? daysBetween(installing.start_date) + 1 : 1;
      return { text: `Day ${day} · ${installing.title}`, tone: "default", hasData: true };
    }

    case "deliberate-practice": {
      const skill = d.practiceSkills.find((s) => s.is_active);
      if (!skill) return { text: "No skill yet →", tone: "default", hasData: d.practiceSkills.length > 0 };
      const last = [...d.practiceSessions]
        .filter((s) => s.skill_id === skill.id)
        .sort((a, b) => b.date.localeCompare(a.date))[0];
      return {
        text: last ? `${skill.skill_name} · last: ${last.sub_skill_focus}` : `${skill.skill_name} · no sessions yet`,
        tone: "default",
        hasData: true,
      };
    }

    case "annual-review": {
      const prevQuarter = shiftQuarter(currentQuarter(), -1);
      const reviewed = d.reviews.some((r) => r.period_type === "quarterly" && r.period_label === prevQuarter);
      return reviewed
        ? { text: "Up to date", tone: "default", hasData: true }
        : { text: `Due · ${prevQuarter} quarterly`, tone: "warning", hasData: d.reviews.length > 0 };
    }

    case "gratitude": {
      const week = mondayOfWeek();
      const logged = d.gratitude.some((e) => e.week_of === week);
      return logged
        ? { text: "Logged this week", tone: "default", hasData: true }
        : { text: "Not logged yet →", tone: "default", hasData: d.gratitude.length > 0 };
    }

    default:
      return { text: "—", tone: "default", hasData: false };
  }
}

export function yearProgress(slug: string, d: AllModuleData, year: number): YearProgress {
  switch (slug) {
    case "habit-foundry": {
      let filled = 0;
      let partial = 0;
      for (let q = 1; q <= 4; q++) {
        const habit = d.habits.find((h) => h.quarter === `${year}-Q${q}`);
        if (habit?.status === "automatic") filled++;
        else if (habit?.status === "installing") partial++;
      }
      return { kind: "segments", total: 4, filled, partial };
    }

    case "adventure-ledger": {
      const done = d.adventures.filter(
        (a) => a.status === "done" && yearOf(a.target_date) === year,
      ).length;
      return { kind: "segments", total: YEARLY_TARGET, filled: Math.min(done, YEARLY_TARGET) };
    }

    case "odyssey-plan": {
      const drafted = d.plans.filter((p) => isDrafted(p.plan_text)).length;
      return { kind: "segments", total: 3, filled: drafted };
    }

    case "annual-review": {
      let filled = 0;
      for (let q = 1; q <= 4; q++) {
        if (d.reviews.some((r) => r.period_type === "quarterly" && r.period_label === `${year}-Q${q}`)) filled++;
      }
      return { kind: "segments", total: 4, filled };
    }

    case "annual-okrs": {
      const quarter = currentQuarter();
      const objective = d.objectives.find((o) => o.quarter === quarter);
      const pct = objective
        ? Math.round(objectiveProgress(d.keyResults.filter((k) => k.objective_id === objective.id)) * 100)
        : 0;
      return { kind: "bar", pct, caption: `${quarter} objective` };
    }

    case "deep-work":
      return { kind: "chart" };

    case "misogi": {
      const active = d.misogiCandidates.find(isMisogiActive);
      if (active?.event_date) {
        const days = daysUntil(active.event_date);
        return { kind: "text", text: days >= 0 ? `Training · D-${days}` : "Event passed" };
      }
      const done = d.misogiCandidates.filter((c) => c.status === "done" && yearOf(c.event_date) === year).length;
      const failed = d.misogiCandidates.filter(
        (c) => c.status === "failed_worth_it" && yearOf(c.event_date) === year,
      ).length;
      return { kind: "text", text: done + failed > 0 ? `${done} done · ${failed} failed — worth it` : "No misogi committed" };
    }

    case "values-compass":
      return { kind: "text", text: d.values.length > 0 ? plural(d.values.length, "value") + " set" : "Not sorted yet" };

    case "woop": {
      const count = d.woopEntries.filter((e) => yearOf(e.created_at.slice(0, 10)) === year).length;
      return { kind: "text", text: `${count} plan${count === 1 ? "" : "s"} this year` };
    }

    case "deliberate-practice": {
      const skill = d.practiceSkills.find((s) => s.is_active);
      const count = skill
        ? d.practiceSessions.filter((s) => s.skill_id === skill.id && yearOf(s.date) === year).length
        : 0;
      return { kind: "text", text: skill ? `${plural(count, "session")} this year` : "No active skill" };
    }

    case "gratitude": {
      const weeks = new Set(
        d.gratitude.filter((e) => yearOf(e.week_of) === year).map((e) => e.week_of),
      ).size;
      return { kind: "bar", pct: Math.round((weeks / 52) * 100), caption: `${plural(weeks, "week")} logged` };
    }

    default:
      return { kind: "text", text: "—" };
  }
}
