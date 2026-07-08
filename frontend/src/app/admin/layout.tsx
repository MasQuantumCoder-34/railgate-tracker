"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Train,
  MapPin,
  History,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Gauge,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const sidebarLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/trains", label: "Trains", icon: Train },
  { href: "/admin/routes", label: "Routes", icon: MapPin },
  { href: "/admin/history", label: "History", icon: History },
  { href: "/admin/feedback", label: "Feedback", icon: MessageSquare },
  { href: "/admin/iot", label: "IoT Settings", icon: Radio },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }
    const token = localStorage.getItem("gw_token");
    if (!token) {
      router.push("/admin/login");
    } else {
      setChecking(false);
    }
  }, [router, isLoginPage]);

  const handleLogout = () => {
    localStorage.removeItem("gw_token");
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 transform border-r border-[hsl(var(--border))] bg-[hsl(var(--card))] pt-16 transition-transform duration-200 lg:relative lg:translate-x-0 lg:pt-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-[hsl(var(--border))]">
            <Gauge className="h-5 w-5 text-brand-500" />
            <span className="font-semibold">Admin Panel</span>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-brand-500 text-white"
                    : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-[hsl(var(--border))]">
            <Button
              variant="ghost"
              className="w-full justify-start text-[hsl(var(--muted-foreground))]"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1">
        <div className="lg:hidden sticky top-16 z-10 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]/95 backdrop-blur-md px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
        <div className="p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
