import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { DashboardNote } from '@/types/dashboard.type';

interface RecentNotesTableProps {
  notes: DashboardNote[];
  // onView: (id: number) => void;
}

// const statusMap = {
//   ANALYZING: { label: '분석 중', variant: 'outline' as const },
//   COMPLETED: { label: '완료', variant: 'default' as const },
//   FAILED: { label: '실패', variant: 'destructive' as const },
// };

export default function NotesTable({ notes }: RecentNotesTableProps) {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px]">날짜</TableHead>
            <TableHead>제목</TableHead>
            <TableHead>태그</TableHead>
            <TableHead className="text-right">상세 보기</TableHead>
            <TableHead className="text-right">삭제</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                최근 분석 내역이 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            notes.map((note) => (
              <TableRow key={note.id}>
                <TableCell>{new Date(note.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="font-medium">{note.title}</TableCell>
                {/* <TableCell>
                  <Badge variant={statusMap[note.status].variant}>
                    {statusMap[note.status].label}
                  </Badge>
                </TableCell> */}
                <TableCell>
                  {note.tags.map((tag) => (
                    <span key={tag} className="mr-2">
                      #{tag}
                    </span>
                  ))}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('노트 상세 보기', note.id)}
                  >
                    보기
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('노트 삭제', note.id)}
                  >
                    삭제
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
