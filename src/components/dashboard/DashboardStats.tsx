import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NotebookPen, CalendarFold, Flame } from 'lucide-react';
import type { DashboardSummaryDto } from '@/models/generated';

interface DashboardStatsProps {
  dashboardData: DashboardSummaryDto | undefined;
}

export default function DashboardStats({ dashboardData }: DashboardStatsProps) {
  const stats = [
    {
      title: '전체 노트',
      Icon: NotebookPen,
      value: dashboardData?.totalNotes,
      unit: '개',
    },
    {
      title: '연속 학습일',
      Icon: Flame,
      value: dashboardData?.currentStreakDays,
      unit: '일',
    },
    {
      title: '이번 달 노트',
      Icon: CalendarFold,
      value: dashboardData?.thisMonthNotes,
      unit: '개',
    },
  ];

  return (
    <section className="grid grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="border border-slate-200 shadow-sm bg-white hover:shadow-md transition-all duration-200"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold text-slate-600">{stat.title}</CardTitle>
            <stat.Icon className="h-5 w-5 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-1">
              <span className="text-4xl font-bold tracking-tight text-slate-900">{stat.value}</span>
              <span className="text-lg text-slate-500 font-medium">{stat.unit}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
