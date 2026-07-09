"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Clock, Route, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecommendationCardProps {
  waitTime: number;
}

export function RecommendationCard({ waitTime }: RecommendationCardProps) {
  const shouldWait = waitTime <= 5;
  const takeDetour = waitTime > 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="card-premium p-4 sm:p-6"
    >
      <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3 sm:mb-4">
        Recommendation
      </p>
      <div className="flex items-start gap-3 sm:gap-4">
        <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0", shouldWait ? "bg-green-100 dark:bg-green-900/30" : takeDetour ? "bg-red-100 dark:bg-red-900/30" : "bg-amber-100 dark:bg-amber-900/30")}>
          {shouldWait ? (
            <Timer className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
          ) : takeDetour ? (
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base sm:text-lg font-bold text-[hsl(var(--foreground))]">
            {shouldWait ? "Wait at Gate" : takeDetour ? "Take Alternate Route" : "Wait if Possible"}
          </p>
          <p className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))] mt-0.5 sm:mt-1">
            {shouldWait
              ? `Gate reopens in ~${waitTime} minutes`
              : takeDetour
              ? `Gate closed for ${waitTime} min - detour recommended`
              : `Gate reopens in ~${waitTime} minutes`}
          </p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 sm:mt-3">
            <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-[hsl(var(--muted-foreground))]">
              <Clock className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
              <span>{waitTime} min wait</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-[hsl(var(--muted-foreground))]">
              <Route className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
              <span>{takeDetour ? "Detour advised" : "On schedule"}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}