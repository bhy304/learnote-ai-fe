export interface DashboardNote {
  id: number;
  title: string;
  tags: string[];
  createdAt: string;
  status: 'ANALYZING' | 'COMPLETED' | 'FAILED';
}

export interface Activity {
  date: string;
  count: number;
  level: number;
}

export interface DashboardResponse {
  userId: number;
  totalNotes: number;
  currentStreakDays: number;
  thisMonthNotes: number;
  recentNotes: DashboardNote[];
  activity: Activity[];
}
