import { useState } from 'react';
import { Button } from './components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './components/ui/dialog';
import { Field, FieldLabel } from './components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from './components/ui/input-group';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

function App() {
  const [noteContent, setNoteContent] = useState('');

  // AI 노트 생성
  const createNote = () => {
    console.log('AI 노트 생성', noteContent);
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="cursor-pointer">New Note</Button>
        </DialogTrigger>
        <form>
          <DialogContent>
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
              <Field>
                <FieldLabel htmlFor="feedback-textarea">학습 노트</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    id="feedback-textarea"
                    placeholder={`예시)
오늘은 React의 useEffect Hook을 공부했습니다.
클린업 함수의 필요성을 이해했고,
dependency array를 비워두면 마운트 시 한 번만 실행된다는 것을 배웠습니다.
하지만 여러 개의 useEffect를 사용할 때 실행 순서가 헷갈렸습니다.
내일은 custom hook을 만들어보려고 합니다.`}
                    className="min-h-[200px] max-h-[500px] overflow-y-auto"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                  />
                  {/* <InputGroupAddon align="block-end">
                    <InputGroupText>
                      {noteContent.length}/1000 characters
                    </InputGroupText>
                  </InputGroupAddon> */}
                </InputGroup>
              </Field>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              <Button type="submit" onClick={createNote}>
                AI 노트 생성
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
}

export default App;
