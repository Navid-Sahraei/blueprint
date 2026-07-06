import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { LAYERS, methodsByLayer, type Layer } from "@/lib/methods";
import { cn } from "@/lib/utils";

const LAYER_OUTCOMES: Record<Layer["id"], { tail: string; body: string }> = {
  1: {
    tail: "know what this year is actually for.",
    body: "Most years drift because nobody decided where they were going. Name your values, sketch a few possible futures, and set goals specific enough to act on.",
  },
  2: {
    tail: "do something you’ll still be telling people about.",
    body: "One hard challenge with a real chance of failure, and a handful of small adventures. The parts of the year you’ll actually remember.",
  },
  3: {
    tail: "protect the work that matters from the noise.",
    body: "A place for the deep, focused hours that move things forward — and a method for turning a vague goal into a plan you’ll follow when it gets hard.",
  },
  4: {
    tail: "end the year better at something than you started.",
    body: "One habit installed properly each quarter, and steady, feedback-driven practice toward a single skill.",
  },
  5: {
    tail: "make next year smarter than this one.",
    body: "A structured review that turns twelve months of experience into something you can actually use.",
  },
};

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
            <h1 className="draft-in max-w-3xl font-mono text-4xl font-semibold leading-tight tracking-tight text-primary sm:text-5xl">
              Stop rebuilding your life system every January.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              A goals app you tried for a week. A habit tracker three phones
              ago. A planner you set up once, felt good about, and never
              opened again. Every year the same restart, and by spring
              you&rsquo;re back to managing tasks when what you wanted was to
              design a life.
            </p>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Blueprint is one system instead of five. Ten proven planning
              methods across five layers — from setting your direction to
              closing the loop at year&rsquo;s end — and you pick the ones
              that fit. Nothing forces you into a single philosophy. Every
              method names the research or the book behind it, and says
              plainly where the evidence is thinner than the hype. Your whole
              year, in one place, built to actually hold.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/app/dashboard"
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
            Five layers. Ten methods. You build the stack.
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            A full year needs more than a to-do list. Blueprint breaks the
            work into five questions, and gives you proven methods to answer
            each one. Run all ten, or three — the system holds either way.
          </p>
          <div className="mt-10 grid gap-4">
            {LAYERS.map((layer) => {
              const methods = methodsByLayer(layer.id);
              const outcome = LAYER_OUTCOMES[layer.id];
              return (
                <div
                  key={layer.id}
                  className="corner-marks grid gap-4 border border-border bg-card p-6 sm:grid-cols-[280px_1fr]"
                >
                  <div>
                    <p className="measure text-xs text-dimension">
                      LAYER {String(layer.id).padStart(2, "0")}
                    </p>
                    <h3 className="mt-1 font-mono text-lg font-semibold text-primary">
                      {layer.name} — {outcome.tail}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {outcome.body}
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
                <p className="label-technical mb-3">Sources, not slogans</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Every method names its research — Locke &amp; Latham on
                  goals, Oettingen on mental contrasting, Lally on how habits
                  actually form. Author, year, journal. Never &ldquo;studies
                  show.&rdquo;
                </p>
              </div>
              <div>
                <p className="label-technical mb-3">Honest about the limits</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  The 21-day habit rule is a myth (the real median is 66
                  days). The 10,000-hour rule is a simplification its own
                  researcher disputed. Where the science is thinner than the
                  hype, Blueprint says so.
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
