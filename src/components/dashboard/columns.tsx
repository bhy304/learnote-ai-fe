import { type ColumnDef } from '@tanstack/react-table';
import { type NoteListItemDto } from '@/models/generated';
import { Link } from 'react-router-dom';
import { NoteActionMenu } from './NoteActionMenu';

export const columns: ColumnDef<NoteListItemDto>[] = [
  {
    accessorKey: 'createdAt',
    header: () => <div className="text-center">작성일</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue('createdAt')}</div>,
    meta: {
      className: 'w-[200px]',
    } as any,
  },
  {
    accessorKey: 'title',
    header: '제목',
    cell: ({ row }) => {
      const noteId = row.original.id;

      return (
        <div className="w-full text-left">
          <Link to={`/notes/${noteId}`} className="font-medium hover:underline cursor-pointer">
            {row.getValue('title')}
          </Link>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <div className="flex justify-end p-0">
        <NoteActionMenu note={row.original} />
      </div>
    ),
    meta: {
      className: 'w-[200px]',
    } as any,
  },
];
