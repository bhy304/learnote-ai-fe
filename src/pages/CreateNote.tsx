import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { noteSchema } from '@/schema/note.schema';
import notesAPI from '@/api/notes.api';
import { InputGroupTextarea } from '@/components/ui/input-group';
import { Button } from '@/components/ui/button';
import { Lightbulb, X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { FieldError } from '@/components/ui/field';

export default function CreateNote() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    mode: 'onChange',
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
    <main className="container mx-auto py-12 px-6 max-w-[1000px] min-h-screen bg-white space-y-12">
      {/* 헤더 섹션 */}
      <div className="flex flex-col gap-6">
        {/* <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="w-fit gap-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          대시보드
        </Button> */}

        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-[1.2]">
            오늘의 학습 노트
          </h1>
          {/* <p className="text-slate-500 text-lg">
            오늘 배운 내용을 자유롭게 적어보세요. AI가 노트를 정리하고 학습을 추천해드릴게요.
          </p> */}
        </div>
      </div>

      <div className="space-y-12">
        <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-3xl flex gap-4 animate-in fade-in duration-500">
          <Lightbulb className="size-5 text-slate-400 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-base font-bold text-slate-600">작성 가이드</p>
            <p className="text-base text-slate-500 leading-relaxed font-medium">
              오늘 배운 핵심 개념, 이해한 점과 어려웠던 부분, 그리고 새로운 인사이트를 자유롭게
              적어보세요.
              <br /> 문장이 완벽하지 않아도 괜찮습니다.
              <br /> AI가 당신의 생각을 구조화하고 학습 방향을 제안해 드립니다.
            </p>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-3">
            <Controller
              name="rawContent"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-3">
                  <InputGroupTextarea
                    {...field}
                    autoFocus
                    id="form-raw-content"
                    placeholder={`예시)\n오늘은 React의 useEffect Hook을 공부했습니다.\n클린업 함수의 필요성을 이해했고, dependency array를 비워두면 마운트 시 한 번만 실행된다는 것을 배웠습니다.\n\n하지만 여러 개의 useEffect를 사용할 때 실행 순서가 조금 헷갈리네요.\n내일은 custom hook을 직접 만들어보면서 복습하려고 합니다.`}
                    className="min-h-[500px] bg-white border-2 p-8 text-lg leading-relaxed text-slate-700 resize-none shadow-sm rounded-xl transition-all border-slate-200 focus:border-slate-400 focus-visible:ring-0 placeholder:text-lg"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </div>
              )}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="px-6 cursor-pointer text-slate-500 hover:text-slate-900 font-medium"
              disabled={isSubmitting}
              onClick={() => navigate('/')}
            >
              <X className="size-4 mr-2" />
              취소
            </Button>
            <Button
              type="submit"
              size="lg"
              className="px-8 cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-sm transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                '분석 중...'
              ) : (
                <>
                  <Sparkles className="size-4 mr-2" />
                  노트 분석
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
