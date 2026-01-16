import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { KanbanSkeleton } from './DashboardSkeleton';
import { useDashboardTodos } from '@/hooks/useDashboardTodos';

export default function TodoView() {
  const { data: todos, isLoading } = useDashboardTodos();

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">TODO</h2>
      </div>
      {isLoading ? <KanbanSkeleton /> : <KanbanBoard initialTodos={todos || []} />}
    </section>
  );
}
