"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { StatCard } from "@/components/shared/StatCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Clock,
  XCircle,
  ArrowUpDown,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import type { StatsPublic } from "@/types";

export default function StatisticsPage() {
  const [stats, setStats] = useState<StatsPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await api.get<StatsPublic>("/stats/public");
    if (res.success && res.data) {
      setStats(res.data);
    } else {
      setError(res.error || "Failed to load statistics");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState message={error} onRetry={fetchStats} />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          icon={BarChart3}
          title="No Statistics"
          description="Statistics data is not available at this time."
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold mb-2">Gate Statistics</h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          Today&apos;s gate performance overview
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Closures Today"
          value={stats.todayClosures}
          icon={XCircle}
          color="red"
        />
        <StatCard
          title="Average Wait Time"
          value={`${stats.avgWaitToday} min`}
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Longest Wait"
          value={`${stats.longestWaitToday} min`}
          icon={TrendingUp}
          color="red"
        />
        <StatCard
          title="Shortest Wait"
          value={`${stats.shortestWaitToday} min`}
          icon={ArrowUpDown}
          color="green"
        />
      </div>

      {stats.dailyAggregation && stats.dailyAggregation.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Daily Gate Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.dailyAggregation}>
                  <XAxis
                    dataKey="_id"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Bar
                    dataKey="closures"
                    fill="hsl(210 58% 24%)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
