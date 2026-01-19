import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/common/DataTable';
import {
  TableSkeleton,
  StatsSkeleton,
  HeatmapSkeleton,
} from '@/components/dashboard/DashboardSkeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboard } from '@/hooks/useDashboard';
import DashboardStats from './DashboardStats';
import Heatmap from './Heatmap';
import { columns } from './columns';
import { useNotes } from '@/hooks/useNote';

export default function Overview() {
  const navigate = useNavigate();
  const PAGE_SIZE = 5;
  const [page, setPage] = useState(1);

  const { data: dashboardData, isLoading: isDashboardLoading } = useDashboard();
  const { data: notes, isLoading: isNotesLoading } = useNotes({
    page: page,
    pageSize: PAGE_SIZE,
  });

  // 통합 초기 로딩 상태: 대시보드 요약이나 첫 노트 목록 중 하나라도 로딩 중이면 전체 스켈레톤 유지
  const isInitialCombinedLoading = isDashboardLoading || (isNotesLoading && !notes);

  if (isInitialCombinedLoading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <StatsSkeleton />
        <HeatmapSkeleton />
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">학습 노트</h2>
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>
          <TableSkeleton />
        </section>
      </div>
    );
  }

  if (!dashboardData) return null;

  return (
    <div className="space-y-4 md:space-y-6">
      <DashboardStats dashboardData={dashboardData} />
      <Heatmap dashboardData={dashboardData} />
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">학습 노트</h2>
          <Button
            className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm transition-all hover:shadow-md pl-3 pr-4"
            onClick={() => navigate('/notes/new')}
          >
            <Plus className="size-4 mr-2" />
            노트 생성
          </Button>
        </div>
        {isNotesLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={notes?.items || []}
              pageCount={notes ? Math.ceil(notes.total / PAGE_SIZE) : 0}
              pageIndex={page - 1}
              onPageChange={setPage}
            />
          </div>
        )}
      </section>
    </div>
  );
}
