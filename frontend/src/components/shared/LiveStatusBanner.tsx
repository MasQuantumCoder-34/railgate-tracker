"use client";

import { CheckCircle, XCircle, Clock, Train, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface LiveStatusBannerProps {
  status: "OPEN" | "CLOSED";
  waitTime?: number;
  lastUpdated?: string;
  trainsInQueue?: number;
}

export function LiveStatusBanner({ status, waitTime, lastUpdated, trainsInQueue }: LiveStatusBannerProps) {
  const isOpen = status === "OPEN";

  const estimatedReopen = lastUpdated && waitTime
    ? new Date(new Date(lastUpdated).getTime() + waitTime * 60000)
    : null;

  const isOverdue = estimatedReopen && new Date() > estimatedReopen;

  const gradient = isOpen
    ? "bg-gradient-to-r from-green-600 via-green-500 to-emerald-500"
    : isOverdue
    ? "bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500"
    : "bg-gradient-to-r from-red-600 via-red-500 to-rose-500";

  return (
    <div className={cn("relative overflow-hidden rounded-2xl p-5 md:p-8 lg:p-10 text-white", gradient)}>
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
        <div className="rounded-full p-3 bg-white/20">
          {isOpen ? (
            <CheckCircle className="h-8 w-8 md:h-10 md:w-10" />
          ) : (
            <XCircle className="h-8 w-8 md:h-10 md:w-10" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-bold">
              {isOpen ? "Gate Open" : isOverdue ? "Gate Overdue" : "Gate Closed"}
            </h2>
            <span
              className={cn(
                "inline-flex h-3 w-3 rounded-full animate-pulse",
                isOpen ? "bg-green-300" : "bg-red-300"
              )}
            />
          </div>
          {!isOpen && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-white/90">
              {waitTime !== undefined && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-base md:text-lg font-semibold">
                    ~{waitTime} min wait
                  </span>
                </div>
              )}
              {estimatedReopen && !isOverdue && (
                <span className="text-sm md:text-base text-white/80">
                  Expected reopen: {format(estimatedReopen, "hh:mm a")}
                </span>
              )}
              {isOverdue && (
                <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-3 py-1">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-semibold">
                    Was due at {format(estimatedReopen!, "hh:mm a")}
                  </span>
                </div>
              )}
              {trainsInQueue && trainsInQueue > 0 && (
                <div className="flex items-center gap-1.5">
                  <Train className="h-4 w-4" />
                  <span>{trainsInQueue} train{trainsInQueue > 1 ? "s" : ""} in queue</span>
                </div>
              )}
            </div>
          )}
          {isOpen && (
            <p className="text-white/80 mt-1 text-base">
              No trains passing at this time
            </p>
          )}
          {lastUpdated && (
            <p className="text-xs text-white/60 mt-2">
              Last updated: {format(new Date(lastUpdated), "hh:mm a")}
              {isOverdue && " · Update pending — gate may need manual reopening"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
