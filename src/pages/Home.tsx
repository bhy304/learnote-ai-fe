import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import CreateNoteDialog from '@/components/CreateNoteDialog';
import AnalysisLoadingView from '@/components/AnalysisLoadingView';
import AnalysisResultDialog from '@/components/AnalysisResultDialog';
import notesAPI from '@/api/notes.api';

export default function Home() {
  const [reviewId, setReviewId] = useState<number | null>(null);

  const {
    data,
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
        <div className="flex min-h-svh flex-col items-center justify-center">
          <CreateNoteDialog onSuccess={handleCreateSuccess} />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex min-h-svh flex-col items-center justify-center">
          <p className="text-red-500">분석 중 오류가 발생했습니다. 다시 시도해주세요.</p>
          <button
            onClick={handleCloseResult}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            돌아가기
          </button>
        </div>
      );
    }

    if (isQueryLoading || (data && data.status === 'ANALYZING')) {
      return (
        <main className="flex min-h-svh flex-col items-center justify-center">
          <AnalysisLoadingView />
        </main>
      );
    }

    if (data && data.status !== 'ANALYZING') {
      return <AnalysisResultDialog result={data} onClose={handleCloseResult} />;
    }

    return null;
  };

  return <>{renderContent()}</>;
}
