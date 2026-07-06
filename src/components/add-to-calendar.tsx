"use client";

import { Button } from "@/components/ui/button";
import { downloadIcs, type IcsEvent } from "@/lib/ics";

export function AddToCalendarButton({
  event,
  size = "sm",
}: {
  event: IcsEvent;
  size?: "sm" | "default";
}) {
  return (
    <Button
      type="button"
      size={size}
      variant="outline"
      onClick={() => downloadIcs(event)}
    >
      Add to calendar
    </Button>
  );
}
