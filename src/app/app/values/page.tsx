import type { Metadata } from "next";

import { ValuesCompass } from "@/components/values/values-compass";

export const metadata: Metadata = { title: "Values Compass" };

export default function ValuesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <ValuesCompass />
    </div>
  );
}
