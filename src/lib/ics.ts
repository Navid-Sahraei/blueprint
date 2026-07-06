/**
 * Minimal, dependency-free .ics (iCalendar) generation for single-event
 * "Add to calendar" downloads. No account, no API — just a client-side
 * file. See RFC 5545 for the format; this covers the subset we need.
 */

function escapeText(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

/** ISO date (YYYY-MM-DD) → the VALUE=DATE form iCalendar wants (YYYYMMDD). */
function toIcsDate(iso: string): string {
  return iso.replace(/-/g, "");
}

function foldLine(line: string): string {
  // RFC 5545 §3.1: lines over 75 octets should be folded with a leading space.
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  let rest = line;
  while (rest.length > 75) {
    chunks.push(rest.slice(0, 75));
    rest = " " + rest.slice(75);
  }
  chunks.push(rest);
  return chunks.join("\r\n");
}

export interface IcsEvent {
  title: string;
  /** ISO date (YYYY-MM-DD). Rendered as an all-day event. */
  date: string;
  description?: string;
}

export function buildIcs(event: IcsEvent): string {
  const uid = `${crypto.randomUUID()}@blueprint`;
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const start = toIcsDate(event.date);
  // All-day events need DTEND on the following day per RFC 5545.
  const end = toIcsDate(
    new Date(new Date(`${event.date}T00:00:00`).getTime() + 86_400_000)
      .toISOString()
      .slice(0, 10),
  );

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Blueprint//Annual Planning//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${escapeText(event.title)}`,
    ...(event.description ? [`DESCRIPTION:${escapeText(event.description)}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.map(foldLine).join("\r\n") + "\r\n";
}

function slugifyFilename(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "event";
}

/** Builds the .ics and triggers a browser download. Client-side only. */
export function downloadIcs(event: IcsEvent): void {
  const blob = new Blob([buildIcs(event)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slugifyFilename(event.title)}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
