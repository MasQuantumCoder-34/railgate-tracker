"use client";

import { motion } from "framer-motion";
import { Users, ThumbsUp, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function CommunityRatingCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="card-premium p-4 sm:p-6"
    >
      <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3 sm:mb-4">
        Community
      </p>
      <div className="space-y-2.5 sm:space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-semibold truncate">Crowd Level</p>
              <p className="text-[11px] sm:text-xs text-[hsl(var(--muted-foreground))] truncate">At the gate</p>
            </div>
          </div>
          <span className={cn("text-[11px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shrink-0", "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400")}>
            Low
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-semibold truncate">Reports Today</p>
              <p className="text-[11px] sm:text-xs text-[hsl(var(--muted-foreground))] truncate">Community verified</p>
            </div>
          </div>
          <span className="text-base sm:text-lg font-bold text-[hsl(var(--foreground))] shrink-0">12</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-semibold truncate">Status Verified</p>
              <p className="text-[11px] sm:text-xs text-[hsl(var(--muted-foreground))] truncate">By community</p>
            </div>
          </div>
          <span className={cn("text-[11px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shrink-0", "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400")}>
            Verified
          </span>
        </div>
      </div>
    </motion.div>
  );
}