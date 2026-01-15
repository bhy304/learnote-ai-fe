import { useState } from 'react';

import Heatmap from '@/components/dashboard/Heatmap';
import Header from '@/components/common/Header';
import DashboardStats from '@/components/dashboard/DashboardStats';
import { DataTable } from '@/components/dashboard/data-table';
import { columns } from '@/components/dashboard/columns';
import { useDashboard } from '@/hooks/useDashboard';
import { useNote, useNotes } from '@/hooks/useNote';
import { useDashboardTodos } from '@/hooks/useDashboardTodos';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const [noteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const { data: dashboardData, isLoading: isDashboardLoading } = useDashboard();
  const { data: todoData, isLoading: isTodosLoading } = useDashboardTodos();
  const { data: notes, isLoading: isNotesLoading } = useNotes({
    page: String(page),
    pageSize: String(PAGE_SIZE),
  });

  console.log(notes);

  const renderContent = () => {
    if (!noteId) {
      return (
        <>
          <Header />
          <main className="container mx-auto py-10 px-4 max-w-[1200px] space-y-12">
            {isDashboardLoading ? (
              <div className="flex h-12 items-center justify-center">
                <p className="text-muted-foreground">통계 데이터를 불러오는 중...</p>
              </div>
            ) : (
              <div>
                <DashboardStats data={dashboardData} />
                <Heatmap dashboardData={dashboardData} />
              </div>
            )}

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">TODO</h2>
                  {/* <p className="text-muted-foreground text-sm">
                    추출된 To-Do들을 드래그 앤 드롭으로 관리하세요.
                  </p> */}
                </div>
              </div>

              {isTodosLoading ? (
                <div className="flex h-64 items-center justify-center bg-muted/20 rounded-xl border border-dashed">
                  <p className="text-muted-foreground">할 일 목록을 불러오는 중...</p>
                </div>
              ) : (
                <KanbanBoard initialTodos={todoData || []} />
              )}
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">학습 노트 목록</h2>
                  {/* <p className="text-muted-foreground text-sm">
                    최근 작성하고 분석한 학습 노트 목록입니다.
                  </p> */}
                </div>
                <Button className="cursor-pointer" onClick={() => navigate('/notes/new')}>
                  노트 생성
                </Button>
                {/* <CreateNoteDialog onSuccess={handleCreateSuccess} /> */}
              </div>

              {isNotesLoading ? (
                <div className="flex h-64 items-center justify-center bg-muted/20 rounded-xl border border-dashed">
                  <p className="text-muted-foreground">노트 목록을 불러오는 중...</p>
                </div>
              ) : (
                <div className="container mx-auto">
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
          </main>
        </>
      );
    }

    // if (isError) {
    //   return (
    //     <div className="flex min-h-svh flex-col items-center justify-center">
    //       <p className="text-red-500">분석 중 오류가 발생했습니다. 다시 시도해주세요.</p>
    //       <button
    //         onClick={handleCloseResult}
    //         className="mt-4 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
    //       >
    //         돌아가기
    //       </button>
    //     </div>
    //   );
    // }

    // if (isQueryLoading || (analysisData && analysisData.status === 'ANALYZING')) {
    //   return (
    //     <main className="flex min-h-svh flex-col items-center justify-center">
    //       <AnalysisLoadingView />
    //     </main>
    //   );
    // }

    // if (analysisData && analysisData.status !== 'ANALYZING') {
    //   return <AnalysisResultDialog result={analysisData} onClose={handleCloseResult} />;
    // }

    return null;
  };

  return <>{renderContent()}</>;
}
