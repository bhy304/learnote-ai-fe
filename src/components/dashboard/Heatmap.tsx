import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import type { Activity, DashboardResponse } from '@/types/dashboard.type';

interface HeatmapProps {
  dashboardData: DashboardResponse | undefined;
}
export default function Heatmap({ dashboardData }: HeatmapProps) {
  const currentYear = new Date().getFullYear();
  const startDate = new Date(currentYear - 1, 11, 31);
  const endDate = new Date(currentYear, 11, 31);

  return (
    <section className="w-full p-4 bg-white rounded-xl border">
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={dashboardData?.activity || []}
        gutterSize={0.8}
        classForValue={(value) => {
          if (!value) return 'color-empty';
          return `color-scale-${value.level}`;
        }}
        showWeekdayLabels={true}
        tooltipDataAttrs={(value) => {
          const activity = value as Activity | undefined;
          return {
            'data-tooltip-id': 'heatmap-tooltip',
            'data-tooltip-content':
              activity && activity.date ? `${activity.date} : ${activity.count}개` : '데이터 없음',
          } as any;
        }}
      />
      <Tooltip id="heatmap-tooltip" />
      <div className="flex justify-end items-center gap-2 text-xs text-muted-foreground">
        <span className="text-sm">Less</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded-[2px] bg-[#ebedf0]" />
          <div className="w-4 h-4 rounded-[2px] bg-[#9be9a8]" />
          <div className="w-4 h-4 rounded-[2px] bg-[#40c463]" />
          <div className="w-4 h-4 rounded-[2px] bg-[#30a14e]" />
          <div className="w-4 h-4 rounded-[2px] bg-[#216e39]" />
        </div>
        <span className="text-sm">More</span>
      </div>
    </section>
  );
}
