"use client";

import { ErrorState } from "@/components/shared/ErrorState";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-16">
      <ErrorState
        message={error.message || "Something went wrong"}
        onRetry={reset}
      />
    </div>
  );
}
