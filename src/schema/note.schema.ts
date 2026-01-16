import * as z from 'zod';

export const noteSchema = z.object({
  rawContent: z.string().min(1, '노트를 입력해 주세요.'),
});

export type NoteSchema = z.infer<typeof noteSchema>;
