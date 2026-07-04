import type { Metadata } from "next";

import { DeepWorkModule } from "@/components/deepwork/deep-work-module";

export const metadata: Metadata = { title: "Deep Work & Time Blocking" };

export default function DeepWorkPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <DeepWorkModule />
    </div>
  );
}
