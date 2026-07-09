"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Clock, Share2, Train, MapPin } from "lucide-react";

interface HeroSectionProps {
  status: "OPEN" | "CLOSED";
  waitTime: number;
  lastUpdated?: string;
  trainName?: string;
  trainNumber?: string;
  direction?: string;
}

export function HeroSection({ status, waitTime, lastUpdated, trainName, trainNumber, direction }: HeroSectionProps) {
  const [remaining, setRemaining] = useState(waitTime);
  const closed = status === "CLOSED";

  useEffect(() => {
    setRemaining(waitTime);
    if (!closed || !waitTime || !lastUpdated) return;
    const elapsed = Math.floor((Date.now() - new Date(lastUpdated).getTime()) / 60000);
    setRemaining(Math.max(0, waitTime - elapsed));
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 60000);
    return () => clearInterval(id);
  }, [closed, waitTime, lastUpdated]);

  const reopenTime = lastUpdated && closed
    ? new Date(new Date(lastUpdated).getTime() + waitTime * 60000)
    : null;
  const reopened = closed && reopenTime && new Date() > reopenTime;
  const displayMins = reopened ? 0 : remaining;

  const shareStatus = async () => {
    const text = closed
      ? `\u{1F6A7} GateWatch Vaniyambadi\n\nGate CLOSED ~${displayMins} min wait\nReopens ~${reopenTime ? format(reopenTime, "hh:mm a") : "TBD"}`
      : `\u2705 GateWatch Vaniyambadi\n\nGate OPEN - Road Clear`;
    if (navigator.share) {
      await navigator.share({ title: "GateWatch", text }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="card-premium overflow-hidden"
    >
      <div className="flex flex-col md:flex-row">
        <div className={cn("flex-1 p-4 sm:p-6 md:p-8", closed ? "bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20" : "bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20")}>
          <div className="flex items-center justify-between mb-3 sm:mb-5">
            <div className={cn("inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold", closed ? "bg-red-500/10 text-red-600 dark:text-red-400" : "bg-green-500/10 text-green-600 dark:text-green-400")}>
              <span className={cn("w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full", closed ? "bg-red-500 animate-pulse" : "bg-green-500")} />
              {closed ? "Gate Closed" : "Gate Open"}
            </div>
            <button onClick={shareStatus} className="p-1.5 sm:p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <Share2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[hsl(var(--muted-foreground))]" />
            </button>
          </div>

          {closed && (trainName || trainNumber) && (
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-4">
              <Train className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-red-500 shrink-0" />
              <p className="text-xs sm:text-sm font-medium text-[hsl(var(--foreground))] truncate">
                {trainName || "Train"} {trainNumber ? `#${trainNumber}` : ""}
                {direction === "up" ? " \u2192" : " \u2190"}
              </p>
            </div>
          )}

          {closed && (
            <div className="mb-2 sm:mb-4">
              <div className="flex items-baseline gap-1 sm:gap-2">
                <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[hsl(var(--foreground))] tabular-nums leading-none">
                  {displayMins}
                </span>
                <span className="text-base sm:text-lg md:text-xl font-semibold text-[hsl(var(--muted-foreground))]">minutes</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 sm:mt-2">
                {reopenTime && !reopened && (
                  <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-[hsl(var(--muted-foreground))]">
                    <Clock className="w-3 sm:w-3.5 h-3 sm:h-3.5 shrink-0" />
                    Reopens ~{format(reopenTime, "hh:mm a")}
                  </div>
                )}
                {reopened && (
                  <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-amber-600 dark:text-amber-400 font-medium">
                    <Clock className="w-3 sm:w-3.5 h-3 sm:h-3.5 shrink-0" />
                    Overdue
                  </div>
                )}
              </div>
            </div>
          )}

          {!closed && (
            <div className="mb-2 sm:mb-4">
              <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">Road Clear</p>
              <p className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))] mt-0.5 sm:mt-1">No trains crossing at this time</p>
            </div>
          )}

          {closed && waitTime > 0 && (
            <div className="w-full h-1 sm:h-1.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden mt-2 sm:mt-4">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: `${(displayMins / waitTime) * 100}%` }}
                className={cn("h-full rounded-full", reopened ? "bg-amber-400" : "bg-red-500")}
                transition={{ duration: 1, ease: "linear" }}
              />
            </div>
          )}

          {lastUpdated && (
            <p className="text-[11px] sm:text-xs text-[hsl(var(--muted-foreground))] mt-2 sm:mt-4">
              Updated {format(new Date(lastUpdated), "hh:mm a")}
            </p>
          )}
        </div>

        <div className="hidden md:flex md:w-48 lg:w-56 xl:w-64 shrink-0 items-center justify-center bg-gradient-to-br from-brand-500/5 to-brand-500/10 dark:from-brand-500/10 dark:to-brand-500/5 p-4 sm:p-6 lg:p-8">
          <div className="text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 mx-auto mb-2 sm:mb-4 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <MapPin className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[hsl(var(--foreground))]">Vaniyambadi</p>
            <p className="text-[11px] sm:text-xs text-[hsl(var(--muted-foreground))]">Railway Gate Crossing</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}