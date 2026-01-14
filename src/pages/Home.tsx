import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import CreateNoteDialog from '@/components/CreateNoteDialog';
import AnalysisLoadingView from '@/components/AnalysisLoadingView';
import AnalysisResultDialog from '@/components/AnalysisResultDialog';
import Heatmap from '@/components/dashboard/Heatmap';
import Header from '@/components/common/Header';
import DashboardStats from '@/components/dashboard/DashboardStats';
import NotesTable from '@/components/dashboard/NotesTable';
import notesAPI from '@/api/notes.api';
import dashboardAPI from '@/api/dashboard.api';

export default function Home() {
  const [reviewId, setReviewId] = useState<number | null>(null);
  const userId = 'user-123'; // 임시 유저 ID

  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['dashboard', userId],
    queryFn: () => dashboardAPI.getDashboard(),
  });
  const { data: notes } = useQuery({
    queryKey: ['notes', userId],
    queryFn: () => dashboardAPI.getNotes(),
  });

  const {
    data: analysisData,
    isError,
    isLoading: isQueryLoading,
  } = useQuery({
    queryKey: ['noteAnalysis', reviewId],
    queryFn: () => {
      if (reviewId === null) throw new Error('reviewId is null');
      return notesAPI.getNote(reviewId);
    },
    enabled: !!reviewId,
    refetchInterval: (query) => (query.state.data?.status === 'ANALYZING' ? 3000 : false),
  });

  const handleCreateSuccess = (id: number) => {
    setReviewId(id);
  };

  const handleCloseResult = () => {
    setReviewId(null);
  };

  const renderContent = () => {
    if (!reviewId) {
      return (
        <>
          <Header />
          <main className="container mx-auto py-10 px-4  max-w-[1200px]">
            <DashboardStats data={dashboardData} />
            <Heatmap dashboardData={dashboardData} />

            <div className="flex items-center justify-between my-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
                <p className="text-muted-foreground">최근 학습한 내용을 확인하고 분석해보세요.</p>
              </div>
              <CreateNoteDialog onSuccess={handleCreateSuccess} />
            </div>

            {isDashboardLoading ? (
              <div className="flex h-64 items-center justify-center">
                <p>데이터를 불러오는 중...</p>
              </div>
            ) : (
              <NotesTable notes={notes || []} />
            )}
          </main>
        </>
      );
    }

    if (isError) {
      return (
        <div className="flex min-h-svh flex-col items-center justify-center">
          <p className="text-red-500">분석 중 오류가 발생했습니다. 다시 시도해주세요.</p>
          <button
            onClick={handleCloseResult}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
          >
            돌아가기
          </button>
        </div>
      );
    }

    if (isQueryLoading || (analysisData && analysisData.status === 'ANALYZING')) {
      return (
        <main className="flex min-h-svh flex-col items-center justify-center">
          <AnalysisLoadingView />
        </main>
      );
    }

    if (analysisData && analysisData.status !== 'ANALYZING') {
      return <AnalysisResultDialog result={analysisData} onClose={handleCloseResult} />;
    }

    return null;
  };

  return <>{renderContent()}</>;
}
