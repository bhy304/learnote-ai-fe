import * as z from 'zod';

export const noteSchema = z.object({
  rawContent: z.string().min(1, '노트를 입력해 주세요.'),
});

export const updateNoteSchema = z.object({
  title: z.string().min(1, '제목을 입력해 주세요.'),
  refinedContent: z.string().min(1, '내용을 입력해 주세요.'),
});

export type UpdateNoteSchema = z.infer<typeof updateNoteSchema>;
export type NoteSchema = z.infer<typeof noteSchema>;
