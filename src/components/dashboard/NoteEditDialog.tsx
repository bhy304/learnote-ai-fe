import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface NoteEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const NoteEditDialog = ({
  open,
  onOpenChange,
  title,
  content,
  onTitleChange,
  onContentChange,
  onConfirm,
  isLoading = false,
}: NoteEditDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>노트 수정</DialogTitle>
          <DialogDescription>노트의 제목과 내용을 수정할 수 있습니다.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-title">제목</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-content">내용</Label>
            <Textarea
              id="edit-content"
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              className="h-[300px] resize-none"
              disabled={isLoading}
              placeholder={isLoading ? '내용을 불러오는 중...' : ''}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            취소
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            수정
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
