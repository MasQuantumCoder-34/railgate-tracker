"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, MessageSquare } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export function CommunityReports() {
  const [sending, setSending] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const report = async (status: "OPEN" | "CLOSED") => {
    setSending(status);
    setMessage(null);
    const res = await api.post("/community", { status });
    if (res.success) {
      setMessage(`Reported as ${status}`);
    } else {
      setMessage(res.error || "Failed");
    }
    setSending(null);
    setTimeout(() => setMessage(null), 3000);
  };

  const reports = [
    { status: "OPEN", label: "Gate Open", color: "green" },
    { status: "CLOSED", label: "Gate Closed", color: "red" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="card-premium p-4 sm:p-6"
    >
      <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3 sm:mb-4">
        Community Reports
      </p>
      <p className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))] mb-3 sm:mb-4">
        Help others \u2014 report what you see at the gate
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        {reports.map((r) => (
          <div key={r.status} className="card-premium p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className={cn("w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full", r.color === "green" ? "bg-green-500" : "bg-red-500")} />
              <span className="text-xs sm:text-sm font-semibold">{r.label}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-[hsl(var(--muted-foreground))] mb-2 sm:mb-3">
              <span className="flex items-center gap-1"><ThumbsUp className="w-2.5 sm:w-3 h-2.5 sm:h-3" /> 0</span>
              <span className="flex items-center gap-1"><MessageSquare className="w-2.5 sm:w-3 h-2.5 sm:h-3" /> 0</span>
            </div>
            <button
              onClick={() => report(r.status as "OPEN" | "CLOSED")}
              disabled={sending === r.status}
              className={cn(
                "w-full py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold transition-all",
                r.color === "green"
                  ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                  : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50",
                sending === r.status && "opacity-50"
              )}
            >
              {sending === r.status ? "Sending..." : `Report ${r.label}`}
            </button>
          </div>
        ))}
      </div>

      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[11px] sm:text-xs text-center mt-2 sm:mt-3 text-[hsl(var(--muted-foreground))]"
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
}