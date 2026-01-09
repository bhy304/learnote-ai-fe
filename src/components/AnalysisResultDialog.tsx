import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import type { GetNoteResponse } from '@/types/notes.type';

interface Props {
  result: GetNoteResponse;
  onClose: () => void;
}

export default function AnalysisResultDialog({ result, onClose }: Props) {
  return (
    <Dialog defaultOpen={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>학습 노트</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">{result.summary.oneLineSummary}</div>
        <DialogFooter>
          {/* <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer">
              수정
            </Button>
          </DialogClose> */}
          <Button variant="outline" className="cursor-pointer" onClick={onClose}>
            대시보드로 이동
          </Button>
          <Button variant="outline" className="cursor-pointer">
            수정
          </Button>
          <Button variant="destructive" className="cursor-pointer">
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
