"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: "up" | "down" | "neutral";
  color?: "default" | "green" | "red" | "amber";
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  color = "default",
}: StatCardProps) {
  const colorClasses = {
    default: "text-brand-500 bg-brand-50 dark:bg-brand-900/30",
    green: "text-green-600 bg-green-50 dark:bg-green-900/30",
    red: "text-red-600 bg-red-50 dark:bg-red-900/30",
    amber: "text-amber-600 bg-amber-50 dark:bg-amber-900/30",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              {title}
            </p>
            <p className="text-3xl font-bold">{value}</p>
            {description && (
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                {description}
              </p>
            )}
          </div>
          <div
            className={cn(
              "rounded-xl p-3",
              colorClasses[color]
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center gap-1 text-xs">
            <span
              className={cn(
                "font-medium",
                trend === "up" && "text-green-600",
                trend === "down" && "text-red-600",
                trend === "neutral" && "text-[hsl(var(--muted-foreground))]"
              )}
            >
              {trend === "up" && "↑"}
              {trend === "down" && "↓"}
              {trend === "neutral" && "→"}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
