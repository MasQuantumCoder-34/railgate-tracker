"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textArea";
import { StatCard } from "@/components/shared/StatCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  XCircle,
  CheckCircle2,
  Clock,
  ToggleLeft,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import type { GateStatus, GateUpdate, StatsAdmin } from "@/types";

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const [stats, setStats] = useState<StatsAdmin | null>(null);
  const [currentStatus, setCurrentStatus] = useState<GateStatus | null>(null);
  const [recentUpdates, setRecentUpdates] = useState<GateUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [form, setForm] = useState({
    waitTime: "",
    trainName: "",
    trainNumber: "",
    direction: "up",
    notes: "",
    trainsInQueue: "1",
  });

  const fetchData = useCallback(async () => {
    setError(null);
    const [statsRes, statusRes, updatesRes] = await Promise.all([
      api.get<StatsAdmin>("/stats/admin"),
      api.get<GateStatus>("/status"),
      api.get<GateUpdate[]>("/status/updates"),
    ]);

    if (statsRes.success && statsRes.data) setStats(statsRes.data);
    if (statusRes.success && statusRes.data) setCurrentStatus(statusRes.data);
    if (updatesRes.success && updatesRes.data) setRecentUpdates(updatesRes.data);
    if (!statsRes.success) setError(statsRes.error || "Failed to load data");
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggle = async () => {
    setToggling(true);
    const newStatus = currentStatus?.status === "OPEN" ? "CLOSED" : "OPEN";
    const body: Record<string, unknown> = { status: newStatus };

    if (newStatus === "CLOSED") {
      if (!form.waitTime || !form.trainName || !form.trainNumber) {
        toast("error", "Please fill in wait time, train name, and number");
        setToggling(false);
        return;
      }
      body.waitTime = parseInt(form.waitTime);
      body.trainName = form.trainName;
      body.trainNumber = form.trainNumber;
      body.direction = form.direction;
      body.notes = form.notes;
      body.trainsInQueue = parseInt(form.trainsInQueue) || 1;
    }

    const res = await api.post("/status", body);
    setToggling(false);

    if (res.success) {
      toast("success", `Gate ${newStatus}`);
      setForm({ waitTime: "", trainName: "", trainNumber: "", direction: "up", notes: "", trainsInQueue: "1" });
      setShowForm(false);
      fetchData();
    } else {
      toast("error", res.error || "Failed to update gate");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          Manage gate status and view statistics
        </p>
      </div>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Updates Today"
            value={stats.totalUpdatesToday}
            icon={Activity}
            color="default"
          />
          <StatCard
            title="Gate Closures"
            value={stats.gateClosures}
            icon={XCircle}
            color="red"
          />
          <StatCard
            title="Gate Openings"
            value={stats.gateOpenings}
            icon={CheckCircle2}
            color="green"
          />
          <StatCard
            title="Avg Wait"
            value={`${stats.averageWait} min`}
            icon={Clock}
            color="amber"
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Gate Control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`h-4 w-4 rounded-full animate-pulse ${
                  currentStatus?.status === "OPEN"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              />
              <span className="text-lg font-semibold">
                Current: {currentStatus?.status || "Unknown"}
              </span>
            </div>
            <Button
              variant={currentStatus?.status === "OPEN" ? "destructive" : "default"}
              onClick={() => {
                if (currentStatus?.status === "OPEN") {
                  setShowForm(true);
                } else {
                  handleToggle();
                }
              }}
              loading={toggling}
            >
              <ToggleLeft className="h-4 w-4" />
              {currentStatus?.status === "OPEN"
                ? "Close Gate"
                : "Open Gate"}
            </Button>
          </div>

          {showForm && (
            <div className="grid gap-4 sm:grid-cols-2 border-t border-[hsl(var(--border))] pt-4 mt-4">
              <Input
                label="Wait Time (minutes)"
                type="number"
                value={form.waitTime}
                onChange={(e) => setForm({ ...form, waitTime: e.target.value })}
                placeholder="e.g. 15"
              />
              <Input
                label="Train Name"
                value={form.trainName}
                onChange={(e) =>
                  setForm({ ...form, trainName: e.target.value })
                }
                placeholder="e.g. Chennai Express"
              />
              <Input
                label="Train Number"
                value={form.trainNumber}
                onChange={(e) =>
                  setForm({ ...form, trainNumber: e.target.value })
                }
                placeholder="e.g. 12345"
              />
              <Select
                label="Direction"
                value={form.direction}
                onChange={(e) =>
                  setForm({ ...form, direction: e.target.value })
                }
                options={[
                  { value: "up", label: "Up" },
                  { value: "down", label: "Down" },
                ]}
              />
              <Input
                label="Trains in Queue"
                type="number"
                min="1"
                value={form.trainsInQueue}
                onChange={(e) =>
                  setForm({ ...form, trainsInQueue: e.target.value })
                }
                placeholder="e.g. 2"
              />
              <div className="sm:col-span-2">
                <Textarea
                  label="Notes (optional)"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Additional notes..."
                />
              </div>
              <div className="sm:col-span-2 flex gap-2">
                <Button onClick={handleToggle} loading={toggling}>
                  Confirm Close Gate
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentUpdates.length === 0 ? (
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              No recent activity
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[hsl(var(--border))]">
                    <th className="text-left py-2 px-3 font-medium text-[hsl(var(--muted-foreground))]">Status</th>
                    <th className="text-left py-2 px-3 font-medium text-[hsl(var(--muted-foreground))]">Wait</th>
                    <th className="text-left py-2 px-3 font-medium text-[hsl(var(--muted-foreground))]">Train</th>
                    <th className="text-left py-2 px-3 font-medium text-[hsl(var(--muted-foreground))]">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUpdates.slice(0, 10).map((update) => (
                    <tr
                      key={update._id}
                      className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/50"
                    >
                      <td className="py-2 px-3">
                        <Badge
                          variant={
                            update.status === "OPEN" ? "success" : "destructive"
                          }
                        >
                          {update.status}
                        </Badge>
                      </td>
                      <td className="py-2 px-3">
                        {update.waitTime ? `${update.waitTime} min` : "-"}
                      </td>
                      <td className="py-2 px-3">
                        {update.trainName
                          ? `${update.trainName} (${update.trainNumber || ""})`
                          : "-"}
                      </td>
                      <td className="py-2 px-3 text-[hsl(var(--muted-foreground))]">
                        {formatDateTime(update.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
