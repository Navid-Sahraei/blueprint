import type { Metadata } from "next";

import { MisogiModule } from "@/components/misogi/misogi-module";

export const metadata: Metadata = { title: "Misogi OS" };

export default function MisogiPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <MisogiModule />
    </div>
  );
}
