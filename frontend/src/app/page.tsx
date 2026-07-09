"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { HeroSection } from "@/components/home/HeroSection";
import { RecommendationCard } from "@/components/home/RecommendationCard";
import { WeatherCard } from "@/components/home/WeatherCard";
import { CommunityRatingCard } from "@/components/home/CommunityRatingCard";
import { LiveTimeline } from "@/components/home/LiveTimeline";
import { InteractiveMap } from "@/components/home/InteractiveMap";
import { CommunityReports } from "@/components/home/CommunityReports";
import { StatisticsCards } from "@/components/home/StatisticsCards";
import { Skeleton } from "@/components/ui/skeleton";
import type { GateStatus, GateClosure } from "@/types";

const REFRESH_INTERVAL = 15000;

interface StatsData {
  todayClosures: number;
  avgWaitToday: number;
  longestWaitToday: number;
  weeklyClosures: number;
  dailyAggregation?: { _id: string; closures: number; openings: number; avgWait: number }[];
}

export default function HomePage() {
  const [status, setStatus] = useState<GateStatus | null>(null);
  const [closures, setClosures] = useState<GateClosure[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setError(null);
    const [statusRes, closuresRes, statsRes] = await Promise.all([
      api.get<GateStatus>("/status"),
      api.get<GateClosure[]>("/status/closures"),
      api.get<StatsData>("/stats/public"),
    ]);

    if (statusRes.success && statusRes.data) setStatus(statusRes.data);
    if (closuresRes.success && closuresRes.data) setClosures(closuresRes.data);
    if (statsRes.success && statsRes.data) setStats(statsRes.data);
    if (!statusRes.success) setError(statusRes.error || "Failed to load");
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(id);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="w-full px-3 sm:px-5 md:px-8 lg:px-10 xl:px-12 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <Skeleton className="h-44 sm:h-48 w-full rounded-[20px]" />
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <Skeleton className="h-36 rounded-[20px]" />
          <Skeleton className="h-36 rounded-[20px]" />
          <Skeleton className="h-36 rounded-[20px]" />
        </div>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
          <Skeleton className="h-64 rounded-[20px]" />
          <Skeleton className="h-64 rounded-[20px]" />
        </div>
      </div>
    );
  }

  if (error && !status) {
    return (
      <div className="w-full px-3 sm:px-5 md:px-8 lg:px-10 xl:px-12 py-4 sm:py-6 text-center pt-20">
        <p className="text-xl sm:text-2xl font-bold text-[hsl(var(--destructive))]">Unable to load</p>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2">{error}</p>
        <button onClick={fetchData} className="mt-4 px-5 sm:px-6 py-2.5 bg-[hsl(var(--primary))] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
          Retry
        </button>
      </div>
    );
  }

  const gateClosed = status?.status === "CLOSED";
  const waitTime = status?.waitTime ?? 0;
  const activeClosure = status?.activeClosure ?? null;

  return (
    <div className="w-full px-3 sm:px-5 md:px-8 lg:px-10 xl:px-12 py-4 sm:py-6 pb-24 md:pb-12 space-y-4 sm:space-y-6">
      {status && (
        <HeroSection
          status={status.status}
          waitTime={waitTime}
          lastUpdated={status.updatedAt}
          trainName={status.trainName}
          trainNumber={status.trainNumber}
          direction={status.direction}
        />
      )}

      {gateClosed && <RecommendationCard waitTime={waitTime} />}

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-3">
        <WeatherCard />
        <CommunityRatingCard />
        <div className="card-premium p-4 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3 sm:mb-4">
            Alternative Routes
          </p>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            {gateClosed
              ? "Gate closed \u2014 consider detours via Kannamangalam or Ambur"
              : "All routes clear"}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
        <LiveTimeline closures={closures} activeClosure={activeClosure} />
        <InteractiveMap />
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
        <CommunityReports />
        <StatisticsCards stats={stats} />
      </div>
    </div>
  );
}