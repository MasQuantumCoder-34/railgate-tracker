import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  default:
    "bg-brand-500 text-white dark:bg-brand-500 dark:text-white",
  secondary:
    "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]",
  destructive: "bg-red-600 text-white dark:bg-red-700",
  outline:
    "border border-[hsl(var(--border))] text-[hsl(var(--foreground))]",
  success:
    "bg-green-600 text-white dark:bg-green-700",
  warning:
    "bg-amber-500 text-white dark:bg-amber-600",
};

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
export type { BadgeProps };
