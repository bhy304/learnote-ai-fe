import type { DashboardResponse } from '@/types/dashboard.type';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NotebookPen, CalendarFold, Flame } from 'lucide-react';

interface DashboardStatsProps {
  data: DashboardResponse | undefined;
}

export default function DashboardStats({ data }: DashboardStatsProps) {
  const stats = [
    {
      title: 'Total Notes',
      icon: <NotebookPen className="w-6 h-6 text-muted-foreground" />,
      value: data?.totalNotes,
      unit: '개',
    },
    {
      title: 'Learning Streak',
      icon: <Flame className="w-6 h-6 text-muted-foreground" />,
      value: data?.currentStreakDays,
      unit: '일',
    },
    {
      title: 'This Month',
      icon: <CalendarFold className="w-6 h-6 text-muted-foreground" />,
      value: data?.thisMonthNotes,
      unit: '개',
    },
  ];

  return (
    <section className="grid grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xl font-medium text-muted-foreground font-poppins">
              {stat.title}
            </CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-baseline gap-1">
              {stat.value}
              <span className="text-sm font-normal text-muted-foreground">{stat.unit}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
