import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { noteSchema } from '@/schema/note.schema';
import notesAPI from '@/api/notes.api';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupTextarea } from '@/components/ui/input-group';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function CreateNote() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      rawContent: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof noteSchema>): Promise<void> => {
    setIsSubmitting(true);
    try {
      const result = await notesAPI.createNote({
        rawContent: data.rawContent,
      });

      form.reset();

      // 관련 쿼리 무효화 (대시보드 통계, 히트맵, 노트 목록 갱신)
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['notes'] });

      navigate(`/notes/${result.noteId}`);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto py-10 px-4 max-w-[1000px]">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-2">오늘의 학습 노트</h1>
        <p className="text-muted-foreground text-lg">오늘의 학습 노트를 작성해보세요.</p>
        <div className="mt-6 bp-primary/5 border border-primary/10 rounded-lg p-6 bg-primary/5">
          <h2 className="font-semibold text-primary flex items-center gap-2 mb-3">
            <Lightbulb className="size-5" />
            학습 노트 작성 가이드
          </h2>
          <ul className="list-disc list-inside  flex  flex-col gap-y-2">
            {[
              '오늘 배운 핵심 개념이나 내용',
              '이해한 점과 아직 어려운 점',
              '새롭게 깨달은 인사이트',
              '다음에 더 학습해보고 싶은 것',
            ].map((text, i) => (
              <li
                key={i}
                className="text-sm text-muted-foreground leading-snug marker:text-primary/40 ml-6"
              >
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup>
          <Controller
            name="rawContent"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-note" className="text-lg">
                  학습 노트
                </FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    id="form-note"
                    placeholder={`예시)\n오늘은 React의 useEffect Hook을 공부했습니다.\n클린업 함수의 필요성을 이해했고,\ndependency array를 비워두면 마운트 시 한 번만 실행된다는 것을 배웠습니다.\n하지만 여러 개의 useEffect를 사용할 때 실행 순서가 헷갈렸습니다.\n내일은 custom hook을 만들어보려고 합니다.`}
                    className="min-h-100 max-h-130 resize-none overflow-y-auto text-lg leading-relaxed p-6 placeholder:text-base placeholder:text-muted-foreground/40"
                    aria-invalid={fieldState.invalid}
                  />
                </InputGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            disabled={isSubmitting}
            onClick={() => navigate('/')}
          >
            취소
          </Button>
          <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
            노트 생성
          </Button>
        </div>
      </form>
    </main>
  );
}
