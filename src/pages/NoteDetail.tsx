import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNote } from '@/hooks/useNote';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  X,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Search,
  Rocket,
  Pencil,
  ArrowLeft,
  ListPlus,
  Save,
  Trash2,
  Target,
  FileText,
} from 'lucide-react';
import AnalysisLoadingView from '@/components/AnalysisLoadingView';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { FieldError } from '@/components/ui/field';
import notesAPI from '@/api/notes.api';
import { useQueryClient } from '@tanstack/react-query';
import type {
  NoteAnalysisResponseDtoSuggestedTodosItem,
  NoteAnalysisResponseDtoFactChecksItem,
} from '@/models/generated';
import { NoteDeleteDialog } from '@/components/dashboard/NoteDeleteDialog';
import { useNoteActions } from '@/hooks/useNoteActions';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { InputGroupTextarea } from '@/components/ui/input-group';
import { updateNoteSchema, type UpdateNoteSchema } from '@/schema/note.schema';

interface NoteSummary {
  oneLineSummary?: string;
  keywords?: string[];
}

export default function NoteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: note, isLoading } = useNote(id || null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [showRawContent, setShowRawContent] = useState(true);

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

  const { control, handleSubmit, reset } = useForm<UpdateNoteSchema>({
    resolver: zodResolver(updateNoteSchema),
    mode: 'onChange',
    defaultValues: {
      title: note?.title || '',
      refinedContent: note?.refinedNote || note?.rawContent || '',
    },
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
          {/* <div className="flex items-center gap-2 text-slate-400 text-sm">
            <FileText className="size-3.5" />
            <span>분석 노트</span>
          </div> */}
          {isEditing ? (
            <div className="space-y-1">
              <Controller
                name="title"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <input
                      {...field}
                      id="form-title"
                      autoFocus
                      className="w-full text-3xl md:text-4xl font-bold tracking-tight text-slate-900 border-b-2 border-slate-100 focus:border-primary outline-none bg-transparent py-1 transition-all"
                      placeholder="제목을 입력하세요"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && fieldState.error && (
                      <FieldError className="pl-1">{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </div>
          ) : (
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-[1.2]">
              {note.title || '제목 없는 노트'}
            </h1>
          )}
        </div>

        <div className="grid gap-12 grid-cols-1">
          <div className="space-y-20">
            {!isAnalyzing && (
              <div className="space-y-16">
                {/* 1. 핵심 요약 */}
                <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                      <Target className="size-4 text-slate-800" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">핵심 요약</h3>
                  </div>
                  <p className="text-xl text-slate-800 leading-relaxed font-semibold">{summary}</p>
                </section>
                {/* 2. 학습 키워드 */}
                {keywords.length > 0 && (
                  <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                        <Search className="size-4 text-slate-800" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">학습 키워드</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {keywords.map((keyword: string, i: number) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="px-4 py-1.5 bg-slate-50/50 text-slate-600 border-slate-200 font-bold rounded-full shadow-none text-sm"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </section>
                )}
                {/* 3. 팩트 체크 */}
                {factChecks.length > 0 && (
                  <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                        <CheckCircle2 className="size-4 text-slate-800" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">팩트 체크</h3>
                    </div>
                    <div className="space-y-6">
                      {factChecks.map(
                        (fact: NoteAnalysisResponseDtoFactChecksItem, index: number) => (
                          <div
                            key={index}
                            className="group relative pl-6 border-l-2 border-slate-100 hover:border-slate-300 transition-colors"
                          >
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 ">
                                <span
                                  className={cn(
                                    'text-xs font-bold px-2 py-0.5 rounded border uppercase tracking-tighter whitespace-nowrap shrink-0',
                                    fact.verdict === 'CORRECT'
                                      ? 'text-emerald-600 border-emerald-200 bg-emerald-50/50'
                                      : 'text-rose-500 border-rose-200 bg-rose-50/50',
                                  )}
                                >
                                  {fact.verdict}
                                </span>
                                <span className="font-bold text-slate-800 text-base">
                                  {fact.comment}
                                </span>
                              </div>
                              {fact.fact && (
                                <p className="text-slate-700 leading-relaxed text-base">
                                  {fact.fact}
                                </p>
                              )}
                              {fact.correction && (
                                <div className="text-slate-700 bg-slate-50/50 p-6 rounded-xl border border-slate-100/80">
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
                {/* 4. 다음 학습 추천 (할 일) */}
                {suggestedTodos.length > 0 && (
                  <section
                    className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
                    id="suggestedTodos"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                        <Rocket className="size-4 text-slate-800" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">다음 학습 추천</h3>
                      {isSelectionMode && (
                        <div className="flex gap-2 ml-auto">
                          <Button
                            variant="default"
                            onClick={handleCreateTodos}
                            className="h-8 shadow-sm"
                          >
                            {selectedIndices.size}개 추가
                          </Button>
                          <Button
                            variant="ghost"
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
                              'flex items-start gap-4 p-6 rounded-xl transition-all duration-300 group border relative overflow-hidden',
                              isCreated
                                ? 'bg-slate-50 border-slate-100 opacity-80'
                                : isSelectionMode
                                  ? selectedIndices.has(i)
                                    ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary/20 cursor-pointer'
                                    : 'bg-white border-slate-100 hover:border-slate-200 cursor-pointer'
                                  : 'bg-white border-slate-100 shadow-sm hover:shadow-md ',
                            )}
                          >
                            {isCreated && (
                              <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-600 text-sm font-bold px-3 py-1 rounded-full z-10 flex items-center gap-1 shadow-sm">
                                <CheckCircle2 className="size-3" />
                                추가됨
                              </div>
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
                                <p className="text-base text-slate-500 font-normal leading-relaxed">
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
                {/* 5. 원본 노트 (참조용 격리) */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                        <FileText className="size-4 text-slate-800" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">원본 내용</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowRawContent(!showRawContent)}
                      className="text-slate-400 hover:text-slate-500 font-bold text-base p-1 px-2 h-auto hover:bg-slate-50 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {showRawContent ? (
                        <>
                          <ChevronUp className="size-3.5" />
                          접기
                        </>
                      ) : (
                        <>
                          <ChevronDown className="size-3.5" />
                          펼쳐보기
                        </>
                      )}
                    </Button>
                  </div>
                  {showRawContent && (
                    <div className="p-8 rounded-xl bg-slate-50/50 border border-slate-100 text-slate-600 leading-relaxed whitespace-pre-wrap italic animate-in fade-in slide-in-from-top-2 duration-300 text-base">
                      {note.rawContent}
                    </div>
                  )}
                </div>
                {/* 6. 나의 학습 노트 (학습의 최종 결과물) */}
                <section className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                      <Pencil className="size-4 text-slate-800" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">나의 학습 노트</h3>
                    <Badge
                      variant="secondary"
                      className="bg-emerald-50 text-emerald-600 text-xs font-bold border-emerald-100 py-0.5 h-auto px-3"
                    >
                      AI 분석 완료
                    </Badge>
                  </div>
                  <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-3xl flex gap-4 animate-in fade-in duration-500">
                    <Lightbulb className="size-5 text-slate-400 shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <p className="text-base font-bold text-slate-600">Expert Guide</p>
                      <p className="text-base text-slate-500 leading-relaxed font-medium">
                        수정 버튼을 눌러 AI가 정리해준 내용을 나만의 언어로 다시 기록할 수 있어요.
                        <br />
                        마크다운(Markdown) 문법을 활용하면 더욱 구조적이고 보기 좋게 정리할 수
                        있어요.
                      </p>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <Controller
                        name="refinedContent"
                        control={control}
                        render={({ field, fieldState }) => (
                          <>
                            <InputGroupTextarea
                              {...field}
                              id="form-refined-content"
                              className="min-h-[500px] bg-white border-2 p-8 text-lg leading-relaxed text-slate-700 resize-none shadow-sm rounded-xl transition-all border-slate-200 focus:border-slate-400 focus-visible:ring-0 placeholder:text-lg"
                              placeholder="나만의 언어로 노트를 정리해 보세요."
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && fieldState.error && (
                              <FieldError className="pl-2">{fieldState.error.message}</FieldError>
                            )}
                          </>
                        )}
                      />
                    </div>
                  ) : (
                    <div className="p-10 rounded-xl bg-white border-2 shadow-sm transition-all duration-500 hover:shadow-md  border-slate-400">
                      <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-slate-800 prose-strong:text-slate-900 prose-strong:font-bold prose-code:text-slate-900 prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-pre:bg-slate-900 prose-pre:text-slate-50 prose-img:rounded-l-none prose-img:rounded-r-xl ">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {note.refinedNote || note.rawContent || ''}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </section>
              </div>
            )}
          </div>
          {/* 편집 모드일 때 나타나는 우측 참조 사이드바 (팩트체크용) */}
          {/* {isEditing && (
            <div className="lg:col-span-1 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="sticky top-8 space-y-6">
                {factChecks.length > 0 && (
                  <section className="bg-slate-50/50 rounded-3xl border border-slate-100 p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-slate-400" />
                      <h3 className="text-base font-bold text-slate-400 uppercase tracking-tight">
                        실시간 참조 가이드
                      </h3>
                    </div>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                      {factChecks.map(
                        (fact: NoteAnalysisResponseDtoFactChecksItem, index: number) => (
                          <div
                            key={index}
                            className="text-base space-y-2 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                          >
                            <div className="flex items-center gap-1.5">
                              <span
                                className={cn(
                                  'px-2 py-0.5 rounded-[4px] font-bold text-sm uppercase',
                                  fact.verdict === 'CORRECT'
                                    ? 'bg-emerald-100 text-emerald-600'
                                    : 'bg-rose-100 text-rose-600',
                                )}
                              >
                                {fact.verdict}
                              </span>
                              <span className="font-bold text-slate-700">{fact.comment}</span>
                            </div>
                            {fact.correction && (
                              <p className="text-slate-500 leading-relaxed bg-white/80 p-2.5 rounded-xl border border-slate-100">
                                {fact.correction}
                              </p>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  </section>
                )}
              </div>
            </div>
          )} */}
        </div>

        {/* <div className="pt-20 text-center pb-20">
          <Button
            variant="ghost"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-slate-400 text-sm hover:text-slate-900 transition-colors uppercase tracking-widest font-bold cursor-pointer"
          >
            맨 위로 돌아가기
          </Button>
        </div> */}
      </main>
    </div>
  );
}
