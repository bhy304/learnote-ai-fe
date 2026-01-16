import { type ColumnDef } from '@tanstack/react-table';
import { type NoteListItemDto } from '@/models/generated';
import { Link } from 'react-router-dom';

export const columns: ColumnDef<NoteListItemDto>[] = [
  // { accessorKey: 'id', header: 'ID' },
  {
    accessorKey: 'createdAt',
    header: () => <div className="w-[120px] text-center">작성일</div>,
    cell: ({ row }) => <div className="w-[120px] text-center">{row.getValue('createdAt')}</div>,
    // header: ({ column }) => {
    //   return (
    //     <Button
    //       variant="ghost"
    //       onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    //     >
    //       생성일
    //       <ArrowUpDown className="ml-2 h-4 w-4" />
    //     </Button>
    //   );
    // },
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
];
