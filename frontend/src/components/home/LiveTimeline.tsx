"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Train, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { GateClosure } from "@/types";

interface LiveTimelineProps {
  closures: GateClosure[];
  activeClosure?: GateClosure | null;
}

export function LiveTimeline({ closures, activeClosure }: LiveTimelineProps) {
  const hasAny = (closures && closures.length > 0) || activeClosure;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="card-premium p-4 sm:p-6"
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
          Gate Activity
        </p>
        {activeClosure && (
          <span className="relative flex h-1.5 sm:h-2 w-1.5 sm:w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 sm:h-2 w-1.5 sm:w-2 bg-red-500" />
          </span>
        )}
      </div>

      {!hasAny && (
        <p className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))]">No closures recorded today</p>
      )}

      <div className="relative">
        <div className="absolute left-[13px] sm:left-[17px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-brand-500/30 via-brand-500/20 to-transparent rounded-full" />

        <div className="space-y-0">
          {activeClosure && (
            <ActiveClosureItem closure={activeClosure} />
          )}

          <AnimatePresence mode="popLayout">
            {closures.filter((c) => !c.isActive).slice(0, 7).map((closure, i) => (
              <ClosureItem key={closure._id} closure={closure} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function ActiveClosureItem({ closure }: { closure: GateClosure }) {
  const closedTime = new Date(closure.closedAt);
  const elapsedMin = Math.floor((Date.now() - closedTime.getTime()) / 60000);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative pl-10 sm:pl-12 py-2 sm:py-3"
    >
      <div className="absolute left-[6px] sm:left-[10px] top-3 sm:top-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-3 sm:w-4 h-3 sm:h-4 rounded-full border-[2px] sm:border-[3px] border-red-500 bg-red-100 dark:bg-red-900/30 flex items-center justify-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-red-500"
          />
        </motion.div>
      </div>

      <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-2.5 sm:p-3">
        <div className="flex items-center justify-between gap-2 mb-0.5 sm:mb-1">
          <span className="text-xs sm:text-sm font-bold text-red-700 dark:text-red-400">Gate Closed</span>
          <span className="text-[11px] sm:text-xs font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-1.5 sm:px-2 py-0.5 rounded-lg shrink-0">
            {elapsedMin} min elapsed
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-[hsl(var(--muted-foreground))]">
          <Clock className="w-2.5 sm:w-3 h-2.5 sm:h-3 shrink-0" />
          Started: {format(closedTime, "hh:mm a")}
        </div>
        {(closure.trainName || closure.trainNumber) && (
          <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-[hsl(var(--muted-foreground))] mt-0.5 sm:mt-1">
            <Train className="w-2.5 sm:w-3 h-2.5 sm:h-3 shrink-0" />
            <span className="truncate">{closure.trainName || "Train"} {closure.trainNumber ? `#${closure.trainNumber}` : ""}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ClosureItem({ closure, index }: { closure: GateClosure; index: number }) {
  const closedTime = new Date(closure.closedAt);
  const openedTime = closure.openedAt ? new Date(closure.openedAt) : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="relative pl-10 sm:pl-12 py-2 sm:py-3"
    >
      <div className="absolute left-[6px] sm:left-[10px] top-3 sm:top-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30, delay: index * 0.05 }}
          className="w-3 sm:w-4 h-3 sm:h-4 rounded-full border-[2px] sm:border-[3px] border-red-500 bg-red-100 dark:bg-red-900/30 flex items-center justify-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-red-500"
          />
        </motion.div>
      </div>

      <div className="space-y-0.5 sm:space-y-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs sm:text-sm font-bold text-[hsl(var(--foreground))] truncate">
            {closure.trainName || "Train"}
          </span>
          <span className="text-[11px] sm:text-xs text-[hsl(var(--muted-foreground))] shrink-0">
            {closure.durationMinutes} min
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3 text-[11px] sm:text-xs text-[hsl(var(--muted-foreground))]">
          <span className="flex items-center gap-1">
            <Clock className="w-2.5 sm:w-3 h-2.5 sm:h-3 shrink-0" />
            Closed: {format(closedTime, "hh:mm a")}
          </span>
          {openedTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-2.5 sm:w-3 h-2.5 sm:h-3 shrink-0" />
              Opened: {format(openedTime, "hh:mm a")}
            </span>
          )}
        </div>
        <p className="text-[11px] sm:text-xs text-[hsl(var(--muted-foreground))]">
          Wait Time: {closure.durationMinutes} Minutes
        </p>
      </div>
    </motion.div>
  );
}