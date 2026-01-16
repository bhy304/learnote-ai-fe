import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  ChevronDown,
  ChevronUp,
  ListPlus,
} from 'lucide-react';
import AnalysisLoadingView from '@/components/AnalysisLoadingView';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import notesAPI from '@/api/notes.api';

interface NoteSummary {
  oneLineSummary?: string;
  keywords?: string[];
}

interface FactCheckItem {
  verdict: string;
  comment: string;
  originalText?: string;
  correction?: string;
}

interface TodoItem {
  content: string;
  reason?: string;
}

export default function NoteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: note, isLoading } = useNote(id || null);
  const [isRawExpanded, setIsRawExpanded] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

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
      const todo = suggestedTodos[index];
      const isObject = typeof todo === 'object' && todo !== null;

      return {
        content: isObject ? (todo as TodoItem).content : (todo as string),
        reason: isObject ? (todo as TodoItem).reason || 'AI 추천 학습 항목' : 'AI 추천 학습 항목',
        dueDate: new Date().toISOString().split('T')[0],
        deadlineType: 'SHORT_TERM' as const,
      };
    });

    try {
      await notesAPI.saveLearningTodos(id!, { todos: selectedTodos });
      toast.success(`${selectedIndices.size}개의 할 일이 생성되었습니다.`);

      setIsSelectionMode(false);
      setSelectedIndices(new Set());
    } catch (error) {
      console.error(error);
      toast.error('할 일 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
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

  return (
    <div className="relative min-h-screen bg-white">
      {/* AI 분석 중일 때 표시되는 고급스러운 오버레이 */}
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
            {!isSelectionMode && (
              // 1. 평상시: 모드 진입 버튼
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 cursor-pointer"
                onClick={() => {
                  setIsSelectionMode(true);
                  document.getElementById('suggestedTodos')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <ListPlus className="size-3.5 mr-2" />할 일 등록
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-4 text-slate-600 hover:bg-slate-50 border-slate-200 cursor-pointer"
            >
              <Pencil className="size-3.5 mr-2" />
              수정
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-4 text-rose-500 hover:bg-rose-50 border-slate-200 hover:border-rose-100 cursor-pointer"
            >
              <Trash2 className="size-3.5 mr-2" />
              삭제
            </Button>
          </div>
        </div>

        {/* 헤더: 제목 */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-[1.2]">
            {note.title || '제목 없는 노트'}
          </h1>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <FileText className="size-3.5" />
            <span>분석 노트</span>
          </div>
        </div>

        {/* 1. 작성한 원본 내용 (접기/펼치기) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              나의 학습 기록
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsRawExpanded(!isRawExpanded)}
              className="h-8 px-2 text-slate-400 hover:text-slate-900 transition-colors text-xs font-semibold gap-1 cursor-pointer"
            >
              {isRawExpanded ? (
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

          {isRawExpanded && (
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100/80 text-slate-600 leading-relaxed whitespace-pre-wrap text-base font-normal max-h-[400px] overflow-y-auto animate-in slide-in-from-top-2 duration-300 custom-scrollbar">
              {note.rawContent}
            </div>
          )}
        </section>

        <div className="h-px bg-slate-100 w-full" />

        {/* AI 분석 섹션들 */}
        <div className="space-y-16">
          {/* 2. 한 줄 요약 */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="size-5 text-slate-400" />
              <h3 className="text-lg font-bold text-slate-900">핵심 요약</h3>
            </div>
            <p className="text-xl text-slate-800 leading-relaxed font-semibold">{summary}</p>
          </section>

          {/* 3. 학습 키워드 */}
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

          {/* 4. 팩트체크 */}
          {factChecks.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-slate-400" />
                <h3 className="text-lg font-bold text-slate-900">팩트 체크</h3>
              </div>
              <div className="space-y-6">
                {factChecks.map((fact: string | FactCheckItem, i: number) => (
                  <div
                    key={i}
                    className="group relative pl-6 border-l-2 border-slate-100 hover:border-slate-300 transition-colors"
                  >
                    {typeof fact === 'string' ? (
                      <p className="text-slate-700 leading-relaxed">{fact}</p>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-tight',
                              fact.verdict === 'CORRECT'
                                ? 'text-emerald-600 border-emerald-200 bg-emerald-50/50'
                                : 'text-rose-500 border-rose-200 bg-rose-50/50',
                            )}
                          >
                            {fact.verdict}
                          </span>
                          <span className="font-bold text-slate-800">{fact.comment}</span>
                        </div>
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
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 5. 다음 학습 추천 */}
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
                      {selectedIndices.size}개 등록
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsSelectionMode(false);
                        setSelectedIndices(new Set());
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="h-8 cursor-pointer"
                    >
                      취소
                    </Button>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                {suggestedTodos.map((todo: string | TodoItem, i: number) => (
                  <div
                    key={i}
                    onClick={() => isSelectionMode && toggleSelect(i)}
                    className={cn(
                      'flex items-start gap-4 p-6 rounded-2xl transition-all duration-300 group border',
                      isSelectionMode
                        ? selectedIndices.has(i)
                          ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary/20'
                          : 'bg-white border-slate-100 hover:border-slate-200 cursor-pointer'
                        : 'bg-white border-slate-100 shadow-sm hover:shadow-md',
                    )}
                  >
                    {isSelectionMode ? (
                      <div className="pt-1 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedIndices.has(i)}
                          onCheckedChange={() => toggleSelect(i)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </div>
                    ) : (
                      <div className="shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs mt-0.5">
                        {i + 1}
                      </div>
                    )}
                    <div className="flex flex-col gap-1.5">
                      <h4 className="text-base font-bold text-slate-800 group-hover:text-primary transition-colors">
                        {typeof todo === 'string' ? todo : todo.content}
                      </h4>
                      {typeof todo === 'object' && todo.reason && (
                        <p className="text-sm text-slate-500 leading-relaxed font-normal">
                          {todo.reason}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="pt-20 text-center pb-20">
          <Button
            variant="ghost"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-slate-400 text-xs hover:text-slate-900 transition-colors uppercase tracking-widest font-bold cursor-pointer"
          >
            맨 위로 돌아가기
          </Button>
        </div>
      </main>
    </div>
  );
}

// SectionCard는 이제 더 이상 쓰이지 않으므로 제거하거나 그대로 두어도 되지만 코드 정리를 위해 제거를 고려할 수 있습니다.
