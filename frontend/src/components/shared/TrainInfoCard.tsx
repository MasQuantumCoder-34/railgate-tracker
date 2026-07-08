"use client";

import { Train, ArrowRight, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TrainInfoCardProps {
  trainName?: string;
  trainNumber?: string;
  direction?: string;
  expectedPassing?: string;
}

export function TrainInfoCard({
  trainName,
  trainNumber,
  direction,
  expectedPassing,
}: TrainInfoCardProps) {
  const hasTrain = Boolean(trainName || trainNumber);

  if (!hasTrain) return null;

  return (
    <Card className="border-amber-200 dark:border-amber-800 h-full">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-full bg-amber-100 dark:bg-amber-900/50 p-2">
            <Train className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
              Train Approaching
            </p>
            <h3 className="text-lg font-bold">
              {trainName || "Unknown Train"}
            </h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {trainNumber && (
            <div>
              <span className="text-[hsl(var(--muted-foreground))]">Number:</span>
              <p className="font-semibold">{trainNumber}</p>
            </div>
          )}
          {direction && (
            <div>
              <span className="text-[hsl(var(--muted-foreground))]">Direction:</span>
              <div className="flex items-center gap-1 font-semibold">
                {direction.toLowerCase() === "up" ? (
                  <ArrowRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowLeft className="h-4 w-4 text-red-500" />
                )}
                {direction}
              </div>
            </div>
          )}
          {expectedPassing && (
            <div className="col-span-2">
              <span className="text-[hsl(var(--muted-foreground))]">Expected passing:</span>
              <p className="font-semibold">{expectedPassing}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
