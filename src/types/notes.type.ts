export interface Note {
  title: string;
  rawContent: string;
}

export interface PostNoteResponse {
  reviewId: number;
  status: string;
  message: string;
}

export interface GetNoteResponse {
  reviewId: number;
  status: string;
  refinedNote: string;
  summary: Summary;
  factChecks: FactCheck[];
  feedback: Feedback;
  skillUpdateProposal: SkillUpdateProposal;
  suggestedTodos: SuggestedTodos[];
}

interface Summary {
  keywords: string[];
  oneLineSummary: string;
}

interface FactCheck {
  comment: string;
  verdict: string;
  correction: string;
  originalText: string;
}

interface Feedback {
  type: string;
  message: string;
  longTermGoal: string;
  shortTermGoal: string;
}

interface SkillUpdateProposal {
  stack: string;
  category: string;
  newSkills: string[];
}

interface SuggestedTodos {
  reason: string;
  content: string;
  deadlineType: string;
}
