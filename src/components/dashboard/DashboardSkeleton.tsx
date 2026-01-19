import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function StatsSkeleton() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((index) => (
        <Card key={index} className="border-slate-200 shadow-sm transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-1">
              <Skeleton className="h-10 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

export function HeatmapSkeleton() {
  return (
    <section className="w-full p-4 bg-white rounded-xl border animate-in fade-in duration-500">
      <div className="w-full overflow-x-auto overflow-y-hidden no-scrollbar pb-6 sm:pb-12">
        <div className="min-w-[850px] h-[165px]">
          <Skeleton className="w-full h-full rounded-md" />
        </div>
      </div>
      <div className="flex justify-end items-center gap-2 md:gap-3 text-[10px] sm:text-xs text-muted-foreground">
        <span className="font-medium">Less</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="w-4 h-4 rounded-[2px]" />
          ))}
        </div>
        <span className="font-medium">More</span>
      </div>
    </section>
  );
}

export function TableSkeleton() {
  return (
    <div className="w-full">
      <div className="bg-white rounded-lg border overflow-hidden shadow-sm">
        {/* Header Skeleton */}
        <div className="border-b bg-muted/50 h-10 flex items-center">
          <div className="flex w-full">
            <div className="w-[120px] flex justify-center">
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex-1 px-2">
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="w-[80px]" />
          </div>
        </div>
        {/* Rows Skeleton */}
        <div className="divide-y">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center h-[49px]">
              <div className="w-[120px] flex justify-center">
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex-1 px-2">
                <Skeleton className="h-4 w-3/4 max-w-[400px]" />
              </div>
              <div className="w-[80px] flex justify-end pr-3">
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-center py-3 px-2 gap-8">
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="size-9 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function KanbanSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-6 h-full min-h-[500px]">
      {/* Pending Column Skeleton */}
      <div className="flex flex-col flex-1 w-full md:min-w-[300px] min-h-[400px] rounded-2xl border bg-blue-50/30 border-blue-100/50 p-4">
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-blue-500" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-6 rounded-md" />
          </div>
        </div>
        <div className="flex flex-col gap-3 p-2">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="py-2">
              <CardContent className="p-2 flex gap-3 items-center">
                <div className="w-4 shrink-0" /> {/* Grip icon space */}
                <Skeleton className="size-4 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Completed Column Skeleton */}
      <div className="flex flex-col flex-1 w-full md:min-w-[300px] min-h-[400px] rounded-2xl border bg-emerald-50/30 border-emerald-100/50 p-4">
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-emerald-500" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-6 rounded-md" />
          </div>
        </div>
        <div className="flex flex-col gap-3 p-2">
          {[1, 2].map((i) => (
            <Card key={i} className="py-2">
              <CardContent className="p-2 flex gap-3 items-center">
                <div className="w-4 shrink-0" /> {/* Grip icon space */}
                <Skeleton className="size-4 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardMainLoading() {
  return (
    <div className="space-y-8 animate-pulse pt-4">
      <div className="space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-80" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-2xl border border-slate-100 bg-slate-50/50" />
        ))}
      </div>
      <div className="h-40 rounded-2xl border border-slate-100 bg-slate-50/50" />
    </div>
  );
}
