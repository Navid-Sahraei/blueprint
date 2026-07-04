import Link from "next/link";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/app/dashboard"
            className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-primary"
          >
            Blueprint
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/app/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/app/habits" className="hover:text-foreground">
              Habits
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
