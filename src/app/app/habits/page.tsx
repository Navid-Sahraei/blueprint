import type { Metadata } from "next";

import { HabitFoundry } from "@/components/habits/habit-foundry";

export const metadata: Metadata = { title: "Habit Foundry" };

export default function HabitsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <HabitFoundry />
    </div>
  );
}
