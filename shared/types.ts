export interface Admin {
  _id?: string;
  username: string;
  passwordHash: string;
  role: 'admin' | 'superadmin';
  createdAt: Date;
}

export interface GateStatus {
  _id?: string;
  status: 'OPEN' | 'CLOSED';
  waitTime: number;
  trainName?: string;
  trainNumber?: string;
  direction?: string;
  notes?: string;
  updatedAt: Date;
}

export interface Train {
  _id?: string;
  trainName: string;
  trainNumber: string;
  route: string;
  direction: string;
  createdAt: Date;
}

export interface Route {
  _id?: string;
  routeName: string;
  distance: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface Feedback {
  _id?: string;
  name: string;
  email: string;
  message: string;
  resolved: boolean;
  createdAt: Date;
}

export interface GateEvent {
  _id?: string;
  status: 'OPEN' | 'CLOSED';
  waitTime: number;
  trainName?: string;
  trainNumber?: string;
  direction?: string;
  notes?: string;
  timestamp: Date;
}

export interface StatsData {
  totalClosuresToday: number;
  averageWaitTime: number;
  longestWaitTime: number;
  shortestWaitTime: number;
  weeklyData: { date: string; closures: number }[];
  monthlyData: { date: string; closures: number }[];
}

export interface AdminStats {
  totalUpdatesToday: number;
  gateClosures: number;
  gateOpenings: number;
  averageWait: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  admin: {
    id: string;
    username: string;
    role: string;
  };
}
