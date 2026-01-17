import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNote } from '@/hooks/useNote';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Search,
  Target,
  CheckCircle2,
  Rocket,
  FileText,
  ListPlus,
  Save,
  X,
  Lightbulb,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AnalysisLoadingView from '@/components/AnalysisLoadingView';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import notesAPI from '@/api/notes.api';
import { useQueryClient } from '@tanstack/react-query';
import type {
  NoteAnalysisResponseDtoSuggestedTodosItem,
  NoteAnalysisResponseDtoFactChecksItem,
} from '@/models/generated';
import { NoteDeleteDialog } from '@/components/dashboard/NoteDeleteDialog';
import { useNoteActions } from '@/hooks/useNoteActions';

interface NoteSummary {
  oneLineSummary?: string;
  keywords?: string[];
}

const updateNoteSchema = z.object({
  title: z.string().min(1, '제목을 입력해 주세요.'),
  refinedContent: z.string().min(1, '내용을 입력해 주세요.'),
});

type UpdateNoteSchema = z.infer<typeof updateNoteSchema>;

export default function NoteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: note, isLoading } = useNote(id || null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const toggleSelect = (index: number) => {
    const newSet = new Set(selectedIndices);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setSelectedIndices(newSet);
  };

  const handleCreateTodos = async () => {
    if (selectedIndices.size === 0) return;
    const selectedTodos = Array.from(selectedIndices).map((index) => {
      const todo = (note?.suggestedTodos || [])[index] as NoteAnalysisResponseDtoSuggestedTodosItem;
      const isObject = typeof todo === 'object' && todo !== null;
      const content = isObject ? todo.content! : (todo as string);
      const reason = isObject ? todo.reason : undefined;

      return {
        content,
        reason,
        dueDate: new Date().toISOString().split('T')[0],
        deadlineType: 'SHORT_TERM' as const,
      };
    });

    try {
      await notesAPI.saveLearningTodos(id!, { todos: selectedTodos });
      toast.success(`${selectedIndices.size}개의 할 일이 생성되었습니다.`);

      setIsSelectionMode(false);
      setSelectedIndices(new Set());

      queryClient.invalidateQueries({ queryKey: ['noteAnalysis', id] });
    } catch (error) {
      console.error(error);
      toast.error('할 일 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateNoteSchema>({
    resolver: zodResolver(updateNoteSchema),
  });

  const { deleteNote, updateNote, isUpdating } = useNoteActions({
    onSuccessDelete: () => navigate('/'),
    onSuccessUpdate: () => setIsEditing(false),
  });

  const startEditing = () => {
    if (note) {
      reset({
        title: note.title || '',
        refinedContent: note.refinedNote || note.rawContent || '',
      });
      setIsEditing(true);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleUpdateNote = async (data: UpdateNoteSchema) => {
    if (!id) return;
    await updateNote({
      id,
      data,
    });
  };

  const handleDeleteNote = async () => {
    if (!id) return;
    await deleteNote(id);
  };

  if (isLoading) {
    return (
      <main className="container mx-auto py-10 px-4 max-w-[800px] space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </main>
    );
  }

  if (!note) {
    return (
      <main className="container mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-semibold">노트를 찾을 수 없습니다.</h2>
        <Button onClick={() => navigate('/')} className="mt-4 text-slate-600">
          대시보드로 돌아가기
        </Button>
      </main>
    );
  }

  const isAnalyzing = note.status === 'ANALYZING';
  const summaryData = note.summary as NoteSummary;
  const summary = summaryData?.oneLineSummary || '요약 정보가 없습니다.';
  const keywords = summaryData?.keywords || [];
  const suggestedTodos = note.suggestedTodos || [];
  const factChecks = note.factChecks || [];

  const allTodosCreated =
    suggestedTodos.length > 0 &&
    suggestedTodos.every((item) => {
      if (typeof item === 'string') return false;
      return item.isCreated;
    });

  return (
    <div className="relative min-h-screen bg-white">
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-md animate-in fade-in duration-500">
          <AnalysisLoadingView />
        </div>
      )}
      <main
        className={cn(
          'container mx-auto py-12 px-6 max-w-[1000px] space-y-12 transition-all duration-700',
          isAnalyzing ? 'blur-[2px] opacity-60' : 'animate-in fade-in',
        )}
      >
        {/* 상단 액션 바 */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="gap-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            대시보드
          </Button>
          <div className="flex gap-3">
            {!isSelectionMode && !allTodosCreated && !isEditing && (
              <Button
                variant="outline"
                className="px-4 cursor-pointer"
                onClick={() => {
                  setIsSelectionMode(true);
                  document.getElementById('suggestedTodos')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <ListPlus className="size-3.5 mr-2" />할 일 추가
              </Button>
            )}

            {isEditing ? (
              <>
                <Button variant="ghost" className="px-4 cursor-pointer" onClick={cancelEditing}>
                  <X className="size-4 mr-2" />
                  취소
                </Button>
                <Button
                  variant="default"
                  className="px-4 cursor-pointer"
                  onClick={handleSubmit(handleUpdateNote)}
                  disabled={isUpdating}
                >
                  <Save className="size-4 mr-2" />
                  {isUpdating ? '저장 중...' : '저장'}
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                className="px-4 cursor-pointer"
                onClick={startEditing}
                disabled={isAnalyzing}
              >
                <Pencil className="size-4 mr-2" />
                수정
              </Button>
            )}

            {!isEditing && (
              <Button
                variant="outline"
                className="px-4 text-rose-500 hover:bg-rose-50 border-slate-200 hover:border-rose-100 cursor-pointer"
                onClick={() => setIsDeleteOpen(true)}
              >
                <Trash2 className="size-4 mr-2" />
                삭제
              </Button>
            )}
            <NoteDeleteDialog
              open={isDeleteOpen}
              onOpenChange={setIsDeleteOpen}
              onConfirm={handleDeleteNote}
              isDeleting={false}
            />
          </div>
        </div>

        {/* 헤더: 제목 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <FileText className="size-3.5" />
            <span>분석 노트</span>
          </div>
          {isEditing ? (
            <div className="space-y-1">
              <input
                {...register('title')}
                className={cn(
                  'w-full text-3xl md:text-4xl font-bold tracking-tight text-slate-900 border-b-2 border-slate-100 focus:border-primary outline-none bg-transparent py-1 transition-all',
                  errors.title && 'border-rose-300',
                )}
                placeholder="제목을 입력하세요"
              />
              {errors.title && (
                <p className="text-xs text-rose-500 font-bold pl-1">{errors.title.message}</p>
              )}
            </div>
          ) : (
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-[1.2]">
              {note.title || '제목 없는 노트'}
            </h1>
          )}
        </div>

        {/* 콘텐츠 영역: 편집 모드일 때 사이드바 레이아웃 적용 */}
        <div className={cn('grid gap-12', isEditing ? 'lg:grid-cols-3' : 'grid-cols-1')}>
          <div className={cn('space-y-12', isEditing ? 'lg:col-span-2' : '')}>
            {/* 1. 학습 노트 내용 */}
            {!isAnalyzing && (
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">
                    학습 노트
                  </h3>
                  {note.refinedNote ? (
                    <Badge
                      variant="secondary"
                      className="bg-emerald-50 text-emerald-600 text-[10px] font-bold border-emerald-100 py-0 h-5"
                    >
                      나의 정리 완료
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-indigo-50 text-indigo-500 text-[10px] font-bold border-indigo-100 py-0 h-5"
                    >
                      AI 분석 초안
                    </Badge>
                  )}
                </div>

                {isEditing && (
                  <div className="p-5 bg-amber-50/80 border border-amber-200/50 rounded-2xl flex gap-4 animate-in fade-in slide-in-from-top-2">
                    <Lightbulb className="size-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="space-y-1.5">
                      <p className="text-sm font-bold text-amber-900 flex items-center gap-2">
                        전문가 다듬기 가이드
                      </p>
                      <p className="text-xs text-amber-800/90 leading-relaxed font-medium">
                        <strong>Tip:</strong> 우측의{' '}
                        <span className="underline underline-offset-2">팩트 체크</span> 결과를
                        참고하여 내용을 보완해보세요. 단순한 문구 수정을 넘어 나만의 인사이트를 한
                        줄 더 추가하는 것이 최고의 학습법입니다.
                      </p>
                    </div>
                  </div>
                )}

                {isEditing ? (
                  <div className="space-y-3">
                    <Textarea
                      {...register('refinedContent')}
                      className={cn(
                        'min-h-[500px] bg-white border-2 focus-visible:ring-2 focus-visible:ring-primary/10 p-6 text-lg leading-relaxed text-slate-700 resize-none shadow-sm rounded-2xl transition-all',
                        errors.refinedContent
                          ? 'border-rose-300 focus-visible:ring-rose-500/10'
                          : 'border-slate-100 focus-visible:border-primary/30',
                      )}
                      placeholder="내용을 입력하세요."
                    />
                    {errors.refinedContent && (
                      <p className="text-xs text-rose-500 font-bold pl-2">
                        {errors.refinedContent.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-10 rounded-3xl bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-300">
                    <div className="text-slate-800 leading-relaxed whitespace-pre-wrap text-lg font-medium">
                      {note.refinedNote || note.rawContent}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* 일반 모드일 때의 섹션들 */}
            {!isEditing && (
              <div className="space-y-16">
                {/* 핵심 요약 */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Target className="size-5 text-slate-400" />
                    <h3 className="text-lg font-bold text-slate-900">핵심 요약</h3>
                  </div>
                  <p className="text-xl text-slate-800 leading-relaxed font-semibold">{summary}</p>
                </section>

                {/* 학습 키워드 */}
                {keywords.length > 0 && (
                  <section className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Search className="size-5 text-slate-400" />
                      <h3 className="text-lg font-bold text-slate-900">학습 키워드</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {keywords.map((keyword: string, i: number) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="px-3 py-1 bg-white text-slate-600 border-slate-200 font-medium rounded-full"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </section>
                )}

                {/* 팩트 체크 */}
                {factChecks.length > 0 && (
                  <section className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-5 text-slate-400" />
                      <h3 className="text-lg font-bold text-slate-900">팩트 체크</h3>
                    </div>
                    <div className="space-y-6">
                      {factChecks.map(
                        (fact: NoteAnalysisResponseDtoFactChecksItem, index: number) => (
                          <div
                            key={index}
                            className="group relative pl-6 border-l-2 border-slate-100 hover:border-slate-300 transition-colors"
                          >
                            <div className="space-y-3">
                              <div className="flex items-start gap-2">
                                <span
                                  className={cn(
                                    'text-xs font-bold px-2 py-0.5 rounded border uppercase tracking-tight whitespace-nowrap shrink-0',
                                    fact.verdict === 'CORRECT'
                                      ? 'text-emerald-600 border-emerald-200 bg-emerald-50/50'
                                      : 'text-rose-500 border-rose-200 bg-rose-50/50',
                                  )}
                                >
                                  {fact.verdict === 'CORRECT' && 'TRUE'}
                                  {fact.verdict === 'PARTIALLY_TRUE' && 'PARTIALLY TRUE'}
                                  {fact.verdict === 'FALSE' && 'FALSE'}
                                  {fact.verdict === 'MISLEADING' && 'MISLEADING'}
                                  {!['CORRECT', 'PARTIALLY_TRUE', 'FALSE', 'MISLEADING'].includes(
                                    fact.verdict || '',
                                  ) && fact.verdict}
                                </span>
                                <span className="font-bold text-slate-800">{fact.comment}</span>
                              </div>
                              {fact.fact && (
                                <p className="text-slate-700 leading-relaxed">{fact.fact}</p>
                              )}
                              {fact.originalText && (
                                <p className="text-sm text-slate-400 italic line-through decoration-slate-300/50">
                                  {fact.originalText}
                                </p>
                              )}
                              {fact.correction && (
                                <div className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-dotted border-slate-200">
                                  <p className="text-base leading-relaxed">{fact.correction}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </section>
                )}

                {/* 다음 학습 추천 (할 일 생성 기능 포함) */}
                {suggestedTodos.length > 0 && (
                  <section className="space-y-6" id="suggestedTodos">
                    <div className="flex items-center gap-2">
                      <Rocket className="size-5 text-slate-400" />
                      <h3 className="text-lg font-bold text-slate-900">다음 학습 추천</h3>
                      {isSelectionMode && (
                        <div className="flex gap-2 ml-auto">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={handleCreateTodos}
                            className="h-8 shadow-sm"
                          >
                            {selectedIndices.size}개 추가
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setIsSelectionMode(false);
                              setSelectedIndices(new Set());
                            }}
                            className="h-8 cursor-pointer"
                          >
                            취소
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      {suggestedTodos.map((todoItem: any, i: number) => {
                        const todo =
                          typeof todoItem === 'string' ? { content: todoItem } : todoItem;
                        const isCreated = todo.isCreated || false;

                        return (
                          <div
                            key={i}
                            onClick={() => !isCreated && isSelectionMode && toggleSelect(i)}
                            className={cn(
                              'flex items-start gap-4 p-6 rounded-2xl transition-all duration-300 group border relative overflow-hidden',
                              isCreated
                                ? 'bg-slate-50 border-slate-100 opacity-80'
                                : isSelectionMode
                                  ? selectedIndices.has(i)
                                    ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary/20'
                                    : 'bg-white border-slate-100 hover:border-slate-200 cursor-pointer'
                                  : 'bg-white border-slate-100 shadow-sm hover:shadow-md',
                            )}
                          >
                            {isCreated && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-full z-10 flex items-center gap-1 shadow-sm cursor-help">
                                      <CheckCircle2 className="size-3.5" />
                                      추가됨
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>이미 할 일 목록에 추가된 항목입니다.</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}

                            {isSelectionMode ? (
                              <div
                                className="pt-1 cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Checkbox
                                  checked={selectedIndices.has(i)}
                                  onCheckedChange={() => toggleSelect(i)}
                                  disabled={isCreated}
                                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                              </div>
                            ) : (
                              <div
                                className={cn(
                                  'shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs mt-0.5 transition-colors',
                                  isCreated
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-slate-900 text-white',
                                )}
                              >
                                {isCreated ? <CheckCircle2 className="size-3.5" /> : i + 1}
                              </div>
                            )}
                            <div className={cn('flex flex-col gap-1.5', isCreated && 'pr-16')}>
                              <h4
                                className={cn(
                                  'text-base font-bold transition-colors',
                                  isCreated
                                    ? 'text-slate-500 line-through'
                                    : 'text-slate-800 group-hover:text-primary',
                                )}
                              >
                                {todo.content}
                              </h4>
                              {todo.reason && (
                                <p className="text-sm text-slate-500 font-normal leading-relaxed">
                                  {todo.reason}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>

          {/* 편집 모드일 때 나타나는 우측 참조 사이드바 */}
          {isEditing && (
            <div className="lg:col-span-1 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="sticky top-8 space-y-8">
                {/* 팩트 체크 참조 패널 */}
                {factChecks.length > 0 && (
                  <section className="bg-slate-50/50 rounded-3xl border border-slate-100 p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-slate-400" />
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                        팩트 체크 참조
                      </h3>
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                      {factChecks.map(
                        (fact: NoteAnalysisResponseDtoFactChecksItem, index: number) => (
                          <div
                            key={index}
                            className="text-xs space-y-2 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  'px-1.5 py-0.5 rounded-[4px] font-bold text-[9px]',
                                  fact.verdict === 'CORRECT'
                                    ? 'bg-emerald-100 text-emerald-600'
                                    : 'bg-rose-100 text-rose-600',
                                )}
                              >
                                {fact.verdict}
                              </span>
                              <span className="font-bold text-slate-700 leading-snug">
                                {fact.comment}
                              </span>
                            </div>
                            {fact.correction && (
                              <p className="text-slate-500 leading-relaxed bg-white/50 p-2 rounded-lg border border-slate-100">
                                {fact.correction}
                              </p>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  </section>
                )}

                {/* 원본 기록 대조 패널 */}
                <section className="bg-slate-50/50 rounded-3xl border border-slate-100 p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-slate-400" />
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                      원본 기록
                    </h3>
                  </div>
                  <div className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto custom-scrollbar italic bg-white/50 p-4 rounded-xl border border-dashed border-slate-200">
                    {note.rawContent}
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
        <div className="pt-20 text-center pb-20">
          <Button
            variant="ghost"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-slate-400 text-sm hover:text-slate-900 transition-colors uppercase tracking-widest font-bold cursor-pointer"
          >
            맨 위로 돌아가기
          </Button>
        </div>
      </main>
    </div>
  );
}
