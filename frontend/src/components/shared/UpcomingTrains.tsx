"use client";

import { useState, useEffect } from "react";
import { Train, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "./EmptyState";
import type { UpcomingTrain as UpcomingTrainType } from "@/types";

interface UpcomingTrainsProps {
  trains: UpcomingTrainType[];
}

export function UpcomingTrains({ trains }: UpcomingTrainsProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  if (!trains || trains.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Train className="h-5 w-5" /> Upcoming Trains
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Train}
            title="No Upcoming Trains"
            description="No trains scheduled for the remainder of today."
          />
        </CardContent>
      </Card>
    );
  }

  const gateClosedSoon = trains.some(
    (t) => t.minutesUntil > 0 && t.minutesUntil <= 15
  );

  return (
    <Card className={gateClosedSoon ? "border-amber-300 dark:border-amber-700" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Train className="h-5 w-5" />
          Upcoming Trains
          <Badge variant={gateClosedSoon ? "warning" : "secondary"} className="ml-auto">
            {trains.length} scheduled
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {trains.map((train) => {
            const isImminent = train.minutesUntil > 0 && train.minutesUntil <= 15;
            const isDue = train.minutesUntil <= 0;
            return (
              <div
                key={train._id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  isImminent
                    ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"
                    : "border-[hsl(var(--border))]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-2 ${
                    isImminent
                      ? "bg-amber-100 dark:bg-amber-900/50"
                      : "bg-[hsl(var(--muted))]"
                  }`}>
                    <Train className={`h-4 w-4 ${
                      isImminent ? "text-amber-600" : "text-brand-500"
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{train.trainName}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      #{train.trainNumber}
                      <span className="inline-flex items-center gap-0.5 ml-2">
                        {train.direction === "up" ? (
                          <ArrowRight className="h-3 w-3" />
                        ) : (
                          <ArrowLeft className="h-3 w-3" />
                        )}
                        {train.direction.toUpperCase()}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${
                    isDue ? "text-red-500" : isImminent ? "text-amber-600" : ""
                  }`}>
                    {isDue
                      ? "Due"
                      : `${train.minutesUntil}m`}
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {train.scheduledTime}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
