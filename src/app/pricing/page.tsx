import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Start free with the Habit Foundry and method previews. Blueprint Pro unlocks all eleven methods, the cross-module dashboard, and data export.",
};

const FREE_FEATURES = [
  "Habit Foundry — the full module, free forever",
  "Read-only previews of all other modules (real UI, sample data)",
  "Annual reflection template (light version)",
  "All eleven method pages with full source citations",
];

const PRO_FEATURES = [
  "All eleven modules across all five layers",
  "Cross-module dashboard — your year at a glance",
  "Quarterly review auto-populated from every module",
  "Data export (CSV / JSON) for every module",
  "Calendar sync",
  "Unlimited historical years and archives",
];

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <p className="label-technical mb-4">Pricing</p>
          <h1 className="font-mono text-3xl font-semibold text-primary sm:text-4xl">
            Start free. Upgrade when the system earns it.
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            No dark patterns: paid modules show you their real interface with
            sample data before any paywall, and cancelling is as easy as
            signing up.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* Free tier */}
            <div className="corner-marks border border-border bg-card p-8">
              <p className="label-technical">Free</p>
              <p className="measure mt-4 text-4xl font-semibold text-primary">
                $0
              </p>
              <p className="mt-1 text-sm text-muted-foreground">forever</p>
              <ul className="mt-8 space-y-3">
                {FREE_FEATURES.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-dimension"
                      aria-hidden
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/app/dashboard"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "mt-8 w-full",
                )}
              >
                Create a free account
              </Link>
            </div>

            {/* Pro tier */}
            <div className="corner-marks border-2 border-primary bg-card p-8">
              <div className="flex items-center justify-between">
                <p className="label-technical">Blueprint Pro</p>
                <Badge variant="accent">Full system</Badge>
              </div>
              <p className="measure mt-4 text-4xl font-semibold text-primary">
                $79<span className="text-lg text-muted-foreground">/year</span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                One annual plan — no monthly option. Blueprint is a system for
                planning a year; the pricing follows its own logic.
              </p>
              <ul className="mt-8 space-y-3">
                {PRO_FEATURES.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-accent"
                      aria-hidden
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/app/dashboard"
                className={cn(
                  buttonVariants({ variant: "accent" }),
                  "mt-8 w-full",
                )}
              >
                Start your year
              </Link>
            </div>
          </div>

          <p className="mt-10 text-sm text-muted-foreground">
            Billed once a year, cancel anytime before renewal — no monthly
            plan, because a system for designing your year shouldn&apos;t
            bill you like a gym membership.
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            Prefer paper?{" "}
            <a href="#pdf-coming-soon" className="text-primary underline-offset-4 hover:underline">
              Get the printable planner
            </a>
            . Live in Notion?{" "}
            <a href="#notion-coming-soon" className="text-primary underline-offset-4 hover:underline">
              Use it in Notion
            </a>
            .
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
