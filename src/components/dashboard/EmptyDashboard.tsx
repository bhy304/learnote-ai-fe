import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PenLine, Bot, LineChart, Sparkles } from 'lucide-react';

interface EmptyDashboardProps {
  userName: string;
}

function BenefitItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border bg-card transition-colors hover:bg-muted/50">
      <div className="shrink-0 w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-base font-medium text-foreground">{text}</span>
    </div>
  );
}

export default function EmptyDashboard({ userName }: EmptyDashboardProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          👋 환영합니다, <span className="text-primary">{userName}</span>님!
        </h1>
        <p className="text-slate-500 text-lg max-w-lg mx-auto leading-relaxed">
          Learnote AI와 함께 매일의 배움을 기록하고 <br />
          나만의 성장 지도를 만들어보세요.
        </p>
      </div>
      <Card className="w-full max-w-xl border bg-white shadow-sm overflow-hidden">
        <div className="p-8 md:p-10 space-y-10">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-center text-slate-800">
              학습 노트 작성을 시작해볼까요?
            </h2>
            <div className="grid gap-3">
              <BenefitItem
                icon={<PenLine className="w-5 h-5 text-primary" />}
                text="매일 배운 것을 자유롭게 기록하세요"
              />
              <BenefitItem
                icon={<Bot className="w-5 h-5 text-primary" />}
                text="AI가 핵심 내용을 요약하고 분석해드려요"
              />
              <BenefitItem
                icon={<LineChart className="w-5 h-5 text-primary" />}
                text="시각화된 통계로 나의 성장을 확인하세요"
              />
            </div>
          </div>
          <div className="flex flex-col gap-5 items-center">
            <Button
              size="lg"
              className="w-full h-14 text-lg font-bold transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
              onClick={() => navigate('/notes/new')}
            >
              <Sparkles className="mr-2 w-5 h-5" />첫 노트 작성하기
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
