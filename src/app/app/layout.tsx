import Link from "next/link";

import { AppNav } from "@/components/app-nav";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-2 sm:px-6">
          <Link
            href="/app/dashboard"
            className="shrink-0 font-mono text-sm font-semibold uppercase tracking-[0.18em] text-primary"
          >
            Blueprint
          </Link>
          <AppNav />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
