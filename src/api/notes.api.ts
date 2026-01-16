import https from './https';
import type {
  CreateNoteDto,
  NoteCreateResponseDto,
  NoteAnalysisResponseDto,
  UpdateNoteDto,
  NoteEntityDto,
  SimpleMessageResponseDto,
  NotesControllerListNotesParams,
  NoteListResponseDto,
} from '@/models/generated';

const notesAPI = {
  async createNote(data: CreateNoteDto) {
    const response = await https.post<CreateNoteDto, NoteCreateResponseDto>('/notes', data);
    return response;
  },
  async getAnalysisNote(id: string) {
    const response = await https.get<NoteAnalysisResponseDto>(`/notes/${id}/analysis`);
    return response;
  },
  async updateNote(id: string, data: UpdateNoteDto) {
    const response = await https.patch<UpdateNoteDto, NoteEntityDto>(`/notes/${id}`, data);
    return response;
  },
  async deleteNote(id: string) {
    const response = await https.delete<SimpleMessageResponseDto>(`/notes/${id}`);
    return response;
  },
  async getNotes(params: NotesControllerListNotesParams) {
    const response = await https.get<NoteListResponseDto>('/notes', { params });
    return response;
  },
};

export default notesAPI;
