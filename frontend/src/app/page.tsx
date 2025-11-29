import Link from 'next/link';
import { Button } from '@/components/ui/button';
import VoiceDemo from '@/components/landing/VoiceDemo';
import { ShieldCheck, Mic, Clock, Newspaper } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 md:px-6 lg:py-32 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            목소리로 세상을 바꿉니다.<br />
            <span className="text-foreground">가장 빠른 음성 제보, 제보로</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            복잡한 글쓰기 대신 말로 하세요. <br className="hidden md:block" />
            당신의 목소리가 기사가 되는 곳, 제보로(Jeboro)입니다.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all">
              <Link href="/report/new">지금 제보하기</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full">
              <Link href="/auth/register?role=REPORTER">기자 회원가입</Link>
            </Button>
          </div>

          <VoiceDemo />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Mic className="h-10 w-10 text-primary" />}
              title="음성으로 간편하게"
              description="타이핑할 필요 없습니다. 말하는 즉시 텍스트로 변환되어 기사 초안이 됩니다."
            />
            <FeatureCard 
              icon={<ShieldCheck className="h-10 w-10 text-primary" />}
              title="철저한 익명 보장"
              description="음성 파일은 절대 서버에 저장되지 않습니다. 오직 텍스트만 안전하게 전달됩니다."
            />
            <FeatureCard 
              icon={<Clock className="h-10 w-10 text-primary" />}
              title="48시간 엠바고"
              description="독점 제보(Exclusive)는 48시간 동안 선택한 기자만 볼 수 있습니다."
            />
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-12 bg-muted/50 border-y">
        <div className="container mx-auto text-center">
          <p className="text-sm font-semibold text-muted-foreground mb-6">TRUSTED BY</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale">
            {/* Dummy Logos */}
            <div className="text-xl font-bold">Daily News</div>
            <div className="text-xl font-bold">Korea Times</div>
            <div className="text-xl font-bold">Seoul Post</div>
            <div className="text-xl font-bold">Tech Today</div>
            <div className="text-xl font-bold">Local Voice</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-background border-t">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-muted-foreground">
            © 2025 Jeboro. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm font-medium">
            <Link href="/terms" className="hover:underline">이용약관</Link>
            <Link href="/privacy" className="hover:underline">개인정보처리방침</Link>
            <Link href="/contact" className="hover:underline">문의하기</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4 p-3 bg-primary/10 w-fit rounded-xl">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
