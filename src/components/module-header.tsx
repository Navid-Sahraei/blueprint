import type { ReactNode } from "react";

/**
 * Shared module header: layer label, draft-in title (the design brief's
 * signature entrance), right-aligned measurement line, intro paragraph.
 */
export function ModuleHeader({
  layer,
  title,
  meta,
  children,
}: {
  layer: string;
  title: string;
  meta?: string;
  children?: ReactNode;
}) {
  return (
    <header>
      <p className="label-technical mb-2">{layer}</p>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="draft-in font-mono text-3xl font-semibold text-primary">
          {title}
        </h1>
        {meta && <p className="measure text-xs text-dimension">{meta}</p>}
      </div>
      {children && (
        <p className="mt-3 max-w-2xl text-muted-foreground">{children}</p>
      )}
    </header>
  );
}
