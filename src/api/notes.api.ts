import https from './https';

interface Note {
  title: string;
  rawContent: string;
}

interface NoteResponse {
  reviewId: number;
  status: string;
  message: string;
}

interface NoteAnalysisResponse {
  reviewId: number;
  status: string;
  refinedNote: string;
  summary: {
    keywords: string[];
    oneLineSummary: string;
  };
  factChecks: [
    {
      comment: string;
      verdict: string;
      correction: string;
      originalText: string;
    },
  ];
  feedback: {
    type: string;
    message: string;
    longTermGoal: string;
    shortTermGoal: string;
  };
  skillUpdateProposal: {
    stack: string;
    category: string;
    newSkills: string[];
  };
  suggestedTodos: [
    {
      reason: string;
      content: string;
      deadlineType: string;
    },
    {
      reason: string;
      content: string;
      deadlineType: string;
    },
  ];
}

const notesAPI = {
  async createNote(data: Note) {
    const response = await https.post<Note, NoteResponse>('/notes', data);
    return response;
  },
  async getNote(id: number) {
    const response = await https.get<NoteAnalysisResponse>(`/notes/${id}/analysis`);
    return response;
  },
};

export default notesAPI;
