"use client";

import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "./EmptyState";
import type { Route } from "@/types";

interface AlternativeRoutesProps {
  routes: Route[];
  gateClosed?: boolean;
}

export function AlternativeRoutes({
  routes,
  gateClosed = false,
}: AlternativeRoutesProps) {
  if (!routes || routes.length === 0) {
    return null;
  }

  const activeRoutes = routes.filter((r) => r.status === "active");

  if (activeRoutes.length === 0) {
    return (
      <EmptyState
        icon={MapPin}
        title="No Routes Available"
        description="No alternative routes are currently available."
      />
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">
        {gateClosed ? "Alternative Routes" : "Available Routes"}
      </h3>
      {gateClosed && (
        <p className="text-sm text-amber-500 dark:text-amber-400">
          The gate is closed. Consider using these alternative routes.
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {activeRoutes.map((route) => (
          <Card
            key={route._id}
            className={
              gateClosed
                ? "border-amber-200 dark:border-amber-800"
                : undefined
            }
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand-500" />
                  <span className="font-medium">{route.routeName}</span>
                </div>
                <Badge
                  variant={route.status === "active" ? "success" : "secondary"}
                >
                  {route.status}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                Distance: {route.distance} km
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
