import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

type Note = {
  id: number;
  title: string;
  created_at: string;
};

const notes: Note[] = [
    {
      id: 39,
      title: '테스트21',
      created_at: '2026-01-14',
    },
    {
      id: 38,
      title: 'Understanding RESTful API Design Principles and OpenAPI Implementation',
      created_at: '2026-01-12',
    },
    {
      id: 37,
      title: '문자 찾기: includes vs indexOf',
      created_at: '2026-01-11',
    },
    {
      id: 36,
      title: '배열 합계: reduce vs forEach',
      created_at: '2026-01-11',
    },
    {
      id: 35,
      title: '회원가입 API 만들면서 상태코드 고민함',
      created_at: '2026-01-11',
    },
  ],

};

const total = 26;
const page = 1;
const pageSize = 5;

export default function NotesTable() {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px] text-center">날짜</TableHead>
            <TableHead className="w-[400px] text-center">제목</TableHead>
            {/* <TableHead className="w-[400px]">태그</TableHead> */}
            <TableHead className="text-center">상세 보기</TableHead>
            <TableHead className="text-center">삭제</TableHead>
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
                <TableCell>{new Date(note.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="font-medium">{note.title}</TableCell>
                {/* <TableCell>
                  <Badge variant={statusMap[note.status].variant}>
                    {statusMap[note.status].label}
                  </Badge>
                </TableCell> */}
                {/* <TableCell>
                  {note.tags.map((tag) => (
                    <span key={tag} className="mr-2">
                      #{tag}
                    </span>
                  ))}
                </TableCell> */}
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
