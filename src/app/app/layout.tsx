import Link from "next/link";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3 sm:px-6">
          <Link
            href="/app/dashboard"
            className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-primary"
          >
            Blueprint
          </Link>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <Link href="/app/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/app/values" className="hover:text-foreground">
              Values
            </Link>
            <Link href="/app/goals" className="hover:text-foreground">
              Goals
            </Link>
            <Link href="/app/habits" className="hover:text-foreground">
              Habits
            </Link>
            <Link href="/app/woop" className="hover:text-foreground">
              WOOP
            </Link>
            <Link href="/methods" className="hover:text-foreground">
              Methods
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
