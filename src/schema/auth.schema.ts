import * as z from 'zod';

export const signupSchema = z
  .object({
    name: z.string().trim().min(1, '이름을 입력해 주세요.'),
    email: z
      .string()
      .trim()
      .min(1, '이메일을 입력해 주세요.')
      .email('이메일 형식으로 입력해 주세요.'),
    password: z.string().trim().min(8, '비밀번호를 8자 이상 입력해 주세요.'),
    passwordConfirm: z.string().trim().min(8, '비밀번호 확인을 8자 이상 입력해 주세요.'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않습니다.',
  });

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, '이메일을 입력해 주세요.')
    .email('이메일 형식으로 입력해 주세요.'),
  password: z.string().trim().min(8, '비밀번호를 8자 이상 입력해 주세요.'),
});

export type SignupSchema = z.infer<typeof signupSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
