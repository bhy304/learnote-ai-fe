import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { Spinner } from './ui/spinner';

export default function AnalysisLoadingView() {
  const [step, setStep] = useState(0);
  const steps = [
    { id: 0, label: '학습 내용 분석 중' },
    { id: 1, label: '핵심 개념 추출 중' },
    { id: 2, label: '인사이트 도출 중' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev < steps.length ? prev + 1 : prev));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-svh w-full max-w-sm mx-auto p-6 space-y-8">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse" />
        <Spinner className="text-primary w-12 h-12" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold tracking-tight">AI가 노트를 분석하고 있어요... 🤖</h3>
        <p className="text-sm text-muted-foreground animate-pulse">
          잠시만 기다려주세요 (약 5-10초)
        </p>
      </div>

      <div className="w-full space-y-4 bg-secondary/30 p-5 rounded-2xl border border-border">
        {steps.map((item, index) => {
          const isDone = index < step;
          const isCurrent = index === step;
          return (
            <div
              key={item.id}
              className={`flex items-center justify-between transition-all duration-300 ${
                isCurrent ? 'opacity-100' : isDone ? 'opacity-70' : 'opacity-30'
              }`}
            >
              <div className="flex items-center gap-3">
                {isDone ? (
                  <div className="bg-primary/20 p-1 rounded-full">
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </div>
                ) : isCurrent ? (
                  <Spinner className="text-primary" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-dashed border-muted-foreground/50" />
                )}
                <span
                  className={`text-sm font-medium ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                  {item.label}
                </span>
              </div>

              {isCurrent && (
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full animate-bounce">
                  Processing
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
