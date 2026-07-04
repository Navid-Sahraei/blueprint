import type { Metadata } from "next";

import { PracticeModule } from "@/components/practice/practice-module";

export const metadata: Metadata = { title: "Deliberate Practice Tracker" };

export default function PracticePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PracticeModule />
    </div>
  );
}
