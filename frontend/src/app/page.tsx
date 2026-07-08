"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { LiveStatusBanner } from "@/components/shared/LiveStatusBanner";
import { GateStatusCard } from "@/components/shared/GateStatusCard";
import { TrainInfoCard } from "@/components/shared/TrainInfoCard";
import { RecentUpdates } from "@/components/shared/RecentUpdates";
import { AlternativeRoutes } from "@/components/shared/AlternativeRoutes";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";
import { formatTime } from "@/lib/utils";
import type { GateStatus, GateUpdate, Route } from "@/types";

const REFRESH_INTERVAL = 10000;

export default function HomePage() {
  const [status, setStatus] = useState<GateStatus | null>(null);
  const [updates, setUpdates] = useState<GateUpdate[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setError(null);
    const [statusRes, updatesRes, routesRes] = await Promise.all([
      api.get<GateStatus>("/status"),
      api.get<GateUpdate[]>("/status/updates"),
      api.get<Route[]>("/routes"),
    ]);

    if (statusRes.success && statusRes.data) setStatus(statusRes.data);
    if (updatesRes.success && updatesRes.data) setUpdates(updatesRes.data);
    if (routesRes.success && routesRes.data) setRoutes(routesRes.data);

    if (!statusRes.success) {
      setError(statusRes.error || "Failed to load gate status");
    }
    setLastRefreshed(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(id);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (error && !status) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState message={error} onRetry={fetchData} />
      </div>
    );
  }

  const gateClosed = status?.status === "CLOSED";
  const hasTrain = Boolean(status?.trainName || status?.trainNumber);

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8 animate-fadeIn">
      {status && (
        <LiveStatusBanner
          status={status.status}
          waitTime={status.waitTime}
          lastUpdated={status.updatedAt}
          trainsInQueue={status.trainsInQueue}
        />
      )}

      <div className={hasTrain ? "grid gap-6 md:grid-cols-2" : ""}>
        {status && (
          <GateStatusCard
            status={status.status}
            waitTime={status.waitTime}
            lastUpdated={status.updatedAt}
          />
        )}
        {hasTrain && (
          <TrainInfoCard
            trainName={status?.trainName}
            trainNumber={status?.trainNumber}
            direction={status?.direction}
          />
        )}
      </div>

      <RecentUpdates updates={updates} />

      <AlternativeRoutes
        routes={routes}
        gateClosed={gateClosed}
      />

      <div className="flex items-center justify-center gap-2 text-xs text-[hsl(var(--muted-foreground))] pb-4">
        <RefreshCw className="h-3 w-3" />
        <span>
          {lastRefreshed
            ? `Auto-refreshing every ${REFRESH_INTERVAL / 1000}s · Last: ${formatTime(lastRefreshed.toISOString())}`
            : "Loading..."}
        </span>
      </div>
    </div>
  );
}
