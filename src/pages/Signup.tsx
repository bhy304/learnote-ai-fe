import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { MailIcon, LockIcon, UserIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import authAPI from '@/api/auth.api';
import axios from 'axios';
import { signupSchema, type SignupSchema } from '@/schema/auth.schema';

export default function Signup() {
  const navigate = useNavigate();
  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const onSubmit = async ({ name, email, password }: SignupSchema): Promise<void> => {
    try {
      await authAPI.signup({
        name,
        email,
        password,
      });
      // @TODO: 가입 성공시 자동 로그인 후 메인페이지로 이동

      navigate('/login');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;

        // @TODO: 400, 409 에러 처리
        if (status === 400 && data.message.includes('users_email_key')) {
          form.setError(
            'email',
            {
              type: 'manual',
              message: '이미 등록된 이메일입니다.',
            },
            { shouldFocus: true },
          );
        } else {
          console.error(error);
        }
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-center text-2xl">회원가입</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">이름</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="username"
                    type="text"
                    placeholder="이름을 입력해 주세요."
                    aria-invalid={!!form.formState.errors.name}
                    {...form.register('name')}
                  />
                  <InputGroupAddon>
                    <UserIcon className="text-muted-foreground" />
                  </InputGroupAddon>
                </InputGroup>
                {form.formState.errors.name && <FieldError errors={[form.formState.errors.name]} />}
              </Field>
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
                    type="password"
                    placeholder="8자 이상 입력해 주세요."
                    aria-invalid={!!form.formState.errors.password}
                    {...form.register('password')}
                  />
                  <InputGroupAddon>
                    <LockIcon className="text-muted-foreground" />
                  </InputGroupAddon>
                </InputGroup>
                {form.formState.errors.password && (
                  <FieldError errors={[form.formState.errors.password]} />
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="passwordConfirm">비밀번호 확인</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="passwordConfirm"
                    type="password"
                    placeholder="비밀번호를 확인해 주세요."
                    aria-invalid={!!form.formState.errors.passwordConfirm}
                    {...form.register('passwordConfirm')}
                  />
                  <InputGroupAddon>
                    <LockIcon className="text-muted-foreground" />
                  </InputGroupAddon>
                </InputGroup>
                {form.formState.errors.passwordConfirm && (
                  <FieldError errors={[form.formState.errors.passwordConfirm]} />
                )}
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-6">
            <Button className="w-full cursor-pointer">회원가입</Button>
            <p className="flex items-center justify-between text-sm">
              이미 계정이 있으신가요?
              <Link to="/login" className="h-auto p-2 hover:underline">
                로그인
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
