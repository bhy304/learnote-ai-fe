import { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dashboardAPI from '@/api/dashboard.api';
import type { TodoResponseDto } from '@/models/generated';
import { TodoResponseDtoStatus } from '@/models/generated/todoResponseDtoStatus';

interface KanbanBoardProps {
  initialTodos: TodoResponseDto[];
}

export function KanbanBoard({ initialTodos }: KanbanBoardProps) {
  const [todos, setTodos] = useState<TodoResponseDto[]>(initialTodos);
  const [activeTodo, setActiveTodo] = useState<TodoResponseDto | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    setTodos(initialTodos);
  }, [initialTodos]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TodoResponseDtoStatus }) =>
      dashboardAPI.updateDashboardTodo(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const pendingTodos = todos.filter((t) => t.status === 'PENDING');
  const completedTodos = todos.filter((t) => t.status === 'COMPLETED');

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const todo = todos.find((t) => t.id.toString() === active.id);
    if (todo) setActiveTodo(todo);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (activeId === overId) return;

    const activeTodo = todos.find((t) => t.id.toString() === activeId);
    if (!activeTodo) return;

    const isOverAColumn = overId === 'PENDING' || overId === 'COMPLETED';
    const overTodo = todos.find((t) => t.id.toString() === overId);

    let newStatus = activeTodo.status;

    if (isOverAColumn) {
      newStatus = overId as TodoResponseDtoStatus;
    } else if (overTodo) {
      newStatus = overTodo.status;
    }

    if (activeTodo.status !== newStatus) {
      setTodos((prev) =>
        prev.map((t) =>
          t.id.toString() === activeId ? { ...t, status: newStatus as TodoResponseDtoStatus } : t,
        ),
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeId = active.id.toString();

      const activeTodo = todos.find((t) => t.id.toString() === activeId);
      if (activeTodo) {
        // Trigger API update
        updateStatusMutation.mutate({
          id: activeId,
          status: activeTodo.status,
        });
      }
    }

    setActiveTodo(null);
  };

  const handleToggleStatus = (id: string, currentStatus: TodoResponseDtoStatus) => {
    const newStatus =
      currentStatus === TodoResponseDtoStatus.PENDING
        ? TodoResponseDtoStatus.COMPLETED
        : TodoResponseDtoStatus.PENDING;

    // Optimistic UI update
    setTodos((prev) =>
      prev.map((t) =>
        t.id.toString() === id ? { ...t, status: newStatus as TodoResponseDtoStatus } : t,
      ),
    );

    updateStatusMutation.mutate({ id, status: newStatus });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 h-full min-h-[400px]">
        <KanbanColumn
          id="PENDING"
          title="Pending"
          todos={pendingTodos}
          onToggleStatus={handleToggleStatus}
        />
        <KanbanColumn
          id="COMPLETED"
          title="Completed"
          todos={completedTodos}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      <DragOverlay
        dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: '0.5',
              },
            },
          }),
        }}
      >
        {activeTodo ? <KanbanCard todo={activeTodo} onToggleStatus={handleToggleStatus} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
