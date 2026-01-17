import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { KanbanSkeleton } from './DashboardSkeleton';
import { useDashboardTodos } from '@/hooks/useDashboardTodos';

export default function TodoView() {
  const { data: todos, isLoading } = useDashboardTodos();

  return (
    <section className="h-full flex flex-col gap-6">
      {isLoading ? <KanbanSkeleton /> : <KanbanBoard initialTodos={todos || []} />}
    </section>
  );
}
