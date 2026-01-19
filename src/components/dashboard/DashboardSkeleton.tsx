import { Skeleton } from '@/components/ui/skeleton';

export function StatsSkeleton() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="h-[140px] rounded-2xl border border-slate-200 p-6 bg-white shadow-sm space-y-4"
        >
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
          <div className="flex items-baseline space-x-1">
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-6 w-8" />
          </div>
        </div>
      ))}
    </section>
  );
}

export function TableSkeleton() {
  return (
    <section className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="border-b border-slate-100 p-4 bg-slate-50/30">
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex gap-4 items-center py-3 border-b border-slate-50 last:border-0"
            >
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 flex-1" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function KanbanSkeleton() {
  return (
    <div className="flex gap-6 h-full min-h-[500px] pb-8">
      {/* Pending Column Skeleton */}
      <div className="flex flex-col flex-1 min-w-[300px] rounded-2xl border border-blue-100/50 bg-blue-50/30 p-4 space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-blue-500" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-6 rounded-md" />
          </div>
        </div>
        <div className="space-y-3 p-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex gap-3 items-center"
            >
              <Skeleton className="size-4 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Column Skeleton */}
      <div className="flex flex-col flex-1 min-w-[300px] rounded-2xl border border-emerald-100/50 bg-emerald-50/30 p-4 space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-emerald-500" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-6 rounded-md" />
          </div>
        </div>
        <div className="space-y-3 p-2">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex gap-3 items-center">
            <Skeleton className="size-4 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
