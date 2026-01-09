import { useState } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Field, FieldError, FieldGroup, FieldLabel } from './ui/field';
import { InputGroup, InputGroupTextarea } from './ui/input-group';
import { NOTE_PLACEHOLDER } from '@/const';
import notesAPI from '@/api/notes.api';

const formSchema = z.object({
  rowContent: z.string().min(1, '노트를 입력해 주세요.'),
});

interface Props {
  onSuccess: (id: number) => void;
}

export default function CreateNoteDialog({ onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rowContent: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>): Promise<void> => {
    try {
      setIsLoading(true);

      const result = await notesAPI.createNote({
        title: `${new Date().toLocaleDateString('ko-KR')} 오늘의 학습 노트`,
        rawContent: data.rowContent,
      });

      onSuccess(result.reviewId);
      form.reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">New Note</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>오늘의 학습 노트</DialogTitle>

            <Accordion
              type="single"
              collapsible
              className="mt-1 rounded-lg bg-muted/50 p-2 cursor-pointer"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>💡 작성 가이드</AccordionTrigger>
                <AccordionContent>• 오늘 배운 개념이나 내용</AccordionContent>
                <AccordionContent>• 이해한 점 / 어려웠던 점</AccordionContent>
                <AccordionContent>• 느낀 점이나 깨달은 점</AccordionContent>
                <AccordionContent>• 다음에 학습하고 싶은 것</AccordionContent>
              </AccordionItem>
            </Accordion>
          </DialogHeader>
          <div className="grid gap-4">
            <FieldGroup>
              <Controller
                name="rowContent"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-note">학습 노트</FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id="form-note"
                        placeholder={NOTE_PLACEHOLDER}
                        rows={10}
                        className="min-h-52 max-h-100 resize-none overflow-y-auto"
                        aria-invalid={fieldState.invalid}
                      />
                    </InputGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer" onClick={() => form.reset()}>
                취소
              </Button>
            </DialogClose>
            <Button type="submit" className="cursor-pointer">
              노트 생성
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
