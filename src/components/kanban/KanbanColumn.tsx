import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanCard } from './KanbanCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { TodoResponseDto } from '@/models/generated';
import type { TodoResponseDtoStatus } from '@/models/generated/todoResponseDtoStatus';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  id: string;
  title: string;
  todos: TodoResponseDto[];
  onToggleStatus: (id: string, currentStatus: TodoResponseDtoStatus) => void;
}

export function KanbanColumn({ id, title, todos, onToggleStatus }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  const getStatusStyles = () => {
    switch (id) {
      case 'PENDING':
        return {
          dot: 'bg-blue-500',
          badge: 'bg-blue-50 text-blue-900',
          countBadge: 'bg-blue-100/30 text-blue-600 border-blue-200/50',
          container: 'bg-blue-50/30 border-blue-100/50',
        };
      case 'COMPLETED':
        return {
          dot: 'bg-emerald-500',
          badge: 'bg-emerald-100/80 text-emerald-900',
          countBadge: 'bg-emerald-100/50 text-emerald-600 border-emerald-200/50',
          container: 'bg-emerald-50/30 border-emerald-100/50',
        };
      default:
        return {
          dot: 'bg-slate-400',
          badge: 'bg-slate-100 text-slate-700',
          countBadge: 'bg-slate-200/50 text-slate-500 border-slate-300/50',
          container: 'bg-slate-50/50 border-slate-100',
        };
    }
  };
  const styles = getStatusStyles();

  return (
    <div
      className={cn(
        'flex flex-col flex-1 min-w-[300px] rounded-2xl border p-4 transition-colors',
        styles.container,
      )}
    >
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-2">
          <div className={cn('size-1.5 rounded-full', styles.dot)} />
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">{title}</h3>
          <span
            className={cn(
              'ml-1 px-2 py-0.5 rounded-md text-[11px] font-bold border transition-all',
              styles.countBadge,
            )}
          >
            {todos.length}
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div ref={setNodeRef} className="flex flex-col gap-3 min-h-[150px] p-2">
          <SortableContext
            items={todos.map((t) => t.id.toString())}
            strategy={verticalListSortingStrategy}
          >
            {todos.map((todo) => (
              <KanbanCard key={todo.id} todo={todo} onToggleStatus={onToggleStatus} />
            ))}
          </SortableContext>
        </div>
      </ScrollArea>
    </div>
  );
}
