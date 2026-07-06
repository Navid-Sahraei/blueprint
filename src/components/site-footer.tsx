import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-technical">
            Blueprint — design your year like a structure
          </p>
          <nav className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/methods" className="hover:text-foreground">
              Methods &amp; sources
            </Link>
            <Link href="/pricing" className="hover:text-foreground">
              Pricing
            </Link>
            <Link href="/login" className="hover:text-foreground">
              Log in
            </Link>
          </nav>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-4 text-sm text-muted-foreground">
          <a href="#pdf-coming-soon" className="hover:text-foreground">
            Prefer paper? Get the printable planner
          </a>
          <a href="#notion-coming-soon" className="hover:text-foreground">
            Use it in Notion
          </a>
        </div>
      </div>
    </footer>
  );
}
