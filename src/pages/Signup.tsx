import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { MailIcon, LockIcon, UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Signup() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">회원가입</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="username">이름</FieldLabel>
              <InputGroup>
                <InputGroupInput id="username" type="text" placeholder="이름을 입력해 주세요." />
                <InputGroupAddon>
                  <UserIcon className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="email">이메일</FieldLabel>
              <InputGroup>
                <InputGroupInput id="email" type="email" placeholder="이메일을 입력해 주세요." />
                <InputGroupAddon>
                  <MailIcon className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">비밀번호</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  type="password"
                  placeholder="영문자, 숫자, 특수문자 포함 8자 이상"
                />
                <InputGroupAddon>
                  <LockIcon className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="passwordConfirm">비밀번호 확인</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="passwordConfirm"
                  type="password"
                  placeholder="비밀번호를 확인해 주세요."
                />
                <InputGroupAddon>
                  <LockIcon className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full">회원가입</Button>
          <p className="flex items-center justify-between text-sm">
            이미 계정이 있으신가요?
            <Link to="/login" className="h-auto p-2 hover:underline">
              로그인
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
