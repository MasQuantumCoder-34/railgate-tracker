"use client";

import { formatTime } from "@/lib/utils";
import type { GateUpdate } from "@/types";

interface LiveFeedProps {
  updates: GateUpdate[];
}

export function LiveFeed({ updates }: LiveFeedProps) {
  if (!updates || updates.length === 0) {
    return (
      <div className="rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-3">
          Live Activity
        </p>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-3">
        Live Activity
      </p>
      <div className="space-y-2">
        {updates.slice(0, 10).map((u) => (
          <div key={u._id} className="flex items-center gap-3 text-sm">
            <span className="text-xs text-[hsl(var(--muted-foreground))] font-mono w-14 shrink-0">
              {formatTime(u.timestamp)}
            </span>
            <span
              className={`inline-flex items-center gap-1 font-semibold text-xs px-2 py-0.5 rounded ${
                u.status === "OPEN"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              ● {u.status === "OPEN" ? "Gate Open" : "Gate Closed"}
            </span>
            {u.status === "CLOSED" && (
              <span className="text-xs text-[hsl(var(--muted-foreground))]">
                ~{u.waitTime}m{u.trainsInQueue && u.trainsInQueue > 1 ? ` · ${u.trainsInQueue} trains` : ""}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}