"use client";

import { motion } from "framer-motion";
import { Cloud, Droplets, Eye, Thermometer } from "lucide-react";

export function WeatherCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="card-premium p-4 sm:p-6"
    >
      <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3 sm:mb-4">
        Weather
      </p>
      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
          <Cloud className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="min-w-0">
          <p className="text-xl sm:text-2xl font-bold text-[hsl(var(--foreground))]">32\u00B0C</p>
          <p className="text-[11px] sm:text-xs text-[hsl(var(--muted-foreground))] truncate">Partly Cloudy</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="text-center p-1.5 sm:p-2 rounded-xl bg-[hsl(var(--muted))]">
          <Thermometer className="w-3.5 sm:w-4 h-3.5 sm:h-4 mx-auto mb-0.5 sm:mb-1 text-[hsl(var(--muted-foreground))]" />
          <p className="text-[11px] sm:text-xs font-semibold">24\u00B0C</p>
          <p className="text-[10px] text-[hsl(var(--muted-foreground))] hidden sm:block">Feels like</p>
        </div>
        <div className="text-center p-1.5 sm:p-2 rounded-xl bg-[hsl(var(--muted))]">
          <Droplets className="w-3.5 sm:w-4 h-3.5 sm:h-4 mx-auto mb-0.5 sm:mb-1 text-[hsl(var(--muted-foreground))]" />
          <p className="text-[11px] sm:text-xs font-semibold">65%</p>
          <p className="text-[10px] text-[hsl(var(--muted-foreground))] hidden sm:block">Humidity</p>
        </div>
        <div className="text-center p-1.5 sm:p-2 rounded-xl bg-[hsl(var(--muted))]">
          <Eye className="w-3.5 sm:w-4 h-3.5 sm:h-4 mx-auto mb-0.5 sm:mb-1 text-[hsl(var(--muted-foreground))]" />
          <p className="text-[11px] sm:text-xs font-semibold">8 km</p>
          <p className="text-[10px] text-[hsl(var(--muted-foreground))] hidden sm:block">Visibility</p>
        </div>
      </div>
    </motion.div>
  );
}