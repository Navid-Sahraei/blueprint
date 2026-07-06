"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

/** Journey order: direction → big moves → execution → mastery → loop. */
const LINKS = [
  { href: "/app/dashboard", label: "Dashboard" },
  { href: "/app/values", label: "Values" },
  { href: "/app/life-design", label: "Odyssey" },
  { href: "/app/goals", label: "Goals" },
  { href: "/app/misogi", label: "Misogi" },
  { href: "/app/adventures", label: "Adventures" },
  { href: "/app/deep-work", label: "Deep Work" },
  { href: "/app/woop", label: "Mental Contrasting" },
  { href: "/app/habits", label: "Habits" },
  { href: "/app/practice", label: "Practice" },
  { href: "/app/review", label: "Review" },
  { href: "/app/gratitude", label: "Gratitude" },
  { href: "/methods", label: "Methods" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Modules"
      className="no-scrollbar -mx-1 flex flex-1 items-center gap-1 overflow-x-auto px-1 text-sm"
    >
      {LINKS.map((link) => {
        const active =
          pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "shrink-0 border-b-2 px-2 py-1.5 transition-colors",
              active
                ? "border-primary font-medium text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
