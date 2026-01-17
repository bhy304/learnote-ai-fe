import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import authAPI from '@/api/auth.api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { loginSchema, type LoginSchema } from '@/schema/auth.schema';
import { useAuthStore } from '@/store/authStore';
import { EyeOffIcon, EyeIcon, MailIcon, LockIcon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function Login() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const setUser = useAuthStore((state) => state.setUser);
  const setAuth = useAuthStore((state) => state.setAuth);

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async ({ email, password }: LoginSchema): Promise<void> => {
    try {
      const { accessToken, refreshToken, user } = await authAPI.login({
        email,
        password,
      });

      queryClient.clear(); // 로그인 시 이전 유저나 이전 세션의 캐시 데이터를 완전히 삭제
      setUser(user);
      setAuth(accessToken, refreshToken);

      navigate('/', { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status } = error.response;

        if (status === 401) {
          form.setError('root', {
            type: 'manual',
            message: '이메일 또는 비밀번호가 올바르지 않습니다.',
          });
          form.setFocus('email');
        }
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md border-slate-200 shadow-lg bg-white">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl font-bold text-slate-900">로그인</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email" className="text-base font-medium">
                  이메일
                </FieldLabel>
                <InputGroup className="h-11">
                  <InputGroupInput
                    id="email"
                    type="email"
                    placeholder="이메일을 입력해 주세요."
                    aria-invalid={!!form.formState.errors.email || !!form.formState.errors.root}
                    {...form.register('email')}
                    className="h-11 text-base placeholder:text-sm"
                  />
                  <InputGroupAddon>
                    <MailIcon className="text-slate-400" />
                  </InputGroupAddon>
                </InputGroup>
                {form.formState.errors.email && (
                  <FieldError errors={[form.formState.errors.email]} />
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="password" className="text-base font-medium">
                  비밀번호
                </FieldLabel>
                <InputGroup className="h-11">
                  <InputGroupInput
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 입력해 주세요."
                    aria-invalid={!!form.formState.errors.password || !!form.formState.errors.root}
                    {...form.register('password')}
                    className="h-11 text-base placeholder:text-sm"
                  />
                  <InputGroupAddon>
                    <LockIcon className="text-slate-400" />
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      type="button"
                      size="icon-xs"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="text-slate-400" />
                      ) : (
                        <EyeIcon className="text-slate-400" />
                      )}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {form.formState.errors.password && (
                  <FieldError errors={[form.formState.errors.password]} />
                )}
                {form.formState.errors.root && <FieldError errors={[form.formState.errors.root]} />}
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-8">
            <Button
              type="submit"
              size="lg"
              className="w-full cursor-pointer text-base font-semibold shadow-md"
            >
              로그인
            </Button>
            <p className="flex items-center justify-between text-sm">
              아직 계정이 없으신가요?
              <Link to="/signup" className="h-auto p-2 hover:underline">
                회원가입
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
