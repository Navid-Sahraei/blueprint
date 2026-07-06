import type { Metadata } from "next";

import { WoopModule } from "@/components/woop/woop-module";

export const metadata: Metadata = { title: "Mental Contrasting" };

export default function WoopPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <WoopModule />
    </div>
  );
}
