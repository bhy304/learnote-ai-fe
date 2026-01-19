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
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="border border-slate-200 shadow-sm bg-white hover:shadow-md transition-all duration-200"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm sm:text-base font-semibold text-slate-600 truncate whitespace-nowrap mr-2">
              {stat.title}
            </CardTitle>
            <stat.Icon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-none">
                {stat.value}
              </span>
              <span className="text-sm sm:text-base text-slate-500 font-medium">{stat.unit}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
