import type { Metadata } from "next";

import { GratitudeModule } from "@/components/gratitude/gratitude-module";

export const metadata: Metadata = { title: "Gratitude Practice" };

export default function GratitudePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <GratitudeModule />
    </div>
  );
}
