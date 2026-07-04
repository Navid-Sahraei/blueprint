import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { LAYERS, methodsByLayer } from "@/lib/methods";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="blueprint-grid border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <p className="label-technical mb-6">
              Annual planning system · rev. {new Date().getFullYear()}
            </p>
            <h1 className="max-w-3xl font-mono text-4xl font-semibold leading-tight tracking-tight text-primary sm:text-5xl">
              Design your year like a structure.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Blueprint is not another habit tracker. It is a five-layer
              planning system — values, goals, bold moves, execution, review —
              assembled from ten methods that each cite the research or the
              named practitioner framework behind them. You choose the modules;
              nothing forces you into one philosophy.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className={cn(buttonVariants({ variant: "accent", size: "lg" }))}
              >
                Start your year
              </Link>
              <Link
                href="/methods"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                Read the methods &amp; sources
              </Link>
            </div>
          </div>
        </section>

        {/* Five layers */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="label-technical mb-3">The framework</p>
          <h2 className="font-mono text-2xl font-semibold text-primary sm:text-3xl">
            Five layers, ten methods, your choice of stack.
          </h2>
          <div className="mt-10 grid gap-4">
            {LAYERS.map((layer) => {
              const methods = methodsByLayer(layer.id);
              return (
                <div
                  key={layer.id}
                  className="corner-marks grid gap-4 border border-border bg-card p-6 sm:grid-cols-[220px_1fr]"
                >
                  <div>
                    <p className="measure text-xs text-dimension">
                      LAYER {String(layer.id).padStart(2, "0")}
                    </p>
                    <h3 className="mt-1 font-mono text-lg font-semibold text-primary">
                      {layer.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {layer.question}
                    </p>
                  </div>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {methods.map((method) => (
                      <li key={method.slug}>
                        <Link
                          href={`/methods/${method.slug}`}
                          className="group block h-full border border-border bg-background p-4 transition-colors hover:border-primary"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-foreground group-hover:text-primary">
                              {method.name}
                            </span>
                            {method.freeTier && (
                              <Badge variant="outline">Free</Badge>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {method.tagline}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Evidence positioning */}
        <section className="border-t border-border bg-secondary/50">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="grid gap-10 md:grid-cols-3">
              <div>
                <p className="label-technical mb-3">No vague claims</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Every method names its sources — Locke &amp; Latham on goal
                  setting, Oettingen on mental contrasting, Lally on habit
                  formation. Author, year, journal. Never &ldquo;studies
                  show.&rdquo;
                </p>
              </div>
              <div>
                <p className="label-technical mb-3">Honest about limits</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  The 21-day habit figure is a myth (the real median is 66
                  days). The 10,000-hour rule is a simplification its own
                  researcher disputed. Where the science is thinner than the
                  hype, Blueprint says so in the interface.
                </p>
              </div>
              <div>
                <p className="label-technical mb-3">Books labeled as books</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Deep Work, The Comfort Crisis, and Designing Your Life are
                  practitioner frameworks, not peer-reviewed findings. We cite
                  the book, then separately cite the research it draws on.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
