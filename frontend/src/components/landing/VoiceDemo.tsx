'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function VoiceDemo() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

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
          setTranscript(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      } else {
        setIsSupported(false);
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!isSupported) return;

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8 shadow-lg border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>실시간 제보 체험</span>
          {isRecording && <span className="text-red-500 animate-pulse text-sm">● Recording</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isSupported && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>브라우저 미지원</AlertTitle>
            <AlertDescription>
              이 브라우저는 Web Speech API를 지원하지 않습니다. Chrome 또는 Safari를 이용해주세요.
            </AlertDescription>
          </Alert>
        )}

        <div className="min-h-[150px] p-4 bg-muted/50 rounded-lg whitespace-pre-wrap break-words text-lg">
          {transcript || <span className="text-muted-foreground">마이크 버튼을 누르고 말씀해보세요...</span>}
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            variant={isRecording ? "destructive" : "default"}
            className="rounded-full w-16 h-16 p-0 shadow-xl transition-all hover:scale-105"
            onClick={toggleRecording}
            disabled={!isSupported}
          >
            {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
          </Button>
        </div>
        
        <p className="text-xs text-center text-muted-foreground mt-4">
          * 음성 데이터는 서버로 전송되지 않고 브라우저에서만 처리됩니다.
        </p>
      </CardContent>
    </Card>
  );
}
