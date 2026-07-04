import type { Metadata } from "next";

import { AdventureModule } from "@/components/adventures/adventure-module";

export const metadata: Metadata = { title: "Adventure Ledger" };

export default function AdventuresPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <AdventureModule />
    </div>
  );
}
