import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NotebookPen, CalendarFold, Flame } from 'lucide-react';
import type { DashboardSummaryDto } from '@/models/generated';

interface DashboardStatsProps {
  data: DashboardSummaryDto | undefined;
}

export default function DashboardStats({ data }: DashboardStatsProps) {
  const stats = [
    {
      title: 'Total Notes',
      Icon: NotebookPen,
      value: data?.totalNotes,
      unit: '개',
    },
    {
      title: 'Learning Streak',
      Icon: Flame,
      value: data?.currentStreakDays,
      unit: '일',
    },
    {
      title: '이번달',
      Icon: CalendarFold,
      value: data?.thisMonthNotes,
      unit: '개',
    },
  ];

  return (
    <section className="grid grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="hover:shadow-md transition-shadow border-none shadow-sm bg-white/50 backdrop-blur-sm gap-4"
        >
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <stat.Icon className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-4xl font-bold tracking-tight">
              {stat.value}
              <span className="text-base font-normal text-muted-foreground ml-1">{stat.unit}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
