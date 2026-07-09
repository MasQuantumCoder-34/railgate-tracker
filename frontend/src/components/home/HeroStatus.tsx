"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface HeroStatusProps {
  status: "OPEN" | "CLOSED";
  waitTime: number;
  lastUpdated?: string;
  trainName?: string;
  trainNumber?: string;
  direction?: string;
}

export function HeroStatus({ status, waitTime, lastUpdated, trainName, trainNumber, direction }: HeroStatusProps) {
  const [remaining, setRemaining] = useState(waitTime);
  const closed = status === "CLOSED";

  useEffect(() => {
    setRemaining(waitTime);
    if (!closed || !waitTime || !lastUpdated) return;
    const elapsed = Math.floor((Date.now() - new Date(lastUpdated).getTime()) / 60000);
    setRemaining(Math.max(0, waitTime - elapsed));
    const id = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 60000);
    return () => clearInterval(id);
  }, [closed, waitTime, lastUpdated]);

  const reopenTime = lastUpdated && closed
    ? new Date(new Date(lastUpdated).getTime() + waitTime * 60000)
    : null;

  const reopened = closed && reopenTime && new Date() > reopenTime;
  const displayMins = reopened ? 0 : remaining;

  return (
    <div
      className={cn(
        "sticky top-16 z-30 rounded-xl overflow-hidden",
        closed ? "bg-gradient-to-r from-red-600 to-rose-600" : "bg-gradient-to-r from-green-600 to-emerald-600"
      )}
    >
      <div className="px-5 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <span className="text-3xl md:text-4xl">{closed ? "🔴" : "🟢"}</span>
            <div>
              <p className={cn("text-xl md:text-2xl font-bold tracking-tight", closed ? "text-red-100" : "text-green-100")}>
                GATE {status}
              </p>
              {closed && (
                <p className="text-xs md:text-sm text-red-200 mt-0.5">
                  {trainName || "Train"} {direction === "up" ? "→" : "←"}
                  {trainNumber ? ` #${trainNumber}` : ""}
                </p>
              )}
            </div>
          </div>
          <span className="relative flex h-2.5 w-2.5">
            <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", closed ? "bg-red-300" : "bg-green-300")} />
            <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", closed ? "bg-red-300" : "bg-green-300")} />
          </span>
        </div>

        {closed && (
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl md:text-7xl font-black text-white tabular-nums">{displayMins}</span>
              <span className="text-lg md:text-xl font-medium text-red-200">min</span>
            </div>
            {reopenTime && !reopened && (
              <p className="text-xs md:text-sm text-red-200 mt-1">Reopens ~{format(reopenTime, "hh:mm a")}</p>
            )}
            {reopened && (
              <p className="text-xs md:text-sm text-amber-200 mt-1 font-medium">Overdue - gate may need manual reopening</p>
            )}
          </div>
        )}

        {!closed && (
          <p className="text-white/90 text-base md:text-lg mt-1 font-medium">Road Clear</p>
        )}

        {lastUpdated && (
          <p className={cn("text-xs md:text-sm mt-3", closed ? "text-red-200" : "text-green-200")}>
            Updated {format(new Date(lastUpdated), "hh:mm a")}
          </p>
        )}
      </div>
      {closed && (
        <div className="h-1.5 bg-black/20">
          <div
            className="h-full bg-white/40 transition-all duration-1000 rounded-r-full"
            style={{ width: `${waitTime > 0 ? (displayMins / waitTime) * 100 : 0}%` }}
          />
        </div>
      )}
    </div>
  );
}