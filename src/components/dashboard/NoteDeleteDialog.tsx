import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

interface NoteDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export const NoteDeleteDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isDeleting = false,
}: NoteDeleteDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
          <DialogDescription>
            삭제된 노트는 복구할 수 없습니다. 계속 진행하시겠습니까?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            취소
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="relative overflow-hidden min-w-[60px]"
          >
            <span className={cn('transition-opacity', isDeleting && 'opacity-0')}>삭제</span>
            {isDeleting && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner className="text-white size-4" />
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
