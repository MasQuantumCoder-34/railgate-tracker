"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export function CommunityReport() {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const report = async (status: "OPEN" | "CLOSED") => {
    setSending(true);
    setMessage(null);
    const res = await api.post("/community", { status });
    if (res.success) {
      setMessage("Reported as " + status);
    } else {
      setMessage(res.error || "Failed to report");
    }
    setSending(false);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-3">
        Community Report
      </p>
      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">
        Tell others what you see at the gate
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => report("OPEN")}
          disabled={sending}
          className="flex-1 py-2.5 rounded-lg font-semibold text-sm bg-green-100 text-green-700 active:bg-green-200 disabled:opacity-50 dark:bg-green-900/30 dark:text-green-400 transition-colors"
        >
          Gate Open
        </button>
        <button
          onClick={() => report("CLOSED")}
          disabled={sending}
          className="flex-1 py-2.5 rounded-lg font-semibold text-sm bg-red-100 text-red-700 active:bg-red-200 disabled:opacity-50 dark:bg-red-900/30 dark:text-red-400 transition-colors"
        >
          Gate Closed
        </button>
      </div>
      {message && (
        <p className="text-xs text-center mt-2 text-[hsl(var(--muted-foreground))]">{message}</p>
      )}
    </div>
  );
}