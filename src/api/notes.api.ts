import https from './https';
import type { GetNoteResponse, Note, PostNoteResponse } from '@/types/notes.type';

const notesAPI = {
  async createNote(data: Note) {
    const response = await https.post<Note, PostNoteResponse>('/notes', data);
    return response;
  },
  async getNote(id: number) {
    const response = await https.get<GetNoteResponse>(`/notes/${id}/analysis`);
    return response;
  },
};

export default notesAPI;
