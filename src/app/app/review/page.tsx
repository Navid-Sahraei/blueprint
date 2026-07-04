import type { Metadata } from "next";

import { ReviewModule } from "@/components/review/review-module";

export const metadata: Metadata = { title: "Annual / Quarterly Review" };

export default function ReviewPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <ReviewModule />
    </div>
  );
}
