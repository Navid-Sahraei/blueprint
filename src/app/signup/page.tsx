import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Create your account" };

// Signups are closed while AUTH_REQUIRED (src/lib/flags.ts) is false.
// Restore the AuthForm below when re-enabling auth.

export default function SignupPage() {
  return (
    <main className="blueprint-grid flex min-h-screen items-center justify-center px-4">
      <div className="corner-marks w-full max-w-sm border border-border bg-card p-8">
        <Link
          href="/"
          className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-primary"
        >
          Blueprint
        </Link>
        <h1 className="mt-6 font-mono text-xl font-semibold text-primary">
          Signups are closed for now
        </h1>
        <p className="mb-6 mt-1 text-sm text-muted-foreground">
          The app is still in development. Jump straight into the dashboard
          below — no account needed yet.
        </p>
        <Link
          href="/app/dashboard"
          className={cn(buttonVariants({ variant: "accent" }), "w-full")}
        >
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}
