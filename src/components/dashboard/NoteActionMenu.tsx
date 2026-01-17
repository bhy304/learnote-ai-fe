import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NoteDeleteDialog } from '@/components/dashboard/NoteDeleteDialog';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { useNoteActions } from '@/hooks/useNoteActions';
import type { NoteListItemDto } from '@/models/generated';

interface NoteActionMenuProps {
  note: NoteListItemDto;
}

export const NoteActionMenu = ({ note }: NoteActionMenuProps) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { deleteNote } = useNoteActions({});

  const handleDelete = async () => {
    await deleteNote(String(note.id));
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => setIsDeleteOpen(true)}
            className="text-rose-500 focus:text-rose-500 cursor-pointer focus:bg-rose-50"
          >
            <Trash2 className="mr-2 h-4 w-4 text-rose-500" />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <NoteDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDelete}
        isDeleting={false}
      />
    </>
  );
};
