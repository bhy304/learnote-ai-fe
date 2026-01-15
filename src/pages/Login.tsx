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
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeOffIcon, EyeIcon, MailIcon, LockIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);

  // @TODO: 이메일 혹은 비밀번호 틀렸을 때 처리
  const onSubmit = async ({ email, password }: LoginSchema): Promise<void> => {
    try {
      const result = await authAPI.login({
        email,
        password,
      });

      console.log(result);
      setAuth(result.accessToken);
      navigate('/', { replace: true });
    } catch (error) {
      // @TODO: 이메일 혹은 비밀번호 틀렸을 때 처리
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-center text-2xl">로그인</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">이메일</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="email"
                    type="email"
                    placeholder="이메일을 입력해 주세요."
                    aria-invalid={!!form.formState.errors.email}
                    {...form.register('email')}
                  />
                  <InputGroupAddon>
                    <MailIcon className="text-muted-foreground" />
                  </InputGroupAddon>
                </InputGroup>
                {form.formState.errors.email && (
                  <FieldError errors={[form.formState.errors.email]} />
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">비밀번호</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 입력해 주세요."
                    aria-invalid={!!form.formState.errors.password}
                    {...form.register('password')}
                  />
                  <InputGroupAddon>
                    <LockIcon className="text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-xs"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {form.formState.errors.password && (
                  <FieldError errors={[form.formState.errors.password]} />
                )}
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-6">
            <Button type="submit" className="w-full cursor-pointer">
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
