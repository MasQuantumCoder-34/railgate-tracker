"use client";

import { motion } from "framer-motion";
import { BarChart3, Clock, GripHorizontal, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface StatsData {
  todayClosures: number;
  avgWaitToday: number;
  longestWaitToday: number;
  weeklyClosures: number;
  dailyAggregation?: { _id: string; closures: number; openings: number; avgWait: number }[];
}

interface StatisticsCardsProps {
  stats: StatsData | null;
}

const chartData = [
  { day: "Mon", closures: 4 },
  { day: "Tue", closures: 6 },
  { day: "Wed", closures: 3 },
  { day: "Thu", closures: 8 },
  { day: "Fri", closures: 5 },
  { day: "Sat", closures: 2 },
  { day: "Sun", closures: 1 },
];

export function StatisticsCards({ stats }: StatisticsCardsProps) {
  const statItems = [
    {
      label: "Today's Closures",
      value: stats?.todayClosures ?? 0,
      icon: GripHorizontal,
      color: "text-red-500",
      bg: "bg-red-100 dark:bg-red-900/30",
    },
    {
      label: "Average Wait",
      value: `${stats?.avgWaitToday ?? 0} min`,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      label: "Longest Closure",
      value: `${stats?.longestWaitToday ?? 0} min`,
      icon: TrendingUp,
      color: "text-orange-500",
      bg: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      label: "This Week",
      value: `${stats?.weeklyClosures ?? 0}`,
      icon: BarChart3,
      color: "text-brand-500",
      bg: "bg-brand-100 dark:bg-brand-900/30",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="card-premium p-4 sm:p-6"
    >
      <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3 sm:mb-4">
        Statistics
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
        {statItems.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 + i * 0.05 }}
            className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-[hsl(var(--muted))]"
          >
            <div className={cn("w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center mb-1 sm:mb-2", item.bg)}>
              <item.icon className={cn("w-3 sm:w-4 h-3 sm:h-4", item.color)} />
            </div>
            <p className="text-sm sm:text-lg font-bold text-[hsl(var(--foreground))]">{item.value}</p>
            <p className="text-[10px] sm:text-[11px] text-[hsl(var(--muted-foreground))]">{item.label}</p>
          </motion.div>
        ))}
      </div>

      <div>
        <p className="text-[11px] sm:text-xs font-semibold text-[hsl(var(--muted-foreground))] mb-2 sm:mb-3">Weekly Activity</p>
        <div className="h-28 sm:h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorClosures" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Area type="monotone" dataKey="closures" stroke="#2563eb" strokeWidth={2} fill="url(#colorClosures)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}