"use client";

import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatTime, getRelativeTime } from "@/lib/utils";
import { EmptyState } from "./EmptyState";
import type { GateUpdate } from "@/types";

interface RecentUpdatesProps {
  updates: GateUpdate[];
}

export function RecentUpdates({ updates }: RecentUpdatesProps) {
  if (!updates || updates.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="No Updates"
        description="No gate status updates recorded yet."
      />
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Recent Updates</h3>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[hsl(var(--border))]" />
        <div className="space-y-4">
          {updates.slice(0, 10).map((update) => (
            <div key={update._id} className="relative pl-10">
              <div className="absolute left-2.5 top-1.5 h-3 w-3 rounded-full border-2 border-brand-500 bg-[hsl(var(--card))]" />
              <div className="flex items-center justify-between gap-2">
                <Badge
                  variant={
                    update.status === "OPEN" ? "success" : "destructive"
                  }
                >
                  {update.status}
                </Badge>
                <span className="text-xs text-[hsl(var(--muted-foreground))]">
                  {getRelativeTime(update.timestamp)}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                <Clock className="h-3 w-3" />
                <span>{formatTime(update.timestamp)}</span>
                {update.status === "CLOSED" && update.waitTime && (
                  <span className="font-medium text-amber-500">
                    ~{update.waitTime} min wait
                  </span>
                )}
                {update.trainsInQueue && update.trainsInQueue > 0 && (
                  <span className="text-xs text-white/70 bg-[hsl(var(--muted-foreground))]/20 px-1.5 py-0.5 rounded">
                    {update.trainsInQueue} train{update.trainsInQueue > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              {update.status === "CLOSED" && (
                <p className="text-sm mt-0.5">
                  {update.trainName || "Goods Train"}
                  {update.trainNumber ? ` (${update.trainNumber})` : ""}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
