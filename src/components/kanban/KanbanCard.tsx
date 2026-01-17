import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TodoResponseDto } from '@/models/generated';
import type { TodoResponseDtoStatus } from '@/models/generated/todoResponseDtoStatus';

interface KanbanCardProps {
  todo: TodoResponseDto;
  onToggleStatus: (id: string, currentStatus: TodoResponseDtoStatus) => void;
}

export function KanbanCard({ todo, onToggleStatus }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: todo.id.toString(),
    data: {
      type: 'Todo',
      todo,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  if (isDragging) {
    return (
      <Card
        ref={setNodeRef}
        style={style}
        className="opacity-30 border-2 border-primary min-h-[80px]"
      />
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="group relative hover:shadow-md transition-shadow cursor-default py-2"
    >
      <CardContent className="p-2 flex gap-3 items-center">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical size={16} />
        </button>

        <Checkbox
          id={`todo-${todo.id}`}
          checked={todo.status === 'COMPLETED'}
          onCheckedChange={() => onToggleStatus(todo.id.toString(), todo.status)}
        />

        <div className="flex-1 space-y-1">
          <label
            htmlFor={`todo-${todo.id}`}
            className={cn(
              'text-sm font-medium leading-none block',
              todo.status === 'COMPLETED' && 'text-muted-foreground line-through',
            )}
          >
            {todo.content}
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
