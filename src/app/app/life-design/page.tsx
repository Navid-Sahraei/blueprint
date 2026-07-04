import type { Metadata } from "next";

import { OdysseyModule } from "@/components/lifedesign/odyssey-module";

export const metadata: Metadata = { title: "Life Design / Odyssey Plan" };

export default function LifeDesignPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <OdysseyModule />
    </div>
  );
}
