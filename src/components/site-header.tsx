import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-primary"
        >
          Blueprint
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/methods"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Methods
          </Link>
          <Link
            href="/pricing"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Pricing
          </Link>
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Log in
          </Link>
          <Link
            href="/app/dashboard"
            className={cn(
              buttonVariants({ variant: "accent", size: "sm" }),
              "hidden sm:inline-flex",
            )}
          >
            Start your year
          </Link>
        </nav>
      </div>
    </header>
  );
}
