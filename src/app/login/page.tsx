import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";

import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
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
          Log in
        </h1>
        <p className="mb-6 mt-1 text-sm text-muted-foreground">
          Back to the drafting table.
        </p>
        <Suspense>
          <AuthForm mode="login" />
        </Suspense>
      </div>
    </main>
  );
}
