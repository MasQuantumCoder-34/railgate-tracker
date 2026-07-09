export interface GateStatus {
  _id: string;
  status: "OPEN" | "CLOSED";
  waitTime?: number;
  trainName?: string;
  trainNumber?: string;
  direction?: string;
  notes?: string;
  trainsInQueue?: number;
  updatedAt: string;
  createdAt: string;
  todayClosures?: number;
  activeClosure?: GateClosure | null;
}

export interface GateUpdate {
  _id: string;
  status: "OPEN" | "CLOSED";
  waitTime?: number;
  trainName?: string;
  trainNumber?: string;
  direction?: string;
  notes?: string;
  trainsInQueue?: number;
  timestamp: string;
}

export interface GateClosure {
  _id: string;
  trainName: string;
  trainNumber: string;
  direction: string;
  closedAt: string;
  openedAt?: string;
  durationMinutes: number;
  isActive: boolean;
}

export interface Route {
  _id: string;
  routeName: string;
  distance: number;
  status: "active" | "inactive";
}

export interface Feedback {
  _id: string;
  name: string;
  email: string;
  message: string;
  resolved: boolean;
  createdAt: string;
}

export interface Train {
  _id: string;
  trainName: string;
  trainNumber: string;
  route: string;
  direction: string;
}

export interface StatsPublic {
  todayClosures: number;
  avgWaitToday: number;
  longestWaitToday: number;
  shortestWaitToday: number;
  weeklyClosures: number;
  monthlyClosures: number;
  dailyAggregation: { _id: string; closures: number; openings: number; avgWait: number }[];
}

export interface StatsAdmin {
  totalUpdatesToday: number;
  gateClosures: number;
  gateOpenings: number;
  averageWait: number;
}

export interface UpcomingTrain {
  _id: string;
  trainName: string;
  trainNumber: string;
  direction: string;
  scheduledTime: string;
  estimatedWait: number;
  minutesUntil: number;
  day?: string;
}