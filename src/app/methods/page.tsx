import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { LAYERS, methodsByLayer } from "@/lib/methods";

export const metadata: Metadata = {
  title: "Methods & sources",
  description:
    "The ten methods inside Blueprint, organized in five layers — each with the research and practitioner sources behind it, cited by author, year, and publication.",
};

export default function MethodsPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <p className="label-technical mb-4">Methods &amp; sources</p>
          <h1 className="font-mono text-3xl font-semibold text-primary sm:text-4xl">
            Ten methods. Every one shows its work.
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Blueprint separates two kinds of grounding and labels them
            honestly: peer-reviewed research, cited by author, year, and
            journal — and practitioner frameworks from named books, which are
            valuable but are not studies. Where popular claims outrun the
            evidence, the method page says so.
          </p>

          <div className="mt-14 space-y-14">
            {LAYERS.map((layer) => (
              <section key={layer.id}>
                <div className="flex items-baseline gap-3 border-b border-border pb-3">
                  <span className="measure text-xs text-dimension">
                    LAYER {String(layer.id).padStart(2, "0")}
                  </span>
                  <h2 className="font-mono text-xl font-semibold text-primary">
                    {layer.name}
                  </h2>
                  <span className="hidden text-sm text-muted-foreground sm:inline">
                    {layer.question}
                  </span>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {methodsByLayer(layer.id).map((method) => (
                    <Link
                      key={method.slug}
                      href={`/methods/${method.slug}`}
                      className="corner-marks group block border border-border bg-card p-5 transition-colors hover:border-primary"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-medium text-foreground group-hover:text-primary">
                          {method.name}
                        </h3>
                        {method.freeTier && <Badge variant="outline">Free</Badge>}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {method.tagline}
                      </p>
                      <p className="measure mt-4 text-xs text-dimension">
                        {method.sources.length} source
                        {method.sources.length === 1 ? "" : "s"} cited
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
