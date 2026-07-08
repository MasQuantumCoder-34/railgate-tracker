"use client";

import { useState, useCallback } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Clock, CalendarDays } from "lucide-react";
import { formatDateTime, formatTime } from "@/lib/utils";
import type { GateUpdate } from "@/types";

export default function SearchPage() {
  const [date, setDate] = useState("");
  const [results, setResults] = useState<GateUpdate[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSearched(true);

    let endpoint = "/status/updates";
    if (date) {
      endpoint += `?date=${date}`;
    }

    const res = await api.get<GateUpdate[]>(endpoint);
    if (res.success && res.data) {
      setResults(res.data);
    } else {
      setError(res.error || "Search failed");
    }
    setLoading(false);
  }, [date]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Gate Events</h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          Search for gate status updates by date
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                label="Filter by date"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} loading={loading}>
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      )}

      {error && <ErrorState message={error} onRetry={handleSearch} />}

      {!loading && !error && searched && results && results.length === 0 && (
        <EmptyState
          icon={CalendarDays}
          title="No Results"
          description={
            date
              ? `No gate events found for ${date}`
              : "No gate events recorded yet"
          }
        />
      )}

      {!loading && !error && results && results.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            {results.length} event{results.length !== 1 ? "s" : ""} found
          </h3>
          <div className="divide-y divide-[hsl(var(--border))] rounded-xl border border-[hsl(var(--border))]">
            {results.map((update) => (
              <div
                key={update._id}
                className="flex items-center justify-between p-4 hover:bg-[hsl(var(--muted))]/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Badge
                    variant={
                      update.status === "OPEN" ? "success" : "destructive"
                    }
                  >
                    {update.status}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">
                      {update.trainName
                        ? `${update.trainName} (${update.trainNumber || "N/A"})`
                        : "No train info"}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                      <Clock className="h-3 w-3" />
                      <span>{formatDateTime(update.timestamp)}</span>
                    </div>
                  </div>
                </div>
                {update.waitTime && (
                  <div className="text-sm font-semibold text-amber-500">
                    ~{update.waitTime} min
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && !searched && (
        <EmptyState
          icon={Search}
          title="Search Gate Events"
          description="Enter a date above to search for gate status updates"
        />
      )}
    </div>
  );
}
