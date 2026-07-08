"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, BarChart3, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/statistics", icon: BarChart3, label: "Stats" },
  { href: "/contact", icon: Phone, label: "Contact" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[hsl(var(--border))] bg-[hsl(var(--card))]/95 backdrop-blur-md">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "text-brand-500 dark:text-brand-400"
                  : "text-[hsl(var(--muted-foreground))]"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  isActive && "text-brand-500 dark:text-brand-400"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
