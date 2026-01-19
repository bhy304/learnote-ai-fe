import React from 'react';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type SortingState,
  getSortedRowModel,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationFirst,
  PaginationLast,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  pageIndex: number;
  onPageChange: (page: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pageIndex,
  onPageChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination: {
        pageIndex,
        pageSize: 5,
      },
    },
  });

  return (
    <div>
      <div className="overflow-hidden rounded-lg border">
        <Table className="w-full">
          <TableHeader className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50 ">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        'text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0',
                        (header.column.columnDef.meta as any)?.className,
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className="">
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 ml-2',
                          (cell.column.columnDef.meta as any)?.className,
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pageCount > 1 && (
        <div className="flex items-center justify-center py-6 px-2 gap-8">
          {/* 페이지 정보 */}
          <div className="text-sm font-medium text-slate-500 whitespace-nowrap">
            Page <span className="text-slate-900">{pageIndex + 1}</span> of{' '}
            <span className="text-slate-900">{pageCount}</span>
          </div>

          {/* 네비게이션 버튼 그룹 */}
          <Pagination className="w-auto mx-0">
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationFirst
                  className={pageIndex === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  onClick={() => onPageChange(1)}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationPrevious
                  className={pageIndex === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  onClick={() => onPageChange(pageIndex)}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  className={
                    pageIndex + 1 >= pageCount ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                  }
                  onClick={() => onPageChange(pageIndex + 2)}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLast
                  className={
                    pageIndex + 1 >= pageCount ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                  }
                  onClick={() => onPageChange(pageCount)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
