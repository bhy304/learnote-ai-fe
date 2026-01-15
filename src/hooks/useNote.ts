import notesAPI from '@/api/notes.api';
import { useQuery } from '@tanstack/react-query';
import type { NotesControllerListNotesParams } from '@/models/generated';

export const useNote = (noteId: string | null) => {
  return useQuery({
    queryKey: ['noteAnalysis', noteId],
    queryFn: () => {
      if (noteId === null) throw new Error('noteId is null');
      return notesAPI.getAnalysisNote(noteId);
    },
    enabled: !!noteId,
    refetchInterval: (query) => (query.state.data?.status === 'ANALYZING' ? 3000 : false),
  });
};

export const useNotes = (params: NotesControllerListNotesParams) => {
  return useQuery({
    queryKey: ['notes', params],
    queryFn: () => notesAPI.getNotes(params),
  });
};
