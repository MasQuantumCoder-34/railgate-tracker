"use client";

import { motion } from "framer-motion";
import { MapPin, Maximize2 } from "lucide-react";

export function InteractiveMap() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="card-premium overflow-hidden"
    >
      <div className="p-4 sm:p-6 pb-2 sm:pb-3 flex items-center justify-between">
        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
          Location
        </p>
        <button className="p-1 sm:p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
          <Maximize2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[hsl(var(--muted-foreground))]" />
        </button>
      </div>
      <div className="relative h-44 sm:h-52 md:h-56 lg:h-64">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3897.5!2d78.6167!3d12.6833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDQwJzU5LjkiTiA3OMKwMzcnMDAuMCJF!5e0!3m2!1sen!2sin!4v1"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Vaniyambadi Railway Gate"
          className="absolute inset-0"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-brand-500 drop-shadow-lg" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}