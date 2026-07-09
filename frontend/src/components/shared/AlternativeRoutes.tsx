"use client";

import { MapPin, Clock } from "lucide-react";
import type { Route } from "@/types";

interface AlternativeRoutesProps {
  routes: Route[];
  gateClosed?: boolean;
  showEmpty?: boolean;
}

export function AlternativeRoutes({
  routes,
  gateClosed = false,
  showEmpty = true,
}: AlternativeRoutesProps) {
  const activeRoutes = routes.filter((r) => r.status === "active");

  if (!activeRoutes.length) {
    if (!showEmpty) return null;
    return (
      <div className="rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1">
          Alternative Routes
        </p>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">No routes available</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-3">
        {gateClosed ? "Alternative Routes" : "Routes"}
      </p>
      {gateClosed && (
        <p className="text-xs text-amber-600 dark:text-amber-400 mb-3 font-medium">
          \u26A0\uFE0F Gate closed - consider a detour
        </p>
      )}
      <div className="space-y-2">
        {activeRoutes.map((route) => (
          <div key={route._id} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-[hsl(var(--muted-foreground))]" />
              <span className="text-sm font-medium">{route.routeName}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
              <Clock className="h-3 w-3" />
              <span>{route.distance}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}