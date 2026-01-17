import { useMutation, useQueryClient } from '@tanstack/react-query';
import notesAPI from '@/api/notes.api';
import { toast } from 'sonner';
import type { UpdateNoteDto } from '@/models/generated';

interface UseNoteActionsProps {
  onSuccessDelete?: () => void;
  onSuccessUpdate?: () => void;
}

export const useNoteActions = ({ onSuccessDelete, onSuccessUpdate }: UseNoteActionsProps = {}) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => notesAPI.deleteNote(id),
    onSuccess: () => {
      toast.success('노트가 삭제되었습니다.');

      // 삭제 성공 시 '목록(notes)'과 '대시보드 통계(dashboard)' 데이터를 새로고침(무효화)
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });

      onSuccessDelete?.(); // 추가 작업(예: 페이지 이동)이 있다면 실행
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error('노트 삭제에 실패했습니다.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNoteDto }) =>
      notesAPI.updateNote(id, data),
    onSuccess: (_, variables) => {
      toast.success('노트가 수정되었습니다.');

      // 수정 성공 시 '상세 내용(noteAnalysis)'까지 새로고침해야 변경된 내용이 바로 보입니다.
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['noteAnalysis', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }); // 제목 변경 등이 대시보드에 반영될 수 있음

      onSuccessUpdate?.(); // 추가 작업(예: 수정 모달 닫기) 실행
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error('노트 수정에 실패했습니다.');
    },
  });

  return {
    deleteNote: deleteMutation.mutateAsync,
    updateNote: updateMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
};
