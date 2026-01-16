import { Button } from '@/components/ui/button';
import { useNote } from '@/hooks/useNote';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function NoteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: note } = useNote(id || null);

  return (
    <main className="container mx-auto py-10 px-4 max-w-[1200px]">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => navigate('/')} className="gap-2 cursor-pointer">
          <ArrowLeft className="size-4" />
          대시보드로 돌아가기
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              /* 수정 로직 */
            }}
            className="cursor-pointer"
          >
            수정
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              /* 삭제 로직 */
            }}
            className="cursor-pointer"
          >
            삭제
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold tracking-tight">{note?.title}</h1>
      </div>
    </main>
  );
}
