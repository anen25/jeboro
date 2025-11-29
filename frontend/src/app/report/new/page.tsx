'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mic, MicOff, Send, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const reportSchema = z.object({
  title: z.string().min(2, '제목을 2글자 이상 입력해주세요.'),
  content: z.string().min(10, '내용을 10글자 이상 입력해주세요.'),
  category: z.string().min(1, '카테고리를 선택해주세요.'),
  region: z.string().optional(),
  publishType: z.enum(['OPEN', 'EXCLUSIVE']),
  isAnonymous: z.boolean().default(true),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export default function NewReportPage() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recognitionRef = useRef<any>(null);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: '',
      content: '',
      category: 'general',
      region: '',
      publishType: 'OPEN',
      isAnonymous: true,
    },
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'ko-KR';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          // Append to existing content or replace? 
          // For simplicity, let's append if not recording, but here we want real-time update.
          // Better strategy: Keep track of previous content and append new transcript.
          // But for this simple demo, let's just update the textarea value.
          // Actually, we should probably append to the current cursor position or end.

          // Simple approach: Update form value directly
          const currentContent = form.getValues('content');
          // This is tricky with continuous updates. 
          // Let's just set the transcript to a separate state or append to content when stopped?
          // The prompt says "Real-time text preview".

          // Let's try to append only the *new* part.
          // Or just let the user speak and it fills the textarea.

          // For now, let's just set the content to the transcript if it's empty, or append.
          // But `interimResults` fires frequently.
          // We'll use the `final` results.

          if (event.results[event.resultIndex].isFinal) {
            const finalTranscript = event.results[event.resultIndex][0].transcript;
            const prev = form.getValues('content');
            form.setValue('content', prev + (prev ? ' ' : '') + finalTranscript);
          }
        };

        recognitionRef.current = recognition;
      }
    }
  }, [form]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const onSubmit = async (data: ReportFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to submit report');

      router.push('/dashboard/informant');
    } catch (error) {
      console.error(error);
      alert('제보 제출에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">새로운 제보 작성</CardTitle>
          <CardDescription>
            음성으로 말하거나 직접 입력하여 제보해주세요. 음성 파일은 저장되지 않습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input id="title" placeholder="제보 제목을 입력하세요" {...form.register('title')} />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="content">내용</Label>
                <Button
                  type="button"
                  variant={isRecording ? "destructive" : "outline"}
                  size="sm"
                  onClick={toggleRecording}
                  className="flex items-center gap-2"
                >
                  {isRecording ? <><MicOff className="h-4 w-4" /> 녹음 중지</> : <><Mic className="h-4 w-4" /> 음성 입력</>}
                </Button>
              </div>
              <Textarea
                id="content"
                placeholder="내용을 입력하세요..."
                className="min-h-[200px] text-lg"
                {...form.register('content')}
              />
              {form.formState.errors.content && (
                <p className="text-sm text-red-500">{form.formState.errors.content.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>공개 방식</Label>
                <RadioGroup
                  defaultValue="OPEN"
                  onValueChange={(val) => form.setValue('publishType', val as 'OPEN' | 'EXCLUSIVE')}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="OPEN" id="open" />
                    <Label htmlFor="open">공개 제보 (모든 기자가 볼 수 있음)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="EXCLUSIVE" id="exclusive" />
                    <Label htmlFor="exclusive">독점 제보 (48시간 엠바고)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">지역 (선택)</Label>
                <Input id="region" placeholder="예: 서울, 부산" {...form.register('region')} />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              제보 제출하기
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
