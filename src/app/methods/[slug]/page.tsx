import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  getMethod,
  LAYERS,
  METHODS,
  SOURCE_KIND_LABEL,
} from "@/lib/methods";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return METHODS.map((method) => ({ slug: method.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const method = getMethod(slug);
  if (!method) return {};
  return {
    title: method.name,
    description: method.tagline,
  };
}

export default async function MethodPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const method = getMethod(slug);
  if (!method) notFound();

  const layer = LAYERS.find((l) => l.id === method.layerId)!;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <p className="label-technical mb-4">
            Layer {String(layer.id).padStart(2, "0")} · {layer.name}
          </p>
          <h1 className="font-mono text-3xl font-semibold text-primary sm:text-4xl">
            {method.name}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">{method.tagline}</p>

          <Separator className="my-8" />

          <section>
            <h2 className="label-technical mb-3">What it does</h2>
            <p className="leading-relaxed">{method.description}</p>
          </section>

          <section className="mt-10">
            <h2 className="label-technical mb-3">Why this works</h2>
            <p className="leading-relaxed">{method.whyItWorks}</p>
          </section>

          {method.honestyNote && (
            <section className="corner-marks mt-10 border border-border bg-secondary/60 p-5">
              <h2 className="label-technical mb-2">Honest caveat</h2>
              <p className="text-sm leading-relaxed">{method.honestyNote}</p>
            </section>
          )}

          <section className="mt-10">
            <h2 className="label-technical mb-3">Inside the module</h2>
            <ul className="space-y-2">
              {method.features.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm">
                  <span className="measure text-dimension" aria-hidden>
                    —
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="label-technical mb-3">Sources</h2>
            <ul className="space-y-4">
              {method.sources.map((source) => (
                <li
                  key={source.citation}
                  className="border-l-2 border-border pl-4"
                >
                  <Badge variant="outline" className="mb-1.5">
                    {SOURCE_KIND_LABEL[source.kind]}
                  </Badge>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {source.citation}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <Separator className="my-10" />

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/app/dashboard"
              className={cn(buttonVariants({ variant: "accent" }))}
            >
              {method.freeTier
                ? "Use this method free"
                : "Start your Blueprint"}
            </Link>
            <Link
              href="/methods"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              ← All methods
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
