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
import { UpcomingTrains } from "@/components/shared/UpcomingTrains";
import type { GateStatus, GateUpdate, Route, UpcomingTrain } from "@/types";

const REFRESH_INTERVAL = 10000;

export default function HomePage() {
  const [status, setStatus] = useState<GateStatus | null>(null);
  const [updates, setUpdates] = useState<GateUpdate[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [upcoming, setUpcoming] = useState<UpcomingTrain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setError(null);
    const [statusRes, updatesRes, routesRes, upcomingRes] = await Promise.all([
      api.get<GateStatus>("/status"),
      api.get<GateUpdate[]>("/status/updates"),
      api.get<Route[]>("/routes"),
      api.get<UpcomingTrain[]>("/schedule/upcoming"),
    ]);

    if (statusRes.success && statusRes.data) setStatus(statusRes.data);
    if (updatesRes.success && updatesRes.data) setUpdates(updatesRes.data);
    if (routesRes.success && routesRes.data) setRoutes(routesRes.data);
    if (upcomingRes.success && upcomingRes.data) setUpcoming(upcomingRes.data);

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
      <div className="flex items-center justify-end gap-2 mb-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <span className="text-xs text-[hsl(var(--muted-foreground))]">
          Live {lastRefreshed ? `· ${formatTime(lastRefreshed.toISOString())}` : ""}
        </span>
        <RefreshCw className="h-3 w-3 text-[hsl(var(--muted-foreground))]" />
      </div>

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

      <UpcomingTrains trains={upcoming} />

      <RecentUpdates updates={updates} />

      <AlternativeRoutes
        routes={routes}
        gateClosed={gateClosed}
      />

    </div>
  );
}
