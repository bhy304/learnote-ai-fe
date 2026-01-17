import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/common/DataTable';
import { TableSkeleton, StatsSkeleton } from '@/components/dashboard/DashboardSkeleton';
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

  if (isDashboardLoading) {
    return (
      <>
        <StatsSkeleton />
        <Skeleton className="h-[200px] w-full rounded-2xl" />
      </>
    );
  }

  if (!dashboardData) return null;

  return (
    <>
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
            <div className="overflow-hidden">
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
    </>
  );
}
