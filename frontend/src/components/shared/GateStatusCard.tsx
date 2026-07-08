"use client";

import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";

interface GateStatusCardProps {
  status: "OPEN" | "CLOSED";
  waitTime?: number;
  lastUpdated?: string;
}

export function GateStatusCard({
  status,
  waitTime,
  lastUpdated,
}: GateStatusCardProps) {
  const isOpen = status === "OPEN";

  return (
    <Card className="h-full">
      <CardContent className="p-6 md:p-8 flex flex-col justify-between h-full">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {isOpen ? (
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 md:p-4">
                <CheckCircle2 className="h-8 w-8 md:h-10 md:w-10 text-green-500" />
              </div>
            ) : (
              <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3 md:p-4">
                <XCircle className="h-8 w-8 md:h-10 md:w-10 text-red-500" />
              </div>
            )}
            <div>
              <p className="text-xs md:text-sm font-medium text-[hsl(var(--muted-foreground))]">
                Current Status
              </p>
              <p className="text-xl md:text-3xl font-bold mt-1">
                <span className={isOpen ? "text-green-600" : "text-red-600"}>
                  {status}
                </span>
              </p>
              <p className="text-sm md:text-base text-[hsl(var(--muted-foreground))] mt-1">
                {isOpen
                  ? "No waiting — gate is open"
                  : (waitTime ?? 0) > 0
                  ? `Estimated wait: ~${waitTime} minutes`
                  : "No waiting"}
              </p>
            </div>
          </div>
          {!isOpen && (waitTime ?? 0) > 0 && (
            <div className="flex flex-col items-center gap-1 text-amber-500 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-4 py-3">
              <Clock className="h-5 w-5" />
              <span className="text-xl md:text-2xl font-bold">{waitTime}</span>
              <span className="text-xs">min</span>
            </div>
          )}
        </div>
        {lastUpdated && (
          <p className="mt-4 md:mt-6 text-xs text-[hsl(var(--muted-foreground))] border-t border-[hsl(var(--border))] pt-3">
            Last updated: {formatDateTime(lastUpdated)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
