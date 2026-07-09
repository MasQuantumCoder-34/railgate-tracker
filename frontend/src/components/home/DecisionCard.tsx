"use client";

interface DecisionCardProps {
  waitTime: number;
}

export function DecisionCard({ waitTime }: DecisionCardProps) {
  const shouldWait = waitTime <= 5;
  const takeDetour = waitTime > 10;

  return (
    <div className="rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-2">
        Should I Wait?
      </p>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{shouldWait ? "✅" : takeDetour ? "⚠️" : "🕒"}</span>
        <div>
          <p className="text-lg font-bold">
            {shouldWait
              ? "Wait"
              : takeDetour
              ? "Take Alternate Route"
              : "Wait if possible"}
          </p>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            {shouldWait
              ? `Gate reopens in about ${waitTime} min`
              : takeDetour
              ? `Gate closed for ${waitTime} min - consider a detour`
              : `Gate reopens in about ${waitTime} min`}
          </p>
        </div>
      </div>
    </div>
  );
}