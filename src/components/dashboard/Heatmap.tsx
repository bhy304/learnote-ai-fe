import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import type { ActivityItemDto, DashboardSummaryDto } from '@/models/generated';
import { formatDate } from '@/lib/format';

interface HeatmapProps {
  dashboardData: DashboardSummaryDto | undefined;
}
export default function Heatmap({ dashboardData }: HeatmapProps) {
  const { startDate, endDate } = formatDate();

  return (
    <section className="w-full p-4 bg-white rounded-xl border">
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={dashboardData?.activity || []}
        gutterSize={0.8}
        classForValue={(value) => {
          if (!value) return 'color-scale-0';
          return `color-scale-${value.level}`;
        }}
        showWeekdayLabels={true}
        tooltipDataAttrs={(value) => {
          const activity = value as ActivityItemDto | undefined;
          return {
            'data-tooltip-id': 'heatmap-tooltip',
            'data-tooltip-content':
              activity && activity.date ? `${activity.date} : ${activity.count}개` : '데이터 없음',
          } as any;
        }}
      />
      <Tooltip id="heatmap-tooltip" />
      <div className="flex justify-end items-center gap-3 text-xs text-muted-foreground -mt-11">
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
