import { Skeleton } from '@/components/ui/skeleton';

export function StatsSkeleton() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="h-[140px] rounded-2xl border border-slate-200 p-6 bg-white shadow-sm space-y-4"
        >
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-20 sm:h-5 sm:w-24" />
            <Skeleton className="h-4 w-4 sm:h-5 sm:w-5 rounded-full" />
          </div>
          <div className="flex items-baseline space-x-1">
            <Skeleton className="h-8 w-24 sm:h-10 sm:w-32" />
            <Skeleton className="h-4 w-10 sm:h-6 sm:w-12" />
          </div>
        </div>
      ))}
    </section>
  );
}

export function HeatmapSkeleton() {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 p-4 pb-6 sm:pb-12">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-40" />
      </div>
      <Skeleton className="h-[120px] w-full rounded-lg" />
    </div>
  );
}

export function TableSkeleton() {
  return (
    <section className="space-y-4">
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="border-b border-slate-200 p-2 bg-slate-50/50">
          <div className="flex gap-4">
            <Skeleton className="h-10 w-[120px]" />
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-[80px]" />
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4 items-center p-2">
              <Skeleton className="h-10 w-[120px]" />
              <Skeleton className="h-10 flex-1" />
              <div className="flex justify-end w-[80px]">
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function KanbanSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-6 h-full min-h-[500px] animate-in fade-in duration-500">
      {/* Pending Column Skeleton */}
      <div className="flex flex-col flex-1 w-full md:min-w-[300px] rounded-2xl border border-blue-100/50 bg-blue-50/30 p-4 space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-blue-500" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-6 rounded-md" />
          </div>
        </div>
        <div className="space-y-3 p-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-3 items-center"
            >
              <Skeleton className="size-5 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3.5 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Column Skeleton */}
      <div className="flex flex-col flex-1 w-full md:min-w-[300px] rounded-2xl border border-emerald-100/50 bg-emerald-50/30 p-4 space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-emerald-500" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-6 rounded-md" />
          </div>
        </div>
        <div className="space-y-3 p-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-3 items-center"
            >
              <Skeleton className="size-5 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-3.5 w-1/3 opacity-50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
