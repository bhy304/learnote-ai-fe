import { Skeleton } from '@/components/ui/skeleton';

export function StatsSkeleton() {
  return (
    <section className="grid grid-cols-3 gap-6 mb-8">
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="h-[120px] rounded-2xl border border-slate-100 p-6 bg-white shadow-sm space-y-3"
        >
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </section>
  );
}

export function TableSkeleton() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-50 pb-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-24 rounded-xl" />
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-4 items-center py-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="h-5 w-8" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function KanbanSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[400px]">
      {[1, 2, 3].map((index) => (
        <div key={index} className="bg-slate-50/50 rounded-2xl p-4 space-y-4">
          <Skeleton className="h-6 w-20 mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
